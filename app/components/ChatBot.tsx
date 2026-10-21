"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { predefinedQuestions } from "@/app/data/chatbots";

import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

// Global utility outside component
function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 50
) {
  let t: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Karen 🤖, Danu's AI assistant. Ask me anything about him, or pick a question below!", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const questionContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lastMessageTime, setLastMessageTime] = useState(0);

  const scrollToBottom = useRef(
    debounce(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        ) as HTMLElement | null;
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
      }
    }, 50)
  ).current;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Close chatbot on Escape key
  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [handleEscapeKey]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
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
        setMessages((prev) => [
          ...prev,
          { text: predefined.answer, isUser: false },
        ]);
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
            text:
              data.response ||
              "Sorry, I couldn't process that. Please try again.",
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Sorry, something went wrong. Please try again or pick a question below.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (questionContainerRef.current?.offsetLeft || 0));
    setScrollLeft(questionContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (questionContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1;
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full p-2 bg-[#131821]/80 backdrop-blur-lg border-[2px] border-[#273344]/50 text-slate-200 transition-all duration-300 hover:border-[#273344] ${
          isOpen ? "bg-[#1c2736]" : ""
        }`}
        variant={isOpen ? "default" : "outline"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        <span className="sr-only">Chat Bot</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-[60] flex h-[min(70vh,500px)] min-h-[420px] w-[min(90vw,400px)] min-h-0 flex-col overflow-hidden rounded-xl border-[2px] border-[#273344] bg-[#131821]/95 shadow-xl backdrop-blur-lg"
          >
            {/* Title Bar */}
            <div className="shrink-0 border-b border-[#273344] bg-[#131821]/80 p-4 backdrop-blur-md">
              <h3 className="text-white font-medium text-center">🤖 Karen <span className="text-xs text-emerald-400 font-normal">• AI Powered</span></h3>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="min-h-0 flex-1" ref={scrollAreaRef}>
              <div className="space-y-3 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={message.isUser ? "text-right" : "text-left"}
                  >
                    <span
                      className={`inline-block max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                        message.isUser
                          ? "bg-[#1c2736] text-slate-200 rounded-br-sm"
                          : "bg-[#273344] text-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                ))}
                {/* Typing indicator */}
                {isLoading && (
                  <div className="text-left">
                    <span className="inline-block rounded-lg bg-[#273344] p-3 text-slate-400 rounded-bl-sm">
                      <span className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking...
                      </span>
                    </span>
                  </div>
                )}
                <div className="h-1" />
              </div>
            </ScrollArea>

            {/* Questions Carousel */}
            <div className="shrink-0 overflow-hidden border-t border-[#273344] bg-[#131821]/50 px-4 pt-3 pb-2">
              <p className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider">Quick questions</p>
              <div
                ref={questionContainerRef}
                className={`flex space-x-2 overflow-x-auto pb-1 ${isLoading ? 'pointer-events-none opacity-70' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ scrollbarWidth: "thin", scrollbarColor: "#273344 transparent", WebkitOverflowScrolling: "touch" }}
                onMouseDown={isLoading ? undefined : handleMouseDown}
                onMouseUp={isLoading ? undefined : handleMouseUp}
                onMouseMove={isLoading ? undefined : handleMouseMove}
                onMouseLeave={isLoading ? undefined : handleMouseUp}
                onTouchStart={isLoading ? undefined : (e) => {
                  setIsDragging(true);
                  setStartX(e.touches[0].pageX - (questionContainerRef.current?.offsetLeft || 0));
                  setScrollLeft(questionContainerRef.current?.scrollLeft || 0);
                }}
                onTouchEnd={isLoading ? undefined : () => setIsDragging(false)}
                onTouchMove={isLoading ? undefined : (e) => {
                  if (!isDragging) return;
                  const x = e.touches[0].pageX - (questionContainerRef.current?.offsetLeft || 0);
                  const walk = (x - startX) * 2;
                  if (questionContainerRef.current) {
                    questionContainerRef.current.scrollLeft = scrollLeft - walk;
                  }
                }}
                role="listbox"
                aria-label="Quick questions"
              >
                {predefinedQuestions.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuestionClick(item.question)}
                    disabled={isLoading}
                    variant="outline"
                    className="whitespace-nowrap flex-shrink-0 bg-[#131821]/50 backdrop-blur-lg border-[1px] border-[#273344]/50 text-slate-200 text-xs disabled:opacity-50"
                  >
                    {item.question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <form
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-[#273344] bg-[#131821]/80 p-3 flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about Danu..."
                disabled={isLoading}
                className="flex-1 bg-[#1c2736] border border-[#273344] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#3b4f6b] transition-colors disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="rounded-lg p-2 bg-[#1c2736] border border-[#273344] text-slate-200 hover:bg-[#273344] disabled:opacity-50 transition-colors"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
