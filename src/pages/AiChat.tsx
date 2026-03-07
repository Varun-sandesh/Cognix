import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User, Lightbulb, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { searchCampusContext, campusData } from "@/data/campusData";
import { searchStaff } from "@/data/staffData";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Where is the Dean's office?",
  "What are the library rules?",
  "Tell me about upcoming events",
  "How do I contact IT support?",
  "What are the exam dates?",
  "Who teaches AI/ML?",
];

function generateAIResponse(query: string): string {
  const q = query.toLowerCase();

  // Search for staff-related queries
  if (q.includes("who teaches") || q.includes("professor") || q.includes("faculty") || q.includes("staff") || q.includes("teacher")) {
    const searchTerm = q.replace(/who teaches|professor|faculty|staff|teacher|find|search/gi, "").trim();
    const results = searchStaff(searchTerm || "");
    if (results.length > 0) {
      const staffInfo = results
        .map(
          (s) =>
            `### ${s.name}\n- **Title:** ${s.title}\n- **Department:** ${s.department}\n- **Office:** ${s.office}\n- **Hours:** ${s.officeHours}\n- **Specialization:** ${s.specialization.join(", ")}\n- **Email:** ${s.email}`
        )
        .join("\n\n");
      return `I found ${results.length} matching faculty member(s):\n\n${staffInfo}`;
    }
    return "I couldn't find any faculty matching that query. Try browsing the **Staff Directory** for a complete list.";
  }

  // Search campus context
  const contextResults = searchCampusContext(query);
  
  if (contextResults.includes("general information")) {
    // No specific results found, provide helpful response
    return `I'm **Cognix AI**, your campus assistant for **${campusData.universityName}**! 🎓\n\nI can help you with:\n\n- 🏛️ **Building locations** & facilities\n- 📚 **Library rules** & borrowing policies\n- 👨‍💼 **Dean's office hours** & appointments\n- 📞 **Important contacts** & helplines\n- 🎉 **Upcoming events** & activities\n- 📅 **Academic calendar** & exam dates\n- 👩‍🏫 **Faculty information** & office hours\n\nTry asking something specific like *"Where is the library?"* or *"When are the exams?"*`;
  }

  return `Here's what I found:\n\n${contextResults}\n\n---\n*Powered by Cognix RAG — Context retrieved from campus knowledge base.*`;
}

export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 Hello! I'm **Cognix AI**, your intelligent campus assistant.\n\nI have access to the complete knowledge base of **${campusData.universityName}**, including building info, library rules, faculty data, events, and more.\n\nAsk me anything about campus life!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = generateAIResponse(messageText);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `👋 Chat cleared! I'm ready for new questions about **${campusData.universityName}**.`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-md px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-primary">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">Cognix AI Assistant</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                RAG-powered • Campus Context Active
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "assistant" ? "bg-primary/10" : "bg-accent/10"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Sparkles className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-accent" />
                )}
              </div>
              <div
                className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === "assistant"
                    ? "glass-card"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&_h3]:text-foreground [&_h3]:font-display [&_h3]:text-sm [&_strong]:text-foreground [&_li]:text-muted-foreground [&_p]:text-secondary-foreground [&_hr]:border-border [&_em]:text-muted-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <p className={`text-[10px] mt-2 ${msg.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />

        {/* Suggestions (only show if few messages) */}
        {messages.length <= 1 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" />
              Try asking:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/50 backdrop-blur-md p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about campus, library, faculty, events..."
            className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 glow-primary"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Cognix AI uses RAG to retrieve campus context • Responses based on university knowledge base
        </p>
      </div>
    </div>
  );
}
