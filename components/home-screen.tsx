"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  MoveRight,
  Sparkles,
  Users,
} from "lucide-react";
import { DEMO_FIXTURE, formatRM } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { Button, SourceTag, StatusBadge } from "@/components/ui";

const DEFAULT_IDEA = "I want to travel, but I don't have a plan yet";
const OUT_OF_SCOPE = "I only handle travel planning and itinerary management for TripMind. Tell me your destination, dates, or how you want to change an existing itinerary.";

function isOutOfScope(text: string) {
  return /python|javascript|code|math problem|news|politics|stocks?|investment advice|marketing copy|legal advice|medical diagnosis|write a poem/i.test(text);
}

export function HomeScreen() {
  const router = useRouter();
  const { state, loadDemo, submitIdea } = useTripStore();
  const [idea, setIdea] = useState(DEFAULT_IDEA);
  const [scopeMessage, setScopeMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = idea.trim();
    if (!value) return;
    if (isOutOfScope(value)) {
      setScopeMessage(OUT_OF_SCOPE);
      return;
    }
    setScopeMessage("");
    submitIdea(value);
    router.push("/chat/demo");
  }

  function handleDemo() {
    loadDemo(idea.trim() || DEFAULT_IDEA);
    router.push("/chat/demo");
  }

  const suggestions = ["I want to go to the beach", "Plan a 3-day food trip", "Load the Penang Demo"];

  return (
    <div className="home-page content-width">
        <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-pulse" />TRIPMIND AI TRAVEL PLANNER</div>
          <h1>Tell me where you want to go.<br /><span>I&apos;ll handle the plan.</span></h1>
          <p>Start with a rough idea. I&apos;ll fill in the essentials and create a practical, explainable itinerary you can keep adjusting.</p>
          <div className="hero-trust-row">
            <span><Check size={14} aria-hidden="true" />No Plan required first</span>
            <span><Check size={14} aria-hidden="true" />Fixed arrangements stay protected</span>
          </div>
        </div>
        <div className="hero-route-art" aria-hidden="true">
          <div className="route-glow route-glow-one" />
          <div className="route-glow route-glow-two" />
          <svg viewBox="0 0 460 260" role="presentation">
            <path className="route-path route-path-back" d="M30 204C89 242 110 155 169 174S246 91 295 116s42 101 130 52" />
            <path className="route-path" d="M30 204C89 242 110 155 169 174S246 91 295 116s42 101 130 52" />
            <circle className="route-node route-node-start" cx="30" cy="204" r="8" />
            <circle className="route-node" cx="169" cy="174" r="7" />
            <circle className="route-node" cx="295" cy="116" r="7" />
            <circle className="route-node route-node-end" cx="425" cy="168" r="9" />
          </svg>
          <div className="route-label route-label-start"><MapPin size={13} />Your idea</div>
          <div className="route-label route-label-end"><Sparkles size={13} />Actionable itinerary</div>
          <div className="floating-note floating-note-top"><Clock3 size={14} /><span>Leave room for buffers</span></div>
          <div className="floating-note floating-note-bottom"><Users size={14} /><span>Consider everyone</span></div>
        </div>
      </section>

      <section className="chatbox-section" aria-labelledby="chatbox-heading">
        <div className="chatbox-card">
          <div className="chatbox-header">
            <div><p className="eyebrow">START HERE</p><h2 id="chatbox-heading">Tell TripMind what you&apos;re thinking</h2></div>
            <span className="chatbox-ai-badge"><Sparkles size={14} />Agent ready</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="chat-input-wrap">
              <textarea ref={inputRef} value={idea} onChange={(event) => { setIdea(event.target.value); setScopeMessage(""); }} rows={2} aria-label="Travel idea" placeholder="For example: I want to travel, but I don't have a plan yet" />
              <button className="send-button" type="submit" aria-label="Send travel idea"><ArrowUp size={20} strokeWidth={2.5} /></button>
            </div>
          </form>
          {scopeMessage ? <div className="scope-message" role="alert"><MessageCircle size={18} /><p>{scopeMessage}</p></div> : null}
          <div className="suggestion-row" aria-label="Example prompts">
            <span className="suggestion-label">Try:</span>
            {suggestions.map((suggestion) => <button type="button" className="suggestion-chip" key={suggestion} onClick={() => suggestion === "Load the Penang Demo" ? handleDemo() : setIdea(suggestion)}>{suggestion}<MoveRight size={13} /></button>)}
          </div>
        </div>
      </section>

      <section className="home-lower-grid">
        <div className="recent-column">
          <div className="section-title-line"><div><p className="eyebrow">YOUR SPACE</p><h2>Recent trips</h2></div><button className="quiet-link" type="button" onClick={handleDemo}>View all<ChevronRight size={15} /></button></div>
          <button className="recent-trip-card" type="button" onClick={() => state.currentVersion ? router.push("/trips/penang-demo/itinerary") : handleDemo()}>
            <div className="recent-trip-map"><span className="map-pin pin-one" /><span className="map-pin pin-two" /><span className="map-route" /></div>
            <div className="recent-trip-content">
              <div className="recent-trip-top"><StatusBadge kind="demo">Demo preview</StatusBadge><span><Clock3 size={13} /> {state.currentVersion ? `Version ${state.currentVersion}` : "Not started"}</span></div>
              <h3>{DEMO_FIXTURE.tripName}</h3>
              <p><MapPin size={14} />Penang · 3 days · 4-traveler preset</p>
              <div className="recent-trip-bottom"><span>{formatRM(DEMO_FIXTURE.totalBudget)} total budget</span><span className="continue-label">{state.currentVersion ? "Continue planning" : "Start exploring"}<ChevronRight size={15} /></span></div>
            </div>
          </button>
        </div>

        <div className="demo-entry-card">
          <div className="demo-entry-orb"><Sparkles size={22} /></div>
          <p className="eyebrow">A 5-MINUTE WALKTHROUGH</p>
          <h2>Want to see the full story?</h2>
          <p>Load the fixed Penang Demo to see how TripMind starts with four travelers&apos; needs while protecting Harmony, Energy, and key arrangements.</p>
          <Button onClick={handleDemo}>Load Penang Demo<ArrowUp size={16} className="rotate-45" /></Button>
          <span className="demo-entry-note"><DatabaseIcon />No API key · Deterministic data</span>
        </div>
      </section>

      <section className="home-principles" aria-label="Product principles">
        <div><span className="principle-icon"><MessageCircle size={17} /></span><div><strong>Understand first, generate second</strong><p>Only ask what blocks generation</p></div></div>
        <div><span className="principle-icon"><ScaleIcon /></span><div><strong>Explain every trade-off</strong><p>Review budget, walking, and experience changes</p></div></div>
        <div><span className="principle-icon"><Check size={17} /></span><div><strong>Protect fixed arrangements</strong><p>Preview major changes before you approve them</p></div></div>
      </section>
    </div>
  );
}

function DatabaseIcon() {
  return <span className="mini-check"><Check size={12} /></span>;
}

function ScaleIcon() {
  return <span className="scale-icon">↔</span>;
}
