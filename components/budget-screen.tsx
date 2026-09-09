"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  Info,
  LockKeyhole,
  ReceiptText,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_LIMITS, DEMO_FIXTURE, formatRM, getCurrentCost, getCurrentHarmony, getCurrentVersion, REPLAN_OPTIONS, sumBudget, type BudgetBreakdown, type DraftKind } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { ApprovalBar, Button, EmptyState, ExperienceDiff, SourceTag, StatusBadge } from "@/components/ui";

export function BudgetScreen() {
  const router = useRouter();
  const { state, approvePendingDraft, cancelPendingDraft } = useTripStore();
  const current = getCurrentVersion(state);
  const draft = state.pendingDraft;
  const currentCost = getCurrentCost(state);
  const draftCost = draft ? getDraftCost(draft.kind, draft.proposal.option, currentCost) : null;
  const hasDraft = Boolean(draft && draft.status === "pending");
  const total = sumBudget(currentCost);
  const draftTotal = draftCost ? sumBudget(draftCost) : null;

  if (!current) return <div className="content-width narrow-page"><EmptyState title="No budget snapshot yet" description="After the first itinerary is generated, TripMind will show the total, category budgets, and version differences here." action={<Button onClick={() => router.push("/")}>Back home<ArrowRight size={16} /></Button>} /></div>;

  const diff = getDiffItems(draft?.kind, draft?.proposal.option, current, currentCost, draftCost, state);
  const draftLabel = draft?.kind === "replan" && draft.proposal.option ? REPLAN_OPTIONS[draft.proposal.option].label : draft?.kind === "harmony" ? "Harmony optimization" : draft?.kind === "energy" ? "Energy optimization" : "Later Day 2 start";

  function approve() {
    approvePendingDraft();
    window.setTimeout(() => router.push("/trips/penang-demo/itinerary"), 80);
  }

  return (
    <div className="content-width budget-page">
      <div className="page-breadcrumb"><button type="button" onClick={() => router.push(draft?.kind === "replan" ? "/trips/penang-demo/replan" : "/trips/penang-demo/itinerary")}><ArrowLeft size={15} />Back</button><span>/</span><span>Budget & version review</span></div>
      <section className="budget-header"><div><p className="eyebrow">BUDGET & VERSION CONTROL</p><div className="budget-title-row"><span className="budget-header-icon"><WalletCards size={21} /></span><div><h1>Budget & version review</h1><p>Review the amount, impact, and version history together before creating a new version.</p></div></div></div><div className="budget-header-status">{hasDraft ? <StatusBadge kind="approval">Pending · Version {current.version} → {current.version + 1}</StatusBadge> : <StatusBadge kind="confirmed">Current Version {current.version} · Saved</StatusBadge>}<span><Info size={13} />4 travelers · 3 days · Planning only</span></div></section>

      <section className="budget-total-card"><div className="budget-total-top"><div><span>Total trip budget</span><strong>{formatRM(DEMO_FIXTURE.totalBudget)}</strong></div><div className="budget-total-compare"><span>Formal remaining {formatRM(DEMO_FIXTURE.totalBudget - total)}</span>{draftTotal !== null ? <><ArrowRight size={17} /><span className="draft-remain">Draft remaining {formatRM(DEMO_FIXTURE.totalBudget - draftTotal)}</span></> : null}</div></div><div className="budget-progress"><span style={{ width: `${Math.min((total / DEMO_FIXTURE.totalBudget) * 100, 100)}%` }} /><span className="budget-progress-draft" style={{ width: `${draftTotal ? Math.min((draftTotal / DEMO_FIXTURE.totalBudget) * 100, 100) : 0}%` }} /></div><div className="budget-progress-labels"><span>Current formal version · {formatRM(total)}</span>{draftTotal !== null ? <span>Pending draft · {formatRM(draftTotal)}</span> : <span>{formatRM(DEMO_FIXTURE.totalBudget - total)} available to adjust</span>}</div></section>

      <section className="budget-category-card"><div className="card-title-row"><div><p className="eyebrow">CATEGORY BREAKDOWN</p><h2>Category budgets</h2></div><SourceTag>Estimated</SourceTag></div><div className="category-grid">{(Object.keys(CATEGORY_LIMITS) as Array<keyof BudgetBreakdown>).map((key) => { const value = currentCost[key]; const draftValue = draftCost?.[key]; const changed = draftValue !== undefined && draftValue !== value; return <div className={`category-item ${changed ? "category-item-changed" : ""}`} key={key}><div className="category-item-top"><span className={`category-icon category-${key}`}><CategoryIcon category={key} /></span><span>{CATEGORY_LABELS[key]}</span>{changed ? <span className={draftValue! > value ? "category-delta up" : "category-delta down"}>{draftValue! > value ? "+" : "−"}{formatRM(Math.abs(draftValue! - value))}</span> : null}</div><div className="category-amounts"><strong>{formatRM(value)}</strong><span>/ {formatRM(CATEGORY_LIMITS[key])}</span>{changed ? <><ArrowRight size={15} /><strong className="draft-amount">{formatRM(draftValue!)}</strong></> : null}</div><div className="category-track"><span style={{ width: `${Math.min((value / CATEGORY_LIMITS[key]) * 100, 100)}%` }} /></div></div>; })}</div><div className="budget-check"><Check size={16} /><span>No category exceeds its RM 1,900 / 1,200 / 700 / 1,000 limit.</span></div></section>

      {hasDraft && draft ? <section className="budget-draft-card"><div className="draft-card-head"><div><StatusBadge kind="approval">Pending draft · Based on Version {draft.baseVersion}</StatusBadge><h2>{draftLabel}</h2><p>{getDraftReason(draft.kind, draft.proposal.option)}</p></div><SourceTag>System estimate</SourceTag></div><ExperienceDiff items={diff} /><div className="budget-draft-note"><LockKeyhole size={15} /><span>The formal itinerary stays unchanged until approval. This draft is valid until {new Date(draft.expiresAt).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })} and will revalidate the locked dinner, transfers, and walking constraints.</span></div></section> : <section className="budget-empty-draft"><div className="budget-empty-icon"><ReceiptText size={20} /></div><div><strong>No pending draft</strong><p>Visit Itinerary, Harmony, Energy, or Rain replan, choose an optimization, and return here to review it.</p></div><Link href="/trips/penang-demo/itinerary">Back to itinerary<ChevronRight size={16} /></Link></section>}

      <section className="version-history-card"><div className="card-title-row"><div><p className="eyebrow">VERSION HISTORY</p><h2>Version comparison</h2></div><span className="history-caption">Older versions remain available</span></div><div className="version-table-wrap"><table className="version-table"><thead><tr><th>Version</th><th>Changes</th><th>Estimated spend</th><th>Harmony</th><th>Status</th></tr></thead><tbody>{[...state.history].reverse().map((version) => <tr className={version.version === state.currentVersion ? "current-version-row" : ""} key={version.version}><td><strong>Version {version.version}</strong><small>{new Date(version.approvedAt).toLocaleDateString("en-MY")}</small></td><td>{version.label}<small>{version.changes[0]}</small></td><td>{formatRM(sumBudget(version.cost))}<small>Remaining {formatRM(DEMO_FIXTURE.totalBudget - sumBudget(version.cost))}</small></td><td><span className="table-harmony">{version.harmony}%</span><SourceTag>Estimated</SourceTag></td><td>{version.version === state.currentVersion ? <StatusBadge kind="confirmed">Current formal</StatusBadge> : <button className="history-view-button" type="button" onClick={() => {}}>View details<ChevronRight size={14} /></button>}</td></tr>)}</tbody></table></div><p className="version-history-foot"><BarChart3 size={15} />Every approval reads the current version at approval time; version numbers are not tied to a fixed action.</p></section>

      {hasDraft && draft ? <ApprovalBar label={`Pending · ${draftLabel}`} description="A new version is created only after the actual changes are approved; canceling leaves formal metrics unchanged." onApprove={approve} onCancel={() => { cancelPendingDraft(); router.push("/trips/penang-demo/itinerary"); }} /> : null}
      <p className="page-caption">Major changes show their budget, impact, and history before a new version is created, so you can review them before approval.</p>
    </div>
  );
}

function getDraftCost(kind: DraftKind | undefined, option: "budget" | "interest" | "walking" | undefined, current: BudgetBreakdown) {
  if (kind === "replan" && option) return REPLAN_OPTIONS[option].cost;
  return current;
}

function getDraftReason(kind: DraftKind, option?: "budget" | "interest" | "walking") {
  if (kind === "replan" && option) return REPLAN_OPTIONS[option].reason;
  if (kind === "harmony") return "Replace incompatible dining, keep shopping time, and reorder same-day activities.";
  if (kind === "energy") return "Reduce consecutive walking, add a rest block, and keep the locked dinner.";
  return "Day 2 start time 09:30 → 10:30; shorten the afternoon activity by 30 minutes.";
}

function getDiffItems(kind: DraftKind | undefined, option: "budget" | "interest" | "walking" | undefined, current: ReturnType<typeof getCurrentVersion>, currentCost: BudgetBreakdown, draftCost: BudgetBreakdown | null, state: ReturnType<typeof useTripStore>["state"]) {
  if (kind === "replan" && option) {
    const metrics = REPLAN_OPTIONS[option].metrics;
    return [
      { label: "Harmony", value: metrics.harmony, detail: "System estimate", tone: "warning" as const },
      { label: "Minimum satisfaction", value: metrics.minimum, detail: "System estimate", tone: "neutral" as const },
      { label: "Budget", value: `${formatRM(sumBudget(currentCost))} → ${formatRM(sumBudget(draftCost ?? currentCost))}`, detail: `${REPLAN_OPTIONS[option].costDelta >= 0 ? "+" : "−"}${formatRM(Math.abs(REPLAN_OPTIONS[option].costDelta))}`, tone: REPLAN_OPTIONS[option].costDelta <= 0 ? "positive" as const : "warning" as const },
      { label: "Walking", value: metrics.walking, detail: "Day 2", tone: "positive" as const },
      { label: "Fatigue", value: metrics.fatigue, detail: "System estimate", tone: "positive" as const },
      { label: "Weather risk", value: metrics.weather, detail: "After replacement", tone: "positive" as const },
      { label: "Key experiences", value: metrics.retained, detail: "System estimate", tone: "neutral" as const },
      { label: "Fixed arrangement", value: "No impact", detail: "Locked dinner", tone: "positive" as const },
    ];
  }
  const harmony = getCurrentHarmony(state);
  const total = sumBudget(currentCost);
  return [
    { label: "Harmony", value: kind === "harmony" ? `${harmony}% → 91%` : `${harmony}%`, detail: "System estimate", tone: "positive" as const },
    { label: "Minimum satisfaction", value: kind === "harmony" ? "64% → 78%" : "78%", detail: "System estimate", tone: "positive" as const },
    { label: "Budget", value: `${formatRM(total)}${draftCost && sumBudget(draftCost) !== total ? ` → ${formatRM(sumBudget(draftCost))}` : ""}`, detail: "Whole group · Whole trip", tone: "neutral" as const },
    { label: "Walking", value: kind === "energy" ? "8.4 → 4.6 km" : "No change", detail: "Day 2", tone: "positive" as const },
    { label: "Fatigue", value: kind === "energy" ? "High → Medium" : "No change", detail: "System estimate", tone: "positive" as const },
    { label: "Weather risk", value: "No impact", detail: "Current draft type", tone: "neutral" as const },
    { label: "Key experiences", value: "Kept", detail: "System estimate", tone: "positive" as const },
    { label: "Fixed arrangement", value: "No impact", detail: "Locked dinner", tone: "positive" as const },
  ];
}

function CategoryIcon({ category }: { category: keyof BudgetBreakdown }) {
  if (category === "stay") return <span>⌂</span>;
  if (category === "food") return <span>✦</span>;
  if (category === "transport") return <span>↗</span>;
  return <span>◌</span>;
}
