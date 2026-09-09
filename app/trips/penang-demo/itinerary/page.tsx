import { Suspense } from "react";
import { ItineraryScreen } from "@/components/itinerary-screen";

export default function ItineraryPage() {
  return <Suspense fallback={<div className="route-loading">Opening itinerary…</div>}><ItineraryScreen /></Suspense>;
}
