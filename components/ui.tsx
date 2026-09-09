"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock3,
  Database,
  Info,
  LockKeyhole,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { formatRM } from "@/lib/demo-data";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "soft";

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  onClick,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <span className="button-loader" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function StatusBadge({
  kind,
  children,
  className = "",
}: {
  kind: "confirmed" | "estimated" | "demo" | "locked" | "approval" | "risk" | "neutral";
  children: ReactNode;
  className?: string;
}) {
  const iconMap: Record<typeof kind, LucideIcon> = {
    confirmed: Check,
    estimated: Info,
    demo: Database,
    locked: LockKeyhole,
    approval: Clock3,
    risk: AlertTriangle,
    neutral: Sparkles,
  };
  const Icon = iconMap[kind];
  return (
    <span className={`status-badge status-${kind} ${className}`}>
      <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
      {children}
    </span>
  );
}

export function SourceTag({ children = "System estimate" }: { children?: ReactNode }) {
  return <span className="source-tag"><Info size={12} aria-hidden="true" />{children}</span>;
}

export function MetricCard({
  label,
  value,
  delta,
  status,
  source,
  icon: Icon,
  tone = "teal",
  footnote,
}: {
  label: string;
  value: string;
  delta?: string;
  status?: string;
  source?: string;
  icon?: LucideIcon;
  tone?: "teal" | "blue" | "amber" | "coral" | "ink";
  footnote?: string;
}) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <div className="metric-topline">
        <span className="metric-label">{label}</span>
        {Icon ? <span className="metric-icon"><Icon size={16} aria-hidden="true" /></span> : null}
      </div>
      <div className="metric-value-row">
        <strong>{value}</strong>
        {delta ? <span className="metric-delta">{delta}</span> : null}
      </div>
      {status ? <span className="metric-status">{status}</span> : null}
      {source ? <SourceTag>{source}</SourceTag> : null}
      {footnote ? <p className="metric-footnote">{footnote}</p> : null}
    </article>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

export function EmptyState({
  title = "No trip yet",
  description = "Start with a rough travel idea and TripMind will fill in the essential details.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-orbit"><Sparkles size={22} aria-hidden="true" /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}

export function ExperienceDiff({
  items,
  compact = false,
}: {
  items: Array<{ label: string; value: string; detail?: string; tone?: "positive" | "warning" | "neutral" }>;
  compact?: boolean;
}) {
  return (
    <div className={`experience-diff ${compact ? "experience-diff-compact" : ""}`}>
      {items.map((item) => (
        <div className={`diff-item diff-${item.tone ?? "neutral"}`} key={item.label}>
          <span className="diff-label">{item.label}</span>
          <strong>{item.value}</strong>
          {item.detail ? <span className="diff-detail">{item.detail}</span> : null}
        </div>
      ))}
    </div>
  );
}

export function ApprovalBar({
  label = "Pending change",
  description,
  approveLabel = "Approve and create version",
  cancelLabel = "Close preview",
  onApprove,
  onCancel,
  disabled = false,
}: {
  label?: string;
  description?: string;
  approveLabel?: string;
  cancelLabel?: string;
  onApprove: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="approval-bar">
      <div className="approval-copy">
        <StatusBadge kind="approval">{label}</StatusBadge>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="approval-actions">
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onApprove} disabled={disabled}>{approveLabel}<ArrowRight size={16} aria-hidden="true" /></Button>
      </div>
    </div>
  );
}

export function Avatar({ name, tone = "mint", size = "md" }: { name: string; tone?: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar-${tone} avatar-${size}`} aria-label={name}>{name.slice(0, 1)}</span>;
}

export function BudgetAmount({ amount, muted = false }: { amount: number; muted?: boolean }) {
  return <span className={muted ? "budget-amount muted" : "budget-amount"}>{formatRM(amount)}</span>;
}
