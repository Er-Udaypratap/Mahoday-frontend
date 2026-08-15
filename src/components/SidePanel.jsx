import React from "react";
import { X, Shield, LogOut } from "lucide-react";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function SidePanel({
  open,
  onClose,
  user,
  sessions,
  onNewChat,
  onSelectSession,
  onLogout,
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-dvh w-[82%] max-w-xs bg-[#0b0c24] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-4 py-4 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-base font-semibold truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pt-4 space-y-2">
          <button
            onClick={() =>
              alert(
                "Privacy Policy: Mahoday aapke naam, email, mobile aur chat messages ko SRIMT ke admission/support purposes ke liye Supabase mein store karta hai. Data kisi third party ko share nahi kiya jaata."
              )
            }
            className="w-full flex items-center gap-2 justify-center border border-white/20 rounded-lg py-2.5 text-sm text-slate-200 hover:bg-white/5"
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </button>

          <button
            onClick={onNewChat}
            className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-lg py-2.5 text-sm font-medium"
          >
            + New chat
          </button>
        </div>

        <p className="px-4 pt-5 pb-2 text-xs font-medium text-slate-500 tracking-wide">CHATS</p>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
          {sessions.length === 0 && (
            <p className="px-2 text-xs text-slate-500">Abhi koi purani chat nahi hai.</p>
          )}
          {sessions.map((s) => (
            <button
              key={s.session_id}
              onClick={() => onSelectSession(s.session_id)}
              className="w-full text-left bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2.5"
            >
              <p className="text-sm truncate">{s.title}</p>
              <p className="text-[11px] text-slate-500">{timeAgo(s.created_at)}</p>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 justify-center border border-red-500/40 text-red-400 rounded-lg py-2.5 text-sm hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
