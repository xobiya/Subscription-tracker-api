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
