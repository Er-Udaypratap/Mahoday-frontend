// Lightweight Supabase REST client - no SDK dependency needed.
// Uses the publishable (anon-safe) key only. Never put a service_role key here.

const SUPABASE_URL = "https://ojueutgyyfpfnawyrplw.supabase.co";
const SUPABASE_KEY = "sb_publishable_9U4PcC_DVAmyarse3zLhLg_iHwwF73J";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export async function saveMessage(role, content) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/chat_history`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ role, content }),
    });
  } catch (e) {
    console.error("Supabase save failed:", e);
  }
}

export async function fetchRecentHistory(limit = 20) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_history?select=role,content,created_at&order=created_at.desc&limit=${limit}`,
      { headers }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.reverse();
  } catch (e) {
    console.error("Supabase fetch failed:", e);
    return [];
  }
}
