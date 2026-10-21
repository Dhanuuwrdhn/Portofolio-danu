"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type PortfolioMode = "professional" | "terminal";
export type ModePhase = "idle" | "to-terminal" | "to-professional";

type Origin = { x: number; y: number };

type Overlay =
  | { kind: "iris"; origin: Origin; open: boolean }
  | { kind: "sheet"; up: boolean }
  | null;

const STORAGE_KEY = "portfolio-mode";

// Timings follow the "Mode switch" board of the design: drop to shell ≈1.3s, render GUI ≈1.1s
const IRIS_DELAY = 180;
const IRIS_DURATION = 560;
const SHEET_DURATION = 480;

type ModeContextValue = {
  mode: PortfolioMode;
  phase: ModePhase;
  switchMode: (next: PortfolioMode, origin?: Origin) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

function isPortfolioMode(value: unknown): value is PortfolioMode {
  return value === "professional" || value === "terminal";
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function originOf(element: Element | null): Origin | undefined {
  if (!element) return undefined;
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // Professional is rendered on the server so crawlers always get the clean, readable view
  const [mode, setModeState] = useState<PortfolioMode>("professional");
  const [phase, setPhase] = useState<ModePhase>("idle");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const commitMode = useCallback((next: PortfolioMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures, the mode still applies for this visit
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has("mode")) {
      url.searchParams.delete("mode");
      window.history.replaceState(null, "", url);
    }
    window.scrollTo({ top: 0 });
  }, []);

  const switchMode = useCallback(
    (next: PortfolioMode, origin?: Origin) => {
      if (next === mode || phase !== "idle") return;

      const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        commitMode(next);
        return;
      }

      if (next === "terminal") {
        // Drop to shell: the page folds while the terminal irises out from the toggle
        const from = origin ?? { x: window.innerWidth / 2, y: 32 };
        setPhase("to-terminal");
        setOverlay({ kind: "iris", origin: from, open: false });
        at(IRIS_DELAY, () => setOverlay({ kind: "iris", origin: from, open: true }));
        at(IRIS_DELAY + IRIS_DURATION, () => commitMode("terminal"));
        at(IRIS_DELAY + IRIS_DURATION + 40, () => {
          setOverlay(null);
          setPhase("idle");
        });
      } else {
        // Render GUI: a white sheet slides up over the shell, then the page staggers in
        setPhase("to-professional");
        setOverlay({ kind: "sheet", up: false });
        at(20, () => setOverlay({ kind: "sheet", up: true }));
        at(SHEET_DURATION + 20, () => commitMode("professional"));
        at(SHEET_DURATION + 60, () => {
          setOverlay(null);
          setPhase("idle");
        });
      }
    },
    [commitMode, mode, phase]
  );

  useEffect(() => {
    // "`" toggles the mode from anywhere except while the visitor is typing
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "`" || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      e.preventDefault();
      switchMode(mode === "professional" ? "terminal" : "professional");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, switchMode]);

  return (
    <ModeContext.Provider value={{ mode, phase, switchMode }}>
      {children}
      {overlay?.kind === "iris" && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] bg-[#10151D]"
          style={{
            clipPath: `circle(${overlay.open ? "150vmax" : "0px"} at ${overlay.origin.x}px ${overlay.origin.y}px)`,
            transition: `clip-path ${IRIS_DURATION}ms cubic-bezier(.7,0,.2,1)`,
          }}
        />
      )}
      {overlay?.kind === "sheet" && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] bg-white"
          style={{
            transform: overlay.up ? "translateY(0)" : "translateY(100%)",
            transition: `transform ${SHEET_DURATION}ms cubic-bezier(.2,.8,.2,1)`,
          }}
        />
      )}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useMode must be used inside ModeProvider");
  return context;
}
