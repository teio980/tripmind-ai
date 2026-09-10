# TripMind

> Don’t just plan the trip. Protect the experience.

TripMind is an explainable travel-planning product built around an AI Chatbox. People do not need to create a complex plan or complete a long form before they can begin. They can start with a rough idea, answer only the questions that matter, and receive a travel plan that can be adjusted, compared, approved, and shared.

TripMind optimizes more than a list of places. It protects the parts of a trip that matter in real life: whether the group can accept the plan, whether every traveler can physically handle it, how much budget remains, which arrangements are fixed, and which experiences are worth keeping when circumstances change.

## Product Overview

TripMind connects the full travel-planning journey into one stateful workflow:

```text
Rough idea
   ↓
AI Chatbox clarification
   ↓
Structured requirement review
   ↓
Constraint-aware first itinerary
   ↓
Harmony coordination + Energy optimization
   ↓
Adaptation to disruptions
   ↓
Budget review, Experience Diff, and version approval
```

The product is organized around four connected capabilities:

- **Harmony**: turn individual preferences into a plan the group can accept while protecting the least-satisfied traveler.
- **Energy**: account for walking, activity density, transfers, early starts, late finishes, and rest so the itinerary does not exhaust someone in the group.
- **Adapt**: repair only the affected part of a trip when weather, delays, closures, or cancellations occur.
- **Discover**: recommend controlled, spontaneous experiences during an available time window based on location, budget, preferences, and energy.

## Who It Is For

TripMind is designed for solo travelers and small groups of 1–8 friends or family members.

| User | Common problem | TripMind helps by |
| --- | --- | --- |
| Traveler with no plan | They only know they want to travel and do not know where to begin | Starting with one sentence and asking only the necessary follow-up questions |
| Trip organizer | Opinions, links, and changes are scattered across group chats and spreadsheets | Summarizing preferences, explaining conflicts, and maintaining one shared itinerary |
| Budget-sensitive traveler | They want to avoid overspending without exposing an exact private limit | Showing category budgets, remaining headroom, and option-level cost changes |
| Traveler with dietary or mobility needs | “Everyone is fine with it” can hide an individual limitation | Treating important needs as constraints and protecting minimum satisfaction |
| Solo traveler | Search results are plentiful but difficult to combine into a realistic day | Producing a schedule with time, movement, estimated cost, and buffers |

Typical use cases include:

- Starting with “I want to travel” and deciding what information is needed next.
- Generating a first itinerary after providing a destination and trip length.
- Coordinating different interests, budgets, dietary needs, and energy levels.
- Adjusting a day because someone wants a later start or a different activity.
- Replanning an afternoon after rain, a delay, a closure, or a cancellation.
- Comparing a lower-cost, lower-walking, or higher-interest alternative before approving it.

## The Problem TripMind Solves

Travel planning usually splits destination research, group discussion, budgeting, itinerary editing, and disruption handling across several tools. TripMind connects these disconnected steps:

- A user with only a vague travel idea does not need to understand a planning data model first.
- The Agent asks about information that actually blocks generation and does not repeat known details.
- An itinerary is a structured, maintainable travel object instead of a one-time chat response.
- Group preferences, dietary needs, budgets, and energy constraints can be summarized and coordinated.
- Time, distance, opening hours, budget, fixed arrangements, and member limits are checked before a candidate becomes formal.
- A disruption repairs the affected time window instead of forcing the user to rebuild the whole day.
- Every meaningful change explains what changed, why it changed, what it costs, and who may be affected.
- A proposed change becomes formal only after the user reviews and approves it.

## Core Features

### 1. Chatbox-first planning

The Chatbox is the primary entry point. Users can begin with “I want to travel, but I do not have a plan yet,” or provide a destination, trip length, interests, pace, or an itinerary change directly.

The Agent extracts what is already known and prioritizes destination and date or trip length because those are the fields needed to start generation. Optional details such as travelers, interests, and pace can be added later or filled with clearly labeled defaults.

### 2. Explain before apply

TripMind does not silently overwrite the current itinerary. When a user asks to start later, optimize Harmony, reduce walking, or respond to rain, the system creates a pending draft based on the current formal version and shows an Experience Diff.

Only approval turns the draft into the next formal version. Closing, canceling, or skipping a preview leaves the current itinerary unchanged.

### 3. Group Harmony

Harmony is more than one group score. It shows:

- Overall Harmony Score.
- Estimated satisfaction for each traveler.
- The least-satisfied traveler.
- Shared preferences and unresolved conflicts.
- Activities that were replaced, reordered, or protected.
- Reasons behind the proposed adjustments.
- Which information is an aggregated group conclusion and which remains private.

The goal is not to maximize an average while sacrificing one person. An optimization should improve the overall experience while protecting minimum member satisfaction.

### 4. Travel Energy

Travel Energy makes “will this be too tiring?” a visible planning discussion. It can account for:

- Daily walking distance.
- Activity count and consecutive activity duration.
- Cross-area transfer count.
- Early starts, late finishes, and rest blocks.
- Personal walking limits and comfort targets.
- Estimated fatigue risk.

The itinerary page opens Energy as an in-context panel. Travelers can compare a baseline with a lower-load candidate before deciding whether to apply it. Walking and fatigue values are planning estimates, not medical advice.

### 5. Constraint-aware itinerary planning

TripMind separates natural-language understanding from deterministic validation:

- The Agent understands intent, organizes candidates, and explains trade-offs.
- Deterministic logic checks time, distance, transfer buffers, budget, opening hours, locked arrangements, and member constraints.
- A candidate that fails validation cannot silently become the formal itinerary.
- Locked arrangements remain visibly locked and must be preserved by optimizations and replans.

### 6. Disruption Replanner

When a disruption occurs, TripMind:

1. Identifies affected activities and time windows.
2. Preserves arrangements that the user has locked.
3. Generates alternatives with different trade-offs.
4. Checks end times, travel, and buffers for each candidate.
5. Shows a standardized Experience Diff.
6. Lets the user choose and approve the result.

### 7. Budget and version control

Budget review brings the total budget, category budgets, current spend, remaining headroom, draft changes, and version history into one place. Users can see whether a proposal changes accommodation, food, transport, or activity costs, and what happens if they cancel it.

Every formal version keeps its change label, estimated spend, and key metrics. Older versions remain available. Version numbers increase from the formal version that exists at the moment of approval; no feature is permanently tied to a specific version number.

### 8. Privacy-aware collaboration

TripMind distinguishes private member input from aggregated group results. A group view can show shared preferences, coordination needs, and system reasoning without exposing exact private budgets, private quotes, or sensitive notes by default.

Inviting travelers is optional and happens after the first itinerary exists. A solo traveler can use the core product without inviting anyone.

### 9. Deterministic fallback

The product is designed around replaceable AI, map, place, routing, and weather adapters. The current prototype uses a fixed Fixture and local browser state so the complete experience can be demonstrated without live network data, API keys, maps, weather services, or real accounts.

## Complete Capability Map

| Module | Problem addressed | Key capabilities |
| --- | --- | --- |
| AI Chatbox | The user does not know how to begin | Natural-language entry, scope checking, requirement extraction, guided questions |
| Requirement Clarifier | Information is incomplete or repeatedly entered | Remembered conditions, missing-field prompts, editable requirement card |
| Itinerary Planner | A generated plan looks good but cannot be executed | Daily timeline, movement, cost, buffers, and constraint validation |
| Trip / Plan Management | The plan exists only in one conversation | Independent trip object, stable entry point, saved first version, continued edits |
| Collaboration | Group opinions are scattered across chat | Invitations, preference collection, aggregated conclusions, voting, roles |
| Group Harmony | Average satisfaction hides an outlier | Shared preferences, conflict detection, member satisfaction, minimum protection |
| Travel Energy | Dense schedules and walking create fatigue | Walking, activity density, transfers, rest, and fatigue-risk assessment |
| Adapt / Replanner | A disruption invalidates part of the schedule | Event detection, local repair, locked-item protection, Experience Diff |
| Budget Planner | The user cannot see the cost of a plan | Total budget, category limits, remaining budget, candidate cost comparison |
| Discover / Surprise Me | Free time is difficult to use intentionally | Safe / Balanced / Adventurous suggestions |
| Version and Approval | Users cannot tell what a change will do | Pending drafts, impact previews, version history, traceable reasons |

First-time planning only requires the Chatbox, Requirement Clarifier, and Itinerary Planner. Harmony, Energy, Adapt, Budget, and Discover enhance an existing itinerary without blocking the first plan.

## Positioning and Differentiation

TripMind can be understood alongside itinerary organization and collaboration products such as Wanderlog, but its focus is different. Traditional itinerary tools are useful for collecting places, organizing schedules, and sharing trip information. TripMind connects understanding, constraint validation, group trade-offs, disruption response, and approval into one explainable travel-state workflow.

| Dimension | Common itinerary organization | TripMind focus |
| --- | --- | --- |
| Starting point | Create a plan first, then fill fields or search places | Say one sentence; the Agent asks for what is missing |
| Group decisions | Collect opinions and leave the final trade-off to the organizer | Show consensus, conflict, member satisfaction, and minimum satisfaction |
| Physical load | The user must manually judge whether the day is too tiring | Include walking, activity density, transfers, and rest in Energy |
| Plan reliability | Primarily display places and scheduled times | Validate time, movement, buffers, budget, and locked arrangements |
| Unexpected change | Manually edit several activities | Repair the affected window and preserve key arrangements |
| Option comparison | Results and reasoning may be separated | Compare impact, cost, risk, walking, and retained experiences together |
| Editing | Directly edit the current plan | Preview first, approve later, and keep older versions |

The difference is not simply a larger feature list. TripMind treats a trip as an explainable, collaborative, and approvable state object rather than a static checklist.

## Agent Scope and Safety

The TripMind Agent is a travel-state orchestrator, not a general-purpose chatbot. It can help with:

- Destinations, dates, trip length, origin, and travel pace.
- Itinerary generation, itinerary changes, routes, transport, budget, and weather impact.
- Group preferences, dietary needs, physical constraints, Harmony, Energy, and disruption replanning.
- Help with using TripMind itself.

It does not handle ticket purchases, hotel reservations, payments, refunds, or other transactions. It also does not handle code, homework, general copywriting, news or political commentary, investment advice, or unrelated medical or legal questions. Travel-related health, visa, and severe-weather questions should receive planning-level cautions and official-information guidance, not diagnosis, legal conclusions, or safety guarantees.

In the complete product architecture, a `Business Scope Guard` sits before and after the Agent:

- Out-of-scope messages are blocked before Agent or domain-tool calls.
- Mixed requests pass only the travel portion to the Agent and explain what was excluded.
- Unknown intent, invalid structured output, or a tool-permission mismatch defaults to rejection.
- The Agent cannot directly write to the database, modify locked arrangements, grant permissions, or call arbitrary external services.
- Major itinerary changes require a structured preview, deterministic validation, and user approval.

This boundary keeps the model responsible for understanding and explanation while system rules remain responsible for facts, calculations, permissions, and final writes.

## How to Use TripMind

The following walkthrough covers the complete experience. For the most reliable first run, start with the Penang Demo and allow about five minutes to explore the main capabilities.

### 1. Start with a travel idea

Open the home page and enter a sentence in the Chatbox, for example:

```text
I want to travel, but I don't have a plan yet
```

You can also try:

- `I want to go to the beach`
- `Plan a 3-day food trip`
- Click `Load the Penang Demo`.

Click send to enter the Agent follow-up page. If the request is unrelated to travel, TripMind explains that it only handles travel planning and itinerary management and does not create trip state.

### 2. Answer the Agent's necessary questions

The Agent prioritizes:

- Destination.
- Date range or trip length.

The `Current requirements` card shows what has been remembered. Provided destination, duration, interests, and pace values can be removed individually; removing a value returns it to the missing or optional state.

You can type a reply or use the Demo quick reply. The current prototype extracts common destination, duration, and interest keywords from natural language. For the most predictable walkthrough, use the English examples or load the Penang Demo directly.

### 3. Review requirements and generate the first itinerary

When destination and trip length are available, the pre-generation review shows:

- Destination, duration, travelers, and shared interests.
- Optional defaults such as relaxed pace and activity budget.
- Demo preset member constraints and fixed arrangements.
- Whether information comes from user input, the Demo Fixture, or a system estimate.

Click `Generate itinerary`. The generation screen shows five stages:

1. `Understand requirements`: read destination, duration, travelers, and preferences.
2. `Find activity candidates`: match activities from the current data source.
3. `Estimate routes and costs`: estimate travel, transfers, and costs.
4. `Validate hard constraints`: check the locked dinner, dietary needs, walking limit, transport, and time buffers.
5. `Save Version 1`: save the first formal itinerary.

After generation, TripMind opens the independent Itinerary page.

### 4. View and adjust the itinerary

The Itinerary page lets you:

- View a timeline by day, including activities, movement, and walking information.
- Review daily estimated spend and trip-level budget summary.
- Distinguish `Estimated`, `Confirmed`, and `Locked` states.
- Open `Ask Agent` and request an adjustment in natural language.
- Open `Invite travelers` to view the simulated sharing flow.
- Navigate to Harmony, Energy, Budget, and Rain replan.

Try this request in the Agent drawer:

```text
Start Day 2 later
```

The preview shows an example change from `09:30` to `10:30`, a shorter afternoon activity, and no impact on the locked Day 2 `19:30` dinner.

Click `Keep this change` to create the next formal version. Clicking `Keep adjusting`, closing the preview, or canceling it leaves the formal version and version number unchanged.

### 5. Use Group Harmony

The `Harmony` page shows:

- Current formal Harmony.
- Candidate Harmony estimate.
- Satisfaction estimate for each traveler.
- The least-satisfied traveler.
- Shared group preferences.
- Items that need coordination.
- Reasons behind the proposed changes.

Click `Run Harmony optimization` to create a candidate. It does not immediately rewrite the formal itinerary. The Demo candidate shows a typical `72% → 91%` Harmony estimate and explains changes such as replacing incompatible dining, retaining shopping time, and reordering same-day activities.

Click `Approve and apply changes` to write the activity changes into a new formal version. Candidate values remain labeled `System estimate` until approval.

### 6. Use Travel Energy

Click `Energy` on the Itinerary page to open the in-context Energy drawer. It compares a Day 2 baseline with a lower-walking candidate:

| Metric | Baseline | Candidate |
| --- | ---: | ---: |
| Walking | 8.4 km | 4.6 km |
| Rest blocks | 0 | 1 |
| Fatigue risk | High | Medium |
| Transfers | 5 | 3 |

In the Demo, Sam has a daily hard limit of `9.0 km` and a comfort target of `≤5.0 km`. The 8.4 km baseline is within the hard limit but still shows a higher load risk; `High` is a risk signal, not a constraint violation.

Click `Generate low-walking candidate` to create a draft. Review it and click `Approve low-walking plan` to add a rest block, reduce walking, and create the next formal version.

### 7. Handle rain and choose a replan

Open `Rain replan` to simulate heavy rain at `13:30` on Day 2, affecting outdoor activities from `14:00–17:00`. The options represent different trade-offs:

| Option | Priority | Budget change | Typical outcome |
| --- | --- | ---: | --- |
| `Least walking` (recommended) | Reduce walking and cross-town transfers | +RM 40 | Lower fatigue risk while preserving the food and culture thread |
| `Keep more interests` | Preserve more cultural experiences | +RM 80 | Higher interest coverage with additional transport and activity cost |
| `Lower budget` | Control unexpected spending | -RM 60 | Lower transport cost with less cultural coverage |

`Experience Diff` compares:

- Harmony.
- Minimum member satisfaction.
- Budget change.
- Walking change.
- Fatigue risk.
- Weather risk.
- Key experiences retained.
- Impact on fixed arrangements.

Every candidate must keep the locked Day 2 `19:30 Hai Keng Restaurant` dinner. Replacement activities must end by `17:00`, with the expected transfer and dinner buffer validated. Select an option and click `Select and continue` to review it in Budget & version review.

### 8. Review budget and approve the version

The Budget page is the final review before a candidate becomes formal. It shows:

- Total budget and remaining budget.
- Stay, food, transport, and activities categories.
- Current formal version versus pending draft.
- Version history, change labels, and estimated spend.
- Validation notes for fixed arrangements, transfers, buffers, and constraints.

Click the approval action to turn the draft into a formal version and return to Itinerary. Canceling closes the draft and keeps the current formal version unchanged.

## Demo Scenario

The repository includes a fixed end-to-end scenario named `Penang Food & Culture Escape`. It makes the product flow repeatable and is not a live booking, live price, or live weather feed.

| Item | Value |
| --- | --- |
| Trip ID | `TRP-PEN-2403` |
| Destination | Penang, Malaysia |
| Duration | 3 days |
| Travelers | Alex, Jamie, Sam, Taylor |
| Total budget | RM 4,800 for the whole group and trip |
| Shared interests | Food, culture, relaxed pace |
| Sam's constraints | Vegetarian; daily walking hard limit 9.0 km; comfort target ≤5.0 km |
| Taylor's preference | Preserve shopping time |
| Fixed arrangement | Day 2 · 19:30 · Hai Keng Restaurant dinner |
| Rain event | Day 2 · 13:30; outdoor activities affected from 14:00–17:00 |

### Demo budget baseline

| Category | Limit | Current formal estimate |
| --- | ---: | ---: |
| Stay | RM 1,900 | RM 1,800 |
| Food | RM 1,200 | RM 1,040 |
| Transport | RM 700 | RM 540 |
| Activities | RM 1,000 | RM 980 |
| **Total** | **RM 4,800** | **RM 4,360** |

The current formal version has an estimated `RM 440` remaining. The recommended rain-replan candidate increases transport from `RM 540` to `RM 580`, bringing estimated total spend to `RM 4,400` and remaining budget to `RM 400`.

## Status and Data Sources

The UI uses labels with explicit meanings:

| Label | Meaning |
| --- | --- |
| `Confirmed` | Confirmed or validated in the current workflow |
| `Estimated` | System estimate for routes, time, cost, Harmony, Energy, or satisfaction |
| `Demo data` | Loaded from the fixed Demo Fixture |
| `Locked` | A user-fixed arrangement that optimization and replanning cannot silently overwrite |
| `Needs approval` / `Pending` | A candidate draft that is not yet part of the formal itinerary |
| `Risk` | A condition that needs attention; it does not automatically mean a hard-constraint failure |

TripMind separates facts, estimates, Demo data, and pending proposals. In the current walkthrough, routes, costs, weather, Harmony, Energy, and satisfaction values are fixed or estimated. In a real trip, users should confirm opening hours, transport, weather, tickets, and restaurant arrangements before departure.

## Pages and Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home / AI Chatbox | Start with a rough idea or load the Penang Demo |
| `/chat/demo` | Agent follow-up | Clarify destination and duration; view current requirements |
| `/chat/demo?stage=ready` | Pre-generation review | Confirm requirements before generation |
| `/trips/penang-demo/itinerary` | Itinerary | View the timeline, metrics, Agent edits, and invitation flow |
| `/trips/penang-demo/itinerary?panel=energy` | Travel Energy | Compare and approve a lower-walking plan |
| `/trips/penang-demo/consensus` | Group Harmony | View preferences, satisfaction, and Harmony optimization |
| `/trips/penang-demo/replan` | Rain replan | Simulate rain and choose a local replan |
| `/trips/penang-demo/budget` | Budget & version review | Compare costs, view history, and approve drafts |

The trip area uses desktop top navigation and a mobile bottom navigation. The UI adapts to narrow screens; Agent and Energy open as drawers. The project also includes a PWA manifest and standalone display configuration.

## Versions, Drafts, and Approval Rules

TripMind stores the current formal itinerary separately from pending candidates:

1. The first itinerary that passes hard-constraint validation is saved as formal `Version 1`.
2. An edit, Harmony optimization, Energy optimization, or Replan starts as a `Pending draft` based on the current version.
3. The draft records `baseVersion`, its reason, creation time, and expiration time.
4. At approval time, the system reads the current formal version again and revalidates the proposal.
5. If validation passes, it creates `currentVersion + 1` and preserves older history.
6. If the formal version changed or the draft expired, the draft cannot be approved and must be regenerated.
7. Canceling a draft, skipping an enhancement, or closing a preview does not change formal metrics or the version number.

A complete Demo walkthrough can follow this sequence:

```text
Version 1: first itinerary
→ Version 2: approve “start Day 2 later”
→ Version 3: approve Harmony
→ Version 4: approve Energy
→ Version 5: approve the rain replan
```

Version numbers are not tied to specific features. If a step is skipped, later approvals continue from the formal version that actually exists.

## Persistence and Reset

The current prototype stores state in browser `localStorage` under:

```text
tripmind-prototype-state-v1
```

Refreshing the page, navigating back, or opening a child route directly restores the current version, pending draft, and version history. The data stays in the current browser and is not synchronized to a server or another device.

Click `Reset Demo` in the trip area to clear:

- The current formal version.
- Pending drafts.
- Version history.
- The current Demo or new-user state.

After reset, return to the home page and load the Penang Demo again.

## AI, Deterministic Logic, and Data Flow

TripMind separates AI responsibilities from rule-based system responsibilities:

```text
User message
   ↓
Business Scope Guard
   ↓
TripMind Agent
   ├─ Requirement extraction and clarification
   ├─ Preference coordination and explanation
   ├─ Candidate orchestration
   └─ Change reasons and impact explanation
          ↓
Deterministic domain logic
   ├─ TripState and version state
   ├─ Time, movement, and buffer validation
   ├─ Budget calculations
   ├─ Harmony and minimum-satisfaction protection
   ├─ Travel Energy and fatigue risk
   └─ Experience Diff and approval
          ↓
Formal itinerary or pending draft
```

In the complete product architecture, AI, place, map, routing, and weather providers are connected through adapters. The Agent, data contracts, validators, and business rules should not be coupled to one vendor. Real secrets should exist only in server environments, never in the browser bundle, logs, or repository.

## Technology Stack

- **Next.js 15**: App Router, page routing, and the application shell.
- **React 19**: Interactive screens and component state.
- **TypeScript**: Type-safe data structures and application code.
- **Lucide React**: Icon system.
- **CSS**: Responsive layout, design tokens, timelines, cards, drawers, and state styling.
- **Browser localStorage**: Local persistence for the current prototype.
- **PWA manifest**: Standalone app configuration for home-screen installation.

The current repository does not use Tailwind, a database, authentication, a live AI provider, a map API, or a weather API. These are future integration points for a production implementation.

## Project Structure

```text
tripmind-ai/
├─ app/
│  ├─ page.tsx                         # Home Chatbox
│  ├─ chat/demo/page.tsx               # Agent clarification and generation review
│  ├─ trips/penang-demo/itinerary/     # Timeline, Agent, and Energy drawers
│  ├─ trips/penang-demo/consensus/     # Group Harmony
│  ├─ trips/penang-demo/replan/        # Rain disruption replanning
│  ├─ trips/penang-demo/budget/        # Budget and version approval
│  ├─ globals.css                      # Design system and responsive styles
│  └─ manifest.ts                      # PWA manifest
├─ components/
│  ├─ app-shell.tsx                    # Navigation, notifications, and reset
│  ├─ home-screen.tsx                  # Home experience
│  ├─ chat-screen.tsx                  # Agent conversation, requirements, generation
│  ├─ itinerary-screen.tsx             # Timeline, metrics, and drawers
│  ├─ consensus-screen.tsx             # Harmony experience
│  ├─ replan-screen.tsx                # Replan options and Experience Diff
│  ├─ budget-screen.tsx                # Budget and version history
│  └─ ui.tsx                           # Shared buttons, badges, cards, and diff UI
├─ lib/
│  ├─ demo-data.ts                     # Demo Fixture, budgets, metrics, and options
│  └─ trip-store.tsx                   # Trip state, drafts, and version operations
├─ public/
│  └─ icon.svg                         # Application icon
├─ docx/
│  ├─ plan.md                          # Product implementation plan
│  ├─ prototype-plan.md                # Prototype scope and acceptance criteria
│  └─ prototype.md                     # Screen, interaction, and visual specification
├─ dataflow.png                        # Product data-flow diagram
├─ package.json
└─ README.md
```

## Local Development

### Requirements

- Node.js 22+.
- npm 10+.
- No API key, database, or third-party account is required for the fixed walkthrough.

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Create and run a production build

```bash
npm run build
npm run start
```

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

## Quick Acceptance Checklist

After starting the app, verify the following flow:

1. The home Chatbox accepts a travel idea and opens the Agent page.
2. The Agent shows current requirements and asks only for missing essentials.
3. The review page shows data sources and five generation stages.
4. Itinerary shows a three-day timeline, budget summary, and locked dinner.
5. `Ask Agent` creates a change preview before approval.
6. Harmony shows the overall score, member satisfaction, minimum satisfaction, and reasons.
7. Energy shows `8.4 km → 4.6 km`, rest blocks, and fatigue-risk changes.
8. Rain replan offers three options with different budget and experience trade-offs.
9. Experience Diff shows budget, walking, risk, retained experiences, and fixed-arrangement impact.
10. Budget shows the pending draft, category limits, and version history.
11. Canceling a draft leaves the formal version unchanged.
12. Refresh restores local state, and `Reset Demo` clears it.

## Design Principles

- **Understand first, generate second**: understand the user before producing an itinerary.
- **Progressive disclosure**: finish the first plan before opening Harmony, Energy, Budget, or Replan.
- **Explain every trade-off**: make every meaningful change and cost visible.
- **Protect the outlier**: do not sacrifice the traveler who needs the most care.
- **Facts versus estimates**: clearly distinguish confirmed facts, estimates, Demo data, and pending proposals.
- **Protect fixed arrangements**: never silently overwrite locked plans.
- **Calm over dashboard**: use a clear timeline and cards instead of an overwhelming control panel.
- **Mobile-first**: make Chatbox, itinerary review, and approval usable on a phone.

## Product Roadmap

The current repository focuses on validating the core user experience, while the product design leaves room for:

- A real AI provider with structured output and tool calls.
- Place, map, routing, and weather providers.
- Supabase persistence, authentication, member permissions, and RLS.
- Revocable and expiring invitation links with real collaboration.
- Member preferences, votes, deadlines, and activity confirmation.
- Budget setup, member budget-fit checks, and budget-constrained replanning.
- Safe / Balanced / Adventurous Surprise Me recommendations.
- More disruption types such as delays, closures, illness, and member drop-out.
- In-trip tracking, completion records, and final trip summaries.
- Admin overview, provider health checks, and auditable reversible admin actions.

These capabilities should reuse the same TripState, permission, validation, approval, and event model instead of creating disconnected sources of truth.

## Current Implementation Boundary

This repository is a frontend interaction prototype that demonstrates the product experience from Chatbox through itinerary generation, Harmony, Energy, rain replanning, budget review, and version approval. To keep the walkthrough repeatable, the current implementation uses a fixed Penang Fixture and browser-local state.

The following capabilities are not connected to live services yet:

- A real LLM, server-side Agent, or persistent conversation memory.
- Real accounts, authentication, database persistence, or cross-device sync.
- Live maps, places, routing, weather, or pricing APIs.
- Booking, payment, ticketing, or accommodation transactions.
- Real invitation joining, member permissions, or member feedback collection.
- Live Discover / Surprise Me recommendations.
- Full offline editing, background sync, or push notifications.

Routes, costs, weather, Harmony, Energy, and satisfaction values shown by the current prototype are for product and workflow demonstration only. They are not live travel advice, medical advice, or quotes.

## Related Documentation

- [Product implementation plan](./docx/plan.md): positioning, users, MVP scope, data model, API strategy, and acceptance criteria.
- [Prototype plan](./docx/prototype-plan.md): eight core screens, demo script, and prototype acceptance criteria.
- [Prototype specification](./docx/prototype.md): screen structure, copy, interactions, and visual rules.
- [Data-flow diagram](./dataflow.png): flow from user input through trip state and approval.

## License

This repository does not currently include a separate open-source license. Add a license, third-party attribution, and data-source information before public distribution or reuse.
