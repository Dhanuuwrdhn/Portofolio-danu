export type Project = {
  id: number;
  title: string;
  company: string;
  date: string;
  description: string;
  skills?: { id: number; title: string }[];
  type: "paid" | "freelance" | "personal";
  link: string;
  imageUrl: string;
};

export const projects: Project[] = [
  {
    id: 11,
    title: "SPEKTRA",
    company: "Bornworks · PLN UIW Banten",
    date: "2026-01-01",
    description:
      "Sistem Pemantauan Kerawanan Transmisi: a monitoring platform for transmission-tower vulnerability at PLN UIW Banten. Field teams see towers, substations and transmission lines on an interactive map, log inspections, and flag towers that need attention, with role-based access for admins and technicians.",
    skills: [
      { id: 1, title: "Next.js" },
      { id: 2, title: "NestJS" },
      { id: 3, title: "Prisma" },
      { id: 4, title: "PostgreSQL" },
      { id: 5, title: "Leaflet" },
    ],
    type: "freelance",
    link: "https://spektra.biz.id/login",
    imageUrl: "/photos/spektra.webp",
  },
  {
    id: 12,
    title: "Invoice·PDF",
    company: "Bornworks",
    date: "2026-01-01",
    description:
      "An invoice builder for Indonesian freelancers and consultants. Users fill in sender, client and line items, then download a proper Indonesian invoice as PDF, complete with the amount in words (terbilang), payment terms (termin), PPN and a signature block, with user accounts to sign in.",
    skills: [
      { id: 1, title: "Next.js" },
      { id: 2, title: "NestJS" },
      { id: 3, title: "PDF Generation" },
    ],
    type: "freelance",
    link: "https://invoice.bornworks.biz.id",
    imageUrl: "/photos/invoice-pdf.webp",
  },
  {
    id: 1,
    title: "E-statement FDR",
    company: "PT Global Innovation Technology",
    date: "2023-12-01",
    description:
      "Enhanced and optimized the E-statement system for FDR motorcycle parts distributors in Bandung. Implemented automated monthly statement generation scheduling, improving the efficiency of distributor billing processes. Key improvements included code optimization and automated scheduling for the 1st of each month.",
    skills: [
      { id: 1, title: "Spring Boot" },
      { id: 2, title: "Scheduling" },
      { id: 3, title: "System Optimization" },
    ],
    type: "paid",
    link: "#",
    imageUrl: "/photos/e-statement.jpeg",
  },
  {
    id: 2,
    title: "KejarTugas",
    company: "PT Global Innovation Technology",
    date: "2024-01-01",
    description:
      "KejarTugas is a project management tool designed to streamline task assignments, set deadlines, notify team members, and monitor project progress within a single platform. It offers a comprehensive overview of tasks and projects, enhancing team collaboration and productivity.",
    skills: [
      { id: 1, title: "Next.js" },
      { id: 2, title: "React.js" },
      { id: 3, title: "React Native" },
      { id: 4, title: "Laravel" },
      { id: 5, title: "Chakra UI" },
    ],
    type: "paid",
    link: "https://kejartugas.com",
    imageUrl:
      "https://drive.google.com/uc?export=view&id=1sFIS_hazQSbNEkzY9IrkQZU-TdhPwOy-",
  },
  {
    id: 3,
    title: "AI-Powered Monitoring System",
    company: "PT Global Innovation Technology",
    date: "2024-04-01",
    description:
      "Developed an intelligent monitoring system using Grafana integrated with AI capabilities to track and analyze server metrics including memory, RAM, CPU, and storage. Implemented machine learning models for predictive analytics and anomaly detection in system performance.",
    skills: [
      { id: 1, title: "Grafana" },
      { id: 2, title: "Python" },
      { id: 3, title: "LLM" },
      { id: 4, title: "AI Integration" },
    ],
    type: "paid",
    link: "#",
    imageUrl: "/photos/grafana.jpeg",
  },
  {
    id: 4,
    title: "Tukerin",
    company: "PT Global Innovation Technology",
    date: "2024-08-01",
    description:
      "Currently developing Tukerin, an innovative C2C (Consumer-to-Consumer) platform that facilitates item-for-item exchanges between users. Unlike traditional e-commerce, Tukerin focuses on enabling direct barter transactions, where users can match and meet to exchange their items. The platform streamlines the bartering process while ensuring a safe and efficient exchange experience.",
    skills: [
      { id: 1, title: "Golang" },
      { id: 2, title: "React Native" },
      { id: 3, title: "Geolocation" },
      { id: 4, title: "Real-time Chat" },
      { id: 5, title: "Match System" },
    ],
    type: "paid",
    link: "#",
    imageUrl: "/photos/tukerin.png",
  },
  {
    id: 5,
    title: "AI Customer Service Chatbot",
    company: "PT Global Innovation Technology",
    date: "2025-04-01",
    description:
      "Leading the development of an AI-powered customer service chatbot for motorcycle spare parts management. The system efficiently handles order management, generates pre-order tickets, and seamlessly integrates with human CS agents for sales order processing. Implemented advanced NLP capabilities to understand customer inquiries and automate response handling.",
    skills: [
      { id: 1, title: "Python" },
      { id: 2, title: "LLM" },
      { id: 3, title: "NLP" },
      { id: 4, title: "Tech Leadership" },
      { id: 5, title: "API Integration" },
    ],
    type: "paid",
    link: "#",
    imageUrl: "/photos/chatbot.svg",
  },
  {
    id: 6,
    title: "Invoice OCR System",
    company: "PT Global Innovation Technology",
    date: "2025-04-01",
    description:
      "Developing an advanced OCR system to automate invoice processing and SAP data entry. The system utilizes computer vision and machine learning to extract relevant information from invoices and automatically populate SAP systems, significantly reducing manual data entry and improving accuracy.",
    skills: [
      { id: 1, title: "Python" },
      { id: 2, title: "OCR" },
      { id: 3, title: "Computer Vision" },
      { id: 4, title: "SAP Integration" },
      { id: 5, title: "Machine Learning" },
    ],
    type: "paid",
    link: "#",
    imageUrl: "/photos/ocr.svg",
  },
  {
    id: 7,
    title: "SentralPart.com",
    company: "PT Global Innovation Technology",
    date: "2025-10-01",
    description:
      "Led the development of SentralPart.com as Technical Leader, an automotive parts e-commerce platform connecting distributors and retailers. Served as Fullstack Developer and Middleware Engineer, building a scalable backend with Express.js and a modern, responsive frontend with Next.js. Implemented seamless API integrations and middleware solutions to ensure efficient data flow across the platform.",
    skills: [
      { id: 1, title: "Next.js" },
      { id: 2, title: "Express.js" },
      { id: 3, title: "Middleware" },
      { id: 4, title: "Tech Leadership" },
      { id: 5, title: "Fullstack Development" },
    ],
    type: "paid",
    link: "https://sentralpart.com",
    imageUrl: "/photos/LogoSentralPart-Horizontal.svg",
  },
  {
    id: 9,
    title: "Bornworks Landing Page",
    company: "Bornworks",
    date: "2026-04-01",
    description:
      "Designed and developed a modern landing page for Bornworks, a digital product studio focused on building web apps, mobile apps, and SaaS platforms. Features a clean, conversion-focused layout with service highlights, portfolio showcase, and contact integration.",
    skills: [
      { id: 1, title: "Next.js" },
      { id: 2, title: "React.js" },
      { id: 3, title: "Tailwind CSS" },
      { id: 4, title: "UI/UX Design" },
    ],
    type: "freelance",
    link: "https://bornworks.biz.id",
    imageUrl: "/photos/bornworks.webp",
  },
  {
    id: 8,
    title: "UMKM App",
    company: "PT Global Innovation Technology",
    date: "2025-05-01",
    description:
      "Developed a mobile Point of Sale (POS) application tailored for Indonesian SMEs (UMKM). The app enables business owners to manage sales transactions, track inventory and storage in real-time, and gain insights into their business operations. Built with React Native for a seamless cross-platform mobile experience and Express.js for a robust backend API handling product catalogs, stock management, and transaction processing.",
    skills: [
      { id: 1, title: "React Native" },
      { id: 2, title: "Express.js" },
      { id: 3, title: "Mobile Development" },
      { id: 4, title: "Inventory Management" },
      { id: 5, title: "POS System" },
    ],
    type: "paid",
    link: "#",
    imageUrl: "/photos/umkm-app.svg",
  },
];

const TYPE_SUMMARY_LABELS: Record<Project["type"], string> = {
  paid: "client",
  freelance: "freelance",
  personal: "personal",
};

// e.g. "client & freelance": built from the types actually present, so it never lists an empty one
export const projectTypeSummary = (() => {
  const labels = (Object.keys(TYPE_SUMMARY_LABELS) as Project["type"][])
    .filter((type) => projects.some((project) => project.type === type))
    .map((type) => TYPE_SUMMARY_LABELS[type]);
  return labels.length > 1
    ? `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]}`
    : labels.join("");
})();
