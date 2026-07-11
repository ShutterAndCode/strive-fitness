import React from "react";
import { Info } from "lucide-react";
import Tooltip from "./Tooltip";

export default function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = "",
  unit = "",
  infoText,
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </label>

            {infoText && (
              <Tooltip content={infoText}>
                <Info className="size-4 cursor-help text-slate-400 transition-colors hover:text-emerald-500" />
              </Tooltip>
            )}
          </div>

          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {value} {unit}
          </span>
        </div>
      )}

      <div className="relative h-2 w-full cursor-pointer rounded-full bg-slate-200 dark:bg-slate-700">
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-emerald-500"
          style={{ width: `${percentage}%` }}
        />

        {/* Hidden range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute z-10 h-full w-full cursor-pointer opacity-0"
        />

        {/* Custom thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white shadow-md transition-transform duration-75 ease-out"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}