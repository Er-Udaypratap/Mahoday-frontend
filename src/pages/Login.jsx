import React, { useState } from "react";
import { loginUser, saveSession } from "../lib/supabase.js";

export default function Login({ onAuthed, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !dob) {
      setError("Email aur date of birth dono chahiye.");
      return;
    }
    setLoading(true);
    const { user, error: err } = await loginUser({ email, dob });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    saveSession(user);
    onAuthed(user);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-1">Login karo</h2>
      <p className="text-sm text-slate-400 mb-6">Apne email aur date of birth se login karo.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-400/50"
        />
        <div>
          <label className="block text-xs text-slate-400 mb-1 ml-1">Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-400/50 [color-scheme:dark]"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 text-black font-medium rounded-lg py-2.5 text-sm disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-xs text-slate-400 mt-5 text-center">
        Account nahi hai?{" "}
        <button onClick={onSwitchToSignup} className="text-amber-300 underline">
          Signup karo
        </button>
      </p>
    </div>
  );
}
