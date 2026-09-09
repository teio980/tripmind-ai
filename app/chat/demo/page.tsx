import { Suspense } from "react";
import { ChatScreen } from "@/components/chat-screen";

export default function DemoChatPage() {
  return <Suspense fallback={<div className="route-loading">Opening TripMind Agent…</div>}><ChatScreen /></Suspense>;
}
