import { Experience, experiences } from "./experiences"; // Import Experience type
import { projects, Project } from "./projects"; // Import Project type

export const help = [
  "whois",
  "experiences",
  "projects",
  "social",
  "banner",
  "clear",
  "help",
  "su",
];

// Simulate fetching experiences from an API
const fetchExperiences = (): Promise<Experience[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(experiences);
    }, 1000); // Simulate a 1-second delay
  });
};

// Simulate fetching projects from an API
const fetchProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(projects);
    }, 1000); // Simulate a 1-second delay
  });
};

export const handleCommand = async (command: string): Promise<string> => {
  const args = command.trim().split(" ");
  let output = "";

  switch (args[0]) {
    case "whois":
      output = `Hey there! I'm a tech enthusiast with an Information Technology degree from Universitas Budiluhur who loves diving into new technologies.

My playground includes web development, mobile apps, and AI implementation – areas where I get to combine creativity with technical expertise.

I'm particularly fascinated by AI and emerging tech, always eager to explore what's next in these rapidly evolving fields.

Recently, I had the exciting opportunity to lead a development team where we successfully delivered 6 diverse projects, ranging from web platforms to AI-powered monitoring tools.

Whether it's crafting user-friendly interfaces or implementing smart solutions, I'm all about creating technology that makes a real impact.`;
      break;
    case "experiences":
      output = "Fetching experiences...\n";
      const experiencesData = await fetchExperiences();
      output += formatExperiences(experiencesData);
      break;
    case "projects":
      output = "Fetching projects...\n";
      const projectsData = await fetchProjects();
      output += formatProjects(projectsData);
      break;
    case "social":
      output =
        "LinkedIn: https://linkedin.com/in/dhanuwardhana\nGitHub: https://github.com/Dhanuuwrdhn";
      break;
    case "clear":
      return ""; // Clear command is handled separately in the component
    case "cv":
      output =
        "https://drive.google.com/file/d/1d1aNuconWr57IjbvdXAzqjwWf2nxtxl4/view?usp=sharing";
      break;
    case "banner":
      output = banner;
      break;
    case "help":
      output = `Available commands: ${help.join(", ")}`;
      break;
    case "su":
      output = "It doesn't do anything now, but it will be soon. 😏";
      break;
    default:
      output = "Command not found. Type 'help' to see available commands.";
  }

  return output;
};

// Helper function to format experiences
const formatExperiences = (experiences: Experience[]): string => {
  return experiences
    .map((exp) => {
      const skills = exp.skills
        ? exp.skills.map((skill) => skill.title).join(", ")
        : "N/A";
      return `
[ • ] ${exp.title} at ${exp.company}
      Date: ${exp.date}
      Description: ${exp.description}
      Skills: ${skills}
      Type: ${exp.type}
`;
    })
    .join("\n");
};

// Helper function to format projects
const formatProjects = (projects: Project[]): string => {
  return projects
    .map((proj) => {
      const skills = proj.skills
        ? proj.skills.map((skill) => skill.title).join(", ")
        : "N/A";
      return `
[ • ] ${proj.title}
      Date: ${proj.date}
      Description: ${proj.description}
      Skills: ${skills}
      Type: ${proj.type}
      Link: ${proj.link}
`;
    })
    .join("\n");
};

export const banner = `Danu, All rights reserved.

       _____
      |  __ \\
      | |  | | __ _ _ __  _   _
      | |  | |/ _\` | '_ \\| | | |
      | |__| | (_| | | | | |_| |
      |_____/ \\__,_|_| |_|\\__,_|



Welcome to my personal website.
For a list of available commands, type 'help'.
`;

export const initialMessage = `Booting up the terminal ...
Loading the system ...

Loading initial ramdisk ...

[    0.000000]   Website version 0.0.0.1 (buildd@nextjs) (tailwindcss@3.3.3) (shadcnui) Wed  22 13:40:32 2025
[    0.000000]   Command line: BOOT_IMAGE=/boot/vmlinuz-5.4.0-42-generic root=UUID=abcd1234 ro quiet splash
[    0.000000]   AMD AuthenticAMD
...
[    0.246920] ACPI: Core revision 20200120
...
[ OK ] Started GNOME Display Manager.
[ OK ] Reached target Graphical Interface.

Personal Website 0.0.0.1 LTS

my-machine login: visitor
`;
