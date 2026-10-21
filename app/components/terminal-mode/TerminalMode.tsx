"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutTemplate, Music } from "lucide-react";
import useSound from "use-sound";
import ChatBot from "@/app/components/ChatBot";
import { useMode } from "@/app/components/ModeProvider";
import { LogoMark } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import {
  bootSequence,
  COMMANDS,
  PROMPT,
  runCommand,
  TONE_COLORS,
  welcome,
  type Line,
} from "./commands";

type RenderedLine = Line & { id: number };

const BOOT_LINE_DELAY = 190;
const GUI_HANDOFF_DELAY = 300;

// The webfont subset has no box-drawing glyphs, so the banner uses system monospace fonts that do
const BANNER_FONT = 'Menlo, Consolas, "DejaVu Sans Mono", "Liberation Mono", ui-monospace, monospace';

// Only the first terminal visit per page load plays the full boot log
let hasBootedOnce = false;

function TerminalLine({ line, narrow }: { line: Line; narrow: boolean }) {
  const kind = line.kind ?? "normal";
  const sizes = {
    normal: narrow ? "text-[12.5px] leading-[1.75] min-h-[1.75em]" : "text-sm leading-[1.75] min-h-[1.75em]",
    small: "text-[12.5px] leading-[1.5] min-h-[1.5em]",
    banner: narrow ? "text-xs leading-[1.12] min-h-[1.12em]" : "text-lg leading-[1.12] min-h-[1.12em]",
  };

  return (
    <div
      className={`${sizes[kind]} ${kind === "banner" ? "whitespace-pre" : "whitespace-pre-wrap break-words"}`}
      style={{ paddingLeft: line.indent, fontFamily: kind === "banner" ? BANNER_FONT : undefined }}
    >
      {line.segs.map((seg, i) =>
        seg.href ? (
          <a
            key={i}
            href={seg.href}
            download={seg.download || undefined}
            target={seg.href.startsWith("http") ? "_blank" : undefined}
            rel={seg.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="underline underline-offset-[3px] hover:text-[#34D399]"
            style={{ color: TONE_COLORS[seg.tone] }}
          >
            {seg.text}
          </a>
        ) : (
          <span key={i} style={{ color: TONE_COLORS[seg.tone] }}>
            {seg.text}
          </span>
        )
      )}
    </div>
  );
}

export default function TerminalMode() {
  const { switchMode } = useMode();
  const [phase, setPhase] = useState<"boot" | "ready">("boot");
  const [bootLines, setBootLines] = useState<RenderedLine[]>([]);
  const [lines, setLines] = useState<RenderedLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [narrow, setNarrow] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicReady, setMusicReady] = useState(false);

  const uid = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [play, { pause }] = useSound("/music/background-music.mp3", {
    volume: 0.4,
    loop: true,
    onload: () => setMusicReady(true),
  });

  const withIds = useCallback((items: Line[]): RenderedLine[] => {
    return items.map((item) => ({ ...item, id: ++uid.current }));
  }, []);

  const finishBoot = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    hasBootedOnce = true;
    setLines(withIds(welcome()));
    setPhase("ready");
  }, [withIds]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const sequence = withIds(bootSequence(!hasBootedOnce));
    const pending = timers.current;
    sequence.forEach((item, i) => {
      pending.push(setTimeout(() => setBootLines((prev) => [...prev, item]), 250 + i * BOOT_LINE_DELAY));
    });
    pending.push(setTimeout(finishBoot, 250 + sequence.length * BOOT_LINE_DELAY + 650));
    return () => pending.forEach(clearTimeout);
  }, [finishBoot, withIds]);

  useEffect(() => {
    // Stop the music when leaving terminal mode
    return () => pause();
  }, [pause]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (phase === "ready") inputRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const run = (raw: string) => {
    const command = raw.trim();
    const echo: Line = {
      segs: [
        { text: PROMPT, tone: "or" },
        { text: command, tone: "wh" },
      ],
    };
    if (command) setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setInput("");

    const result = runCommand(command, narrow);
    if (result.effect === "clear") {
      setLines([]);
      return;
    }

    const tail: Line[] = result.lines.length ? [{ segs: [] }] : [];
    setLines((prev) => [...prev, ...withIds([echo, ...result.lines, ...tail])]);

    if (result.effect === "gui") {
      timers.current.push(setTimeout(() => switchMode("professional"), GUI_HANDOFF_DELAY));
    }
    if (result.effect === "karen") setChatOpen(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < 0) return;
      const next = historyIndex + 1;
      setHistoryIndex(next >= history.length ? -1 : next);
      setInput(next >= history.length ? "" : history[next]);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const typed = input.trim().toLowerCase();
      const matches = COMMANDS.filter((cmd) => typed && cmd.startsWith(typed));
      if (matches.length === 1) setInput(matches[0]);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    }
  };

  const toggleMusic = () => {
    if (musicOn) {
      pause();
    } else {
      play();
    }
    setMusicOn(!musicOn);
  };

  const runChip = (command: string) => {
    run(command);
    inputRef.current?.focus({ preventScroll: true });
  };

  const focusPrompt = () => {
    // Keep text selectable: only refocus when nothing is being selected
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  if (phase === "boot") {
    return (
      <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#10151D] font-mono text-[#C8D1DC] selection:bg-[#10B981]/35">
        <div className="flex-1 overflow-hidden px-5 py-12 sm:px-[72px] sm:py-16" aria-live="polite">
          {bootLines.map((item) => (
            <TerminalLine key={item.id} line={item} narrow={narrow} />
          ))}
          <span className="animate-cursor-blink mt-1.5 inline-block h-[17px] w-[9px] bg-[#10B981]" />
        </div>
        <button
          type="button"
          onClick={finishBoot}
          className="absolute bottom-7 left-5 right-5 h-[46px] rounded-xl border border-[#273344] text-[13px] font-medium text-[#7D8A9C] transition-colors hover:border-[#10B981] hover:text-[#F4F4F5] sm:bottom-9 sm:left-auto sm:right-10 sm:h-9 sm:rounded-[9px] sm:px-3.5 sm:text-xs"
        >
          {narrow ? "tap to skip boot ›" : "skip boot ›"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#10151D] font-mono text-[#C8D1DC] selection:bg-[#10B981]/35">
      <header className="flex h-14 flex-none items-center justify-between border-b border-[#273344] bg-[#131821] pl-4 pr-3 sm:px-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <LogoMark color="#F4F4F5" className="h-[18px] w-[25px]" title="Danu monogram" />
          <span className="text-[12.5px] text-[#F4F4F5] sm:text-[13px]">danu.me</span>
          <span className="hidden text-[13px] text-[#7D8A9C] sm:inline">~/terminal</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={toggleMusic}
            disabled={!musicReady}
            aria-pressed={musicOn}
            aria-label="Background music"
            className="flex h-11 w-11 items-center justify-center gap-2 rounded-[10px] border border-[#273344] text-xs font-medium text-[#C8D1DC] transition-colors hover:border-[#10B981] disabled:opacity-50 sm:h-9 sm:w-auto sm:rounded-[9px] sm:px-3"
          >
            {musicOn ? (
              <span className="animate-eq inline-flex h-3 items-end gap-0.5" aria-hidden>
                <span className="h-3 w-[3px] bg-[#10B981]" />
                <span className="h-3 w-[3px] bg-[#10B981]" />
                <span className="h-3 w-[3px] bg-[#10B981]" />
              </span>
            ) : (
              <Music className="h-[15px] w-[15px] text-[#10B981]" aria-hidden />
            )}
            <span className="hidden sm:inline">{musicOn ? "music: on" : "music: off"}</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode("professional")}
            className="flex h-11 items-center gap-2 rounded-[10px] bg-[#F4F4F5] px-3 font-sans text-[13px] font-semibold text-[#10151D] transition-colors hover:bg-white sm:h-9 sm:rounded-[9px] sm:px-3.5"
          >
            <LayoutTemplate className="h-[15px] w-[15px]" aria-hidden />
            Professional view
          </button>
        </div>
      </header>

      <main ref={scrollRef} onClick={focusPrompt} className="terminal-scroll flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 pb-6 pt-5 sm:px-8 sm:pb-10 sm:pt-8" aria-live="polite">
          {lines.map((item) => (
            <TerminalLine key={item.id} line={item} narrow={narrow} />
          ))}
          <div className="flex items-center text-[12.5px] leading-[1.75] sm:text-sm">
            <label htmlFor="term-cmd" className="flex-none whitespace-pre text-[#FFA23E]">
              {PROMPT}
            </label>
            <input
              id="term-cmd"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={narrow ? "type help" : "type help and press Enter"}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent p-0 font-mono text-base text-[#F4F4F5] caret-[#10B981] outline-none placeholder:text-[#4B5A6E] sm:text-sm"
            />
          </div>
        </div>
      </main>

      <div className="flex flex-none gap-2 overflow-x-auto whitespace-nowrap border-t border-[#273344] bg-[#131821] px-4 pb-3.5 pt-2.5 sm:flex-wrap sm:items-center sm:bg-transparent sm:px-6 sm:py-3">
        <span className="mr-1.5 hidden text-xs text-[#7D8A9C] sm:inline">quick commands</span>
        {COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => runChip(command)}
            className="h-9 flex-none rounded-[9px] border border-[#273344] bg-[#10151D] px-3.5 text-[12.5px] font-medium text-[#C8D1DC] transition-colors hover:border-[#10B981] hover:text-[#F4F4F5] sm:h-[30px] sm:rounded-lg sm:bg-[#131821] sm:px-3 sm:text-xs"
          >
            {command}
          </button>
        ))}
      </div>
      <footer className="hidden h-[30px] flex-none items-center justify-between border-t border-[#273344] bg-[#131821] px-6 text-[11.5px] text-[#7D8A9C] sm:flex">
        <span>
          <span className="text-[#10B981]">●</span> connected · zsh · utf-8
        </span>
        <span>tab autocomplete · ↑↓ history · ctrl+l clear · ` professional view</span>
      </footer>

      <ChatBot theme="dark" raised open={chatOpen} onOpenChange={setChatOpen} />
      <Toaster position="top-center" />
    </div>
  );
}
