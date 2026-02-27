export const prerender = false;

const OWNER = "medoismail";
const REPO = "miwallpapers";
const BRANCH = "main";

export async function POST({ request }: { request: Request }) {
  // Auth check
  const adminPw = import.meta.env.ADMIN_PASSWORD;
  const authHeader = request.headers.get("x-admin-password") || "";
  if (!adminPw || authHeader !== adminPw) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ghToken = import.meta.env.GITHUB_TOKEN;
  if (!ghToken) {
    return new Response(JSON.stringify({ error: "missing GITHUB_TOKEN" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return new Response(JSON.stringify({ error: "no file" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `public/images/originals/${filename}`;

    // Read file as base64
    const arrayBuf = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuf).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    // Upload to GitHub via Contents API
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add wallpaper: ${filename}`,
          content: base64,
          branch: BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return new Response(
        JSON.stringify({
          error: err.message || "GitHub API error",
          status: res.status,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({
        ok: true,
        filename,
        sha: data.content?.sha,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
