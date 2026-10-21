"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Lock, X } from "lucide-react";
import { projects } from "@/app/data/projects";
import type { Project } from "@/app/data/projects";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Section, { StackChip } from "./Section";

const yearOf = (date: string) => new Date(date).getFullYear().toString();

const monthYear = (date: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(date));

const hostOf = (link: string) => {
  try {
    return new URL(link).host;
  } catch {
    return link;
  }
};

const isLive = (project: Project) => project.link !== "#";

// Logos and illustrations are SVGs and look best padded, screenshots should fill the frame
const isIllustration = (src: string) => src.endsWith(".svg");

function TypeBadge({ project }: { project: Project }) {
  return project.type === "paid" ? (
    <span className="rounded-md bg-[#ECFDF5] px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.04em] text-[#047857]">
      Client work
    </span>
  ) : (
    <span className="rounded-md bg-[#F4F4F5] px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.04em] text-[#52525B]">
      Personal
    </span>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const contain = isIllustration(project.imageUrl);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-[#D4D4D8] hover:shadow-[0_14px_34px_rgba(24,24,27,0.08)] motion-reduce:transition-none">
      {/* Whole card opens the details; the live link below sits above this layer */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${project.title} — open details`}
        className="absolute inset-0 z-10 rounded-2xl"
      />
      <div className="relative aspect-video overflow-hidden border-b border-[#E4E4E7] bg-[#F4F4F5]">
        <Image
          src={project.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 500px, 100vw"
          className={contain ? "object-contain p-10" : "object-cover object-top"}
        />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-[22px] pt-5">
        <div className="flex items-center gap-2">
          <TypeBadge project={project} />
          <span className="ml-auto font-mono text-xs text-[#71717A]">{yearOf(project.date)}</span>
        </div>
        <h3 className="mt-3.5 text-lg font-semibold leading-[1.35] tracking-[-0.015em]">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-[14.5px] leading-[1.6] text-[#71717A]">{project.description}</p>
        {project.skills && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.skills.slice(0, 4).map((skill) => (
              <StackChip key={skill.id}>{skill.title}</StackChip>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-[18px] text-sm">
          {isLive(project) ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 inline-flex items-center gap-1.5 font-medium text-[#047857] hover:text-[#065F46]"
            >
              Visit site
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#71717A]">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Private
            </span>
          )}
          <span className="text-[#18181B]">Details →</span>
        </div>
      </div>
    </article>
  );
}

function ProjectModal({
  index,
  onIndexChange,
}: {
  index: number;
  onIndexChange: (index: number | null) => void;
}) {
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const go = (step: number) => onIndexChange((index + step + projects.length) % projects.length);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const details = [
    { label: "Client", value: project.company },
    { label: "Type", value: project.type === "paid" ? "Client work" : "Personal project" },
    { label: "Date", value: monthYear(project.date) },
  ];

  return (
    <DialogContent
      hideClose
      className="flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-[880px] flex-col gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 font-sans text-[#18181B] shadow-[0_30px_80px_rgba(9,9,11,0.35)] sm:rounded-[20px]"
    >
      <div className="relative h-[200px] flex-none overflow-hidden border-b border-[#E4E4E7] bg-[#F4F4F5] md:h-[300px]">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="880px"
          className={isIllustration(project.imageUrl) ? "object-contain p-12" : "object-contain p-6"}
        />
        <DialogClose
          aria-label="Close project details"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#18181B] shadow-[0_4px_12px_rgba(24,24,27,0.08)]"
        >
          <X className="h-[18px] w-[18px]" aria-hidden />
        </DialogClose>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 py-6 md:flex-row md:gap-10 md:px-10 md:py-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <TypeBadge project={project} />
            <span className="font-mono text-xs text-[#71717A]">{yearOf(project.date)}</span>
          </div>
          <DialogTitle className="mt-3.5 text-2xl font-semibold leading-[1.15] tracking-[-0.03em] md:text-[30px]">
            {project.title}
          </DialogTitle>
          <DialogDescription className="mt-3.5 text-base leading-[1.7] text-[#3F3F46]">
            {project.description}
          </DialogDescription>
          {project.skills && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.skills.map((skill) => (
                <StackChip key={skill.id}>{skill.title}</StackChip>
              ))}
            </div>
          )}
        </div>

        <aside className="md:w-[232px] md:flex-none">
          <dl className="grid grid-cols-2 gap-4 text-sm md:flex md:flex-col">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#71717A]">{item.label}</dt>
                <dd className="mt-1">{item.value}</dd>
              </div>
            ))}
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#71717A]">Status</dt>
              <dd className="mt-1 flex items-center gap-1.5">
                <span className={`h-[7px] w-[7px] rounded-full ${isLive(project) ? "bg-[#10B981]" : "bg-[#A1A1AA]"}`} />
                {isLive(project) ? "Live" : "Private"}
              </dd>
            </div>
          </dl>
          {isLive(project) && (
            <>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#18181B] text-sm font-medium text-white transition-colors hover:bg-[#3F3F46]"
              >
                Visit site
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <p className="mt-2.5 text-center font-mono text-xs text-[#71717A]">{hostOf(project.link)}</p>
            </>
          )}
        </aside>
      </div>

      <div className="flex h-[60px] flex-none items-center justify-between gap-3 border-t border-[#E4E4E7] px-4 text-sm md:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex min-w-0 items-center gap-2 text-[#52525B] hover:text-[#18181B]"
        >
          <ChevronLeft className="h-4 w-4 flex-none" aria-hidden />
          <span className="truncate">{prev.title}</span>
        </button>
        <span className="hidden flex-none font-mono text-xs text-[#71717A] sm:inline">
          {index + 1} / {projects.length} · esc to close
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex min-w-0 items-center gap-2 font-medium text-[#18181B]"
        >
          <span className="truncate">{next.title}</span>
          <ChevronRight className="h-4 w-4 flex-none" aria-hidden />
        </button>
      </div>
    </DialogContent>
  );
}

export default function ProProjects() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Section
      id="projects"
      eyebrow="02 · Projects"
      title="Selected work"
      className="border-b bg-[#FAFAFA]"
      aside={
        <p className="text-sm text-[#71717A]">{projects.length} projects · client work &amp; personal</p>
      }
    >
      <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(min(100%,420px),1fr))] gap-4 md:mt-10 md:gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} onOpen={() => setSelected(index)} />
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        {selected !== null && <ProjectModal index={selected} onIndexChange={setSelected} />}
      </Dialog>
    </Section>
  );
}
