'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, X, Send, MessageSquareText, Trash2, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Halo! Aku **JaszBot** 🤖, asisten AI-mu di Jasznime.\n\nMau nonton anime apa hari ini? Tulis saja genre, tema, atau cerita yang kamu sukai (misalnya: *\"anime aksi fantasi dengan sihir\"* atau *\"anime komedi romantis anak sekolahan yang lucu\"*), nanti aku carikan rekomendasi terbaik untukmu! ✨"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to list
    const updatedMessages = [...messages, { role: 'user', content: userMessage } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'model', 
            content: `Aduh maaf, terjadi kendala saat memproses: ${data.message || 'Koneksi terputus.'}` 
          }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { 
          role: 'model', 
          content: 'Aduh, sepertinya server JaszBot sedang sibuk. Silakan coba lagi sebentar lagi! 🥺' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Hapus seluruh riwayat percakapan dengan JaszBot?')) {
      setMessages([
        {
          role: 'model',
          content: "Halo! Aku **JaszBot** 🤖, asisten AI-mu di Jasznime.\n\nMau nonton anime apa hari ini? Tulis saja genre, tema, atau cerita yang kamu sukai, nanti aku carikan rekomendasi terbaik untukmu! ✨"
        }
      ]);
    }
  };

  // Helper to parse basic markdown link [label](url), **bold**, and *italic*
  const parseBoldItalic = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...parseItalicOnly(text.substring(lastIndex, match.index)));
      }
      parts.push(<strong key={`bold-${match.index}`} className="font-extrabold text-white">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(...parseItalicOnly(text.substring(lastIndex)));
    }
    return parts;
  };

  const parseItalicOnly = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const italicRegex = /\*([^*]+)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = italicRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<em key={`italic-${match.index}`} className="italic opacity-90">{match[1]}</em>);
      lastIndex = italicRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, lIdx) => {
      if (line.trim() === '') return <div key={lIdx} className="h-2" />;

      let isHeading = false;
      let headingLevel = 0;
      let displayLine = line;

      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        isHeading = true;
        headingLevel = headingMatch[1].length;
        displayLine = headingMatch[2];
      }

      let isListItem = false;
      const listMatch = line.match(/^(\*|-)\s+(.*)$/);
      if (!isHeading && listMatch) {
        isListItem = true;
        displayLine = listMatch[2];
      }

      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(displayLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(...parseBoldItalic(displayLine.substring(lastIndex, match.index)));
        }
        const label = match[1];
        const url = match[2];
        
        parts.push(
          <Link
            key={`link-${match.index}`}
            href={url}
            className="text-primary font-black hover:underline cursor-pointer decoration-primary decoration-2 underline-offset-2"
          >
            {label}
          </Link>
        );
        lastIndex = linkRegex.lastIndex;
      }
      if (lastIndex < displayLine.length) {
        parts.push(...parseBoldItalic(displayLine.substring(lastIndex)));
      }

      if (isHeading) {
        const sizeClass = headingLevel === 1 
          ? "text-lg font-extrabold text-white mt-3 mb-1.5 block" 
          : headingLevel === 2 
            ? "text-base font-extrabold text-white mt-2.5 mb-1 block"
            : "text-sm font-extrabold text-white mt-2 mb-1 block";
        return (
          <span key={lIdx} className={sizeClass}>
            {parts}
          </span>
        );
      }

      if (isListItem) {
        return (
          <div key={lIdx} className="pl-4 flex items-start gap-1.5 mb-1.5 text-sm leading-relaxed">
            <span className="text-primary shrink-0 mt-1.5 text-xs">•</span>
            <span className="break-words">{parts}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} className="leading-relaxed mb-1.5 break-words text-sm">
          {parts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button (FAB) Container */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-none">
        {/* Animated Text CTA */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                y: [0, -4, 0],
              }}
              transition={{ 
                opacity: { duration: 0.3, delay: 1 },
                x: { duration: 0.4, delay: 1, type: 'spring' },
                scale: { duration: 0.4, delay: 1, type: 'spring' },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
              exit={{ opacity: 0, x: 20, scale: 0.8, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-base-300/90 backdrop-blur-xl border border-white/10 text-white text-xs font-black shadow-2xl cursor-pointer select-none orange-glow pointer-events-auto group max-w-[200px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Tanya saran anime</span>
              <Sparkles size={12} className="text-primary group-hover:animate-bounce shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-full bg-gradient-to-tr from-primary to-orange-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200 orange-glow border border-white/10 pointer-events-auto shrink-0"
          aria-label="Tanya JaszBot"
          title="Tanya JaszBot"
          whileHover={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1"
              >
                <Sparkles size={24} fill="currentColor" className="animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] glass-panel border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl bg-base-300/80 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-base-200 to-base-300 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2.5 rounded-2xl border border-primary/30">
                  <Bot className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    JaszBot <Sparkles size={12} className="text-primary fill-primary" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-white/40">Asisten Rekomendasi</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                  title="Hapus Percakapan"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  title="Tutup Chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-none bg-black/10">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                      msg.role === 'user'
                        ? 'bg-primary border-primary/20 text-white rounded-tr-none shadow-[0_4px_12px_rgba(239,68,68,0.2)]'
                        : 'bg-white/5 border-white/5 text-white/80 rounded-tl-none'
                    }`}
                  >
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-center gap-2.5 animate-pulse">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-white/50 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span className="text-xs font-medium">JaszBot sedang berpikir...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-base-200/50 border-t border-white/5 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tulis pesan atau tema anime..."
                className="flex-grow bg-base-300 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder-white/30"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-3 rounded-2xl bg-primary disabled:bg-white/5 text-white disabled:text-white/20 transition-all active:scale-95 shrink-0 orange-glow border border-white/5"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
