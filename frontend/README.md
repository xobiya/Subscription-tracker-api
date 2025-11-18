# Frontend — Subscription Tracker (Vite + React)

This folder contains the frontend application for Subscription Tracker. It is built with Vite + React, Tailwind CSS, and uses the backend API under `src/api.js`.

Quick start
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Copy environment variables (if any) and start the dev server:
```bash
npm run dev
```

Build for production
```bash
npm run build
```

Run tests
```bash
cd frontend
npx vitest run
```

Architecture
- `src/api.js` — thin API wrapper used by services. Keep this consistent with the backend endpoints.
- `src/services/` — service layer that normalizes backend responses and exposes use-case functions (e.g., `subscriptionService`).
- `src/hooks/` — custom hooks that encapsulate data fetching and mutations (e.g., `useSubscriptions`).
- `src/contexts/` — application contexts (AuthContext) for user/token and global state.
- `src/components/` — presentational components and features split into `container` (data) and `view` (UI) where applicable.
- `src/components/ui/` — UI primitives (Button, Card, Input, Loading, ErrorMessage, Profile wrapper).

Testing notes
- Tests use Vitest + @testing-library/react and run in jsdom.
- If you see warnings like "Not implemented: window.scrollTo" during tests, add a small stub in your test setup (e.g., `globalThis.window.scrollTo = () => {}`) or mock framer-motion during tests.

Environment & API
- The frontend expects the backend API to be reachable at the base URL configured by `src/api.js`. Update that file to change the base URL (for example to `http://localhost:5500/api`).

Security
- Do not store long-lived secrets in the frontend. Use the backend to sign tokens and only store short-lived tokens in memory or secure httpOnly cookies.

Notifications & preferences
- The profile screen now exposes a notification preferences drawer where users can pick channels (email/SMS/push) and select which `daysBefore` values trigger reminders.
- Preferences are fetched/persisted via `/api/v1/users/{id}/preferences`, so any backend changes there should be reflected in `src/services/notificationService.js` and the `ProfileContainer`.
- Save and use the provided hooks/services to keep the UI decoupled from API details.

Next steps
- Continue refactoring large feature files into container/view pairs (Navbar, Subscriptions, Dashboard subcomponents).
- Add integration tests that exercise the main flows (login, list subscriptions, create subscription).
# Frontend (Vite + React + Tailwind)

Requirements
- Node.js 18+

Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` to `http://localhost:5500`.

Files added
- `src/` - React app entry and App component
- `vite.config.js` - Vite + proxy config
- `tailwind.config.cjs` & `postcss.config.cjs` - Tailwind setup

Next steps
- Add pages/components (Login, Dashboard, Subscriptions CRUD)
- Add API client and auth flow
- Add forms and styling
