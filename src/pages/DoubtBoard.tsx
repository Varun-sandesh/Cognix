import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Tag,
  Bot,
  User,
  Plus,
  X,
  Filter,
  ArrowUp,
} from "lucide-react";

interface Doubt {
  id: string;
  title: string;
  description: string;
  author: string;
  authorType: "student" | "faculty";
  department: string;
  tags: string[];
  createdAt: Date;
  status: "open" | "answered" | "resolved";
  upvotes: number;
  responses: DoubtResponse[];
}

interface DoubtResponse {
  id: string;
  content: string;
  author: string;
  authorType: "student" | "faculty" | "ai";
  createdAt: Date;
}

const initialDoubts: Doubt[] = [
  {
    id: "1",
    title: "How to access IEEE papers from off-campus?",
    description:
      "I need to access IEEE Xplore papers for my research project but I'm working from home. How do I set up VPN access?",
    author: "Arjun Patel",
    authorType: "student",
    department: "Computer Science",
    tags: ["Library", "Research", "VPN"],
    createdAt: new Date(Date.now() - 3600000),
    status: "answered",
    upvotes: 12,
    responses: [
      {
        id: "r1",
        content:
          "You can access IEEE through our campus VPN. Go to vpn.cognixuni.edu, log in with your student ID, and then navigate to the library's digital resources page. All IEEE, Springer, and ACM databases will be accessible.",
        author: "Prof. Sneha Gupta",
        authorType: "faculty",
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: "r2",
        content:
          "Based on the library rules, remote access to IEEE, Springer, and ACM digital libraries is available through VPN with student credentials. You get access to all subscribed databases from any location.",
        author: "Cognix AI",
        authorType: "ai",
        createdAt: new Date(Date.now() - 2400000),
      },
    ],
  },
  {
    id: "2",
    title: "When is the deadline for mid-semester project submission?",
    description:
      "I'm confused about the deadlines for the Data Structures project. The syllabus says March 15 but the LMS shows March 18. Which one is correct?",
    author: "Neha Singh",
    authorType: "student",
    department: "Computer Science",
    tags: ["Academics", "Deadlines", "Data Structures"],
    createdAt: new Date(Date.now() - 7200000),
    status: "open",
    upvotes: 8,
    responses: [],
  },
  {
    id: "3",
    title: "Lab equipment booking process for the IoT Lab",
    description:
      "What's the process to book equipment from the IoT Lab for our final year project? Do we need faculty approval first?",
    author: "Rahul Verma",
    authorType: "student",
    department: "Electronics & Communication",
    tags: ["Lab", "Equipment", "IoT"],
    createdAt: new Date(Date.now() - 14400000),
    status: "resolved",
    upvotes: 5,
    responses: [
      {
        id: "r3",
        content:
          "Yes, you need your project guide's approval. Fill out the Lab Equipment Request form available at the CSB reception, get it signed by your guide, and submit it to the lab coordinator. Booking is confirmed within 24 hours.",
        author: "Dr. Priya Nair",
        authorType: "faculty",
        createdAt: new Date(Date.now() - 10800000),
      },
    ],
  },
  {
    id: "4",
    title: "Guest lecture schedule for this semester?",
    description: "Are there any industry guest lectures planned for this semester? I'd love to attend talks related to AI/ML.",
    author: "Divya Rao",
    authorType: "student",
    department: "Information Technology",
    tags: ["Events", "Guest Lecture", "AI/ML"],
    createdAt: new Date(Date.now() - 28800000),
    status: "open",
    upvotes: 15,
    responses: [
      {
        id: "r4",
        content:
          "Great question! We have TechFest 2026 coming up on March 15 at the Innovation Hub, which will feature multiple AI/ML talks. Additionally, the Research Symposium on April 5 at the Science Complex will have academic presentations on cutting-edge AI research.",
        author: "Cognix AI",
        authorType: "ai",
        createdAt: new Date(Date.now() - 25200000),
      },
    ],
  },
];

const statusConfig = {
  open: { label: "Open", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  answered: { label: "Answered", icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DoubtBoard() {
  const [doubts, setDoubts] = useState<Doubt[]>(initialDoubts);
  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "answered" | "resolved">("all");

  const filtered = doubts.filter((d) => filterStatus === "all" || d.status === filterStatus);
  const activeDoubt = doubts.find((d) => d.id === selectedDoubt);

  const handleNewDoubt = () => {
    if (!newTitle.trim()) return;
    const newDoubt: Doubt = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      author: "You (Student)",
      authorType: "student",
      department: "Computer Science",
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date(),
      status: "open",
      upvotes: 0,
      responses: [],
    };
    setDoubts([newDoubt, ...doubts]);
    setNewTitle("");
    setNewDesc("");
    setNewTags("");
    setShowNewForm(false);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedDoubt) return;
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === selectedDoubt
          ? {
              ...d,
              status: "answered" as const,
              responses: [
                ...d.responses,
                {
                  id: Date.now().toString(),
                  content: replyText,
                  author: "You",
                  authorType: "student" as const,
                  createdAt: new Date(),
                },
              ],
            }
          : d
      )
    );
    setReplyText("");
  };

  const handleUpvote = (id: string) => {
    setDoubts((prev) => prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d)));
  };

  return (
    <div className="flex h-full">
      {/* Left: List */}
      <div className={`flex flex-col border-r border-border ${selectedDoubt ? "hidden lg:flex" : "flex"} w-full lg:w-96`}>
        {/* Header */}
        <div className="border-b border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Doubt Board</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live • Real-time updates
              </p>
            </div>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 glow-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              New Doubt
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5">
            {(["all", "open", "answered", "resolved"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-full px-3 py-1 text-[10px] font-medium capitalize transition-colors ${
                  filterStatus === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* New doubt form */}
        <AnimatePresence>
          {showNewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Doubt title..."
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your doubt..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none resize-none"
                />
                <input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Tags (comma-separated)"
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={handleNewDoubt} className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
                    Post Doubt
                  </button>
                  <button onClick={() => setShowNewForm(false)} className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doubts list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((doubt) => {
            const status = statusConfig[doubt.status];
            return (
              <button
                key={doubt.id}
                onClick={() => setSelectedDoubt(doubt.id)}
                className={`w-full text-left border-b border-border p-4 hover:bg-secondary/30 transition-colors ${
                  selectedDoubt === doubt.id ? "bg-secondary/50 border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(doubt.id);
                    }}
                    className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0 pt-0.5"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium">{doubt.upvotes}</span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">{doubt.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 ${status.bg} ${status.color}`}>
                        <status.icon className="h-2.5 w-2.5" />
                        {status.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{doubt.responses.length} replies</span>
                      <span className="text-[10px] text-muted-foreground">• {formatTimeAgo(doubt.createdAt)}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {doubt.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Detail */}
      <div className={`flex-1 flex flex-col ${selectedDoubt ? "flex" : "hidden lg:flex"}`}>
        {activeDoubt ? (
          <>
            {/* Detail header */}
            <div className="border-b border-border p-4 lg:p-6">
              <button
                onClick={() => setSelectedDoubt(null)}
                className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground lg:hidden"
              >
                ← Back to list
              </button>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-display text-lg font-bold text-foreground">{activeDoubt.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">by {activeDoubt.author}</span>
                    <span className="text-xs text-muted-foreground">• {activeDoubt.department}</span>
                    <span className="text-xs text-muted-foreground">• {formatTimeAgo(activeDoubt.createdAt)}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 ${statusConfig[activeDoubt.status].bg} ${statusConfig[activeDoubt.status].color}`}
                >
                  {statusConfig[activeDoubt.status].label}
                </span>
              </div>
              <p className="mt-3 text-sm text-secondary-foreground">{activeDoubt.description}</p>
              <div className="flex gap-1.5 mt-3">
                {activeDoubt.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Responses */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6 space-y-4">
              {activeDoubt.responses.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No responses yet. Be the first to help!</p>
                </div>
              )}
              {activeDoubt.responses.map((res) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      res.authorType === "ai" ? "bg-primary/10" : res.authorType === "faculty" ? "bg-accent/10" : "bg-secondary"
                    }`}
                  >
                    {res.authorType === "ai" ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 glass-card p-3 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{res.author}</span>
                      <span
                        className={`text-[9px] rounded-full px-1.5 py-0.5 ${
                          res.authorType === "ai"
                            ? "bg-primary/10 text-primary"
                            : res.authorType === "faculty"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {res.authorType === "ai" ? "AI" : res.authorType === "faculty" ? "Faculty" : "Student"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{formatTimeAgo(res.createdAt)}</span>
                    </div>
                    <p className="text-sm text-secondary-foreground">{res.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reply input */}
            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleReply();
                }}
                className="flex gap-2"
              >
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a response..."
                  className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 glow-primary"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Select a doubt to view details and responses</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
