"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { coreStack, summary, tagline } from "@/app/data/about";
import { experiences } from "@/app/data/experiences";
import { socialLinks } from "@/app/data/socials";
import { originOf, useMode } from "@/app/components/ModeProvider";
import ResumeDialog from "./ResumeDialog";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white text-[#18181B] transition-colors hover:bg-[#F4F4F5]";

function TerminalTeaser() {
  const { switchMode } = useMode();
  const ref = useRef<HTMLButtonElement>(null);
  const currentRole = experiences.find((exp) => exp.date.includes("Present"));

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => switchMode("terminal", originOf(ref.current))}
      className="block w-full overflow-hidden rounded-2xl border border-[#273344] bg-[#10151D] text-left text-[#C8D1DC] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_34px_rgba(24,24,27,0.12)] md:mt-14"
    >
      <div className="flex items-center justify-between border-b border-[#273344] bg-[#131821] px-4 py-3 font-mono text-xs text-[#7D8A9C]">
        <span>~/danu.me</span>
        <span className="text-[#10B981]">terminal</span>
      </div>
      <div className="px-4 pb-5 pt-[18px] font-mono text-[12.5px] leading-[1.75] sm:text-[13px]">
        <div>
          <span className="text-[#FFA23E]">visitor@Danu.me:~$</span> <span className="text-[#F4F4F5]">whois</span>
        </div>
        <div className="text-[#F4F4F5]">Syahrial Danu Wardhana</div>
        <div className="text-[#7D8A9C]">Software Engineer · web / mobile / AI</div>
        {currentRole && <div className="text-[#7D8A9C]">{currentRole.company} · Indonesia</div>}
        <div className="mt-1.5">
          <span className="text-[#FFA23E]">visitor@Danu.me:~$</span>{" "}
          <span className="animate-cursor-blink inline-block h-[15px] w-2 bg-[#10B981] align-[-3px]" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[#273344] px-4 py-3.5 font-sans text-[13px]">
        <span className="text-[#A1ABB8]">Prefer the command line?</span>
        <span className="font-medium text-[#10B981]">Open terminal →</span>
      </div>
    </button>
  );
}

export default function ProHero() {
  const currentRole = experiences.find((exp) => exp.date.includes("Present"));

  return (
    <section id="about" className="scroll-mt-16 px-5 pb-12 pt-10 sm:px-6 md:pb-[88px] md:pt-24">
      <div className="mx-auto flex max-w-5xl flex-wrap items-start gap-7 md:gap-12">
        <div className="min-w-0 flex-[999_1_520px]">
          {currentRole && (
            <motion.div
              {...fadeUp(0.06)}
              className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] py-1.5 pl-2.5 pr-3 text-[13px] text-[#52525B]"
            >
              <span className="animate-status-pulse h-2 w-2 rounded-full bg-[#10B981]" />
              <span>
                Currently at <strong className="font-semibold text-[#18181B]">{currentRole.company}</strong>
              </span>
            </motion.div>
          )}

          <motion.div {...fadeUp(0.12)}>
            <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] md:mt-6 md:text-6xl">
              Syahrial Danu Wardhana
            </h1>
          </motion.div>

          <motion.div {...fadeUp(0.18)}>
            <p className="mt-4 max-w-[620px] text-lg leading-[1.45] tracking-[-0.01em] text-[#3F3F46] md:mt-5 md:text-[22px]">
              {tagline}
            </p>
            <p className="mt-3 max-w-[560px] text-[15px] leading-[1.7] text-[#71717A] md:mt-4 md:text-base">
              {summary}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2.5 md:mt-8 md:flex md:flex-wrap md:items-center md:gap-3">
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#18181B] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[#3F3F46] md:h-[46px]"
              >
                Get in touch
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <ResumeDialog>
                <button type="button" className={`${outlineButton} h-12 px-[18px] text-[15px] font-medium md:h-[46px]`}>
                  <FileText className="h-4 w-4" aria-hidden />
                  Resume
                </button>
              </ResumeDialog>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-[#E4E4E7] md:block" />
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={`${outlineButton} h-11 text-sm md:h-[46px] md:w-[46px]`}
              >
                <FaGithub className="h-[18px] w-[18px]" aria-hidden />
                <span className="md:hidden">GitHub</span>
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`${outlineButton} h-11 text-sm md:h-[46px] md:w-[46px]`}
              >
                <FaLinkedin className="h-[18px] w-[18px]" aria-hidden />
                <span className="md:hidden">LinkedIn</span>
              </a>
            </div>

            <div className="mt-8 md:mt-11">
              <p className="mb-2.5 font-mono text-xs uppercase tracking-[0.08em] text-[#71717A] md:mb-3">
                Core stack
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {coreStack.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-[9px] border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 py-1.5 font-mono text-xs text-[#3F3F46] md:px-[11px] md:py-[7px] md:text-[13px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.24)} className="flex w-full flex-[1_1_340px]">
          <TerminalTeaser />
        </motion.div>
      </div>
    </section>
  );
}
