import { ADMIN_COOKIE_NAME } from "../../../src/lib/admin/auth";

export async function onRequestPost(): Promise<Response> {
  const expiredCookie = `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

  return new Response(JSON.stringify({ success: true, message: "Logged out" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": expiredCookie,
    },
  });
}
