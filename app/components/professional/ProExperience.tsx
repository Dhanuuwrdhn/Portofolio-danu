"use client";

import { FileText } from "lucide-react";
import { experiences } from "@/app/data/experiences";
import type { Experience } from "@/app/data/experiences";
import ResumeDialog from "./ResumeDialog";
import Section, { RichText, StackChip } from "./Section";

const formatRange = (date: string) => date.replace(/\s+-\s+/, " — ");

function TimelineDot({ kind }: { kind: "current" | "past" | "education" }) {
  if (kind === "current") {
    return (
      <span className="absolute -left-1.5 top-[3px] h-[11px] w-[11px] rounded-full bg-[#10B981] shadow-[0_0_0_4px_#D1FAE5] md:top-[5px]" />
    );
  }
  return (
    <span
      className={`absolute -left-1.5 top-[3px] h-[11px] w-[11px] border-2 border-[#D4D4D8] bg-white md:top-[5px] ${
        kind === "education" ? "rounded-[3px]" : "rounded-full"
      }`}
    />
  );
}

function TimelineRow({ experience, last }: { experience: Experience; last: boolean }) {
  const isEducation = experience.type === "education";
  const kind = isEducation ? "education" : experience.date.includes("Present") ? "current" : "past";

  return (
    <li className="flex flex-wrap gap-x-10 gap-y-1.5">
      <div className="hidden flex-[0_0_168px] pt-[3px] font-mono text-[13px] text-[#71717A] md:block">
        {formatRange(experience.date)}
      </div>
      <div
        className={`relative ml-[5px] min-w-0 flex-[999_1_480px] border-l border-[#E4E4E7] pl-6 md:ml-0 md:pl-8 ${
          last ? "pb-2" : "pb-9 md:pb-11"
        }`}
      >
        <TimelineDot kind={kind} />
        <p className="mb-1.5 font-mono text-xs text-[#71717A] md:hidden">{formatRange(experience.date)}</p>
        <h3 className="text-[17px] font-semibold leading-[1.35] tracking-[-0.015em] md:text-lg">
          {experience.title}
        </h3>
        <p className="mt-0.5 text-sm text-[#3F3F46] md:mt-1 md:text-[15px]">{experience.company}</p>
        {!isEducation && (
          <>
            <RichText
              text={experience.description}
              className="mt-2.5 max-w-[620px] text-[14.5px] leading-[1.6] text-[#71717A] md:mt-3 md:text-[15px] md:leading-[1.65]"
            />
            {experience.skills && experience.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4">
                {experience.skills.map((skill) => (
                  <StackChip key={skill.id}>{skill.title}</StackChip>
                ))}
              </div>
            )}
          </>
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
      eyebrow="01 · Experience"
      title="Where I've worked"
      aside={
        <ResumeDialog>
          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-[10px] border border-[#E4E4E7] bg-white px-3.5 text-sm font-medium text-[#18181B] transition-colors hover:bg-[#F4F4F5] sm:inline-flex"
          >
            <FileText className="h-[15px] w-[15px]" aria-hidden />
            View full resume
          </button>
        </ResumeDialog>
      }
    >
      <ol className="mt-8 md:mt-12">
        {work.map((exp) => (
          <TimelineRow key={exp.id} experience={exp} last={false} />
        ))}
      </ol>

      {education.length > 0 && (
        <>
          <h3 className="mb-5 mt-3 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#71717A] md:mb-6 md:mt-6">
            Education
          </h3>
          <ol>
            {education.map((exp, index) => (
              <TimelineRow key={exp.id} experience={exp} last={index === education.length - 1} />
            ))}
          </ol>
        </>
      )}
    </Section>
  );
}
