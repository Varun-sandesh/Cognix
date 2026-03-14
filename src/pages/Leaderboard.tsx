import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Crown,
  Code2,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Star,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  college_name: string;
  roll_number: string;
  leetcode_username: string;
  gfg_username: string;
  codeforces_username: string;
  leetcode_score: number;
  gfg_score: number;
  codeforces_score: number;
  total_score: number;
}

const platformConfig = {
  leetcode: { label: "LeetCode", color: "text-warning", bg: "bg-warning/10", url: "https://leetcode.com/u/" },
  gfg: { label: "GeeksforGeeks", color: "text-success", bg: "bg-success/10", url: "https://www.geeksforgeeks.org/user/" },
  codeforces: { label: "CodeForces", color: "text-primary", bg: "bg-primary/10", url: "https://codeforces.com/profile/" },
};

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-warning" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-warning/60" />;
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
}

function getRankBg(rank: number) {
  if (rank === 1) return "border-warning/30 bg-gradient-to-r from-warning/5 to-transparent";
  if (rank === 2) return "border-muted-foreground/20 bg-gradient-to-r from-muted/20 to-transparent";
  if (rank === 3) return "border-warning/15 bg-gradient-to-r from-warning/3 to-transparent";
  return "";
}

export default function Leaderboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [leetcode, setLeetcode] = useState("");
  const [gfg, setGfg] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [lcScore, setLcScore] = useState("");
  const [gfgScore, setGfgScore] = useState("");
  const [cfScore, setCfScore] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (profile) {
      setLeetcode(profile.leetcode_username || "");
      setGfg(profile.gfg_username || "");
      setCodeforces(profile.codeforces_username || "");
      setLcScore(profile.leetcode_score?.toString() || "0");
      setGfgScore(profile.gfg_score?.toString() || "0");
      setCfScore(profile.codeforces_score?.toString() || "0");
    }
  }, [profile]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .gt("total_score", 0)
      .order("total_score", { ascending: false });
    if (!error && data) setEntries(data as LeaderboardEntry[]);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const total = (parseInt(lcScore) || 0) + (parseInt(gfgScore) || 0) + (parseInt(cfScore) || 0);
    const { error } = await supabase
      .from("profiles")
      .update({
        leetcode_username: leetcode,
        gfg_username: gfg,
        codeforces_username: codeforces,
        leetcode_score: parseInt(lcScore) || 0,
        gfg_score: parseInt(gfgScore) || 0,
        codeforces_score: parseInt(cfScore) || 0,
        total_score: total,
      })
      .eq("user_id", user.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Coding profiles updated! 🎯");
      setEditMode(false);
      await refreshProfile();
      await fetchLeaderboard();
    }
    setSaving(false);
  };

  const filtered = entries.filter(
    (e) =>
      e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.college_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.roll_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 glow-accent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-warning" />
              <span className="text-xs font-medium uppercase tracking-widest text-warning">Rankings</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Coding Leaderboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Rank based on LeetCode, GeeksforGeeks & CodeForces scores
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLeaderboard}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            {user && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 glow-primary"
              >
                <Code2 className="h-3.5 w-3.5" />
                {editMode ? "Cancel" : "Update Profiles"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit coding profiles */}
      {editMode && user && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Your Coding Profiles
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "LeetCode", user: leetcode, setUser: setLeetcode, score: lcScore, setScore: setLcScore, cfg: platformConfig.leetcode },
              { label: "GeeksforGeeks", user: gfg, setUser: setGfg, score: gfgScore, setScore: setGfgScore, cfg: platformConfig.gfg },
              { label: "CodeForces", user: codeforces, setUser: setCodeforces, score: cfScore, setScore: setCfScore, cfg: platformConfig.codeforces },
            ].map((p) => (
              <div key={p.label} className={`rounded-lg border border-border p-4 space-y-3 ${p.cfg.bg}`}>
                <p className={`text-xs font-semibold ${p.cfg.color}`}>{p.label}</p>
                <input
                  value={p.user}
                  onChange={(e) => p.setUser(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <input
                  value={p.score}
                  onChange={(e) => p.setScore(e.target.value)}
                  placeholder="Score / Problems solved"
                  type="number"
                  className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full sm:w-auto rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 glow-primary disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Update Ranking"}
          </button>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, college, or roll number..."
          className="w-full rounded-lg border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
        />
      </div>

      {/* Leaderboard table */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <RefreshCw className="h-8 w-8 text-primary mx-auto animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Loading rankings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {entries.length === 0
              ? "No rankings yet. Be the first to add your coding profiles!"
              : "No results match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Top 3 podium for desktop */}
          {filtered.length >= 3 && !searchQuery && (
            <div className="hidden lg:grid grid-cols-3 gap-3 mb-4">
              {[filtered[1], filtered[0], filtered[2]].map((entry, i) => {
                const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card p-5 text-center ${rank === 1 ? "ring-1 ring-warning/30 -mt-4 pb-8" : "mt-2"}`}
                  >
                    <div className="mb-3">{getRankIcon(rank)}</div>
                    <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="font-display text-lg font-bold text-primary">
                        {entry.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="font-display font-semibold text-foreground text-sm">{entry.full_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{entry.college_name}</p>
                    <p className="font-display text-2xl font-bold text-primary mt-2">{entry.total_score}</p>
                    <p className="text-[10px] text-muted-foreground">Total Score</p>
                    <div className="flex justify-center gap-2 mt-3">
                      {entry.leetcode_username && (
                        <a href={platformConfig.leetcode.url + entry.leetcode_username} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] rounded-full bg-warning/10 text-warning px-2 py-0.5 hover:bg-warning/20">
                          LC: {entry.leetcode_score}
                        </a>
                      )}
                      {entry.gfg_username && (
                        <a href={platformConfig.gfg.url + entry.gfg_username} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] rounded-full bg-success/10 text-success px-2 py-0.5 hover:bg-success/20">
                          GFG: {entry.gfg_score}
                        </a>
                      )}
                      {entry.codeforces_username && (
                        <a href={platformConfig.codeforces.url + entry.codeforces_username} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] rounded-full bg-primary/10 text-primary px-2 py-0.5 hover:bg-primary/20">
                          CF: {entry.codeforces_score}
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          {filtered.map((entry, i) => {
            const rank = i + 1;
            const isCurrentUser = user && entry.user_id === user.id;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30 ${getRankBg(rank)} ${isCurrentUser ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="w-8 flex justify-center shrink-0">{getRankIcon(rank)}</div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-display text-sm font-bold text-primary">
                    {entry.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{entry.full_name}</p>
                    {isCurrentUser && (
                      <span className="text-[9px] rounded-full bg-primary/10 text-primary px-1.5 py-0.5">You</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{entry.college_name} • {entry.roll_number}</p>
                </div>
                {/* Platform scores */}
                <div className="hidden sm:flex items-center gap-3">
                  {entry.leetcode_username && (
                    <a href={platformConfig.leetcode.url + entry.leetcode_username} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-warning hover:underline">
                      LC: {entry.leetcode_score} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                  {entry.gfg_username && (
                    <a href={platformConfig.gfg.url + entry.gfg_username} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-success hover:underline">
                      GFG: {entry.gfg_score} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                  {entry.codeforces_username && (
                    <a href={platformConfig.codeforces.url + entry.codeforces_username} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-primary hover:underline">
                      CF: {entry.codeforces_score} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-lg font-bold text-foreground">{entry.total_score}</p>
                  <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 justify-end">
                    <TrendingUp className="h-2.5 w-2.5" /> Score
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
