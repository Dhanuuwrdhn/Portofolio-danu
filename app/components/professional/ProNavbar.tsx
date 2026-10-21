"use client";

import { useEffect, useState } from "react";
import { SquareTerminal } from "lucide-react";
import { smoothScroll } from "@/app/utils/smoothScroll";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function ProNavbar({ onSwitchMode }: { onSwitchMode: () => void }) {
  const [activeSection, setActiveSection] = useState("about");

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

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => smoothScroll(e, "top")}
          className="flex items-center gap-2.5 font-semibold text-zinc-900"
          aria-label="Scroll to top"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
            SD
          </span>
          <span className="hidden sm:inline">Syahrial Danu</span>
        </a>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => smoothScroll(e, item.id)}
              className={`hidden rounded-md px-3 py-2 text-sm font-medium transition-colors md:inline-block ${
                activeSection === item.id
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onSwitchMode}
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            aria-label="Switch to terminal view"
          >
            <SquareTerminal className="h-4 w-4" />
            Terminal mode
          </button>
        </nav>
      </div>
    </header>
  );
}
