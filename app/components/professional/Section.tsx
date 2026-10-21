"use client";

import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Section({ id, index, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-zinc-200 py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
              {index}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {title}
            </h2>
          </div>
          {description && <p className="max-w-sm text-zinc-500">{description}</p>}
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
              <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-zinc-400">
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

export function SkillChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}
