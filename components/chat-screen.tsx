"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { DEMO_FIXTURE, GENERATION_STEPS } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { Button, EmptyState, SourceTag, StatusBadge } from "@/components/ui";

export function ChatScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewRequested = searchParams.get("stage") === "ready";
  const { state, answerClarification, removeRequirement, startGeneration, advanceGeneration, loadDemo } = useTripStore();
  const [answer, setAnswer] = useState("");
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const isGenerating = state.stage === "generating";
  const isReady = state.stage === "ready_to_generate" || isReviewRequested;

  useEffect(() => {
    if (state.stage === "clarifying") answerRef.current?.focus();
  }, [state.stage]);

  useEffect(() => {
    if (!isGenerating) return;
    const delay = searchParams.get("skip") === "1" ? 80 : state.generationStep === 0 ? 540 : 720;
    const timer = window.setTimeout(() => advanceGeneration(), delay);
    return () => window.clearTimeout(timer);
  }, [advanceGeneration, isGenerating, searchParams, state.generationStep]);

  useEffect(() => {
    if (state.stage === "itinerary_ready") router.replace("/trips/penang-demo/itinerary");
  }, [router, state.stage]);

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!state.destination) missing.push("destination");
    if (!state.duration) missing.push("trip length");
    return missing;
  }, [state.destination, state.duration]);

  function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim()) return;
    answerClarification(answer.trim());
    setAnswer("");
  }

  function handleDemoQuickReply() {
    if (state.mode === "demo_preset") {
      answerClarification("Penang, 3 days, four travelers, food-focused, relaxed pace");
      return;
    }
    answerClarification("Penang, 3 days");
  }

  if (isGenerating) return <GenerationView />;

  if (isReady) return <ReviewView onBack={() => router.push("/chat/demo")} onGenerate={startGeneration} />;

  if (state.stage === "initial") {
    return (
      <div className="content-width narrow-page">
        <EmptyState title="Share your travel idea" description="Return home to enter a sentence, or load the Penang Demo to start exploring." action={<><Button onClick={() => router.push("/")}><ArrowLeft size={16} />Back home</Button><Button variant="secondary" onClick={() => { loadDemo(); router.push("/chat/demo"); }}>Load Penang Demo</Button></>} />
      </div>
    );
  }

  return (
    <div className="content-width chat-page">
      <div className="page-breadcrumb"><button type="button" onClick={() => router.push("/")}><ArrowLeft size={15} />Home</button><span>/</span><span>Agent follow-up</span></div>
      <div className="chat-page-heading">
        <div><p className="eyebrow">TRIPMIND AGENT · REQUIREMENT CLARIFIER</p><h1>Turn a rough idea into a trip you can take.</h1><p>I&apos;ll only ask about details that block itinerary generation. Everything else can be adjusted later.</p></div>
        {state.mode === "demo_preset" ? <StatusBadge kind="demo">Demo Fixture preset</StatusBadge> : <StatusBadge kind="neutral">New traveler · 1 person</StatusBadge>}
      </div>

      <div className="chat-layout">
        <section className="conversation-card" aria-label="Conversation with TripMind Agent">
          <div className="conversation-topbar"><div className="agent-avatar"><Compass size={19} /></div><div><strong>TripMind Agent</strong><span><span className="online-dot" />Understanding your travel idea</span></div><button type="button" aria-label="Help" className="round-icon-button"><CircleHelp size={17} /></button></div>
          <div className="conversation-body">
            <div className="message-row message-user"><span className="message-label">You</span><div className="bubble bubble-user">{state.idea || "I want to travel, but I don't have a plan yet"}</div></div>
            <div className="message-row message-agent"><span className="message-label agent-label"><Sparkles size={13} />Agent</span><div className="bubble bubble-agent">Of course. First, confirm the destination and trip length. Everything else can be adjusted later, so I won&apos;t guess at important constraints.</div></div>
            {state.destination || state.duration ? <div className="message-row message-agent"><span className="message-label agent-label"><Sparkles size={13} />Agent</span><div className="bubble bubble-agent">I&apos;ve noted what you shared. {missingFields.length ? `You still need ${missingFields.join(" and ")}.` : "The essential details are ready for a pre-generation review."}</div></div> : null}
            {missingFields.length ? <button type="button" className="quick-reply" onClick={handleDemoQuickReply}><span className="quick-reply-icon"><Sparkles size={15} /></span><span><strong>{state.mode === "demo_preset" ? "Penang, 3 days, four travelers, food-focused, relaxed pace" : "Penang, 3 days"}</strong><small>{state.mode === "demo_preset" ? "Demo preset quick reply · Load the complete context" : "Quick reply · destination + trip length"}</small></span><ArrowRight size={17} /></button> : null}
          </div>
          <form className="chat-composer" onSubmit={submitAnswer}>
            <textarea ref={answerRef} value={answer} onChange={(event) => setAnswer(event.target.value)} rows={2} placeholder="Type your reply…" aria-label="Reply to TripMind Agent" />
            <button type="submit" className="composer-send" aria-label="Send reply" disabled={!answer.trim()}><ArrowUp size={19} /></button>
          </form>
          <div className="composer-hint"><span><MessageCircle size={13} />Natural language is supported</span><span>Enter to send · Shift + Enter for a new line</span></div>
        </section>

        <RequirementsCard />
      </div>
    </div>
  );
}

function RequirementsCard() {
  const { state, removeRequirement } = useTripStore();
  const requirements = [
    { key: "destination" as const, label: "Destination", value: state.destination ?? "To confirm", status: state.destination ? "provided" : "missing" },
    { key: "duration" as const, label: "Duration", value: state.duration ? `${state.duration} days` : "To confirm", status: state.duration ? "provided" : "missing" },
    { key: "travelers" as const, label: "Travelers", value: state.mode === "demo_preset" ? "4 travelers" : "1 traveler (solo default)", status: "default" },
    { key: "interests" as const, label: "Interests", value: state.interests.length ? state.interests.join(" · ") : "Not specified", status: state.interests.length ? "provided" : "optional" },
    { key: "pace" as const, label: "Pace", value: state.pace ?? "Not specified", status: state.pace ? "provided" : "optional" },
  ];
  const missing = requirements.filter((item) => item.status === "missing");

  return (
    <aside className="requirements-card">
      <div className="requirements-heading"><div><p className="eyebrow">WHAT I REMEMBER</p><h2>Current requirements</h2></div><button type="button" className="collapse-button" aria-label="Collapse current requirements"><ChevronDown size={17} /></button></div>
      <div className="requirement-list">
        {requirements.map((item) => <div className="requirement-row" key={item.label}><span className="requirement-label">{item.label}</span><span className={`requirement-value requirement-${item.status}`}>{item.value}{item.status === "provided" && item.key !== "travelers" ? <button type="button" aria-label={`Remove ${item.label}`} onClick={() => removeRequirement(item.key as "destination" | "duration" | "interests" | "pace")}><X size={13} /></button> : null}</span></div>)}
      </div>
      {state.mode === "demo_preset" ? <div className="preset-note"><StatusBadge kind="demo">Loaded demo context</StatusBadge><p>The 4-traveler preset, Sam&apos;s vegetarian and walking constraints, and Taylor&apos;s shopping time come from the Demo you loaded; they were not guessed.</p></div> : <div className="default-note"><InfoIcon /><p>Travelers default to 1 person. Optional details such as interests and pace can be added later.</p></div>}
      <div className={`missing-box ${missing.length ? "missing-box-active" : "missing-box-ready"}`}><span className="missing-icon">{missing.length ? <Plus size={15} /> : <Check size={15} />}</span><div><strong>{missing.length ? "Still needed" : "Ready to generate"}</strong><p>{missing.length ? missing.map((item) => item.label).join(" + ") : "Enter the pre-generation review"}</p></div></div>
    </aside>
  );
}

function ReviewView({ onBack, onGenerate }: { onBack: () => void; onGenerate: () => void }) {
  const { state } = useTripStore();
  const isDemo = state.mode === "demo_preset";
  const cards = [
    { label: "Destination", value: state.destination ?? "Penang, Malaysia", icon: MapPin },
    { label: "Trip length", value: `${state.duration ?? 3} days`, icon: CalendarDays },
    { label: "Travelers", value: `${state.travelers} people`, icon: Users },
    { label: "Shared interests", value: state.interests.length ? state.interests.join(" · ") : "To add", icon: Sparkles },
  ];

  return (
    <div className="content-width review-page">
      <div className="page-breadcrumb"><button type="button" onClick={onBack}><ArrowLeft size={15} />Back to follow-up</button><span>/</span><span>Pre-generation review</span></div>
      <div className="review-header"><div><p className="eyebrow">REQUIREMENT REVIEW · STEP 03</p><h1>Here&apos;s how I understand this trip</h1><p>Confirm these requirements first. You can still use Agent to adjust the itinerary after it is generated.</p></div><div className="review-header-badges"><StatusBadge kind="demo">Demo data</StatusBadge><StatusBadge kind="estimated">Needs confirmation</StatusBadge></div></div>
      <section className="review-card">
        <div className="review-card-top"><div><span className="review-card-icon"><Sparkles size={18} /></span><div><strong>Structured trip requirements</strong><p>Make the known inputs clear before generating</p></div></div><SourceTag>{isDemo ? "Demo Fixture preset" : "Your input"}</SourceTag></div>
        <div className="review-fact-grid">{cards.map(({ label, value, icon: Icon }) => <div className="review-fact" key={label}><span className="fact-icon"><Icon size={17} /></span><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
        <div className="review-detail-grid">
          <div><span className="detail-label">Optional defaults</span><p><span className="detail-dot" />{state.pace ?? "Relaxed"}<em>System default</em></p><p><span className="detail-dot" />Activities budget RM 1,000<em>Demo data</em></p></div>
          <div><span className="detail-label">Always protect</span>{isDemo ? <><p><span className="detail-check"><Check size={12} /></span>Sam · Vegetarian needs and daily walking limit</p><p><span className="detail-check"><Check size={12} /></span>Taylor · Shopping time</p><p><span className="detail-lock"><Check size={12} /></span>Day 2 · 19:30 locked dinner</p></> : <p><span className="detail-dot" />No fixed arrangements</p>}</div>
        </div>
        <div className="review-note"><CircleHelp size={17} /><p>{isDemo ? "Demo preset inputs stay labeled as demo data and are never presented as system guesses." : "Missing optional details use clearly labeled, reasonable defaults."} You can change these inputs later.</p></div>
      </section>
      <div className="review-footer"><button className="text-back" type="button" onClick={onBack}><ArrowLeft size={16} />Back to details</button><Button size="lg" onClick={onGenerate}>Generate {state.duration ?? 3}-day itinerary<ArrowRight size={17} /></Button></div>
    </div>
  );
}

function GenerationView() {
  const { state } = useTripStore();
  return (
    <div className="content-width generation-page">
      <div className="generation-intro"><span className="generation-orb"><Sparkles size={22} /></span><p className="eyebrow">TRIPMIND AGENT · BUILDING YOUR ESCAPE</p><h1>Turn the idea into a route.</h1><p>I&apos;ll find candidates first, then check every time, transfer, and fixed arrangement.</p></div>
      <section className="generation-card" aria-live="polite">
        <div className="generation-card-head"><div><strong>Building your itinerary</strong><span>Fixed Demo data · No external API</span></div><span className="generation-count">{Math.min(state.generationStep + 1, 5)} / 5</span></div>
        <div className="generation-progress-track"><span style={{ width: `${Math.min((state.generationStep / 5) * 100 + 8, 100)}%` }} /></div>
        <div className="generation-steps">
          {GENERATION_STEPS.map((step, index) => { const complete = state.generationStep > index; const active = state.generationStep === index; return <div className={`generation-step ${complete ? "step-complete" : ""} ${active ? "step-active" : ""}`} key={step.title}><span className="step-marker">{complete ? <Check size={14} /> : active ? <span className="step-pulse" /> : index + 1}</span><div><strong>{step.title}</strong><p>{step.detail}</p></div>{complete ? <span className="step-state">Complete</span> : active ? <span className="step-state step-state-active">In progress</span> : null}</div>; })}
        </div>
      </section>
      <div className="generation-guard"><span><Check size={14} />Fixed arrangements protected</span><span><Check size={14} />Estimated data clearly labeled</span><span><Check size={14} />Saved as a standalone trip</span></div>
    </div>
  );
}

function InfoIcon() {
  return <span className="info-icon"><CircleHelp size={15} /></span>;
}
