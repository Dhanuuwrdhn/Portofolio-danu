"use client";

import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function Section({ id, eyebrow, title, aside, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-16 border-t border-[#F4F4F5] px-5 py-14 sm:px-6 md:py-[88px] ${className}`}>
      <motion.div
        className="mx-auto max-w-5xl"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#047857]">{eyebrow}</p>
            <h2 className="mt-2.5 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] md:text-4xl">
              {title}
            </h2>
          </div>
          {aside}
        </div>
        {children}
      </motion.div>
    </section>
  );
}

// Data descriptions are hand-wrapped; rebuild real paragraphs and "- " bullet lists from them
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((line) => line.trim());
        const bullets = lines.filter((line) => line.startsWith("- "));
        const prose = lines.filter((line) => !line.startsWith("- ")).join(" ");

        return (
          <div key={i}>
            {prose && <p>{prose}</p>}
            {bullets.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-[#A1A1AA]">
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet.slice(2)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StackChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[7px] bg-[#F4F4F5] px-[9px] py-[5px] font-mono text-xs text-[#3F3F46]">
      {children}
    </span>
  );
}
