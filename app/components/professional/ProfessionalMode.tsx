"use client";

import { ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ChatBot from "@/app/components/ChatBot";
import { useMode } from "@/app/components/ModeProvider";
import { contactEmail, socialLinks } from "@/app/data/socials";
import { Toaster } from "@/components/ui/sonner";
import ProExperience from "./ProExperience";
import ProHero from "./ProHero";
import ProNavbar from "./ProNavbar";
import ProProjects from "./ProProjects";

function ProContact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-zinc-200 py-20 md:py-24">
      <div className="rounded-3xl bg-zinc-900 px-6 py-12 text-white sm:px-12 md:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
          03 — Contact
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
          Have a product in mind? Let&apos;s build it together.
        </h2>
        <p className="mt-4 max-w-xl text-zinc-400">
          I&apos;m open to new opportunities and collaborations. The fastest way to reach me
          is by email.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${contactEmail}`}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            {contactEmail}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400"
          >
            <FaLinkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ProfessionalMode() {
  const { setMode } = useMode();

  return (
    <div
      id="top"
      className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-emerald-100 selection:text-emerald-900"
    >
      <ProNavbar onSwitchMode={() => setMode("terminal")} />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <ProHero />
        <ProExperience />
        <ProProjects />
        <ProContact />
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Syahrial Danu. All rights reserved.</p>
          <button
            type="button"
            onClick={() => setMode("terminal")}
            className="font-mono text-xs transition-colors hover:text-zinc-900"
          >
            {">_"} prefer the command line? Try terminal mode
          </button>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
