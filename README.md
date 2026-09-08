# Mahoday — SRIMT AI Assistant (Frontend)

React + Vite PWA frontend for Mahoday, the AI assistant for SR Institute of
Management & Technology, Lucknow.

## Features
- Deep-space dark theme
- Blinking blue electric "thinking" indicator
- Voice input, photo upload
- Email + password signup/login (custom Supabase table auth, SHA-256 hashed)
- Session-based chat history (New chat / Old chats side panel)
- Installable as a PWA (Add to Home Screen)

## Supabase setup required
```sql
create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  mobile text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);
alter table app_users enable row level security;
create policy "Allow public signup insert" on app_users for insert to anon with check (true);
create policy "Allow public login select" on app_users for select to anon using (true);

create table if not exists chat_history (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  content text not null,
  user_id uuid references app_users(id),
  session_id uuid,
  created_at timestamptz not null default now()
);
alter table chat_history enable row level security;
create policy "Allow public insert" on chat_history for insert to anon with check (true);
create policy "Allow public select" on chat_history for select to anon using (true);
```

## Backend
Set `BACKEND_URL` in `src/App.jsx` to your deployed FastAPI + Gemini backend.

## Deploy
Push to GitHub, connect the repo on Vercel (Framework: Vite, auto-detected).
