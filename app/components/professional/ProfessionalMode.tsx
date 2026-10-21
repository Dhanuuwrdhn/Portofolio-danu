"use client";

import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ChatBot from "@/app/components/ChatBot";
import { useMode } from "@/app/components/ModeProvider";
import { contactEmail, socialHandles, socialLinks } from "@/app/data/socials";
import { Toaster } from "@/components/ui/sonner";
import ProExperience from "./ProExperience";
import ProHero from "./ProHero";
import ProNavbar from "./ProNavbar";
import ProProjects from "./ProProjects";

const contactRow =
  "flex items-center gap-3 rounded-xl border border-[#3F3F46] px-4 py-3.5 text-[15px] text-white transition-colors hover:border-[#71717A]";

function ProContact() {
  return (
    <section id="contact" className="scroll-mt-16 px-5 py-14 sm:px-6 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-8 rounded-3xl bg-[#18181B] p-7 text-white md:gap-10 md:p-14">
        <div className="min-w-0 flex-[999_1_460px]">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#10B981]">03 · Contact</p>
          <h2 className="mt-3.5 text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[44px]">
            Have a product to build?
            <br />
            Let&apos;s talk.
          </h2>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-7 inline-block break-all text-lg font-medium tracking-[-0.02em] text-white underline decoration-[#10B981] decoration-2 underline-offset-8 md:text-[26px]"
          >
            {contactEmail}
          </a>
        </div>
        <div className="flex w-full flex-[1_1_260px] flex-col gap-2.5">
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={contactRow}>
            <FaLinkedin className="h-[18px] w-[18px]" aria-hidden />
            <span className="flex-1">LinkedIn</span>
            <span className="font-mono text-xs text-[#A1A1AA]">/in/{socialHandles.linkedin}</span>
          </a>
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className={contactRow}>
            <FaGithub className="h-[18px] w-[18px]" aria-hidden />
            <span className="flex-1">GitHub</span>
            <span className="font-mono text-xs text-[#A1A1AA]">@{socialHandles.github}</span>
          </a>
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-3 rounded-xl bg-[#10B981] px-4 py-3.5 text-[15px] font-semibold text-[#052E1F] transition-colors hover:bg-[#34D399]"
          >
            <Mail className="h-[18px] w-[18px]" aria-hidden />
            <span className="flex-1">Send an email</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ProfessionalMode() {
  const { phase } = useMode();
  const folding = phase === "to-terminal";

  return (
    <div
      className="min-h-screen bg-white font-sans text-[#18181B] antialiased selection:bg-[#D1FAE5] selection:text-[#065F46] motion-reduce:transition-none"
      style={{
        // "Fold": the page dims and recedes while the terminal irises in
        opacity: folding ? 0.25 : 1,
        transform: folding ? "scale(0.985)" : "none",
        filter: folding ? "blur(3px)" : "none",
        transformOrigin: "50% 0",
        transition: "opacity 380ms ease, transform 380ms ease, filter 380ms ease",
      }}
    >
      <ProNavbar />

      <main id="main" tabIndex={-1} className="outline-none">
        <ProHero />
        <ProExperience />
        <ProProjects />
        <ProContact />
      </main>

      <footer className="px-5 pb-12 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-[13px] text-[#71717A]">
          <span>© {new Date().getFullYear()} Syahrial Danu Wardhana</span>
          <span className="hidden font-mono text-xs sm:inline">
            press{" "}
            <kbd className="rounded-[5px] border border-b-2 border-[#E4E4E7] px-1.5 py-0.5 font-mono text-[#3F3F46]">
              `
            </kbd>{" "}
            for terminal mode
          </span>
        </div>
      </footer>

      <ChatBot theme="light" />
      <Toaster position="top-center" />
    </div>
  );
}
