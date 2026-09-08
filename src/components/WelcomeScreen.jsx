import React from "react";

export default function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-xl font-semibold mb-1">Welcome to Mahoday</h2>
      <p className="text-sm text-slate-400 max-w-xs">
        SRIMT's AI assistant. Ask about admissions, courses, fees, or placements to get started.
      </p>
    </div>
  );
}
