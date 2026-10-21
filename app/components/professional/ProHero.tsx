"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { aboutData, coreStack } from "@/app/data/about";
import { experiences } from "@/app/data/experiences";
import { contactEmail, socialLinks } from "@/app/data/socials";
import ResumeDialog from "./ResumeDialog";
import { RichText, SkillChip } from "./Section";

export default function ProHero() {
  const about = aboutData[0];
  const currentRole = experiences.find(
    (exp) => exp.type === "work" && exp.date.includes("Present")
  );

  return (
    <section id="about" className="scroll-mt-20 pb-20 pt-16 md:pb-24 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {currentRole && (
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {currentRole.title} at {currentRole.company}
          </p>
        )}

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
          Syahrial Danu Wardhana
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-zinc-500 md:text-2xl">
          Software Engineer building web, mobile, and AI-powered products from idea to
          production.
        </p>

        <RichText
          text={about.description}
          className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg"
        />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${contactEmail}`}
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Get in touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <ResumeDialog>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            >
              <FileText className="h-4 w-4" />
              Resume
            </button>
          </ResumeDialog>
          <div className="ml-1 flex items-center gap-1">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            Core stack
          </p>
          <div className="flex flex-wrap gap-2">
            {coreStack.map((skill) => (
              <SkillChip key={skill}>{skill}</SkillChip>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
