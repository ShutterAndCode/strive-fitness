import React from "react";

export default function Tooltip({ content, children }) {
  return (
    <div className="relative flex items-center group">
      {children}

      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-48 -translate-x-1/2 rounded-md bg-slate-800 p-2 text-center text-xs text-white shadow-lg group-hover:block">
        {content}
      </div>
    </div>
  );
}