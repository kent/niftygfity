import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NiftyGifty",
    short_name: "NiftyGifty",
    description: "Gift planning made simple. Track gift ideas, manage budgets, and never forget a special occasion.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

