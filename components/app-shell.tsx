"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  LayoutList,
  RotateCcw,
  Scale,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DEMO_FIXTURE } from "@/lib/demo-data";
import { useTripStore } from "@/lib/trip-store";
import { Button, StatusBadge } from "@/components/ui";

const navItems = [
  { href: "/trips/penang-demo/itinerary", label: "Itinerary", icon: CalendarDays },
  { href: "/trips/penang-demo/consensus", label: "Harmony", icon: Scale },
  { href: "/trips/penang-demo/budget", label: "Budget", icon: WalletCards },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, loadDemo, resetDemo, setToast } = useTripStore();
  const [resetOpen, setResetOpen] = useState(false);
  const isHome = pathname === "/";
  const isTripArea = pathname.startsWith("/trips/");

  useEffect(() => {
    if (!state.toast) return;
    const timer = window.setTimeout(() => setToast(null), 5200);
    return () => window.clearTimeout(timer);
  }, [setToast, state.toast]);

  function handleLoadDemo() {
    loadDemo();
    router.push("/chat/demo");
  }

  function handleReset() {
    resetDemo();
    setResetOpen(false);
    router.push("/");
  }

  return (
    <div className="app-shell">
      <header className={`top-nav ${isHome ? "top-nav-home" : ""}`}>
        <div className="top-nav-inner">
          <Link className="brand" href="/" aria-label="TripMind home">
            <img className="brand-logo" src="/tripmind-logo.svg" alt="TripMind" width="144" height="36" />
          </Link>

          {isHome ? (
            <div className="top-nav-actions">
              <button className="text-nav-button" type="button" onClick={handleLoadDemo}>
                <span className="demo-dot" />Load Penang Demo
              </button>
              <button className="help-button" type="button" onClick={() => setToast({ tone: "info", title: "Start with one sentence", message: "Share a destination or rough idea. TripMind will only ask for the details needed to generate your plan." })}>
                <CircleHelp size={17} aria-hidden="true" />
                <span>How it works</span>
              </button>
            </div>
          ) : (
            <>
              <nav className="desktop-nav" aria-label="Main navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href.includes("itinerary") && pathname.includes("itinerary"));
                  return (
                    <Link className={`nav-link ${active ? "nav-link-active" : ""}`} href={item.href} key={item.href}>
                      <Icon size={16} aria-hidden="true" />{item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="trip-nav-meta">
                {isTripArea && state.currentVersion ? <span className="version-chip">Version {state.currentVersion}</span> : null}
                {isTripArea ? <span className="saved-chip"><Check size={13} aria-hidden="true" />Saved</span> : null}
                <button className="reset-button" type="button" onClick={() => setResetOpen(true)}>
                  <RotateCcw size={14} aria-hidden="true" />Reset Demo
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {isTripArea && state.mode === "demo_preset" ? (
        <div className="demo-strip">
          <div className="demo-strip-inner">
            <StatusBadge kind="demo">Demo Fixture preset · 4 travelers</StatusBadge>
            <span>All routes, costs, Harmony, and Energy values are deterministic system estimates</span>
            <span className="demo-strip-guard"><Check size={14} aria-hidden="true" />Locked dinner protected</span>
          </div>
        </div>
      ) : null}

      <main className="page-content">{children}</main>

      {isTripArea ? (
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href.includes("itinerary") && pathname.includes("itinerary"));
            return <Link className={active ? "mobile-nav-active" : ""} href={item.href} key={item.href}><Icon size={19} aria-hidden="true" /><span>{item.label}</span></Link>;
          })}
          <Link className={pathname.includes("/replan") ? "mobile-nav-active" : ""} href="/trips/penang-demo/replan"><LayoutList size={19} aria-hidden="true" /><span>Replan</span></Link>
        </nav>
      ) : null}

      {state.toast ? (
        <div className={`toast toast-${state.toast.tone}`} role={state.toast.tone === "error" ? "alert" : "status"}>
          <span className="toast-icon">{state.toast.tone === "success" ? <Check size={16} /> : state.toast.tone === "error" ? <X size={16} /> : <Bot size={16} />}</span>
          <div><strong>{state.toast.title}</strong>{state.toast.message ? <p>{state.toast.message}</p> : null}</div>
          <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button>
        </div>
      ) : null}

      {resetOpen ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setResetOpen(false); }}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setResetOpen(false)}><X size={18} /></button>
            <span className="modal-icon modal-icon-amber"><RotateCcw size={20} aria-hidden="true" /></span>
            <h2 id="reset-title">Reset this Demo?</h2>
            <p>Your current version, pending previews, and history will be cleared, returning to the new-user entry. You can load the Penang Demo again afterward.</p>
            <div className="modal-actions"><Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleReset}>Confirm reset</Button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
