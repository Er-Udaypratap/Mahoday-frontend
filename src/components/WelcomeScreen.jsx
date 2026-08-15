import React from "react";
import { Zap } from "lucide-react";

// Centered welcome state - shown only before the first message is sent.
export default function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
        <Zap className="w-7 h-7 text-white" fill="white" />
      </div>
      <h2 className="text-xl font-semibold mb-1">Welcome to Mahoday</h2>
      <p className="text-sm text-slate-400 max-w-xs">
        SRIMT's AI assistant. Ask about admissions, courses, fees, or placements to get started.
      </p>
    </div>
  );
}
