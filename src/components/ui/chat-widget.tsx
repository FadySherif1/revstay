"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useChatStream } from "@/components/ui/use-chat-stream";

const TOOLTIP_KEY = "revstay-chat-tooltip-dismissed";

const WELCOME_MESSAGE =
  "Hi! I'm the Revstay Concierge — ask me anything about growing your hotel's bookings, OTA platforms, or hospitality in Egypt. مرحباً! اسألني عن أي شيء يخص الفنادق والحجوزات.";

const STARTER_CHIPS = [
  "How do I rank higher on Booking.com?",
  "What does Revstay do exactly?",
  "إزاي أزود حجوزات فندقي؟",
];

function isRtl(text: string) {
  return /[؀-ۿ]/.test(text);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [input, setInput] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const { messages, sendMessage, isStreaming, error, reset } = useChatStream();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.sessionStorage.getItem(TOOLTIP_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setShowTooltip(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function dismissTooltip() {
    setShowTooltip(false);
    window.sessionStorage.setItem(TOOLTIP_KEY, "1");
  }

  function openWidget() {
    setOpen(true);
    dismissTooltip();
  }

  function handleSend() {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !open && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 max-w-[220px] rounded-2xl border border-ink/10 bg-white-soft px-4 py-3 text-sm text-ink shadow-[var(--shadow-warm)]"
          >
            <button
              type="button"
              aria-label="Dismiss tooltip"
              onClick={dismissTooltip}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink/10 text-ink-soft hover:bg-ink/20"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
            Ask me anything about hotels ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!open && (
        <button
          type="button"
          aria-label="Open Revstay Concierge chat"
          onClick={openWidget}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-gold-ink shadow-[var(--shadow-warm)] transition-transform hover:scale-105"
        >
          <span
            aria-hidden
            className={`absolute inset-0 rounded-full bg-gold-500 ${
              prefersReducedMotion ? "" : "animate-ping motion-reduce:animate-none"
            } opacity-40`}
          />
          <MessageCircle className="relative h-6 w-6" strokeWidth={1.75} />
        </button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Revstay Concierge chat"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-white-soft sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,85vh)] sm:w-[380px] sm:rounded-3xl sm:border sm:border-ink/10 sm:shadow-[var(--shadow-warm)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-gold-500 px-5 py-4 sm:rounded-t-3xl">
              <div>
                <p className="font-serif text-lg text-gold-ink">Revstay Concierge</p>
                <p className="text-xs text-gold-ink/80">Hotels, OTAs & Egyptian hospitality</p>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gold-ink/90 hover:bg-gold-ink/10"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              <div
                dir={isRtl(WELCOME_MESSAGE) ? "rtl" : "ltr"}
                className="max-w-[85%] rounded-2xl rounded-tl-sm border border-ink/10 bg-ivory px-4 py-2.5 text-sm leading-relaxed text-ink-soft"
              >
                {WELCOME_MESSAGE}
              </div>

              {!hasMessages && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      dir={isRtl(chip) ? "rtl" : "ltr"}
                      onClick={() => sendMessage(chip)}
                      className="rounded-full border border-gold-500/30 bg-gold-500/[0.08] px-3 py-1.5 text-xs font-medium text-gold-600 transition-colors hover:bg-gold-500/15"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message) => {
                const rtl = isRtl(message.content);
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      dir={rtl ? "rtl" : "ltr"}
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-tr-sm bg-gold-500/15 text-ink"
                          : "rounded-tl-sm border border-ink/10 bg-ivory text-ink-soft"
                      }`}
                    >
                      {message.content || (
                        <span className="inline-flex items-center gap-1 py-0.5">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-mute [animation-delay:-0.3s] motion-reduce:animate-none" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-mute [animation-delay:-0.15s] motion-reduce:animate-none" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-mute motion-reduce:animate-none" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {error && (
                <div className="flex flex-col items-start gap-2 rounded-2xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error-fg">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const last = [...messages].reverse().find((m) => m.role === "user");
                      if (last) sendMessage(last.content);
                    }}
                    className="font-semibold underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-ink/10 p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-ink/10 bg-ivory px-3 py-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about hotels, OTAs, or travel in Egypt…"
                  dir={isRtl(input) ? "rtl" : "ltr"}
                  className="max-h-28 flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-ink-mute focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-gold-ink transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              {hasMessages && (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 text-xs font-medium text-ink-mute underline underline-offset-2 hover:text-gold-600"
                >
                  Start a new conversation
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
