"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Terminal, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { originOf, useMode } from "@/app/components/ModeProvider";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function ProNavbar() {
  const { phase, switchMode } = useMode();
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopToggle = useRef<HTMLButtonElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      // Treat the band just below the navbar as the "current" section
      { rootMargin: "-80px 0px -60% 0px" }
    );

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const openTerminal = (button: HTMLButtonElement | null) => {
    setMenuOpen(false);
    switchMode("terminal", originOf(button));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E4E4E7] bg-white/[0.86] backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-5xl items-center justify-between gap-4 pl-5 pr-4 sm:px-6 md:h-16">
        <a href="#about" aria-label="Syahrial Danu — home" className="flex items-center gap-2.5 text-[#18181B]">
          <LogoMark className="h-[22px] w-[31px]" lifted={phase === "to-terminal"} />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Syahrial Danu</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? "true" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#F4F4F5] hover:text-[#18181B] ${
                activeSection === item.id ? "text-[#18181B]" : "text-[#52525B]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            ref={desktopToggle}
            type="button"
            onClick={() => openTerminal(desktopToggle.current)}
            className="ml-3 inline-flex h-[38px] items-center gap-2 rounded-[10px] bg-[#18181B] px-3.5 font-mono text-[13px] font-medium text-white transition-transform active:scale-[0.94]"
          >
            <Terminal className="h-4 w-4 text-[#10B981]" strokeWidth={2.25} aria-hidden />
            Terminal mode
          </button>
        </nav>

        <div className="flex gap-2 md:hidden">
          <button
            ref={mobileToggle}
            type="button"
            onClick={() => openTerminal(mobileToggle.current)}
            aria-label="Switch to terminal mode"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18181B] active:scale-[0.94]"
          >
            <Terminal className="h-[18px] w-[18px] text-[#10B981]" strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white text-[#18181B]"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Primary" className="border-t border-[#F4F4F5] px-3 pb-3 pt-2 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center rounded-xl px-3 text-[15px] text-[#18181B] hover:bg-[#F4F4F5]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
