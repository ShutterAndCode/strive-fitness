import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${className}`}
    >
      {theme === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
      <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
};

export default ThemeToggle;
