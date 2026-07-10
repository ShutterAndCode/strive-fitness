import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem(`theme`) ||
      (window.matchMedia("(prefers-color-scheme: dark").matches
        ? "dark"
        : "light"),
  );

  // update theme when state changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => {
      prev === "light" ? "dark" : "light";
    });
  };
  return <ThemeContext.Provider value={theme,toggleTheme}>{children}</ThemeContext.Provider>;
}
export function UseTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(`useTheme must be within a ThemeProvider`);
  }
}
