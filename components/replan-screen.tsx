"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CloudRain,
  Clock3,
  Info,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrainFront,
  WalletCards,
} from "lucide-react";
import { DEMO_FIXTURE, getCurrentHarmony, getCurrentVersion, REPLAN_OPTIONS, type ReplanOption, formatRM } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { Button, EmptyState, ExperienceDiff, SourceTag, StatusBadge } from "@/components/ui";

export function ReplanScreen() {
  const router = useRouter();
  const { state, createDraft, setSelectedReplan } = useTripStore();
  const current = getCurrentVersion(state);
  const [selected, setSelected] = useState<ReplanOption>(state.selectedReplan ?? "walking");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const pending = state.pendingDraft?.kind === "replan" ? state.pendingDraft : null;

  useEffect(() => {
    if (pending?.proposal.option) setSelected(pending.proposal.option);
  }, [pending?.proposal.option]);

  if (!current) return <div className="content-width narrow-page"><EmptyState title="No itinerary to replan yet" description="Generate an itinerary first, then simulate the Day 2 rain event." action={<Button onClick={() => router.push("/")}>Back home<ArrowRight size={16} /></Button>} /></div>;

  const option = REPLAN_OPTIONS[selected];
  const harmony = getCurrentHarmony(state);
  const diffItems: Array<{ label: string; value: string; detail: string; tone: "positive" | "warning" | "neutral" }> = [
    { label: "Harmony", value: option.metrics.harmony, detail: "System estimate", tone: option === REPLAN_OPTIONS.walking ? "warning" : "positive" as const },
    { label: "Minimum satisfaction", value: option.metrics.minimum, detail: "System estimate", tone: "neutral" as const },
    { label: "Budget", value: `${formatRM(Object.values(current.cost).reduce((sum, amount) => sum + amount, 0))} → ${formatRM(Object.values(option.cost).reduce((sum, amount) => sum + amount, 0))}`, detail: option.costDelta >= 0 ? `+${formatRM(option.costDelta)}` : formatRM(option.costDelta), tone: option.costDelta <= 0 ? "positive" : "warning" as const },
    { label: "Walking change", value: option.metrics.walking, detail: "Day 2", tone: "positive" as const },
    { label: "Fatigue risk", value: option.metrics.fatigue, detail: "System estimate", tone: "positive" as const },
    { label: "Weather risk", value: option.metrics.weather, detail: "After replacement", tone: "positive" as const },
    { label: "Key experiences kept", value: option.metrics.retained, detail: "System estimate", tone: "neutral" as const },
    { label: "Fixed arrangement", value: "No impact", detail: "19:30 locked dinner", tone: "positive" as const },
  ];

  function choose(value: ReplanOption) {
    setSelected(value);
    setSelectedReplan(value);
  }

  function continueApproval() {
      if (!pending) createDraft("replan", { option: selected, title: `${option.label} · Rain replan`, reason: option.reason });
    router.push("/trips/penang-demo/budget");
  }

  return (
    <div className="content-width replan-page">
      <div className="page-breadcrumb"><button type="button" onClick={() => router.push("/trips/penang-demo/itinerary")}><ArrowLeft size={15} />My itinerary</button><span>/</span><span>Rain replan</span></div>
      <section className="disruption-banner"><div className="weather-icon"><CloudRain size={27} /></div><div className="disruption-copy"><div className="disruption-title"><p className="eyebrow">DISRUPTION REPLANNER · DEMO WEATHER EVENT</p><StatusBadge kind="risk">Demo weather event</StatusBadge></div><h1>Heavy rain affected Day 2 afternoon outdoor activities.</h1><p><Clock3 size={15} />13:30 event · Affected window 14:00–17:00 · Replacement activities must end by 17:00</p></div><div className="disruption-map"><span className="map-rain-dot dot-one" /><span className="map-rain-dot dot-two" /><span className="map-rain-dot dot-three" /><span className="disruption-path" /><MapPin size={18} /></div></section>
      <div className="replan-guard"><span><LockKeyhole size={15} />Unchanged: Day 2 19:30 Hai Keng Restaurant dinner</span><span><ShieldCheck size={15} />30 min transfer + 60 min dinner buffer reserved</span><span><Info size={15} />Candidates based on formal Version {current.version}</span></div>

      <div className="replan-heading"><div><p className="eyebrow">RECOMMENDED OPTIONS</p><h2>Choose the trade-off that matters most.</h2><p>Least walking is recommended by default, but it is never applied automatically. Review the changes, then approve them.</p></div><StatusBadge kind="approval">Formal itinerary unchanged</StatusBadge></div>
      <div className="replan-options">{(Object.keys(REPLAN_OPTIONS) as ReplanOption[]).map((key) => { const item = REPLAN_OPTIONS[key]; const active = selected === key; const recommended = key === "walking"; return <button type="button" className={`replan-option ${active ? "replan-option-active" : ""}`} key={key} onClick={() => choose(key)}><div className="replan-option-top"><span className={`radio-dot ${active ? "radio-dot-active" : ""}`} />{recommended ? <StatusBadge kind="confirmed">Recommended</StatusBadge> : <span className="option-index">0{key === "interest" ? 2 : 3}</span>}</div><h3>{item.label}</h3><p>{item.subtitle}</p><div className="option-cost"><span className={item.costDelta > 0 ? "cost-up" : item.costDelta < 0 ? "cost-down" : ""}>{item.costDelta >= 0 ? "+" : "−"}{formatRM(Math.abs(item.costDelta))}</span><span>· {item.reason}</span></div><div className="option-mini-metrics"><span><TrainFront size={13} />{item.metrics.walking}</span><span><WalletCards size={13} />{item.costDelta >= 0 ? `+RM ${item.costDelta}` : `−RM ${Math.abs(item.costDelta)}`}</span></div></button>; })}</div>

      <section className="diff-panel"><div className="diff-panel-head"><div><p className="eyebrow">EXPERIENCE DIFF · {option.label}</p><h2>What will this choice change?</h2></div><div className="diff-panel-actions"><SourceTag>System estimate</SourceTag><button type="button" onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? "Hide activity changes" : "View activity changes"}<ChevronDown className={detailsOpen ? "rotate-180" : ""} size={16} /></button></div></div><ExperienceDiff items={diffItems} />{detailsOpen ? <div className="activity-diff-list">{option.changes.map((change, index) => <div className="activity-diff-row" key={change}><span className={`activity-diff-icon activity-diff-${index % 4}`}><Check size={14} /></span><span>{change}</span></div>)}</div> : null}<div className="diff-footer"><span><LockKeyhole size={14} />Fixed arrangement impact: no impact</span><span><Check size={14} />Replacement ends by 17:00 · Transfer and dinner buffer validated</span></div></section>

      <div className="replan-footer"><Link className="text-back" href="/trips/penang-demo/itinerary"><ArrowLeft size={16} />Back to itinerary</Link><div><span className="replan-footer-note">Your selection continues to budget and version review</span><Button size="lg" onClick={continueApproval}>{pending ? "Continue draft approval" : "Select and continue"}<ArrowRight size={17} /></Button></div></div>
      <p className="page-caption">TripMind only repairs the affected time window and explains what was kept, changed, and what it costs.</p>
    </div>
  );
}
