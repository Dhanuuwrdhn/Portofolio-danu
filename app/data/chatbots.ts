// chatbots.ts

// Define the type for predefinedQuestions
interface Question {
  question: string;
  answer: string;
}

export const predefinedQuestions: Question[] = [
  {
    question: 'Who is Danu?',
    answer:
      'Syahrial Danu is a Fullstack Developer from Indonesia. He graduated with a degree in Informatics from Universitas Budiluhur, specializing in Expert Programming. He started his career as a Mobile Developer intern at PT Media Kreasi Abadi, then grew into a Technical Leader at PT Global Innovation Technology managing 8 projects, and is currently a Mid Software Engineer (Fullstack) at Sprout Digital Labs.',
  },
  {
    question: "What's your tech stack?",
    answer:
      'Danu works with a wide range of technologies: Flutter, Next.js, NestJS, and Express.js for his current role. He also has experience with React Native, Spring Boot, Laravel, Golang, Python, Grafana, and AI integrations (Faiss, LLM). He is comfortable working across mobile, web, and backend development.',
  },
  {
    question: 'What projects have you built?',
    answer:
      'Some notable projects include: SentralPart.com (automotive parts e-commerce), UMKM App (mobile POS with inventory management), E-statement FDR (motorcycle parts management), KejarTugas (project management tool), AI-Powered Grafana Monitoring System, Tukerin (C2C marketplace), and an OCR System. You can check the Projects section for more details!',
  },
  {
    question: 'Are you open for freelance?',
    answer:
      "Yes! Danu is open for freelance projects, remote work, and business collaborations. For any opportunities, please contact him directly via email at Dhanuwardhan12@gmail.com. He's experienced in fullstack web development, mobile apps, and backend systems.",
  },
  {
    question: 'Where do you currently work?',
    answer:
      'Danu is currently working as a Mid Software Engineer (Fullstack) at Sprout Digital Labs since February 2025. He works with Flutter, NestJS, and Next.js to build and maintain the platform.',
  },
  {
    question: 'Leadership experience?',
    answer:
      'At PT Global Innovation Technology (Dec 2023 - Feb 2025), Danu served as Technical Leader managing 8 key projects. He led the development of SentralPart.com as a fullstack developer and middleware engineer, and oversaw teams working on mobile apps, AI initiatives, and internal tools using Waterfall methodology.',
  },
  {
    question: 'How can I contact you?',
    answer:
      'You can reach Danu through: Email — Dhanuwardhan12@gmail.com, LinkedIn — linkedin.com/in/dhanuwardhana, or GitHub — github.com/Dhanuuwrdhn. Feel free to connect!',
  },
]

// AI chat is now handled via /api/chat route (server-side)
// Predefined questions above are used for quick-access buttons
