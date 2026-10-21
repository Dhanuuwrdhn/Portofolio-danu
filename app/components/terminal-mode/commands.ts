import { coreStack, tagline } from "@/app/data/about";
import { experiences } from "@/app/data/experiences";
import { projects } from "@/app/data/projects";
import { contactEmail, resumePdfPath, socialHandles, socialLinks } from "@/app/data/socials";

export type Tone = "tx" | "mu" | "em" | "or" | "wh" | "er";

export type Segment = {
  text: string;
  tone: Tone;
  href?: string;
  download?: boolean;
};

export type LineKind = "normal" | "banner" | "small";

export type Line = {
  segs: Segment[];
  kind?: LineKind;
  indent?: string;
};

export type CommandEffect = "clear" | "gui" | "karen";

export type CommandResult = {
  lines: Line[];
  effect?: CommandEffect;
};

export const TONE_COLORS: Record<Tone, string> = {
  tx: "#C8D1DC",
  mu: "#7D8A9C",
  em: "#10B981",
  or: "#FFA23E",
  wh: "#F4F4F5",
  er: "#F87171",
};

export const PROMPT = "visitor@Danu.me:~$ ";

export const COMMANDS = ["whois", "experiences", "projects", "social", "cv", "gui", "clear", "help"];

const COMMAND_HELP: [string, string][] = [
  ["whois", "who is Danu"],
  ["experiences", "work history & education"],
  ["projects", `selected work (${projects.length})`],
  ["social", "where to find me"],
  ["cv", "preview / download resume"],
  ["gui", "switch to professional view"],
  ["clear", "clear the screen"],
  ["help", "show this list"],
];

const s = (text: string, tone: Tone = "tx"): Segment => ({ text, tone });
const a = (text: string, href: string, extra: Partial<Segment> = {}): Segment => ({
  text,
  tone: "em",
  href,
  ...extra,
});
const line = (segs: Segment[], extra: Omit<Line, "segs"> = {}): Line => ({ segs, ...extra });
const blank = (): Line => line([]);

const ok = (text: string) => line([s("[", "mu"), s("  OK  ", "em"), s("] ", "mu"), s(text)]);

const currentRole = experiences.find((exp) => exp.date.includes("Present"));
const workHistory = experiences.filter((exp) => exp.type === "work");
const education = experiences.filter((exp) => exp.type === "education");

const formatRange = (date: string) => date.replace(/\s+-\s+/, " — ");
const firstParagraph = (text: string) =>
  text.trim().split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, " ");
const yearOf = (date: string) => new Date(date).getFullYear().toString();

// First visit gets the whole boot log, later switches only the last few lines
export function bootSequence(full: boolean): Line[] {
  const lines = [
    line([s("Σ danu.me boot", "wh"), s("  ·  syahrial danu wardhana", "mu")]),
    blank(),
    ok("Mounting /home/danu"),
    ok("Loading profile: software-engineer"),
    ok(`Indexing ~/projects (${projects.length} found)`),
    ok("Starting flutter.engine"),
    ok("Starting next.js + nestjs runtime"),
    ok("Waking karen.ai assistant"),
    ok("Tuning lofi.radio (muted)"),
    blank(),
    line([s("Welcome, visitor.", "em")]),
  ];
  return full ? lines : [ok("Restoring session"), ok("Waking karen.ai assistant"), line([s("Welcome back.", "em")])];
}

const BANNER = [
  "██████╗  █████╗ ███╗   ██╗██╗   ██╗",
  "██╔══██╗██╔══██╗████╗  ██║██║   ██║",
  "██║  ██║███████║██╔██╗ ██║██║   ██║",
  "██║  ██║██╔══██║██║╚██╗██║██║   ██║",
  "██████╔╝██║  ██║██║ ╚████║╚██████╔╝",
  "╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ",
];

export function welcome(): Line[] {
  return [
    ...BANNER.map((row) => line([s(row, "em")], { kind: "banner" })),
    blank(),
    line([
      s("Syahrial Danu Wardhana", "wh"),
      s(currentRole ? ` — ${currentRole.title} @ ${currentRole.company}` : ""),
    ]),
    line([s("Web · Mobile · AI — from idea to production.", "mu")]),
    blank(),
    line([s("Type ", "mu"), s("help", "em"), s(" to list commands, or ", "mu"), s("gui", "em"), s(" for the professional view.", "mu")]),
    blank(),
  ];
}

export function runCommand(raw: string, narrow: boolean): CommandResult {
  const cmd = raw.trim().toLowerCase();
  const out: Line[] = [];
  const label = (text: string, wide: string) => s(narrow ? text : wide, "mu");

  if (cmd === "") return { lines: out };

  if (cmd === "clear") return { lines: out, effect: "clear" };

  if (cmd === "help") {
    out.push(line([s("Available commands", "wh")]));
    COMMAND_HELP.forEach(([name, description]) => {
      out.push(line([s("  " + name.padEnd(14), "em"), s(description, "mu")]));
    });
    out.push(blank());
    out.push(line([s("tip: ", "mu"), s("Tab", "or"), s(" autocompletes, ", "mu"), s("↑ ↓", "or"), s(" browse history", "mu")]));
    return { lines: out };
  }

  if (cmd === "whois" || cmd === "about") {
    out.push(line([s("Syahrial Danu Wardhana", "wh")]));
    if (currentRole) out.push(line([s(`${currentRole.title} @ ${currentRole.company} · ex-Technical Leader`)]));
    out.push(line([s(tagline)]));
    out.push(blank());
    out.push(line([label("stack  ", "  stack    "), s(coreStack.join(" · "))]));
    out.push(line([label("based  ", "  based    "), s("Indonesia")]));
    if (currentRole) {
      out.push(line([label("now    ", "  now      "), s("● ", "em"), s(`${currentRole.title} at ${currentRole.company}`)]));
    }
    return { lines: out };
  }

  if (cmd === "experiences" || cmd === "experience") {
    workHistory.forEach((exp) => {
      const skills = (exp.skills ?? []).map((skill) => skill.title).join(" · ");
      if (narrow) {
        out.push(line([s(formatRange(exp.date), "mu")]));
        out.push(line([s(exp.title, "wh")]));
        out.push(line([s("@ " + exp.company, "em")]));
        out.push(line([s(firstParagraph(exp.description))]));
        if (skills) out.push(line([s(skills, "mu")]));
      } else {
        out.push(line([s(formatRange(exp.date).padEnd(22), "mu"), s(exp.title, "wh"), s(" @ ", "mu"), s(exp.company, "em")]));
        out.push(line([s(firstParagraph(exp.description))], { indent: "22ch" }));
        if (skills) out.push(line([s(skills, "mu")], { indent: "22ch" }));
      }
      out.push(blank());
    });
    if (education.length) {
      out.push(line([s("— education", "mu")]));
      education.forEach((edu) => {
        if (narrow) {
          out.push(line([s(formatRange(edu.date), "mu")]));
          out.push(line([s(edu.title, "wh")]));
          out.push(line([s("@ " + edu.company, "em")]));
        } else {
          out.push(line([s(formatRange(edu.date).padEnd(22), "mu"), s(edu.title, "wh"), s(" @ ", "mu"), s(edu.company, "em")]));
        }
      });
    }
    return { lines: out };
  }

  if (cmd === "projects" || cmd === "ls projects") {
    out.push(line([s(`${projects.length} projects`, "wh"), s(narrow ? "" : "  ·  client work & personal", "mu")]));
    out.push(blank());
    if (!narrow) {
      out.push(line([s("  #  " + "project".padEnd(32) + "type".padEnd(10) + "year".padEnd(6) + "link", "mu")]));
    }
    projects.forEach((project, i) => {
      const n = String(i + 1).padStart(2, "0");
      const type = project.type === "paid" ? "client" : "personal";
      const year = yearOf(project.date);
      const link = project.link !== "#" ? a("↗ live", project.link) : s("private", "mu");
      const skills = (project.skills ?? []).map((skill) => skill.title).join(" · ");
      if (narrow) {
        out.push(line([s(n + " ", "mu"), s(project.title, "wh")]));
        out.push(line([s(`${type} · ${year} · `, "mu"), link], { indent: "3ch" }));
      } else {
        out.push(line([s("  " + n + " ", "mu"), s(project.title.padEnd(32), "wh"), s(type.padEnd(10)), s(year.padEnd(6), "mu"), link]));
        if (skills) out.push(line([s(skills, "mu")], { indent: "5ch", kind: "small" }));
      }
    });
    out.push(blank());
    out.push(line([s("Run ", "mu"), s("gui", "em"), s(" to browse them with screenshots and details.", "mu")]));
    return { lines: out };
  }

  if (cmd === "social" || cmd === "contact") {
    out.push(line([label("linkedin  ", "  linkedin   "), a(`linkedin.com/in/${socialHandles.linkedin}`, socialLinks.linkedin)]));
    out.push(line([label("github    ", "  github     "), a(`github.com/${socialHandles.github}`, socialLinks.github)]));
    out.push(line([label("email     ", "  email      "), a(contactEmail, `mailto:${contactEmail}`)]));
    return { lines: out };
  }

  if (cmd === "cv" || cmd === "resume") {
    out.push(line([s("fetching resume.pdf … ", "mu"), s("done", "em")]));
    out.push(line([s("  → ", "em"), a("open preview", resumePdfPath), s("   ", "mu"), a("download PDF", resumePdfPath, { download: true })]));
    return { lines: out };
  }

  if (cmd === "gui" || cmd === "exit") {
    out.push(line([s("rendering professional view ", "mu"), s("[██████████] 100%", "em")]));
    return { lines: out, effect: "gui" };
  }

  if (cmd === "ls") {
    out.push(line([s("about.md  experiences/  projects/  resume.pdf  social.txt", "or")]));
    return { lines: out };
  }

  if (cmd === "karen") {
    out.push(line([s("karen is listening → opening chat", "mu")]));
    return { lines: out, effect: "karen" };
  }

  if (cmd.startsWith("sudo")) {
    out.push(line([s("[sudo] password for visitor: ", "mu"), s("••••••", "mu")]));
    out.push(line([s("Nice try. You can always just "), a("send an email", `mailto:${contactEmail}`), s(".")]));
    return { lines: out };
  }

  out.push(line([s("command not found: ", "er"), s(cmd, "wh"), s(" — type ", "mu"), s("help", "em"), s(" to see what I can do.", "mu")]));
  return { lines: out };
}
