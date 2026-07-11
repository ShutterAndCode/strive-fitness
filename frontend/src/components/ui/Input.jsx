import React from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  required = false,
  min,
  max,
}) {
  const handleChange = (e) => {
    const val = e.target.value;

    if (type === "number") {
      onChange(val === "" ? "" : parseFloat(val));
    } else {
      onChange(val);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
      />
    </div>
  );
}