export type Stage =
  | "initial"
  | "clarifying"
  | "ready_to_generate"
  | "generating"
  | "itinerary_ready";

export type Mode = "new_user" | "demo_preset";
export type ReplanOption = "budget" | "interest" | "walking";
export type DraftKind = "harmony" | "energy" | "replan" | "itinerary_change";
export type MemberFeedback = "not_collected" | "collected";
export type CategoryKey = "stay" | "food" | "transport" | "activities";

export type BudgetBreakdown = Record<CategoryKey, number>;

export type Toast = {
  tone: "success" | "info" | "error";
  title: string;
  message?: string;
};

export type PendingDraft = {
  id: string;
  baseVersion: number;
  kind: DraftKind;
  proposal: {
    option?: ReplanOption;
    targetHarmony?: number;
    title?: string;
    reason?: string;
  };
  createdAt: string;
  expiresAt: string;
  status: "pending" | "approved" | "cancelled" | "expired";
};

export type DemoVersion = {
  version: number;
  label: string;
  kind: "initial" | DraftKind;
  approvedAt: string;
  cost: BudgetBreakdown;
  harmony: number;
  energyOptimized: boolean;
  lateStart: boolean;
  replan?: ReplanOption;
  changes: string[];
};

export type PrototypeState = {
  schemaVersion: number;
  demoStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  mode: Mode;
  stage: Stage;
  idea: string;
  destination: string | null;
  duration: number | null;
  travelers: number;
  interests: string[];
  pace: string | null;
  constraints: string[];
  currentVersion: number | null;
  selectedReplan: ReplanOption | null;
  pendingDraft: PendingDraft | null;
  viewedVersion: number | null;
  history: DemoVersion[];
  formalHarmony: number | null;
  estimatedHarmony: number | null;
  memberFeedback: MemberFeedback;
  generationStep: number;
  toast: Toast | null;
};

export const STORAGE_KEY = "tripmind-prototype-state-v1";

export const GENERATION_STEPS = [
  {
    title: "Understand requirements",
    detail: "Destination, trip length, travelers, and preferences noted.",
  },
  {
    title: "Find activity candidates",
    detail: "Match food and cultural experiences from the Penang Demo data.",
  },
  {
    title: "Estimate routes and costs",
    detail: "Costs and transfer times are marked as Estimated.",
  },
  {
    title: "Validate hard constraints",
    detail: "Check the locked dinner, vegetarian needs, 9.0 km limit, and transfer buffer.",
  },
  {
    title: "Save Version 1",
    detail: "Create a standalone itinerary that you can keep adjusting.",
  },
] as const;

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  stay: "Stay",
  food: "Food",
  transport: "Transport",
  activities: "Activities",
};

export const CATEGORY_LIMITS: BudgetBreakdown = {
  stay: 1900,
  food: 1200,
  transport: 700,
  activities: 1000,
};

export const BASELINE_COST: BudgetBreakdown = {
  stay: 1800,
  food: 1040,
  transport: 540,
  activities: 980,
};

export const DEMO_FIXTURE = {
  tripName: "Penang Food & Culture Escape",
  tripId: "TRP-PEN-2403",
  destination: "Penang, Malaysia",
  duration: 3,
  travelers: 4,
  totalBudget: 4800,
  sharedInterests: ["Food", "Culture"],
  members: [
    { name: "Alex", initial: "A", tone: "mint", role: "Organizer" },
    { name: "Jamie", initial: "J", tone: "sky", role: "Traveler" },
    { name: "Sam", initial: "S", tone: "amber", role: "Demo preset" },
    { name: "Taylor", initial: "T", tone: "lavender", role: "Demo preset" },
  ],
  constraints: [
    "Sam · Vegetarian (Demo Fixture preset)",
    "Sam · Daily walking hard limit 9.0 km, comfort target ≤5.0 km",
    "Taylor · Keep shopping time (Demo Fixture preset)",
  ],
  fixedDinner: "Day 2 · 19:30 · Hai Keng Restaurant dinner",
  rainEvent: "Day 2 · 13:30 heavy rain affecting 14:00–17:00 outdoor activities",
} as const;

export const TIMELINE_DAYS = [
  {
    day: "Day 1",
    title: "Arrival & George Town culture",
    cost: 260,
    energy: "Easy",
    activities: [
      {
        time: "10:00",
        title: "Arrive at Penang International Airport",
        meta: "Transfer · 25 min",
        tag: "Arrival",
        icon: "plane",
      },
      {
        time: "12:00",
        title: "George Town old-town lunch",
        meta: "Transfer · 20 min",
        tag: "Food",
        icon: "utensils",
      },
      {
        time: "14:00",
        title: "Mural & neighborhood walk",
        meta: "Walk · 2.2 km",
        tag: "Culture",
        icon: "landmark",
      },
      {
        time: "18:30",
        title: "Rest block",
        meta: "Suggested · 45 min",
        tag: "Open time",
        icon: "coffee",
      },
    ],
  },
  {
    day: "Day 2",
    title: "Market, afternoon outdoor segment & locked dinner",
    cost: 820,
    energy: "Watch load",
    activities: [
      {
        time: "09:30",
        title: "Penang Central Market",
        meta: "Walk · 1.6 km",
        tag: "Market",
        icon: "store",
      },
      {
        time: "14:00",
        title: "Outdoor cultural activity",
        meta: "14:00–17:00 · Weather-sensitive",
        tag: "Outdoor",
        icon: "sun",
        affected: true,
      },
      {
        time: "19:30",
        title: "Hai Keng Restaurant dinner",
        meta: "Locked · 4 travelers",
        tag: "Fixed arrangement",
        icon: "lock",
        locked: true,
      },
    ],
  },
  {
    day: "Day 3",
    title: "Slow finish & seaside time",
    cost: 540,
    energy: "Easy",
    activities: [
      {
        time: "10:30",
        title: "Peranakan Museum",
        meta: "Estimated stay · 90 min",
        tag: "Culture",
        icon: "building",
      },
      {
        time: "13:00",
        title: "Free lunch & coffee",
        meta: "Flexible within budget",
        tag: "Food",
        icon: "coffee",
      },
      {
        time: "16:00",
        title: "Seaside walk / departure prep",
        meta: "Walk · 1.1 km",
        tag: "Open time",
        icon: "waves",
      },
    ],
  },
] as const;

export const REPLAN_OPTIONS: Record<
  ReplanOption,
  {
    label: string;
    subtitle: string;
    reason: string;
    costDelta: number;
    cost: BudgetBreakdown;
    metrics: {
      harmony: string;
      minimum: string;
      walking: string;
      fatigue: string;
      weather: string;
      retained: string;
    };
    changes: string[];
  }
> = {
  walking: {
    label: "Least walking",
    subtitle: "Move the replacement indoors and reduce cross-town transfers",
    reason: "Better for the current energy load while keeping the food and culture thread",
    costDelta: 40,
    cost: { ...BASELINE_COST, transport: 580 },
    metrics: {
      harmony: "91%* → 89%*",
      minimum: "78%* → 78%*",
      walking: "Day 2 −1.6 km",
      fatigue: "Medium → Low",
      weather: "High → Low",
      retained: "88%*",
    },
    changes: [
      "Add: 14:10–16:10 indoor cultural gallery",
      "Replace: outdoor cultural activity → rain-ready cultural experience",
      "Reorder: market and indoor activity by location",
      "Keep: Day 2 19:30 Hai Keng Restaurant locked dinner, no impact",
    ],
  },
  interest: {
    label: "Keep more interests",
    subtitle: "Keep more cultural experiences and accept one short transfer",
    reason: "Maximize shared-interest coverage at the cost of more transport and activity spend",
    costDelta: 80,
    cost: { ...BASELINE_COST, transport: 600, activities: 1000 },
    metrics: {
      harmony: "91%* → 94%*",
      minimum: "78%* → 80%*",
      walking: "Day 2 −0.6 km",
      fatigue: "Medium → Medium",
      weather: "High → Low",
      retained: "98%*",
    },
    changes: [
      "Add: 14:20–16:20 indoor cultural gallery and craft experience",
      "Move: keep one covered cultural route",
      "Cost: transport +RM60, activities +RM20",
      "Keep: Day 2 19:30 Hai Keng Restaurant locked dinner, no impact",
    ],
  },
  budget: {
    label: "Lower budget",
    subtitle: "Use a nearby free indoor space to control unexpected transport costs",
    reason: "Protect budget headroom first, with less optional cultural coverage",
    costDelta: -60,
    cost: { ...BASELINE_COST, transport: 480 },
    metrics: {
      harmony: "91%* → 86%*",
      minimum: "78%* → 72%*",
      walking: "Day 2 +0.2 km",
      fatigue: "Medium → Medium",
      weather: "High → Medium",
      retained: "76%*",
    },
    changes: [
      "Replace: outdoor cultural activity → free indoor gallery near the hotel",
      "Remove: one cross-town transfer, save RM60",
      "Note: lower cultural coverage; confirm with the group",
      "Keep: Day 2 19:30 Hai Keng Restaurant locked dinner, no impact",
    ],
  },
};

export function createInitialState(): PrototypeState {
  return {
    schemaVersion: 1,
    demoStep: 1,
    mode: "new_user",
    stage: "initial",
    idea: "",
    destination: null,
    duration: null,
    travelers: 1,
    interests: [],
    pace: null,
    constraints: [],
    currentVersion: null,
    selectedReplan: null,
    pendingDraft: null,
    viewedVersion: null,
    history: [],
    formalHarmony: null,
    estimatedHarmony: null,
    memberFeedback: "not_collected",
    generationStep: 0,
    toast: null,
  };
}

export function createDemoState(idea = "I want to travel, but I don't have a plan yet"): PrototypeState {
  return {
    ...createInitialState(),
    mode: "demo_preset",
    stage: "clarifying",
    idea,
    // Keep the required fields open so the demo still shows the clarifying step.
    // The preset contributes group context and constraints, not a hidden answer.
    destination: null,
    duration: null,
    travelers: DEMO_FIXTURE.travelers,
    interests: [...DEMO_FIXTURE.sharedInterests],
    pace: "Relaxed",
    constraints: [...DEMO_FIXTURE.constraints],
    demoStep: 2,
  };
}

export function createInitialVersion(): DemoVersion {
  return {
    version: 1,
    label: "Initial itinerary",
    kind: "initial",
    approvedAt: new Date().toISOString(),
    cost: { ...BASELINE_COST },
    harmony: 72,
    energyOptimized: false,
    lateStart: false,
    changes: ["Time, transfers, budget, and locked dinner validated"],
  };
}

export function normalizeState(value: unknown): PrototypeState {
  const fallback = createInitialState();
  if (!value || typeof value !== "object") return fallback;
  const source = value as Partial<PrototypeState>;
  if (source.schemaVersion !== 1) return fallback;
  return {
    ...fallback,
    ...source,
    mode: source.mode === "demo_preset" ? "demo_preset" : "new_user",
    stage: source.stage ?? fallback.stage,
    travelers: typeof source.travelers === "number" ? source.travelers : 1,
    interests: Array.isArray(source.interests) ? source.interests : [],
    constraints: Array.isArray(source.constraints) ? source.constraints : [],
    history: Array.isArray(source.history) ? source.history : [],
    pendingDraft: source.pendingDraft ?? null,
    toast: null,
  };
}

export function getCurrentVersion(state: PrototypeState): DemoVersion | null {
  if (!state.currentVersion) return null;
  return (
    state.history.find((version) => version.version === state.currentVersion) ??
    state.history[state.history.length - 1] ??
    null
  );
}

export function getCurrentCost(state: PrototypeState): BudgetBreakdown {
  return { ...(getCurrentVersion(state)?.cost ?? BASELINE_COST) };
}

export function getCurrentHarmony(state: PrototypeState): number {
  return state.formalHarmony ?? getCurrentVersion(state)?.harmony ?? 72;
}

export function hasApprovedChange(state: PrototypeState, kind: DraftKind): boolean {
  return state.history.some((version) => version.kind === kind);
}

export function isDraftExpired(draft: PendingDraft | null): boolean {
  if (!draft) return false;
  return Date.now() > new Date(draft.expiresAt).getTime();
}

export function sumBudget(budget: BudgetBreakdown): number {
  return Object.values(budget).reduce((total, amount) => total + amount, 0);
}

export function formatRM(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("en-MY", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
