"use client";

import { ModeProvider, useMode } from "@/app/components/ModeProvider";
import ProfessionalMode from "@/app/components/professional/ProfessionalMode";
import TerminalMode from "@/app/components/terminal-mode/TerminalMode";

function Portfolio() {
  const { mode } = useMode();
  return mode === "terminal" ? <TerminalMode /> : <ProfessionalMode />;
}

export default function Home() {
  return (
    <ModeProvider>
      <Portfolio />
    </ModeProvider>
  );
}
