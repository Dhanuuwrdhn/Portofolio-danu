'use client'

import { smoothScroll } from '@/app/utils/smoothScroll'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NavbarProps {
  terminalHeight: number
  onSwitchMode?: () => void
}

export default function Navbar({ terminalHeight, onSwitchMode }: NavbarProps) {
  const [showName, setShowName] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Throttle helper to prevent excessive scroll event firings
  function throttle<Args extends unknown[]>(func: (...args: Args) => void, limit: number) {
    let inThrottle = false

    return (...args: Args) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Show name when scrolled past terminal
      setShowName(scrollPosition > terminalHeight)

      // Show buttons when scrolled past terminal, hide only when at the top
      setShowButtons(scrollPosition > terminalHeight)

      // Determine active section
      const sections = ['about', 'experiences', 'projects']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    const throttledHandleScroll = throttle(handleScroll, 100)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [terminalHeight])

  const navItems = [
    { name: 'About', href: '#about', color: '#10B981' },
    { name: 'Experiences', href: '#experiences', color: '#F43F5E' },
    { name: 'Projects', href: '#projects', color: '#FFA23E' },
  ]

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#10151D] bg-opacity-70 backdrop-blur-md transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ y: showButtons ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showName ? 1 : 0, y: showName ? 0 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <a
              href="#top"
              onClick={(e) => smoothScroll(e, 'top')}
              className="text-white font-bold hover:text-gray-300 transition-colors"
              aria-label="Scroll to top"
            >
              Syahrial Danu
            </a>
          </motion.div>
          <div>
            <div className="ml-4 md:ml-10 flex items-baseline space-x-2 md:space-x-4">
              <AnimatePresence>
                {showButtons &&
                  navItems.map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <a
                        id={`nav-${item.name.toLowerCase()}`}
                        data-testid={`nav-${item.name.toLowerCase()}`}
                        href={item.href}
                        onClick={(e) => smoothScroll(e, item.name.toLowerCase())}
                        className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeSection === item.name.toLowerCase() ? 'border-2' : ''
                        }`}
                        style={{
                          borderColor:
                            activeSection === item.name.toLowerCase() ? item.color : 'transparent',
                        }}
                        aria-label={`Scroll to ${item.name} section`}
                      >
                        {item.name}
                      </a>
                    </motion.div>
                  ))}
                {showButtons && onSwitchMode && (
                  <motion.div
                    key="switch-mode"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      type="button"
                      onClick={onSwitchMode}
                      className="text-slate-400 hover:bg-gray-700 hover:text-[#10B981] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      aria-label="Switch to professional view"
                    >
                      GUI
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
