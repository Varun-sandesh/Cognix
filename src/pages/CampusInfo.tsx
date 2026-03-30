import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Library,
  TreePine,
  Building,
  Plus,
  Clock,
  User,
  Send,
  Filter,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "general", label: "General News", icon: Newspaper, color: "text-primary", bg: "bg-primary/10" },
  { id: "library", label: "Library", icon: Library, color: "text-accent", bg: "bg-accent/10" },
  { id: "ground", label: "Ground / Sports", icon: TreePine, color: "text-success", bg: "bg-success/10" },
  { id: "block", label: "Block / Building", icon: Building, color: "text-warning", bg: "bg-warning/10" },
];

interface CampusPost {
  id: string;
  user_id: string;
  author_name: string;
  college_name: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
}

export default function CampusInfo() {
  const [posts, setPosts] = useState<CampusPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("campus_posts_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "campus_posts" }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("campus_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !user || !profile) return;
    setSubmitting(true);
    const { error } = await supabase.from("campus_posts").insert({
      user_id: user.id,
      author_name: profile.full_name,
      college_name: profile.college_name,
      category,
      title: title.trim(),
      content: content.trim(),
    });
    if (error) {
      toast({ title: "Error", description: "Failed to post. Try again.", variant: "destructive" });
    } else {
      toast({ title: "Posted!", description: "Your info has been shared." });
      setTitle("");
      setContent("");
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (postId: string) => {
    await supabase.from("campus_posts").delete().eq("id", postId);
    toast({ title: "Deleted", description: "Post removed." });
  };

  const filtered = activeCategory === "all" ? posts : posts.filter((p) => p.category === activeCategory);
  const getCat = (id: string) => categories.find((c) => c.id === id) || categories[0];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            Campus <span className="text-gradient">Info Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share and discover campus updates, library hours, ground availability & more
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Share Info"}
        </button>
      </div>

      {/* Post Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's happening?"
                    maxLength={120}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Details</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share the details..."
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !title.trim() || !content.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
            activeCategory === "all"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "glass-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? `${cat.bg} ${cat.color} border border-current/20`
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <cat.icon className="h-3.5 w-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-secondary mb-3" />
              <div className="h-3 w-2/3 rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post, i) => {
            const cat = getCat(post.category);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cat.bg} ${cat.color}`}>
                        <cat.icon className="h-3 w-3" />
                        {cat.label}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  {user?.id === post.user_id && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
