# TripMind Prototype

An interactive Next.js prototype recreated from `prototype.md` and `prototype-plan.md`. This version uses a fixed Penang Demo Fixture and does not connect to real accounts, a backend, maps, weather services, or an AI provider.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Core routes

- `/`: AI Chatbox home
- `/chat/demo`: Agent follow-up and requirement review
- `/trips/penang-demo/itinerary`: Standalone itinerary
- `/trips/penang-demo/consensus`: Group Harmony
- `/trips/penang-demo/itinerary?panel=energy`: Travel Energy drawer
- `/trips/penang-demo/replan`: Rain replan and Experience Diff
- `/trips/penang-demo/budget`: Budget and version review

Demo state is stored in browser `localStorage` under `tripmind-prototype-state-v1`; `Reset Demo` clears the current prototype state.
