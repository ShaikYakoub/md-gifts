export interface AuthResult {
  authorized: boolean;
  status: number;
  email?: string;
  error?: string;
}

export interface AdminEnv {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  GITHUB_APP_ID?: string;
  GITHUB_INSTALLATION_ID?: string;
  GITHUB_PRIVATE_KEY?: string;
  ALLOW_LOCAL_DEV_ADMIN?: string;
  [key: string]: unknown;
}

export const ADMIN_COOKIE_NAME = "mdgifts_admin_session";

function toBase64Url(str: string): string {
  const b64 = btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return toBase64Url(binary);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates an HMAC-SHA256 signed admin session token.
 */
export async function createSessionToken(
  email: string,
  secret: string,
  expiresInSeconds = 7 * 24 * 3600
): Promise<string> {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = toBase64Url(JSON.stringify({ email: email.toLowerCase().trim(), exp }));
  const data = `${header}.${payload}`;

  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const signature = arrayBufferToBase64Url(signatureBuffer);

  return `${data}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed admin session token.
 */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; email?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };
    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;

    const key = await getHmacKey(secret);
    const enc = new TextEncoder();

    const sigBinary = fromBase64Url(signature);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
    if (!isValid) return { valid: false };

    const payloadObj = JSON.parse(fromBase64Url(payload)) as { email?: string; exp?: number };
    if (!payloadObj.exp || payloadObj.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    return { valid: true, email: payloadObj.email };
  } catch {
    return { valid: false };
  }
}

export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Verifies admin authentication using either:
 * 1. Admin session cookie / Bearer token (via ADMIN_PASSWORD)
 * 2. Cloudflare Access header (Cf-Access-Authenticated-User-Email via ADMIN_EMAIL)
 * 3. Local development override (ALLOW_LOCAL_DEV_ADMIN === "true")
 */
export async function verifyAdminAuth(request: Request, env: AdminEnv): Promise<AuthResult> {
  const configuredAdmin = env.ADMIN_EMAIL?.trim();
  const configuredPassword = env.ADMIN_PASSWORD?.trim();

  // 1. Session Cookie or Bearer Token (Password Authentication)
  const cookieHeader = request.headers.get("Cookie");
  const authHeader = request.headers.get("Authorization");
  const sessionToken =
    parseCookie(cookieHeader, ADMIN_COOKIE_NAME) ||
    (authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null);

  if (sessionToken && configuredPassword) {
    const tokenResult = await verifySessionToken(sessionToken, configuredPassword);
    if (tokenResult.valid && tokenResult.email) {
      return {
        authorized: true,
        status: 200,
        email: tokenResult.email,
      };
    }
  }

  // 2. Cloudflare Access Header (Cf-Access-Authenticated-User-Email)
  const accessEmail = request.headers.get("Cf-Access-Authenticated-User-Email");
  if (accessEmail) {
    if (!configuredAdmin) {
      return {
        authorized: false,
        status: 500,
        error: "Server configuration error: ADMIN_EMAIL secret is not configured",
      };
    }

    const allowedEmails = configuredAdmin
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const normalizedUserEmail = accessEmail.trim().toLowerCase();
    if (!allowedEmails.includes(normalizedUserEmail)) {
      return {
        authorized: false,
        status: 403,
        error: "Forbidden: Access denied for this identity",
      };
    }

    return {
      authorized: true,
      status: 200,
      email: normalizedUserEmail,
    };
  }

  // 3. Local Development Fallback
  const isLocalDev = env.ALLOW_LOCAL_DEV_ADMIN === "true";
  if (isLocalDev) {
    const devEmail =
      request.headers.get("X-Dev-Admin-Email") ||
      (configuredAdmin ? configuredAdmin.split(",")[0].trim() : "local-admin@mdgifts.in");
    return {
      authorized: true,
      status: 200,
      email: devEmail,
    };
  }

  // Check configuration existence
  if (!configuredAdmin && !configuredPassword) {
    return {
      authorized: false,
      status: 500,
      error: "Server configuration error: ADMIN_EMAIL or ADMIN_PASSWORD is not configured",
    };
  }

  return {
    authorized: false,
    status: 401,
    error: "Authentication required: Please log in with your admin credentials",
  };
}
