import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersRound,
  Plus,
  Send,
  ArrowLeft,
  Calendar,
  GitBranch,
  Hash,
  UserPlus,
  LogOut as LeaveIcon,
  MessageCircle,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  description: string | null;
  group_type: string;
  year: string | null;
  branch: string | null;
  college_name: string;
  created_by: string;
  member_count: number;
  created_at: string;
}

interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const groupTypes = [
  { id: "year", label: "Year-wise", icon: Calendar },
  { id: "branch", label: "Branch-wise", icon: GitBranch },
  { id: "general", label: "General", icon: Hash },
];

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const branchOptions = ["CSE", "ECE", "ME", "CE", "EE", "IT", "AI/ML", "Data Science"];

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Set<string>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [newGroup, setNewGroup] = useState({ name: "", description: "", group_type: "general", year: "", branch: "" });
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
    fetchMyMemberships();
  }, [user]);

  useEffect(() => {
    if (!selectedGroup) return;
    fetchMessages(selectedGroup.id);

    const channel = supabase
      .channel(`group_${selectedGroup.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "group_messages",
        filter: `group_id=eq.${selectedGroup.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as GroupMessage]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedGroup]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchGroups = async () => {
    const { data } = await supabase.from("campus_groups").select("*").order("created_at", { ascending: false });
    if (data) setGroups(data);
    setLoading(false);
  };

  const fetchMyMemberships = async () => {
    if (!user) return;
    const { data } = await supabase.from("group_members").select("group_id").eq("user_id", user.id);
    if (data) setMyGroups(new Set(data.map((m) => m.group_id)));
  };

  const fetchMessages = async (groupId: string) => {
    const { data } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (data) setMessages(data);
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !user || !profile) return;
    const { error } = await supabase.from("campus_groups").insert({
      name: newGroup.name.trim(),
      description: newGroup.description.trim() || null,
      group_type: newGroup.group_type,
      year: newGroup.year || null,
      branch: newGroup.branch || null,
      college_name: profile.college_name,
      created_by: user.id,
    });
    if (error) {
      toast({ title: "Error", description: "Could not create group.", variant: "destructive" });
    } else {
      toast({ title: "Group Created!" });
      setShowCreate(false);
      setNewGroup({ name: "", description: "", group_type: "general", year: "", branch: "" });
      fetchGroups();
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    const { error } = await supabase.from("group_members").insert({ group_id: groupId, user_id: user.id });
    if (!error) {
      setMyGroups((prev) => new Set(prev).add(groupId));
      toast({ title: "Joined!" });
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", user.id);
    setMyGroups((prev) => { const s = new Set(prev); s.delete(groupId); return s; });
    if (selectedGroup?.id === groupId) setSelectedGroup(null);
    toast({ title: "Left group" });
  };

  const sendMessage = async () => {
    if (!msgInput.trim() || !user || !profile || !selectedGroup) return;
    const msg = msgInput.trim();
    setMsgInput("");
    await supabase.from("group_messages").insert({
      group_id: selectedGroup.id,
      user_id: user.id,
      author_name: profile.full_name,
      content: msg,
    });
  };

  const filteredGroups = filter === "all" ? groups : groups.filter((g) => g.group_type === filter);

  // Chat view
  if (selectedGroup) {
    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-card/40 backdrop-blur-sm">
          <button onClick={() => setSelectedGroup(null)} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-foreground truncate">{selectedGroup.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{selectedGroup.description || "No description"}</p>
          </div>
          <button
            onClick={() => leaveGroup(selectedGroup.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            Leave
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.user_id === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "glass-card rounded-bl-md"
                }`}>
                  {!isMe && (
                    <p className="text-[10px] font-medium text-accent mb-0.5">{msg.author_name}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/40 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={!msgInput.trim()}
              className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-accent" />
            Campus <span className="text-gradient">Groups</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with peers — year-wise, branch-wise, or by interest
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity glow-accent"
        >
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Cancel" : "Create Group"}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Group Name</label>
                  <input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="e.g., CSE 2nd Year"
                    maxLength={60}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
                  <select
                    value={newGroup.group_type}
                    onChange={(e) => setNewGroup({ ...newGroup, group_type: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {groupTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {newGroup.group_type === "year" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Year</label>
                  <select
                    value={newGroup.year}
                    onChange={(e) => setNewGroup({ ...newGroup, year: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              )}
              {newGroup.group_type === "branch" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Branch</label>
                  <select
                    value={newGroup.branch}
                    onChange={(e) => setNewGroup({ ...newGroup, branch: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Branch</option>
                    {branchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description (optional)</label>
                <input
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What's this group about?"
                  maxLength={200}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleCreateGroup}
                disabled={!newGroup.name.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Create
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setFilter("all")}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
            filter === "all" ? "bg-primary/10 text-primary border border-primary/30" : "glass-card text-muted-foreground hover:text-foreground"
          }`}
        >
          All Groups
        </button>
        {groupTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              filter === t.id ? "bg-accent/10 text-accent border border-accent/30" : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Groups List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-5 w-2/3 rounded bg-secondary mb-3" />
              <div className="h-3 w-full rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <UsersRound className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No groups yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGroups.map((group, i) => {
            const isMember = myGroups.has(group.id);
            const typeInfo = groupTypes.find((t) => t.id === group.group_type) || groupTypes[2];
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 hover:border-accent/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <typeInfo.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm text-foreground">{group.name}</h3>
                      {(group.year || group.branch) && (
                        <p className="text-[10px] text-accent">{group.year || group.branch}</p>
                      )}
                    </div>
                  </div>
                </div>
                {group.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{group.description}</p>
                )}
                <div className="flex items-center gap-2">
                  {isMember ? (
                    <>
                      <button
                        onClick={() => setSelectedGroup(group)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Open Chat
                      </button>
                      <button
                        onClick={() => leaveGroup(group.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LeaveIcon className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Join Group
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
