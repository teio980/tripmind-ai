"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  LockKeyhole,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";
import { DEMO_FIXTURE, getCurrentHarmony, getCurrentVersion } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { ApprovalBar, Avatar, Button, EmptyState, SourceTag, StatusBadge } from "@/components/ui";

const satisfaction = [
  { name: "Alex", score: 92, tone: "mint", note: "Culture and food balance well" },
  { name: "Jamie", score: 84, tone: "sky", note: "Budget and free time are balanced" },
  { name: "Sam", score: 64, tone: "amber", note: "Vegetarian and energy needs need care" },
  { name: "Taylor", score: 78, tone: "lavender", note: "Wants to keep shopping time" },
];

export function ConsensusScreen() {
  const router = useRouter();
  const { state, createDraft, approvePendingDraft, cancelPendingDraft } = useTripStore();
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const current = getCurrentVersion(state);
  const pending = state.pendingDraft?.kind === "harmony" ? state.pendingDraft : null;
  const formalHarmony = getCurrentHarmony(state);
  const hasApplied = formalHarmony === 91;
  const candidateHarmony = pending ? 91 : state.estimatedHarmony;

  if (!current) return <div className="content-width narrow-page"><EmptyState title="Generate an itinerary first" description="Group Harmony uses the saved itinerary to explain shared preferences and areas that need coordination." action={<Button onClick={() => router.push("/")}>Back home<ArrowRight size={16} /></Button>} /></div>;

  function runOptimization() {
    if (!pending && !hasApplied) createDraft("harmony", { title: "Group Harmony optimization", targetHarmony: 91, reason: "Protect Sam's vegetarian needs and Taylor's shopping time" });
  }

  return (
    <div className="content-width consensus-page">
      <div className="page-breadcrumb"><button type="button" onClick={() => router.push("/trips/penang-demo/itinerary")}><ArrowLeft size={15} />My itinerary</button><span>/</span><span>Group Harmony</span></div>
      <section className="feature-hero harmony-hero"><div className="feature-hero-copy"><div className="feature-kicker"><span className="feature-kicker-icon"><Sparkles size={14} /></span>GROUP HARMONY · GROUP COORDINATION</div><h1>Find a travel rhythm everyone can accept.</h1><p>The overall score is only the start. We protect the least-satisfied traveler and the experiences no one wants to sacrifice.</p><div className="feature-protection-row"><span><ShieldCheck size={15} />Minimum satisfaction protected</span><span><LockKeyhole size={15} />Private preferences stay private</span><span><Check size={15} />Fixed arrangements stay intact</span></div></div><div className="harmony-orbit"><div className="orbit-ring orbit-ring-back" /><div className="orbit-ring orbit-ring-front" /><div className="harmony-score-large"><strong>{formalHarmony}%</strong><span>Formal Harmony</span></div><div className="orbit-avatar orbit-avatar-one"><Avatar name="Alex" tone="mint" size="sm" /></div><div className="orbit-avatar orbit-avatar-two"><Avatar name="Sam" tone="amber" size="sm" /></div><div className="orbit-avatar orbit-avatar-three"><Avatar name="T" tone="lavender" size="sm" /></div></div></section>

      <div className="harmony-status-row"><div><StatusBadge kind={hasApplied ? "confirmed" : "approval"}>{hasApplied ? `Formal Version ${current.version} · Applied` : "Candidate optimization · Pending approval"}</StatusBadge><span className="status-row-copy">{hasApplied ? "The activity changes passed validation and were saved as a new version." : "Running optimization creates a preview only; it does not rewrite the formal itinerary."}</span></div>{state.memberFeedback === "not_collected" ? <span className="feedback-status"><MessageCircle size={14} />Member feedback: not collected</span> : null}</div>

      <section className="harmony-metrics-grid"><div className="harmony-metric-card harmony-metric-score"><span>Overall Harmony</span><div><strong>{formalHarmony}%</strong>{candidateHarmony && !hasApplied ? <><ArrowRight size={19} /><strong className="candidate-score">{candidateHarmony}%<small>Candidate estimate</small></strong></> : null}</div><SourceTag>{hasApplied ? "Approved system estimate" : "Formal value · System estimate"}</SourceTag><p>{hasApplied ? "Approved activity changes" : "Pending candidate is expected to add 19 points"}</p></div><div className="harmony-metric-card"><span>Minimum member satisfaction</span><div><strong>{hasApplied ? "78%" : "64%"}</strong>{candidateHarmony && !hasApplied ? <><ArrowRight size={19} /><strong className="candidate-score">78%<small>Candidate estimate</small></strong></> : null}</div><SourceTag>Per-member system estimate</SourceTag><p>Optimization will not sacrifice the traveler who needs the most care</p></div><div className="harmony-metric-card"><span>Participating travelers</span><div><strong>4</strong><span className="metric-unit">people</span></div><span className="member-mini-row">{DEMO_FIXTURE.members.map((member) => <Avatar key={member.name} name={member.name} tone={member.tone} size="sm" />)}</span><p>Whole group · Whole trip · Demo scope</p></div></section>

      <div className="consensus-grid">
        <section className="preference-card"><div className="card-title-row"><div><p className="eyebrow">PREFERENCE SUMMARY</p><h2>What matters to the group</h2></div><StatusBadge kind="demo">Aggregated summary</StatusBadge></div><div className="preference-block preference-block-consensus"><span className="preference-icon"><Check size={16} /></span><div><strong>Shared by everyone</strong><p>Food · culture · a relaxed pace</p></div></div><div className="preference-block preference-block-coordinate"><span className="preference-icon"><Vote size={16} /></span><div><strong>Needs coordination</strong><p>Shopping time · vegetarian alternatives · Day 2 energy load</p></div></div><div className="private-note"><LockKeyhole size={15} /><span>Only aggregated conclusions appear here—not exact budgets or private quotes.</span></div></section>
        <section className="satisfaction-card"><div className="card-title-row"><div><p className="eyebrow">MEMBER SATISFACTION</p><h2>Per-traveler satisfaction</h2></div><SourceTag>System estimate</SourceTag></div><div className="satisfaction-list">{satisfaction.map((member) => <div className="satisfaction-row" key={member.name}><Avatar name={member.name} tone={member.tone} /><div className="satisfaction-person"><strong>{member.name}</strong><span>{member.note}</span></div><div className="satisfaction-bar"><span style={{ width: `${hasApplied && member.name === "Sam" ? 78 : member.score}%` }} /></div><strong className="satisfaction-score">{hasApplied && member.name === "Sam" ? 78 : member.score}</strong></div>)}</div><p className="satisfaction-foot"><ShieldCheck size={16} />No traveler is ignored · Minimum satisfaction will not decrease through optimization</p></section>
      </div>

      <section className="harmony-reasons-card"><button className="reasons-toggle" type="button" onClick={() => setReasonsOpen(!reasonsOpen)}><div><span className="reasons-icon"><Sparkles size={17} /></span><span><strong>{hasApplied ? "Applied activity changes" : "Why did the system make these changes?"}</strong><small>See which experiences were kept or replaced</small></span></div><ChevronDown className={reasonsOpen ? "rotate-180" : ""} size={18} /></button>{reasonsOpen ? <div className="reasons-content"><ReasonRow icon={<Check size={15} />} title="Replace incompatible dining" detail="Keep vegetarian options for Sam while staying in the same neighborhood." /><ReasonRow icon={<ShoppingBagIcon />} title="Keep Taylor&apos;s shopping time" detail="Place shopping after the Day 2 market activity without sacrificing shared cultural experiences." /><ReasonRow icon={<ArrowRight size={15} />} title="Reorder same-day activities" detail="Reduce cross-town backtracking and split up consecutive activities, raising minimum satisfaction from 64% to 78% (system estimate)." /></div> : null}</section>

      {pending ? <div className="pending-feature-card"><div><StatusBadge kind="approval">Pending candidate · Based on Version {pending.baseVersion}</StatusBadge><h2>Harmony is estimated to rise from 72% to 91%</h2><p>The candidate changes activities while keeping Sam&apos;s vegetarian needs, Taylor&apos;s shopping time, and the locked dinner.</p></div><SourceTag>System estimate</SourceTag></div> : null}
      <div className="feature-actions">{!hasApplied ? <Button size="lg" onClick={runOptimization} disabled={Boolean(pending)}>{pending ? "Candidate generated" : "Run Harmony optimization"}<Sparkles size={17} /></Button> : <Button variant="secondary" size="lg" disabled><Check size={17} />Harmony applied</Button>}{pending ? <ApprovalBar label="Harmony candidate" description="The next version is created only after the activity changes are approved." approveLabel="Approve and apply changes" cancelLabel="Skip candidate" onApprove={() => { approvePendingDraft(); }} onCancel={cancelPendingDraft} /> : <Link className="secondary-action-link" href="/trips/penang-demo/itinerary">Back to itinerary<ChevronRight size={16} /></Link>}</div>
      <p className="page-caption">Group Harmony optimizes overall and minimum satisfaction together while protecting the hard needs of minority travelers.</p>
    </div>
  );
}

function ReasonRow({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) { return <div className="reason-row"><span className="reason-row-icon">{icon}</span><div><strong>{title}</strong><p>{detail}</p></div></div>; }
function ShoppingBagIcon() { return <ShoppingBag size={15} aria-hidden="true" />; }
