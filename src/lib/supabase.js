// Lightweight Supabase REST client - no SDK dependency needed.
// Uses the publishable (anon-safe) key only. Never put a service_role key here.

const SUPABASE_URL = "https://ojueutgyyfpfnawyrplw.supabase.co";
const SUPABASE_KEY = "sb_publishable_9U4PcC_DVAmyarse3zLhLg_iHwwF73J";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

// ---------- Chat history (session-based) ----------

export async function saveMessage(role, content, userId, sessionId) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/chat_history`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        role,
        content,
        user_id: userId || null,
        session_id: sessionId || null,
      }),
    });
  } catch (e) {
    console.error("Supabase save failed:", e);
  }
}

// Returns one entry per chat session: { session_id, title, created_at }
export async function fetchSessionsForUser(userId) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_history?select=session_id,role,content,created_at&user_id=eq.${userId}&order=created_at.asc`,
      { headers }
    );
    if (!res.ok) return [];
    const rows = await res.json();

    const map = new Map();
    for (const r of rows) {
      if (!r.session_id) continue;
      if (!map.has(r.session_id)) {
        map.set(r.session_id, {
          session_id: r.session_id,
          title: r.role === "user" ? r.content : "New chat",
          created_at: r.created_at,
        });
      } else {
        map.get(r.session_id).created_at = r.created_at;
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } catch (e) {
    console.error("Supabase sessions fetch failed:", e);
    return [];
  }
}

export async function fetchMessagesBySession(sessionId) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_history?select=role,content,created_at&session_id=eq.${sessionId}&order=created_at.asc`,
      { headers }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Supabase messages fetch failed:", e);
    return [];
  }
}

// ---------- Auth (custom table-based, not Supabase Auth) ----------

export async function signupUser({ fullName, email, mobile, dob }) {
  const existing = await fetch(
    `${SUPABASE_URL}/rest/v1/app_users?select=id&email=eq.${encodeURIComponent(email)}`,
    { headers }
  ).then((r) => r.json());

  if (existing && existing.length > 0) {
    return { error: "Is email se pehle se account bana hua hai. Login karo." };
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_users`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      full_name: fullName,
      email,
      mobile,
      date_of_birth: dob,
    }),
  });

  if (!res.ok) {
    return { error: "Signup fail ho gaya, dobara try karo." };
  }
  const data = await res.json();
  return { user: data[0] };
}

export async function loginUser({ email, dob }) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/app_users?select=*&email=eq.${encodeURIComponent(
      email
    )}&date_of_birth=eq.${dob}`,
    { headers }
  );
  if (!res.ok) return { error: "Login fail ho gaya, dobara try karo." };
  const data = await res.json();
  if (!data || data.length === 0) {
    return { error: "Email ya date of birth galat hai." };
  }
  return { user: data[0] };
}

// ---------- Local session ----------

const SESSION_KEY = "mahoday_session";

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
