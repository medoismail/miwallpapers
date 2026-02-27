export const prerender = false;

const url = () => import.meta.env.UPSTASH_REDIS_REST_URL;
const token = () => import.meta.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd: string[]) {
  const res = await fetch(url(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  return res.json();
}

// GET /api/likes → { "photo-id": 5, ... }
export async function GET() {
  try {
    const data = await redis(["HGETALL", "likes"]);
    // Upstash returns flat array: [key, val, key, val, ...]
    const counts: Record<string, number> = {};
    const arr = data.result || [];
    for (let i = 0; i < arr.length; i += 2) {
      counts[arr[i]] = Number(arr[i + 1]) || 0;
    }
    return new Response(JSON.stringify(counts), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
      },
    });
  } catch {
    return new Response("{}", {
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST /api/likes  body: { id, action: "like" | "unlike" }
export async function POST({ request }: { request: Request }) {
  try {
    const { id, action } = await request.json();
    if (!id || typeof id !== "string") {
      return new Response('{"error":"missing id"}', { status: 400 });
    }
    const delta = action === "unlike" ? -1 : 1;
    const data = await redis(["HINCRBY", "likes", id, String(delta)]);
    const count = Math.max(0, Number(data.result) || 0);

    // Clamp to 0 if somehow negative
    if (count === 0 && delta === -1) {
      await redis(["HSET", "likes", id, "0"]);
    }

    return new Response(JSON.stringify({ id, count }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response('{"error":"failed"}', { status: 500 });
  }
}
