# Loser Kingdom Studio

## Run locally

Use Node.js 22+, then `npm ci`, `npm run dev`. The Express server serves the UI and API at http://localhost:3000. `npm run lint`, `npm test`, and `npm run build` validate the project. For production, build first and run `npm start` with `NODE_ENV=production`.

Copy `.env.example` to `.env` only if using Gemini. `GEMINI_API_KEY` stays on the server; optional `GEMINI_MODEL` overrides the existing model default. Without a key, the discipline policy and reviewed challenge catalog still work with fixed Vietnamese copy.

## Excuses and recovery

Health, accidents, emergencies, caregiving and recovery take priority, even if the selected category says distraction. These requests bypass Gemini and are available offline. Unclear reasons ask for clarification with zero penalty. Self-reported distraction uses a fixed virtual 10 HP penalty; Gemini only writes bounded habit-focused wording and cannot change that decision. This is conservative keyword/category routing, not a diagnosis or a lie detector; the category picker and instant rest button cover missed wording.

Recovery stops focus checks, leaves unfinished tasks pending and persists across reloads. It grants no XP, HP, completed task or streak reset. Repeated requests suggest reducing workload, never a health-proof demand or a quota that forces someone to work. The journal does not retain health explanations. This is a local self-discipline app: localStorage and self-reports are editable, so it cannot guarantee honesty or support competitive rankings without separate server-side accounts and evidence policies.

Generated and stored challenges must exactly match the reviewed catalog. Old unreviewed challenges are retired without completion rewards. Free-text submissions need review before use. Shock effects are replaced by a static dismissible reminder; recovery pauses the challenge screens. Vietnamese TTS selects a `vi` voice explicitly and displays a message if the device lacks one.
