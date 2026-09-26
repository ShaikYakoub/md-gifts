import { validateUploadPath } from "./validation";

export interface GitHubEnv {
  GITHUB_APP_ID?: string;
  GITHUB_INSTALLATION_ID?: string;
  GITHUB_PRIVATE_KEY?: string;
  [key: string]: unknown;
}

const REPO_OWNER = "ShaikYakoub";
const REPO_NAME = "md-gifts";

// Memory cache for installation token to minimize GitHub API calls
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Validates if the target repository path is strictly in the allowed whitelist
 */
export function isAllowedRepoPath(path: string): boolean {
  if (!path || path.includes("\0") || path.includes("..")) {
    return false;
  }

  const normalized = path.replace(/^\/+/, "");

  if (normalized === "content/products.json" || normalized === "content/banners.json") {
    return true;
  }

  if (normalized.startsWith("public/uploads/products/") || normalized.startsWith("public/uploads/banners/")) {
    return validateUploadPath(normalized).isValid;
  }

  return false;
}

/**
 * Encodes an ASN.1 DER length
 */
function encodeDerLength(len: number): number[] {
  if (len < 128) return [len];
  if (len < 256) return [0x81, len];
  if (len < 65536) return [0x82, (len >> 8) & 0xff, len & 0xff];
  return [0x83, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff];
}

/**
 * Wraps a PKCS#1 RSA Private Key DER buffer in a PKCS#8 PrivateKeyInfo structure
 */
function pkcs1ToPkcs8(pkcs1Der: Uint8Array): Uint8Array {
  // AlgorithmIdentifier: SEQUENCE { rsaEncryption (1.2.840.113549.1.1.1), NULL }
  const algorithmIdentifier = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
  ];
  // Version INTEGER 0
  const version = [0x02, 0x01, 0x00];

  const octetStringHeader = [0x04, ...encodeDerLength(pkcs1Der.length)];
  const innerLen = version.length + algorithmIdentifier.length + octetStringHeader.length + pkcs1Der.length;
  const sequenceHeader = [0x30, ...encodeDerLength(innerLen)];

  const pkcs8 = new Uint8Array(sequenceHeader.length + innerLen);
  let offset = 0;
  pkcs8.set(sequenceHeader, offset);
  offset += sequenceHeader.length;
  pkcs8.set(version, offset);
  offset += version.length;
  pkcs8.set(algorithmIdentifier, offset);
  offset += algorithmIdentifier.length;
  pkcs8.set(octetStringHeader, offset);
  offset += octetStringHeader.length;
  pkcs8.set(pkcs1Der, offset);

  return pkcs8;
}

/**
 * Parses PEM string into CryptoKey using Web Crypto
 */
async function importRsaPrivateKey(pem: string): Promise<CryptoKey> {
  const isPkcs1 = pem.includes("BEGIN RSA PRIVATE KEY");
  const cleanPem = pem
    .replace(/-----BEGIN (?:RSA )?PRIVATE KEY-----/g, "")
    .replace(/-----END (?:RSA )?PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");

  const binaryString = atob(cleanPem);
  const der = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    der[i] = binaryString.charCodeAt(i);
  }

  const pkcs8Der = isPkcs1 ? pkcs1ToPkcs8(der) : der;

  return await crypto.subtle.importKey(
    "pkcs8",
    pkcs8Der.buffer as ArrayBuffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );
}

/**
 * Base64URL encoder without padding
 */
function base64UrlEncode(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.byteLength; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary)
    .replace(/[+]/g, "-")
    .replace(/[/]/g, "_")
    .replace(/=/g, "");
}

/**
 * Creates an RS256 JWT for GitHub App authentication
 */
async function createGitHubAppJwt(appId: string, privateKeyPem: string): Promise<string> {
  const privateKey = await importRsaPrivateKey(privateKeyPem);
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iat: now - 60, // 60s in the past to prevent clock drift
    exp: now + 540, // 9 minutes (max allowed is 10m)
    iss: appId.trim(),
  };

  const textEncoder = new TextEncoder();
  const encodedHeader = base64UrlEncode(textEncoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(textEncoder.encode(JSON.stringify(payload)));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    textEncoder.encode(unsignedToken)
  );

  return `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;
}

/**
 * Obtains an installation access token for repository operations
 */
export async function getInstallationToken(env: GitHubEnv): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  const appId = env.GITHUB_APP_ID?.trim() || "5077719";
  const installationId = env.GITHUB_INSTALLATION_ID?.trim() || "164922482";
  const privateKey = env.GITHUB_PRIVATE_KEY?.trim();

  if (!privateKey) {
    throw new Error("GITHUB_PRIVATE_KEY secret is not configured in Cloudflare environment");
  }

  const jwt = await createGitHubAppJwt(appId, privateKey);

  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "md-gifts-admin",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain GitHub App installation token: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { token: string; expires_at: string };
  const expiresAt = new Date(data.expires_at).getTime();

  cachedToken = {
    token: data.token,
    expiresAt,
  };

  return data.token;
}

/**
 * Fetches current content and SHA for an approved repository file
 */
export async function fetchRepoFile(
  path: string,
  env: GitHubEnv
): Promise<{ content: string; sha: string; exists: boolean }> {
  if (!isAllowedRepoPath(path)) {
    throw new Error(`Access denied: Path "${path}" is outside approved repository boundaries`);
  }

  const token = await getInstallationToken(env);
  const normalizedPath = path.replace(/^\/+/, "");
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${normalizedPath}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "md-gifts-admin",
    },
  });

  if (response.status === 404) {
    return { content: "", sha: "", exists: false };
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GitHub API error fetching ${path}: ${response.status} ${err}`);
  }

  const data = (await response.json()) as { content: string; sha: string; encoding: string };
  // Base64 decode to utf-8 text
  const cleanBase64 = data.content.replace(/\s+/g, "");
  const binary = atob(cleanBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const textContent = new TextDecoder().decode(bytes);

  return {
    content: textContent,
    sha: data.sha,
    exists: true,
  };
}

/**
 * Commits a file update or creation directly to the repository via GitHub Contents API
 */
export async function commitRepoFile(
  path: string,
  content: string | Uint8Array,
  message: string,
  env: GitHubEnv,
  existingSha?: string
): Promise<{ sha: string; commitUrl: string }> {
  if (!isAllowedRepoPath(path)) {
    throw new Error(`Access denied: Path "${path}" is outside approved repository boundaries`);
  }

  const token = await getInstallationToken(env);
  const normalizedPath = path.replace(/^\/+/, "");
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${normalizedPath}`;

  // If SHA was not provided, fetch the existing file to get the current SHA if it exists
  let sha = existingSha;
  if (!sha) {
    try {
      const existing = await fetchRepoFile(normalizedPath, env);
      if (existing.exists) {
        sha = existing.sha;
      }
    } catch {
      // New file creation
    }
  }

  let base64Content: string;
  if (typeof content === "string") {
    const bytes = new TextEncoder().encode(content);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64Content = btoa(binary);
  } else {
    let binary = "";
    for (let i = 0; i < content.length; i++) {
      binary += String.fromCharCode(content[i]);
    }
    base64Content = btoa(binary);
  }

  const body: { message: string; content: string; sha?: string; branch: string } = {
    message: `admin: ${message}`,
    content: base64Content,
    branch: "main",
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "md-gifts-admin",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 409) {
    throw new Error("Conflict: The file has been modified concurrently. Please reload and retry.");
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GitHub API error committing ${path}: ${response.status} ${err}`);
  }

  const result = (await response.json()) as {
    content?: { sha: string; html_url?: string };
    commit?: { html_url?: string; sha: string };
  };

  return {
    sha: result.content?.sha || result.commit?.sha || "",
    commitUrl: result.commit?.html_url || "",
  };
}
