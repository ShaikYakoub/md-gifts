import { AdminEnv, createSessionToken, ADMIN_COOKIE_NAME } from "../../../src/lib/admin/auth";

export async function onRequestPost(context: { request: Request; env: AdminEnv }): Promise<Response> {
  try {
    const body = (await context.request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const configuredPassword = context.env.ADMIN_PASSWORD?.trim();
    const configuredEmail = context.env.ADMIN_EMAIL?.trim().toLowerCase();

    // Development fallback if ADMIN_PASSWORD is not set yet in local dev
    const isDev = context.env.ALLOW_LOCAL_DEV_ADMIN === "true";
    const effectivePassword = configuredPassword || (isDev ? "admin123" : "");

    if (!effectivePassword) {
      return new Response(
        JSON.stringify({
          error: "Admin password is not configured in environment variables (ADMIN_PASSWORD).",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify email (if configured)
    if (configuredEmail) {
      const allowedEmails = configuredEmail.split(",").map((e) => e.trim().toLowerCase());
      if (!allowedEmails.includes(email)) {
        return new Response(JSON.stringify({ error: "Invalid email or password" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Verify password
    if (password !== effectivePassword) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate signed session token (valid for 7 days)
    const token = await createSessionToken(email, effectivePassword, 7 * 24 * 3600);

    const isSecure = context.request.url.startsWith("https:");
    const cookieFlags = [
      `${ADMIN_COOKIE_NAME}=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=604800",
      ...(isSecure ? ["Secure"] : []),
    ].join("; ");

    return new Response(
      JSON.stringify({
        success: true,
        email,
        message: "Logged in successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieFlags,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Login failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
