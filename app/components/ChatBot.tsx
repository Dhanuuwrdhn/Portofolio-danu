"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, ChevronDown, RotateCcw, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { predefinedQuestions } from "@/app/data/chatbots";

import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

type ChatTheme = "light" | "dark";

interface ChatBotProps {
  theme?: ChatTheme;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Lifts the launcher above a bottom toolbar, as in the terminal view
  raised?: boolean;
}

const greeting: Message[] = [
  { text: "Hi, I'm Karen.", isUser: false },
  {
    text: "I can tell you about Danu's work, projects, or how to reach him. What would you like to know?",
    isUser: false,
  },
];

const themes = {
  light: {
    launcher:
      "bg-[#18181B] text-white shadow-[0_12px_32px_rgba(24,24,27,0.22)] font-sans",
    launcherLabel: "Ask Karen",
    panel: "bg-white border-[#E4E4E7] shadow-[0_30px_70px_rgba(24,24,27,0.18)] text-[#18181B] font-sans",
    header: "border-[#F4F4F5]",
    subtitle: "text-[#71717A]",
    iconButton: "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]",
    body: "bg-[#FAFAFA]",
    stamp: "text-[#71717A]",
    botBubble: "bg-white border border-[#E4E4E7] text-[#18181B]",
    userBubble: "bg-[#18181B] text-white",
    chip: "bg-white border-[#E4E4E7] text-[#18181B] hover:border-[#18181B]",
    footer: "border-[#F4F4F5]",
    inputWrap: "border-[#E4E4E7] focus-within:border-[#18181B]",
    input: "text-[#18181B] placeholder:text-[#A1A1AA]",
    disclaimer: "text-[#71717A]",
  },
  dark: {
    launcher:
      "bg-[#131821] border border-[#273344] text-[#F4F4F5] shadow-[0_12px_32px_rgba(0,0,0,0.4)] font-mono",
    launcherLabel: "ask karen",
    panel: "bg-[#131821] border-[#273344] shadow-[0_30px_70px_rgba(0,0,0,0.5)] text-[#F4F4F5] font-mono",
    header: "border-[#273344]",
    subtitle: "text-[#7D8A9C]",
    iconButton: "text-[#7D8A9C] hover:bg-[#1C2430] hover:text-[#F4F4F5]",
    body: "bg-[#10151D]",
    stamp: "text-[#7D8A9C]",
    botBubble: "bg-[#131821] border border-[#273344] text-[#C8D1DC]",
    userBubble: "bg-[#10B981] text-[#052E1F]",
    chip: "bg-[#131821] border-[#273344] text-[#C8D1DC] hover:border-[#10B981]",
    footer: "border-[#273344]",
    inputWrap: "border-[#273344] focus-within:border-[#10B981]",
    input: "text-[#F4F4F5] placeholder:text-[#4B5A6E]",
    disclaimer: "text-[#7D8A9C]",
  },
} satisfies Record<ChatTheme, Record<string, string>>;

export default function ChatBot({ theme = "light", open, onOpenChange, raised = false }: ChatBotProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open]
  );

  const [messages, setMessages] = useState<Message[]>(greeting);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = themes[theme];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Close chatbot on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, setIsOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const sendMessage = async (message: string) => {
    const now = Date.now();
    if (now - lastMessageTime < 3000) {
      toast.error("Please wait a moment before sending another message.");
      return;
    }

    if (!message.trim() || isLoading) return;

    setLastMessageTime(now);
    const userMessage = message.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Check predefined questions first (instant response)
      const predefined = predefinedQuestions.find(
        (item) => item.question.toLowerCase() === userMessage.toLowerCase()
      );

      if (predefined) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay for UX
        setMessages((prev) => [...prev, { text: predefined.answer, isUser: false }]);
      } else {
        // Call AI via API route
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            text: data.response || "Sorry, I couldn't process that. Please try again.",
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again or pick a question above.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const resetChat = () => {
    setMessages(greeting);
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Ask Karen, Danu's AI assistant"}
        className={`fixed right-4 z-50 flex h-[52px] items-center gap-2.5 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5 sm:right-7 ${
          raised ? "bottom-[80px] sm:bottom-[104px]" : "bottom-4 sm:bottom-6 sm:right-6"
        } ${t.launcher} ${isOpen ? "w-[52px] justify-center" : "pl-2 pr-2 sm:pr-5"}`}
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981]">
              <Sparkles className="h-[18px] w-[18px] text-[#052E1F]" aria-hidden />
            </span>
            <span className="hidden sm:inline">{t.launcherLabel}</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Chat with Karen"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className={`fixed right-4 z-50 flex w-[min(400px,calc(100vw-32px))] flex-col overflow-hidden rounded-[20px] border sm:right-6 ${
              raised
                ? "bottom-[144px] h-[min(620px,calc(100dvh-176px))] sm:bottom-[168px] sm:h-[min(620px,calc(100dvh-200px))]"
                : "bottom-[80px] h-[min(660px,calc(100dvh-112px))] sm:bottom-[92px]"
            } ${t.panel}`}
          >
            <header className={`flex flex-none items-center gap-3 border-b py-3.5 pl-4 pr-3.5 ${t.header}`}>
              <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-[#10B981]">
                <Sparkles className="h-[18px] w-[18px] text-[#052E1F]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">Karen</p>
                <p className={`mt-0.5 flex items-center gap-1.5 text-[12.5px] ${t.subtitle}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  Danu&apos;s AI assistant
                </p>
              </div>
              <button
                type="button"
                onClick={resetChat}
                aria-label="Start a new chat"
                className={`flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors ${t.iconButton}`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chat"
                className={`flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors ${t.iconButton}`}
              >
                <ChevronDown className="h-[18px] w-[18px]" aria-hidden />
              </button>
            </header>

            <div
              ref={scrollRef}
              aria-live="polite"
              className={`flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-[18px] ${t.body}`}
            >
              <span className={`self-center font-mono text-[11px] ${t.stamp}`}>today</span>
              {messages.map((message, index) => (
                <div key={index} className="contents">
                  <div
                    className={`max-w-[85%] whitespace-pre-line px-3.5 py-[11px] text-sm leading-relaxed ${
                      message.isUser
                        ? `self-end rounded-[16px_16px_4px_16px] ${t.userBubble}`
                        : `self-start rounded-[16px_16px_16px_4px] ${t.botBubble}`
                    }`}
                  >
                    {message.text}
                  </div>
                  {index === greeting.length - 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {predefinedQuestions.map((item) => (
                        <button
                          key={item.question}
                          type="button"
                          onClick={() => sendMessage(item.question)}
                          disabled={isLoading}
                          className={`h-8 rounded-full border px-3 text-[13px] font-medium transition-colors disabled:opacity-50 ${t.chip}`}
                        >
                          {item.question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div
                  aria-label="Karen is typing"
                  className={`animate-typing flex gap-1 self-start rounded-[16px_16px_16px_4px] px-3.5 py-[11px] ${t.botBubble}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className={`flex-none border-t px-3.5 pb-2.5 pt-3 ${t.footer}`}>
              <div
                className={`flex items-center gap-2 rounded-[14px] border py-1.5 pl-3.5 pr-1.5 transition-colors ${t.inputWrap}`}
              >
                <label htmlFor="karen-input" className="sr-only">
                  Message Karen
                </label>
                <input
                  id="karen-input"
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Danu's work…"
                  disabled={isLoading}
                  autoComplete="off"
                  className={`min-w-0 flex-1 bg-transparent text-base outline-none sm:text-sm ${t.input}`}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#10B981] text-[#052E1F] transition-opacity disabled:opacity-40"
                >
                  <ArrowUp className="h-[18px] w-[18px]" aria-hidden />
                </button>
              </div>
              <p className={`mt-2 text-center text-[11.5px] ${t.disclaimer}`}>
                Karen is an AI and can make mistakes. Check the resume for details.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
