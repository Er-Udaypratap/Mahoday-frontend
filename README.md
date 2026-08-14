# Mahoday — SRIMT AI Assistant (Frontend)

React + Vite frontend for Mahoday, the AI assistant for SR Institute of
Management & Technology, Lucknow.

## Features
- Deep-space dark theme: nebula glow, multi-layer twinkling stars, shooting stars
- Blinking electric (⚡) "thinking" indicator instead of a plain spinner
- Voice input (Web Speech API — works on Chrome/Edge/most Android browsers)
- Photo upload (sent to backend as base64, e.g. for Gemini multimodal)
- Chat history saved to Supabase (`chat_history` table)
- Mobile-first, responsive layout

## Before you deploy

1. **Backend URL**: open `src/App.jsx` and replace:
   ```js
   const BACKEND_URL = "https://your-backend.onrender.com/chat";
   ```
   with your deployed FastAPI + Gemini backend endpoint.

2. **Supabase table**: create a `chat_history` table in your Supabase project
   with columns:
   - `id` (uuid, primary key, default `gen_random_uuid()`)
   - `role` (text)
   - `content` (text)
   - `created_at` (timestamptz, default `now()`)

   Also enable Row Level Security with an insert/select policy for the
   `anon`/publishable role, or history saving will silently fail.

## Deploy without local setup (mobile-friendly)

**Option A — Netlify drag-and-drop:**
This project needs a build step, so it can't be dragged in raw. Easiest
mobile path: push this folder to a GitHub repo (GitHub mobile app or web
upload works), then connect that repo in Netlify/Vercel — they'll run
`npm install && npm run build` for you automatically.

**Option B — StackBlitz / CodeSandbox (browser-based, no CLI):**
Upload this folder there, it installs and runs in-browser, and you can
deploy straight from the browser on mobile.

## Local dev (if you ever use a desktop)
```bash
npm install
npm run dev
```
