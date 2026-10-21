"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Lock } from "lucide-react";
import { projects } from "@/app/data/projects";
import type { Project } from "@/app/data/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Section, { SkillChip } from "./Section";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(new Date(date));

// Logos and illustrations are SVGs and look best padded, screenshots should fill the frame
const isIllustration = (src: string) => src.endsWith(".svg");

function ProjectImage({
  project,
  sizes,
  fitWhole = false,
}: {
  project: Project;
  sizes: string;
  fitWhole?: boolean;
}) {
  const contain = fitWhole || isIllustration(project.imageUrl);
  return (
    <Image
      src={project.imageUrl}
      alt={project.title}
      fill
      sizes={sizes}
      className={contain ? "object-contain p-10" : "object-cover object-top"}
    />
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const hasLiveLink = project.link !== "#";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-100 bg-zinc-50"
        aria-label={`Open details for ${project.title}`}
      >
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <ProjectImage project={project} sizes="(min-width: 768px) 480px, 100vw" />
        </div>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-medium uppercase tracking-wider">
            {project.type === "paid" ? "Client work" : "Personal"}
          </span>
          <span aria-hidden>·</span>
          <span>{formatDate(project.date)}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-zinc-900">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-zinc-600">
          {project.description}
        </p>

        {project.skills && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.skills.slice(0, 4).map((skill) => (
              <SkillChip key={skill.id}>{skill.title}</SkillChip>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-6 text-sm font-medium">
          <button
            type="button"
            onClick={onOpen}
            className="text-zinc-900 underline-offset-4 hover:underline"
          >
            Read more
          </button>
          {hasLiveLink ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-600"
            >
              Visit site
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <Lock className="h-3.5 w-3.5" />
              Private
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProProjects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section
      id="projects"
      index="02 — Projects"
      title="Selected work"
      description="Products I've built or led — from ERP and marketplaces to AI tooling."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={() => setSelected(project)} />
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-zinc-200 bg-white text-zinc-900">
            <DialogHeader>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {selected.company} · {formatDate(selected.date)}
              </p>
              <DialogTitle className="text-2xl font-semibold">{selected.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Project details for {selected.title}
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <ProjectImage project={selected} sizes="(min-width: 768px) 720px, 100vw" fitWhole />
            </div>
            <p className="leading-relaxed text-zinc-600">{selected.description}</p>
            {selected.skills && (
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((skill) => (
                  <SkillChip key={skill.id}>{skill.title}</SkillChip>
                ))}
              </div>
            )}
            {selected.link !== "#" && (
              <div className="flex justify-end">
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                >
                  Visit project
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </Section>
  );
}
