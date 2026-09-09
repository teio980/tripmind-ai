import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TripMind · Protect the experience",
    short_name: "TripMind",
    description: "An explainable, approvable travel planning assistant",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f5",
    theme_color: "#0e7168",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
