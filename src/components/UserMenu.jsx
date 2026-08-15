import React, { useState, useRef, useEffect } from "react";
import { Shield, MessageSquarePlus, History, LogOut } from "lucide-react";

export default function UserMenu({ user, onNewChat, onOpenHistory, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = (user?.full_name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[#0d0e26] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              onNewChat();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 text-left"
          >
            <MessageSquarePlus className="w-4 h-4 text-slate-300" />
            New chat
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onOpenHistory();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 text-left"
          >
            <History className="w-4 h-4 text-slate-300" />
            Old chats
          </button>

          <button
            onClick={() => {
              setOpen(false);
              alert(
                "Privacy Policy: Mahoday aapke naam, email, mobile aur chat messages ko SRIMT ke admission/support purposes ke liye Supabase mein store karta hai. Data kisi third party ko share nahi kiya jaata."
              );
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 text-left"
          >
            <Shield className="w-4 h-4 text-slate-300" />
            Privacy policy
          </button>

          <div className="border-t border-white/10">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
