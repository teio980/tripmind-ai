import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { TripProvider } from "@/lib/trip-store";

export const metadata: Metadata = {
  title: "TripMind · Protect the experience",
  description: "Start with a rough idea and create an explainable, approvable travel itinerary.",
};

export const viewport: Viewport = {
  themeColor: "#0e7168",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <TripProvider><AppShell>{children}</AppShell></TripProvider>
      </body>
    </html>
  );
}
