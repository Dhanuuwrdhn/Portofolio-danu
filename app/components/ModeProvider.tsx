"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type PortfolioMode = "professional" | "terminal";

const STORAGE_KEY = "portfolio-mode";

type ModeContextValue = {
  mode: PortfolioMode;
  setMode: (mode: PortfolioMode) => void;
  toggleMode: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

function isPortfolioMode(value: unknown): value is PortfolioMode {
  return value === "professional" || value === "terminal";
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Professional is rendered on the server so crawlers always get the clean, readable view
  const [mode, setModeState] = useState<PortfolioMode>("professional");

  useEffect(() => {
    // ?mode=terminal in the URL wins over the remembered preference
    const fromQuery = new URLSearchParams(window.location.search).get("mode");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be blocked (private mode); fall back to the default
    }
    const initial = isPortfolioMode(fromQuery) ? fromQuery : stored;
    if (isPortfolioMode(initial)) setModeState(initial);
  }, []);

  const setMode = useCallback((next: PortfolioMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures, the mode still applies for this visit
    }
    window.scrollTo({ top: 0 });
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "professional" ? "terminal" : "professional");
  }, [mode, setMode]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useMode must be used inside ModeProvider");
  return context;
}
