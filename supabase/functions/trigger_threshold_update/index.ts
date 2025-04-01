import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { GITHUB_TOKEN, GITHUB_REPO } = Deno.env.toObject();

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/threshold_update.yml/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        ref: "main", // Or your branch
      }),
    }
  );

  if (response.ok) {
    return new Response("✅ Threshold update triggered successfully.", { status: 200 });
  } else {
    return new Response("❌ Failed to trigger threshold update.", { status: 500 });
  }
});
