export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: "TaskFlowAI",
    short_name: "TaskFlowAI",
    description: "No-code workflow studio with embedded AI.",
    start_url: "/board",
    display: "standalone",
    background_color: "#f5f1e8",
    theme_color: "#f5f1e8",
    orientation: "any",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "content-type": "application/manifest+json" },
  });
}
