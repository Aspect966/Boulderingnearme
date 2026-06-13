"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  DEFAULT_THEME,
  loadTheme,
  saveTheme,
  type ThemeColors,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: ThemeColors;
  setColor: (key: keyof ThemeColors, value: string) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const loaded = loadTheme();
    setTheme(loaded);
    applyTheme(loaded);
  }, []);

  const setColor = useCallback((key: keyof ThemeColors, value: string) => {
    setTheme((prev) => {
      const next = { ...prev, [key]: value };
      applyTheme(next);
      saveTheme(next);
      return next;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
    saveTheme(DEFAULT_THEME);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setColor, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
