"use client";

import { experiences } from "@/app/data/experiences";
import type { Experience } from "@/app/data/experiences";
import Section, { RichText, SkillChip } from "./Section";

function ExperienceRow({ experience }: { experience: Experience }) {
  return (
    <li className="grid gap-2 py-8 first:pt-0 last:pb-0 md:grid-cols-[180px_1fr] md:gap-10">
      <p className="text-sm tabular-nums text-zinc-500 md:pt-1">{experience.date}</p>
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{experience.title}</h3>
        <p className="text-zinc-600">{experience.company}</p>
        <RichText
          text={experience.description}
          className="mt-4 text-[15px] leading-relaxed text-zinc-600"
        />
        {experience.skills && experience.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {experience.skills.map((skill) => (
              <SkillChip key={skill.id}>{skill.title}</SkillChip>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

export default function ProExperience() {
  const work = experiences.filter((exp) => exp.type === "work");
  const education = experiences.filter((exp) => exp.type === "education");

  return (
    <Section
      id="experience"
      index="01 — Experience"
      title="Where I've worked"
      description="Roles across product teams, client delivery, and technical leadership."
    >
      <ol className="divide-y divide-zinc-200">
        {work.map((exp) => (
          <ExperienceRow key={exp.id} experience={exp} />
        ))}
      </ol>

      {education.length > 0 && (
        <div className="mt-16">
          <h3 className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            Education
          </h3>
          <ol className="divide-y divide-zinc-200">
            {education.map((exp) => (
              <ExperienceRow key={exp.id} experience={exp} />
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}
