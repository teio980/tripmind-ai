"use client";

import {
  createDemoState,
  createInitialState,
  createInitialVersion,
  DEMO_FIXTURE,
  getCurrentCost,
  getCurrentHarmony,
  isDraftExpired,
  normalizeState,
  REPLAN_OPTIONS,
  STORAGE_KEY,
  type DraftKind,
  type PendingDraft,
  type PrototypeState,
  type ReplanOption,
  type Toast,
} from "@/lib/demo-data";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type TripStore = {
  state: PrototypeState;
  hydrated: boolean;
  loadDemo: (idea?: string) => void;
  submitIdea: (idea: string) => void;
  answerClarification: (answer: string) => void;
  removeRequirement: (field: "destination" | "duration" | "interests" | "pace") => void;
  startGeneration: () => void;
  advanceGeneration: () => void;
  createDraft: (kind: DraftKind, proposal: PendingDraft["proposal"]) => boolean;
  approvePendingDraft: () => number | null;
  cancelPendingDraft: () => void;
  setSelectedReplan: (option: ReplanOption) => void;
  setViewedVersion: (version: number | null) => void;
  setToast: (toast: Toast | null) => void;
  resetDemo: () => void;
};

const TripStoreContext = createContext<TripStore | null>(null);

function extractDuration(text: string): number | null {
  const match = text.match(/(\d+)\s*-?\s*days?/i);
  return match ? Number(match[1]) : null;
}

function extractDestination(text: string): string | null {
  const known = text.match(/Penang|Japan|Tokyo|Bangkok|Singapore|Bali|Taipei|Osaka/i);
  if (!known) return null;
  return /Penang/i.test(known[0]) ? DEMO_FIXTURE.destination : known[0];
}

function extractInterests(text: string): string[] {
  const tags: string[] = [];
  if (/food|foodie|restaurant|dining/i.test(text)) tags.push("Food");
  if (/culture|museum|old town|heritage/i.test(text)) tags.push("Culture");
  if (/beach|island|seaside|coast/i.test(text)) tags.push("Beach");
  return tags;
}

function isReadyForGeneration(state: PrototypeState): boolean {
  return Boolean(state.destination && state.duration);
}

function buildVersionFromDraft(state: PrototypeState, draft: PendingDraft) {
  const current = state.history[state.history.length - 1] ?? createInitialVersion();
  const option = draft.proposal.option;
  const isReplan = draft.kind === "replan" && option;
  const nextCost = isReplan ? REPLAN_OPTIONS[option].cost : getCurrentCost(state);
  const nextHarmony = draft.kind === "harmony" ? 91 : getCurrentHarmony(state);
  const changes: string[] = [];

  if (draft.kind === "itinerary_change") {
    changes.push("Day 2 start time 09:30 → 10:30", "Shorten the afternoon activity by 30 minutes", "Keep the locked dinner unchanged");
  }
  if (draft.kind === "harmony") {
    changes.push("Replace incompatible dining", "Keep Taylor's shopping time", "Reorder same-day activities");
  }
  if (draft.kind === "energy") {
    changes.push("Day 2 walking 8.4 km → 4.6 km", "Add one 45-minute rest block", "Validate the locked dinner and transfer buffer");
  }
  if (draft.kind === "replan" && option) {
    changes.push(...REPLAN_OPTIONS[option].changes);
  }

  return {
    version: (state.currentVersion ?? current.version) + 1,
    label:
      draft.kind === "replan"
        ? `${REPLAN_OPTIONS[option as ReplanOption].label} · Rain replan`
        : draft.kind === "energy"
          ? "Energy optimization"
          : draft.kind === "harmony"
            ? "Harmony optimization"
            : "Later Day 2 start",
    kind: draft.kind,
    approvedAt: new Date().toISOString(),
    cost: { ...nextCost },
    harmony: nextHarmony,
    energyOptimized: current.energyOptimized || draft.kind === "energy",
    lateStart: current.lateStart || draft.kind === "itinerary_change",
    replan: option,
    changes,
  } as const;
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PrototypeState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setState(normalizeState(JSON.parse(stored)));
    } catch {
      setState(createInitialState());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const persistable = { ...state, toast: null };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [hydrated, state]);

  const loadDemo = useCallback((idea = "I want to travel, but I don't have a plan yet") => {
    setState({
      ...createDemoState(idea),
      toast: {
        tone: "info",
        title: "Penang Demo loaded",
        message: "The 4-traveler preset and source labels are ready. Answer the Agent's required questions first.",
      },
    });
  }, []);

  const submitIdea = useCallback((idea: string) => {
    const destination = extractDestination(idea);
    const duration = extractDuration(idea);
    const interests = extractInterests(idea);
    setState((previous) => ({
      ...previous,
      stage: destination && duration ? "ready_to_generate" : "clarifying",
      demoStep: destination && duration ? 3 : 2,
      idea,
      destination: destination ?? null,
      duration,
      interests,
      pace: /not too rushed|slow|relaxed|easy/i.test(idea) ? "Relaxed" : null,
      toast: null,
    }));
  }, []);

  const answerClarification = useCallback((answer: string) => {
    setState((previous) => {
      const destination = extractDestination(answer) ?? previous.destination;
      const duration = extractDuration(answer) ?? previous.duration;
      const extractedInterests = extractInterests(answer);
      const interests = Array.from(new Set([...previous.interests, ...extractedInterests]));
      const isDemoQuickReply = previous.mode === "demo_preset" && /penang/i.test(answer);
      const next = {
        ...previous,
        stage: "clarifying" as const,
        demoStep: 2 as const,
        idea: answer,
        destination,
        duration,
        interests,
        pace: /not too rushed|slow|relaxed|easy/i.test(answer) ? "Relaxed" : previous.pace,
      };
      if (isReadyForGeneration(next) || isDemoQuickReply) {
        return {
          ...next,
          stage: "ready_to_generate" as const,
          demoStep: 3 as const,
          toast: null,
        };
      }
      return next;
    });
  }, []);

  const removeRequirement = useCallback(
    (field: "destination" | "duration" | "interests" | "pace") => {
      setState((previous) => {
        const next = { ...previous, stage: "clarifying" as const, demoStep: 2 as const };
        if (field === "destination") next.destination = null;
        if (field === "duration") next.duration = null;
        if (field === "interests") next.interests = [];
        if (field === "pace") next.pace = null;
        return next;
      });
    },
    [],
  );

  const startGeneration = useCallback(() => {
    setState((previous) => ({
      ...previous,
      stage: "generating",
      demoStep: 3,
      generationStep: 0,
      toast: null,
    }));
  }, []);

  const advanceGeneration = useCallback(() => {
    setState((previous) => {
      if (previous.stage !== "generating") return previous;
      const nextStep = previous.generationStep + 1;
      if (nextStep >= 5) {
        const firstVersion = createInitialVersion();
        return {
          ...previous,
          stage: "itinerary_ready" as const,
          demoStep: 4 as const,
          generationStep: 5,
          currentVersion: 1,
          history: [firstVersion],
          formalHarmony: 72,
          estimatedHarmony: null,
          pendingDraft: null,
          toast: {
            tone: "success" as const,
            title: "Version 1 saved",
            message: "Hard constraints passed. You can now keep protecting the experience of this trip.",
          },
        };
      }
      return { ...previous, generationStep: nextStep };
    });
  }, []);

  const createDraft = useCallback((kind: DraftKind, proposal: PendingDraft["proposal"]) => {
    let created = false;
    setState((previous) => {
      if (!previous.currentVersion) return previous;
      if (previous.pendingDraft?.status === "pending") return previous;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000);
      const draft: PendingDraft = {
        id: `draft-${kind}-${createdAt.getTime()}`,
        baseVersion: previous.currentVersion,
        kind,
        proposal,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: "pending",
      };
      created = true;
      return {
        ...previous,
        pendingDraft: draft,
        estimatedHarmony: kind === "harmony" ? 91 : previous.estimatedHarmony,
        toast: {
          tone: "info" as const,
          title: "Pending preview generated",
          message: `Based on current Version ${previous.currentVersion}; the formal itinerary is unchanged.`,
        },
      };
    });
    return created;
  }, []);

  const approvePendingDraft = useCallback(() => {
    let approvedVersion: number | null = null;
    setState((previous) => {
      const draft = previous.pendingDraft;
      if (!draft || draft.status !== "pending") {
        return {
          ...previous,
          toast: { tone: "info", title: "No draft to approve" },
        };
      }
      if (draft.baseVersion !== previous.currentVersion || isDraftExpired(draft)) {
        return {
          ...previous,
          pendingDraft: { ...draft, status: isDraftExpired(draft) ? "expired" : "cancelled" },
          toast: {
            tone: "error",
            title: "Draft is no longer valid",
            message: "The current version changed or the preview expired. Generate it again from the current itinerary.",
          },
        };
      }
      const nextVersion = buildVersionFromDraft(previous, draft);
      approvedVersion = nextVersion.version;
      return {
        ...previous,
        currentVersion: nextVersion.version,
        history: [...previous.history, nextVersion],
        pendingDraft: null,
        selectedReplan: null,
        formalHarmony: draft.kind === "harmony" ? 91 : previous.formalHarmony,
        estimatedHarmony: null,
        demoStep: draft.kind === "harmony" ? 5 : draft.kind === "energy" ? 6 : draft.kind === "replan" ? 7 : 4,
        toast: {
          tone: "success",
          title: `Version ${nextVersion.version} created`,
          message: "Older versions remain available, and the new experience changes passed locked-item and constraint validation.",
        },
      };
    });
    return approvedVersion;
  }, []);

  const cancelPendingDraft = useCallback(() => {
    setState((previous) => ({
      ...previous,
      pendingDraft: null,
      estimatedHarmony: previous.pendingDraft?.kind === "harmony" ? null : previous.estimatedHarmony,
      toast: { tone: "info", title: "Preview closed", message: "The formal itinerary and version number did not change." },
    }));
  }, []);

  const setSelectedReplan = useCallback((option: ReplanOption) => {
    setState((previous) => ({ ...previous, selectedReplan: option }));
  }, []);

  const setViewedVersion = useCallback((version: number | null) => {
    setState((previous) => ({ ...previous, viewedVersion: version }));
  }, []);

  const setToast = useCallback((toast: Toast | null) => {
    setState((previous) => ({ ...previous, toast }));
  }, []);

  const resetDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(createInitialState());
  }, []);

  const value = useMemo<TripStore>(
    () => ({
      state,
      hydrated,
      loadDemo,
      submitIdea,
      answerClarification,
      removeRequirement,
      startGeneration,
      advanceGeneration,
      createDraft,
      approvePendingDraft,
      cancelPendingDraft,
      setSelectedReplan,
      setViewedVersion,
      setToast,
      resetDemo,
    }),
    [
      state,
      hydrated,
      loadDemo,
      submitIdea,
      answerClarification,
      removeRequirement,
      startGeneration,
      advanceGeneration,
      createDraft,
      approvePendingDraft,
      cancelPendingDraft,
      setSelectedReplan,
      setViewedVersion,
      setToast,
      resetDemo,
    ],
  );

  return <TripStoreContext.Provider value={value}>{children}</TripStoreContext.Provider>;
}

export function useTripStore() {
  const value = useContext(TripStoreContext);
  if (!value) throw new Error("useTripStore must be used inside TripProvider");
  return value;
}
