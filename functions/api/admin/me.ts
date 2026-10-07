import { verifyAdminAuth, AdminEnv } from "../../../src/lib/admin/auth";

export async function onRequestGet(context: { request: Request; env: AdminEnv }): Promise<Response> {
  const auth = await verifyAdminAuth(context.request, context.env);

  if (!auth.authorized) {
    return new Response(JSON.stringify({ authenticated: false, error: auth.error }), {
      status: auth.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      email: auth.email,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
