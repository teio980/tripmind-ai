"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Copy,
  Flag,
  Info,
  Landmark,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plane,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  TrainFront,
  Utensils,
  Waves,
  X,
  Zap,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { DEMO_FIXTURE, getCurrentCost, getCurrentHarmony, getCurrentVersion, hasApprovedChange, TIMELINE_DAYS, formatRM } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { ApprovalBar, Avatar, Button, EmptyState, ExperienceDiff, MetricCard, SourceTag, StatusBadge } from "@/components/ui";

const timelineIconMap: Record<string, LucideIcon> = {
  plane: Plane,
  utensils: Utensils,
  landmark: Landmark,
  coffee: Coffee,
  store: Store,
  sun: Sun,
  lock: LockKeyhole,
  building: Building2,
  waves: Waves,
};

export function ItineraryScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useTripStore();
  const [agentOpen, setAgentOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const panel = searchParams.get("panel");
  const current = getCurrentVersion(state);
  const isEnergyOpen = panel === "energy";

  if (!current) {
    return <div className="content-width narrow-page"><EmptyState title="No itinerary to view yet" description="After you generate the first Penang Demo itinerary, this becomes your stable trip page." action={<Button onClick={() => router.push("/")}>Back home<ArrowRight size={16} /></Button>} /></div>;
  }

  const isDemo = state.mode === "demo_preset";
  const cost = getCurrentCost(state);
  const harmony = getCurrentHarmony(state);
  const hasEnergy = hasApprovedChange(state, "energy");
  const hasLateStart = hasApprovedChange(state, "itinerary_change");

  return (
    <div className="content-width itinerary-page">
      <div className="page-breadcrumb"><button type="button" onClick={() => router.push("/")}><ArrowLeft size={15} />My itinerary</button><span>/</span><span>{DEMO_FIXTURE.tripName}</span></div>
      <section className="trip-header-card">
        <div className="trip-heading-main"><div className="trip-title-row"><span className="trip-pin"><MapPin size={17} /></span><div><p className="eyebrow">{DEMO_FIXTURE.tripId} · Trip object</p><h1>{DEMO_FIXTURE.tripName}</h1></div></div><div className="trip-meta-row"><span><MapPin size={14} />{state.destination ?? DEMO_FIXTURE.destination}</span><span><CalendarDays size={14} />{state.duration ?? 3} days</span><span><UsersIcon />{state.travelers} travelers{isDemo ? " · Demo preset" : ""}</span></div></div>
        <div className="trip-header-actions"><div className="header-statuses"><StatusBadge kind={isDemo ? "demo" : "estimated"}>{isDemo ? "Demo data" : "Estimated"}</StatusBadge><span className="last-saved"><Check size={13} />Saved just now</span></div><div className="trip-action-row"><Button variant="secondary" size="sm" onClick={() => setInviteOpen(true)}><UsersIcon />Invite travelers</Button><Button size="sm" onClick={() => setAgentOpen(true)}><MessageCircle size={15} />Ask Agent</Button></div></div>
      </section>

      <nav className="trip-tabs" aria-label="Itinerary enhancements">
        <Link className="trip-tab trip-tab-active" href="/trips/penang-demo/itinerary"><CalendarDays size={16} />Itinerary</Link>
        <Link className="trip-tab" href="/trips/penang-demo/consensus"><ScaleIcon />Harmony <span className="tab-number">{harmony}%</span></Link>
        <Link className={`trip-tab ${isEnergyOpen ? "trip-tab-highlight" : ""}`} href="/trips/penang-demo/itinerary?panel=energy"><Zap size={16} />Energy</Link>
        <Link className="trip-tab" href="/trips/penang-demo/budget"><WalletIcon />Budget</Link>
        <Link className="trip-tab trip-tab-alert" href="/trips/penang-demo/replan"><AlertTriangle size={16} />Rain replan</Link>
      </nav>

      <div className="itinerary-layout">
        <main className="timeline-column">
          <div className="timeline-overview"><div><p className="eyebrow">Current formal version</p><h2>Version {current.version} <span>· {current.label}</span></h2></div><div className="timeline-overview-right"><StatusBadge kind="confirmed">Hard constraints passed</StatusBadge><span className="estimate-note"><Info size={13} />Routes and costs are system estimates</span></div></div>
          {hasLateStart ? <div className="change-banner change-banner-teal"><span className="change-banner-icon"><Check size={16} /></span><div><strong>Version {current.version} includes a later start</strong><p>Day 2 now starts at 10:30; the locked dinner is unchanged.</p></div><StatusBadge kind="confirmed">Applied</StatusBadge></div> : null}
          <div className="day-timeline">{TIMELINE_DAYS.map((day, index) => <DayBlock key={day.day} day={day} index={index} lateStart={hasLateStart} energyOptimized={hasEnergy} />)}</div>
          <button className="agent-inline-cta" type="button" onClick={() => setAgentOpen(true)}><span className="agent-inline-icon"><Sparkles size={17} /></span><span><strong>Want to adjust this itinerary?</strong><small>Tell Agent, for example: &quot;Start Day 2 later&quot;</small></span><ArrowRight size={17} /></button>
          <div className="locked-callout"><LockKeyhole size={17} /><div><strong>Fixed arrangement protected</strong><p>Day 2 · 19:30 Hai Keng Restaurant dinner is locked. Every optimization and replan must keep it and validate the arrival buffer.</p></div><StatusBadge kind="locked">Locked</StatusBadge></div>
        </main>

        <aside className="itinerary-side-rail">
          <div className="side-rail-heading"><div><p className="eyebrow">TRIP SNAPSHOT</p><h2>Trip summary</h2></div><button type="button" className="more-button" aria-label="More itinerary actions"><MoreHorizontal size={18} /></button></div>
          <div className="metric-stack">
            <MetricCard label="Group Harmony" value={`${harmony}%`} delta={harmony < 91 ? "Can improve" : "Updated"} status={harmony < 91 ? "Minimum member satisfaction protected" : "Candidate approved and saved"} source="System estimate" icon={Sparkles} tone="teal" />
            <MetricCard label="Travel Energy · Day 2" value={hasEnergy ? "4.6 km" : "8.4 km"} delta={hasEnergy ? "−3.8 km" : "High risk alert"} status={hasEnergy ? "Medium · 1 rest block" : "High · 0 rest blocks"} source="System estimate" icon={Zap} tone={hasEnergy ? "blue" : "amber"} footnote="Sam hard limit 9.0 km · Comfort target ≤5.0 km" />
            <MetricCard label="Estimated spend" value={formatRM(Object.values(cost).reduce((total, item) => total + item, 0))} delta={`Remaining ${formatRM(DEMO_FIXTURE.totalBudget - Object.values(cost).reduce((total, item) => total + item, 0))}`} status="Whole group · Whole trip · Planning only" source="Estimated" icon={WalletCards} tone="ink" />
          </div>
          <div className="side-quick-links"><Link href="/trips/penang-demo/consensus"><span className="quick-link-icon quick-link-teal"><Sparkles size={15} /></span><span><strong>View Group Harmony</strong><small>Shared preferences and activity rationale</small></span><ChevronRight size={16} /></Link><Link href="/trips/penang-demo/itinerary?panel=energy"><span className="quick-link-icon quick-link-blue"><Zap size={15} /></span><span><strong>Open Travel Energy</strong><small>Compare the Day 2 load change</small></span><ChevronRight size={16} /></Link><Link href="/trips/penang-demo/replan"><span className="quick-link-icon quick-link-coral"><AlertTriangle size={15} /></span><span><strong>Simulate rain replan</strong><small>Repair only the affected afternoon</small></span><ChevronRight size={16} /></Link></div>
          <div className="side-source-card"><div className="side-source-icon"><DatabaseIcon /></div><div><strong>Data notes</strong><p>This trip uses the Penang Demo Fixture. Costs, routes, weather, and member satisfaction are system estimates.</p></div></div>
        </aside>
      </div>

      {isEnergyOpen ? <EnergyDrawer onClose={() => router.replace(pathname)} hasEnergy={hasEnergy} /> : null}
      {agentOpen ? <AgentDrawer onClose={() => setAgentOpen(false)} /> : null}
      {inviteOpen ? <InviteDialog onClose={() => setInviteOpen(false)} /> : null}
    </div>
  );
}

function DayBlock({ day, index, lateStart, energyOptimized }: { day: (typeof TIMELINE_DAYS)[number]; index: number; lateStart: boolean; energyOptimized: boolean }) {
  const activities: Array<{ time: string; title: string; meta: string; tag: string; icon: string; locked?: boolean; affected?: boolean }> = day.activities.map((activity) => ({ ...activity }));
  if (day.day === "Day 2" && energyOptimized) {
    activities.splice(2, 0, { time: "17:00", title: "Rest block", meta: "45 min · Break up consecutive activities", tag: "Recovery", icon: "coffee" });
  }
  return (
    <section className={`day-block ${index === 1 ? "day-block-focus" : ""}`}>
      <div className="day-block-heading"><div className="day-heading-left"><span className="day-index">0{index + 1}</span><div><h3>{day.day} <span>· {day.title}</span></h3><p>{index === 1 ? "Fixed arrangements and weather buffer included in validation" : "The schedule leaves room to breathe; times and costs are estimates"}</p></div></div><div className="day-heading-right"><span>{formatRM(day.cost)}</span><StatusBadge kind="estimated">Estimated</StatusBadge></div></div>
      <div className="activity-list">
        {activities.map((activity, activityIndex) => { const Icon = timelineIconMap[activity.icon] ?? MapPin; const isLateAdjusted = lateStart && day.day === "Day 2" && activityIndex === 0; const displayTime = isLateAdjusted ? "10:30" : activity.time; const isRest = activity.tag === "Recovery" || activity.tag === "Open time"; return <div className={`activity-row ${activity.locked ? "activity-locked" : ""} ${activity.affected ? "activity-affected" : ""} ${isLateAdjusted ? "activity-adjusted" : ""}`} key={`${activity.time}-${activity.title}`}><div className="activity-time">{isLateAdjusted ? <><span className="time-old">09:30</span><strong>{displayTime}</strong></> : <strong>{displayTime}</strong>}</div><div className="activity-connector"><span className={`activity-node node-${isRest ? "rest" : activity.locked ? "locked" : activity.affected ? "risk" : "default"}`}><Icon size={15} /></span>{activityIndex < activities.length - 1 ? <span className="connector-line" /> : null}</div><div className="activity-content"><div className="activity-title-line"><h4>{activity.title}</h4>{activity.locked ? <StatusBadge kind="locked">Locked</StatusBadge> : activity.affected ? <StatusBadge kind="risk">Weather-sensitive</StatusBadge> : isLateAdjusted ? <StatusBadge kind="confirmed">Adjusted</StatusBadge> : null}</div><div className="activity-meta"><span className="activity-tag">{activity.tag}</span><span>{activity.meta}</span></div></div><button className="activity-more" type="button" aria-label={`${activity.title} more information`}><MoreHorizontal size={16} /></button></div>; })}
      </div>
    </section>
  );
}

function AgentDrawer({ onClose }: { onClose: () => void }) {
  const { state, createDraft, approvePendingDraft, cancelPendingDraft } = useTripStore();
  const [message, setMessage] = useState("Start Day 2 later");
  const pending = state.pendingDraft?.kind === "itinerary_change" ? state.pendingDraft : null;

  function submit() {
    if (!message.trim()) return;
    createDraft("itinerary_change", { title: "Later Day 2 start", reason: message.trim() });
  }

  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="agent-drawer" role="dialog" aria-modal="true" aria-labelledby="agent-drawer-title"><div className="drawer-handle" /><div className="drawer-header"><div><p className="eyebrow">TRIPMIND AGENT</p><h2 id="agent-drawer-title">Keep adjusting your itinerary</h2></div><button type="button" className="drawer-close" aria-label="Close Agent drawer" onClick={onClose}><X size={19} /></button></div><div className="drawer-intro"><span className="agent-avatar"><Sparkles size={18} /></span><p>Tell me what you want to change. I&apos;ll explain the impact first, then let you decide whether to create a new version.</p></div><div className="drawer-suggestions"><button type="button" onClick={() => setMessage("Start Day 2 later")}>Start Day 2 later</button><button type="button" onClick={() => setMessage("Swap the museum for shopping")}>Swap the museum for shopping</button></div><div className="drawer-input-wrap"><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} aria-label="Tell Agent how to modify the itinerary" /><button type="button" onClick={submit} aria-label="Submit change request"><Send size={17} /></button></div>{pending ? <div className="drawer-preview"><div className="preview-heading"><StatusBadge kind="approval">Pending preview</StatusBadge><SourceTag>Based on Version {pending.baseVersion}</SourceTag></div><h3>Later Day 2 start</h3><p>Only unlocked time slots change; the Day 2 19:30 dinner is unaffected.</p><ExperienceDiff compact items={[{ label: "Start time", value: "09:30 → 10:30", tone: "positive" }, { label: "Afternoon activity", value: "Shorten by 30 min", tone: "neutral" }, { label: "Locked dinner", value: "No impact", tone: "positive" }, { label: "Version", value: `v${pending.baseVersion} → v${pending.baseVersion + 1}`, tone: "neutral" }]} /><ApprovalBar label="Change preview" description="A new formal version is created only after approval." approveLabel="Keep this change" cancelLabel="Keep adjusting" onApprove={() => { approvePendingDraft(); onClose(); }} onCancel={cancelPendingDraft} /></div> : <div className="drawer-safe-note"><LockKeyhole size={16} /><span>I&apos;ll protect locked arrangements and never overwrite the current version directly.</span></div>}<div className="drawer-footer"><span><Info size={13} />Estimated result · Cancel anytime</span></div></aside></div>;
}

function EnergyDrawer({ onClose, hasEnergy }: { onClose: () => void; hasEnergy: boolean }) {
  const { state, createDraft, approvePendingDraft } = useTripStore();
  const pending = state.pendingDraft?.kind === "energy" ? state.pendingDraft : null;
  function handlePrimary() {
    if (pending) {
      approvePendingDraft();
      onClose();
      return;
    }
    createDraft("energy", { title: "Day 2 low-walking plan", reason: "Reduce consecutive walking while keeping food and cultural experiences" });
  }
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="energy-drawer" role="dialog" aria-modal="true" aria-labelledby="energy-title"><div className="drawer-handle" /><div className="drawer-header"><div><p className="eyebrow">TRAVEL ENERGY · DAY 2</p><h2 id="energy-title">Leave room for energy</h2></div><button type="button" className="drawer-close" aria-label="Close Energy panel" onClick={onClose}><X size={19} /></button></div><p className="energy-lead">Reduce physical load while keeping the food and cultural experiences. The 8.4 km route passes hard constraints, but the current risk alert is High.</p><div className="energy-limit"><span className="limit-icon"><Flag size={16} /></span><div><strong>Sam&apos;s Demo Fixture limit</strong><p>Daily hard limit <b>9.0 km</b> · Comfort target <b>≤5.0 km</b></p></div><StatusBadge kind="confirmed">Within limit</StatusBadge></div><div className="energy-compare"><div className="energy-compare-head"><span>Metric</span><span>Day 2 baseline</span><span>Candidate</span><span>Change</span></div><EnergyMetric label="Walking" before="8.4 km" after="4.6 km" change="−3.8 km" tone="blue" /><EnergyMetric label="Rest blocks" before="0" after="1" change="+1" tone="teal" /><EnergyMetric label="Fatigue risk" before="High" after="Medium" change="↓" tone="amber" /><EnergyMetric label="Transfers" before="5" after="3" change="−2" tone="blue" /></div><div className="energy-reasons"><h3>What changes</h3><p><Check size={15} />Reorder the Day 2 outdoor segment and market by location / transfers</p><p><Check size={15} />Shorten consecutive walking and add a 45-minute rest</p><p><LockKeyhole size={15} />Keep the locked Day 2 19:30 dinner and validate the transfer buffer</p></div>{hasEnergy ? <div className="applied-panel"><Check size={16} /><span>The low-walking plan is applied to the current formal version.</span></div> : <Button size="lg" className="energy-primary" onClick={handlePrimary}>{pending ? "Approve low-walking plan" : "Generate low-walking candidate"}<ArrowRight size={17} /></Button>} {!hasEnergy && pending ? <p className="drawer-approval-hint">Candidate generated. Approval will create the next version from current Version {pending.baseVersion}.</p> : null}<div className="drawer-footer"><span><Info size={13} />Walking and fatigue values are system estimates, not medical advice</span></div></aside></div>;
}

function EnergyMetric({ label, before, after, change, tone }: { label: string; before: string; after: string; change: string; tone: string }) {
  return <div className="energy-metric-row"><span className="energy-metric-label">{label}</span><span>{before}</span><strong className={`energy-after energy-after-${tone}`}>{after}</strong><span className="energy-change">{change}</span></div>;
}

function InviteDialog({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = "tripmind.app/join/TRP-PEN-2403";
  async function copyLink() { try { await navigator.clipboard?.writeText(`https://${link}`); } catch {} setCopied(true); window.setTimeout(() => setCopied(false), 2200); }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="invite-modal modal-card" role="dialog" aria-modal="true" aria-labelledby="invite-title"><button className="modal-close" type="button" aria-label="Close invite dialog" onClick={onClose}><X size={18} /></button><span className="modal-icon modal-icon-teal"><UsersIcon /></span><p className="eyebrow">COLLABORATION</p><h2 id="invite-title">Invite travel companions</h2><p>Generate a simulated share link so friends can add their preferences. Real accounts and joining flows are disabled in this Prototype.</p><div className="share-link-box"><span>{link}</span><button type="button" onClick={copyLink}>{copied ? <Check size={17} /> : <Copy size={17} />}<span>{copied ? "Copied" : "Copy link"}</span></button></div><div className="invite-members"><span>Current members</span><div>{DEMO_FIXTURE.members.map((member) => <Avatar key={member.name} name={member.name} tone={member.tone} size="sm" />)}</div><small>Alex · Jamie · Sam · Taylor</small></div><Button size="lg" className="full-width" onClick={onClose}>Got it</Button></div></div>;
}

function DatabaseIcon() { return <span className="database-glyph"><span /><span /><span /></span>; }
function UsersIcon() { return <Users size={15} aria-hidden="true" />; }
function ScaleIcon() { return <span className="scale-glyph">↔</span>; }
function WalletIcon() { return <span className="wallet-glyph">RM</span>; }
