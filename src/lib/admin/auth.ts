export interface AuthResult {
  authorized: boolean;
  status: number;
  email?: string;
  error?: string;
}

export interface AdminEnv {
  ADMIN_EMAIL?: string;
  GITHUB_APP_ID?: string;
  GITHUB_INSTALLATION_ID?: string;
  GITHUB_PRIVATE_KEY?: string;
  ALLOW_LOCAL_DEV_ADMIN?: string;
  [key: string]: unknown;
}

/**
 * Verifies that the incoming request is authenticated by Cloudflare Access
 * and matches the configured administrator email address.
 */
export function verifyAdminAuth(request: Request, env: AdminEnv): AuthResult {
  const accessEmail = request.headers.get("Cf-Access-Authenticated-User-Email");
  const configuredAdmin = env.ADMIN_EMAIL?.trim();

  // Local development fallback only when explicitly enabled via env
  const isLocalDev = env.ALLOW_LOCAL_DEV_ADMIN === "true";
  if (isLocalDev && !accessEmail) {
    const devEmail = request.headers.get("X-Dev-Admin-Email") || configuredAdmin || "local-admin@mdgifts.in";
    return {
      authorized: true,
      status: 200,
      email: devEmail,
    };
  }

  if (!accessEmail) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required via Cloudflare Access (Cf-Access-Authenticated-User-Email header missing)",
    };
  }

  if (!configuredAdmin) {
    return {
      authorized: false,
      status: 500,
      error: "Server configuration error: ADMIN_EMAIL secret is not configured",
    };
  }

  // Check against allowed emails (case-insensitive, trims whitespace)
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
