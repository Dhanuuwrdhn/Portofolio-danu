"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Layout from "@/app/components/Layout";
import Terminal from "@/app/components/Terminal/Terminal";
import FloatingButton from "@/app/components/FloatingButton";
import About from "@/app/components/About";
import Experiences from "@/app/components/Experiences";
import Projects from "@/app/components/Projects";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { PatternBackground } from "@/components/ui/pattern-background";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [initialMessageComplete, setInitialMessageComplete] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(0);
  const [terminalWidth, setTerminalWidth] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleBannerComplete = useCallback(() => {
    setShowContent(true);
    setInitialMessageComplete(true);
  }, []);

  useEffect(() => {
    const updateTerminalDimensions = () => {
      if (terminalRef.current) {
        setTerminalHeight(terminalRef.current.offsetHeight);
        setTerminalWidth(terminalRef.current.offsetWidth);
      }
    };

    updateTerminalDimensions();
    window.addEventListener("resize", updateTerminalDimensions);

    return () => {
      window.removeEventListener("resize", updateTerminalDimensions);
    };
  }, []);

  return (
    <main
      id="top"
      className="min-h-screen bg-[#10151D] selection:bg-[#FFA23E]/20 selection:text-[#FFA23E] relative"
    >
      <PatternBackground />
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-56 2xl:px-64">
          <Navbar terminalHeight={terminalHeight} />
          <div className="w-full">
            <motion.div
              ref={terminalRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-full backdrop-blur-sm"
            >
              <Terminal onBannerComplete={handleBannerComplete} />
            </motion.div>

            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full h-auto mt-8 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-10 2xl:px-12"
                >
                  <FloatingButton
                    terminalWidth={terminalWidth}
                    initialMessageComplete={initialMessageComplete}
                  />
                  <div className="space-y-24">
                    <motion.div
                      id="about"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <About />
                    </motion.div>
                    <motion.div
                      id="experiences"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <Experiences />
                    </motion.div>
                    <motion.div
                      id="projects"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <Projects />
                    </motion.div>
                  </div>
                  <Footer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Layout>
      <Toaster position="top-center" />
    </main>
  );
}
