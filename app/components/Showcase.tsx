"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

import { aboutData } from "@/app/data/about";
import { experiences } from "@/app/data/experiences";
import { projects } from "@/app/data/projects";
import { contactEmail, resumePdfPath, socialLinks } from "@/app/data/socials";
import ChatBot from "@/app/components/ChatBot";
import type { Waypoint } from "@/app/components/Scene3D";

// WebGL needs the browser; load three.js only on the client.
const Scene3D = dynamic(() => import("@/app/components/Scene3D"), { ssr: false });

type Item = {
  key: string;
  waypoint: Waypoint;
  label: string;
  title: string;
  subtitle?: string;
  body?: string;
  tags?: string[];
  links?: { href: string; label: string; icon?: React.ReactNode }[];
};
type Section = { name: string; items: Item[] };

const firstParagraph = (s: string) => s.split(/\n\s*\n/)[0].trim();
// Spread n items around one scene so each gets its own camera angle (moving sideways).
const orbit = (i: number, n: number, spread: number) => (n <= 1 ? 0 : (i / (n - 1) - 0.5) * spread);

function buildSections(): Section[] {
  return [
    {
      name: "Intro",
      items: [
        {
          key: "intro",
          waypoint: { scene: 0, angle: 0, radius: 7 },
          label: "Portfolio",
          title: "Syahrial Danu",
          subtitle: "Software Engineer · Web · Mobile · AI",
        },
      ],
    },
    {
      name: "About",
      items: [
        {
          key: "about",
          waypoint: { scene: 1, angle: 0.5, radius: 6.5 },
          label: "About",
          title: aboutData[0].heading,
          body: firstParagraph(aboutData[0].description),
          links: [{ href: resumePdfPath, label: "Download CV" }],
        },
      ],
    },
    {
      name: "Experience",
      items: experiences.map((e, i, all) => ({
        key: `exp-${e.id}`,
        waypoint: { scene: 2, angle: orbit(i, all.length, 2.4), radius: 7 - (i % 2) },
        label: `${e.type === "education" ? "Education" : "Experience"} · ${e.date}`,
        title: e.title,
        subtitle: e.company,
        body: firstParagraph(e.description),
        tags: e.skills?.map((s) => s.title),
      })),
    },
    {
      name: "Projects",
      items: projects.map((p, i, all) => ({
        key: `proj-${p.id}`,
        waypoint: { scene: 3, angle: orbit(i, all.length, 3.2), radius: 6.5 + (i % 3) * 0.6 },
        label: `Project · ${{ paid: "Client work", freelance: "Freelance", personal: "Personal" }[p.type]}`,
        title: p.title,
        subtitle: p.company,
        body: p.description,
        tags: p.skills?.map((s) => s.title),
        links: p.link && p.link !== "#" ? [{ href: p.link, label: "Visit project" }] : undefined,
      })),
    },
    {
      name: "Contact",
      items: [
        {
          key: "contact",
          waypoint: { scene: 4, angle: 0, radius: 7 },
          label: "Contact",
          title: "Let's build something",
          subtitle: "Open to collaborations and new roles.",
          links: [
            { href: `mailto:${contactEmail}`, label: "Email", icon: <FaEnvelope /> },
            { href: socialLinks.github, label: "GitHub", icon: <FaGithub /> },
            { href: socialLinks.linkedin, label: "LinkedIn", icon: <FaLinkedin /> },
          ],
        },
      ],
    },
  ];
}

const LOCK_MS = 1100; // one move per gesture; roughly the camera tween length
type Pos = { s: number; i: number; dir: "up" | "down" | "left" | "right" };

export default function Showcase() {
  const sections = useMemo(() => buildSections(), []);
  const [pos, setPos] = useState<Pos>({ s: 0, i: 0, dir: "down" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const posRef = useRef(pos);
  const lockUntil = useRef(0);

  useEffect(() => {
    // Reduced-motion users get the same sections without the 3D layer.
    const ok = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setWebgl(ok);
    if (!ok) setReady(true);
  }, []);

  const move = useCallback((next: Pos, force = false) => {
    const now = performance.now();
    if (!force && now < lockUntil.current) return;
    if (next.s === posRef.current.s && next.i === posRef.current.i) return;
    lockUntil.current = now + LOCK_MS;
    posRef.current = next;
    setPos(next);
  }, []);

  // Down/up = next/previous section. Left/right = next/previous item inside it.
  const goSection = useCallback(
    (s: number, force = false) => {
      const n = Math.max(0, Math.min(sections.length - 1, s));
      move({ s: n, i: 0, dir: n > posRef.current.s ? "down" : "up" }, force);
    },
    [move, sections.length],
  );
  const goItem = useCallback(
    (i: number, force = false) => {
      const { s } = posRef.current;
      const n = Math.max(0, Math.min(sections[s].items.length - 1, i));
      move({ s, i: n, dir: n > posRef.current.i ? "right" : "left" }, force);
    },
    [move, sections],
  );

  useEffect(() => {
    let accX = 0;
    let accY = 0;
    let lastWheel = 0;
    let gestureUsed = false;
    let touch: { x: number; y: number } | null = null;
    const inNativeScroll = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("[data-native-scroll]");

    const onWheel = (e: WheelEvent) => {
      if (menuOpen || inNativeScroll(e.target)) return;
      e.preventDefault();
      const now = performance.now();
      // A pause between wheel events starts a new gesture; trackpad inertia stays in the old one.
      if (now - lastWheel > 250) {
        gestureUsed = false;
        accX = accY = 0;
      }
      lastWheel = now;
      if (gestureUsed) return;
      accX += e.deltaX;
      accY += e.deltaY;
      if (Math.abs(accX) > 40 && Math.abs(accX) > Math.abs(accY)) {
        gestureUsed = true;
        goItem(posRef.current.i + Math.sign(accX));
      } else if (Math.abs(accY) > 35) {
        gestureUsed = true;
        goSection(posRef.current.s + Math.sign(accY));
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touch = inNativeScroll(e.target) ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touch || menuOpen) return;
      const dx = touch.x - e.changedTouches[0].clientX;
      const dy = touch.y - e.changedTouches[0].clientY;
      touch = null;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) goItem(posRef.current.i + Math.sign(dx));
      else if (Math.abs(dy) > 50) goSection(posRef.current.s + Math.sign(dy));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setMenuOpen(false);
      if (menuOpen || (e.target instanceof HTMLElement && e.target.closest("input,textarea"))) return;
      const { s, i } = posRef.current;
      const actions: Record<string, () => void> = {
        ArrowDown: () => goSection(s + 1),
        PageDown: () => goSection(s + 1),
        " ": () => goSection(s + 1),
        ArrowUp: () => goSection(s - 1),
        PageUp: () => goSection(s - 1),
        ArrowRight: () => goItem(i + 1),
        ArrowLeft: () => goItem(i - 1),
        Home: () => goSection(0, true),
        End: () => goSection(sections.length - 1, true),
      };
      if (actions[e.key]) {
        e.preventDefault();
        actions[e.key]();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [goItem, goSection, menuOpen, sections.length]);

  const section = sections[pos.s];
  const item = section.items[pos.i];
  const many = section.items.length > 1;
  // Text enters from the direction of travel.
  const offset = { down: { y: 30 }, up: { y: -30 }, right: { x: 40 }, left: { x: -40 } }[pos.dir];

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0a0a0b] text-white selection:bg-white/20">
      {webgl && <Scene3D waypoint={item.waypoint} onReady={() => setReady(true)} />}

      {/* Vignette keeps text readable over the brighter smoke. */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(10,10,11,0.55) 75%), linear-gradient(90deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.2) 55%, transparent 100%)",
        }}
      />
      {/* On phones the text sits at the bottom, so darken from below instead. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent md:hidden" />

      {/* Loader */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm uppercase tracking-[0.8em] text-white/80 animate-pulse">Loading</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burger */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="fixed left-6 top-6 z-40 flex h-8 w-8 flex-col justify-center gap-[6px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/50"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`block h-px w-6 bg-white/80 transition-all duration-300 ${
              menuOpen && i === 0 ? "translate-y-[7px] rotate-45" : ""
            } ${menuOpen && i === 1 ? "opacity-0" : ""} ${menuOpen && i === 2 ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        ))}
      </button>

      {/* Menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Sections"
            className="fixed inset-0 z-30 flex items-center bg-[#0a0a0b]/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-6 pl-[12vw]">
              {sections.map((sec, s) => (
                <motion.li
                  key={sec.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * s }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      goSection(s, true);
                    }}
                    className={`text-3xl md:text-5xl font-light uppercase tracking-[0.3em] transition-colors ${
                      pos.s === s ? "text-white" : "text-white/35 hover:text-white/80"
                    }`}
                  >
                    {sec.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Item text */}
      <section
        aria-live="polite"
        className="relative z-10 flex h-full w-full items-end md:items-center px-6 pb-32 md:pb-0 md:pl-[10vw] md:pr-[45vw]"
      >
        <AnimatePresence mode="wait">
          <motion.article
            key={item.key}
            initial="hidden"
            animate="show"
            exit="out"
            variants={{
              hidden: { opacity: 0 },
              out: { opacity: 0, transition: { duration: 0.3 } },
              show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
            }}
            className="max-w-xl"
          >
            {[
              <p key="l" className="mb-6 text-[11px] uppercase tracking-[0.5em] text-white/50">
                {String(pos.s + 1).padStart(2, "0")} — {item.label}
              </p>,
              <h1
                key="t"
                className={`font-light uppercase leading-tight ${
                  item.key === "intro"
                    ? "text-4xl md:text-6xl tracking-[0.35em]"
                    : "text-2xl md:text-4xl tracking-[0.18em]"
                }`}
              >
                {item.title}
              </h1>,
              item.subtitle && (
                <p key="s" className="mt-4 text-xs md:text-sm uppercase tracking-[0.35em] text-white/60">
                  {item.subtitle}
                </p>
              ),
              item.body && (
                <p key="b" className="mt-5 md:mt-8 text-sm md:text-[15px] leading-6 md:leading-7 text-white/70 line-clamp-5 md:line-clamp-6">
                  {item.body}
                </p>
              ),
              item.tags?.length && (
                <p key="g" className="mt-6 text-[10px] uppercase tracking-[0.35em] text-white/40">
                  {item.tags.join("  /  ")}
                </p>
              ),
              item.links && (
                <div key="k" className="mt-10 flex flex-wrap gap-6">
                  {item.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/80 hover:text-white"
                    >
                      {l.icon}
                      <span className="border-b border-white/30 pb-1 group-hover:border-white">{l.label}</span>
                    </a>
                  ))}
                </div>
              ),
            ]
              .filter(Boolean)
              .map((el, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, ...offset },
                    out: { opacity: 0 },
                    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {el}
                </motion.div>
              ))}
          </motion.article>
        </AnimatePresence>
      </section>

      {/* Section dots (vertical) */}
      <nav aria-label="Sections" className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {sections.map((sec, s) => (
          <button
            key={sec.name}
            onClick={() => goSection(s, true)}
            aria-label={sec.name}
            aria-current={s === pos.s ? "true" : undefined}
            className="group relative flex items-center justify-end p-1"
          >
            <span
              className={`pointer-events-none absolute right-6 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] transition-colors ${
                s === pos.s ? "text-white/70" : "text-white/0 group-hover:text-white/60"
              }`}
            >
              {sec.name}
            </span>
            <span
              className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                s === pos.s ? "scale-125 bg-white" : "bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Item stepper (horizontal) — only for sections with several items */}
      <AnimatePresence>
        {many && (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
            className="fixed bottom-16 left-6 right-6 z-20 flex items-center gap-5 md:left-[10vw] md:right-auto"
          >
            <button
              onClick={() => goItem(pos.i - 1, true)}
              disabled={pos.i === 0}
              aria-label="Previous"
              className="text-white/60 hover:text-white disabled:opacity-20"
            >
              <svg width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true">
                <path d="M11 1L1 11l10 10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <div className="flex min-w-0 items-center gap-1 md:gap-1.5">
              {section.items.map((it, i) => (
                <button
                  key={it.key}
                  onClick={() => goItem(i, true)}
                  aria-label={it.title}
                  aria-current={i === pos.i ? "true" : undefined}
                  className="py-2"
                >
                  <span
                    className={`block h-px transition-all duration-500 ${
                      i === pos.i ? "w-6 md:w-10 bg-white" : "w-2 md:w-4 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => goItem(pos.i + 1, true)}
              disabled={pos.i === section.items.length - 1}
              aria-label="Next"
              className="text-white/60 hover:text-white disabled:opacity-20"
            >
              <svg width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true">
                <path d="M1 1l10 10L1 21" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.4em] text-white/40">
              {String(pos.i + 1).padStart(2, "0")} / {String(section.items.length).padStart(2, "0")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next-section hint */}
      {pos.s < sections.length - 1 && (
        <button
          onClick={() => goSection(pos.s + 1, true)}
          aria-label={`Next section: ${sections[pos.s + 1].name}`}
          className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 hover:text-white"
        >
          <span className="text-[9px] uppercase tracking-[0.5em]">{sections[pos.s + 1].name}</span>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" className="animate-bounce">
            <path d="M1 1l10 10L21 1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      )}

      {/* Chatbot keeps its own scrolling; paging ignores wheel/touch inside it. */}
      <div data-native-scroll className="relative z-40">
        <ChatBot theme="dark" />
      </div>
    </main>
  );
}
