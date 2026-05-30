"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Shield, Lightbulb } from "lucide-react";
import api, { type CopilotResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: string[];
  mitre?: { tactic: string; technique: string }[];
  confidence?: number;
  timestamp: Date;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I'm CyberOracle AI — your autonomous threat analysis copilot. Ask me about active threats, request incident analysis, or get remediation strategies.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.askCopilot(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        recommendations: response.recommendations,
        mitre: response.mitre_references || undefined,
        confidence: response.confidence,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Unable to process query. Ensure the backend is running.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    "Analyze recent critical threats",
    "What malware indicators should I look for?",
    "Recommend remediation for phishing attack",
    "Show MITRE ATT&CK coverage gaps",
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Bot className="w-7 h-7 text-cyan-400" />
          AI Copilot
        </h1>
        <span className="text-xs glass-card px-2 py-1 text-cyan-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Autonomous Analysis Engine
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[75%] rounded-xl p-4",
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/20"
                  : "glass-card"
              )}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-cyan-400 font-semibold">CyberOracle AI</span>
                    {msg.confidence !== undefined && (
                      <span className="text-[10px] text-slate-500 ml-auto">
                        Confidence: {(msg.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                )}
                <div className="text-sm text-slate-200 whitespace-pre-wrap">{msg.content}</div>

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <Lightbulb className="w-3 h-3" /> Recommendations
                    </div>
                    {msg.recommendations.map((rec, i) => (
                      <div key={i} className="text-xs text-slate-400 pl-4 border-l border-yellow-500/20">
                        {rec}
                      </div>
                    ))}
                  </div>
                )}

                {msg.mitre && msg.mitre.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.mitre.map((m, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                        {m.technique} — {m.tactic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 glass-card max-w-[75%]">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs text-slate-500">Analyzing threat intelligence...</span>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 my-3">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => { setInput(action); }}
              className="glass-card px-3 py-2 text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-3 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask CyberOracle AI..."
          className="flex-1 px-4 py-3 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 disabled:opacity-50 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
