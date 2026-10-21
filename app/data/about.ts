export type About = {
  id: number
  heading: string
  description: string
}

export const aboutData: About[] = [
  {
    id: 1,
    heading: 'Howdy! Syahrial Danu here.',
    description:
      'I am a Software Engineer with hands-on experience building web, mobile, and AI-powered solutions from idea to production. My background spans full-stack development, cross-platform mobile engineering, and technical leadership, with a strong focus on delivering products that are scalable, practical, and aligned with real business needs.\n\nOver the years, I have led and contributed to multiple projects across ERP, marketplace, SME applications, automation tools, and customer-facing platforms. I enjoy working across the full product lifecycle, from architecture and development to deployment and optimization, using technologies like Next.js, React, Express.js, Laravel, Flutter, React Native, Kotlin, Docker, and modern CI/CD workflows.',
  },
]

export const tagline =
  'Software Engineer building web, mobile, and AI-powered products from idea to production.'

export const summary =
  "I ship Flutter apps, Next.js platforms and NestJS / Laravel backends, and I've led a delivery team as Technical Leader. I like clean architecture, short feedback loops, and software that actually reaches users."

export const coreStack: string[] = ['Flutter', 'Next.js', 'NestJS', 'React Native', 'Laravel', 'Docker']
