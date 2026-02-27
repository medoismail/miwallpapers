export const prerender = false;

export async function POST({ request }: { request: Request }) {
  const { password } = await request.json();
  const correct = import.meta.env.ADMIN_PASSWORD;

  if (!correct || password !== correct) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
