import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  Bot,
  Building2,
  TrendingUp,
  Calendar,
  BookOpen,
  Zap,
} from "lucide-react";
import { campusData } from "@/data/campusData";
import { staffData } from "@/data/staffData";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Faculty Members",
    value: staffData.length.toString(),
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Campus Buildings",
    value: campusData.buildings.length.toString(),
    icon: Building2,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Active Doubts",
    value: "12",
    icon: MessageSquare,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "AI Queries Today",
    value: "148",
    icon: Bot,
    color: "text-success",
    bg: "bg-success/10",
  },
];

const quickLinks = [
  { label: "Ask AI", desc: "Get instant campus answers", icon: Bot, path: "/chat", color: "from-primary/20 to-primary/5" },
  { label: "Find Staff", desc: "Search faculty directory", icon: Users, path: "/directory", color: "from-accent/20 to-accent/5" },
  { label: "Post Doubt", desc: "Ask the community", icon: MessageSquare, path: "/doubts", color: "from-warning/20 to-warning/5" },
];

export default function Dashboard() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero */}
      <div className="glass-card p-6 lg:p-8 glow-primary">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                {campusData.universityName}
              </span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Welcome to <span className="text-gradient">Cognix</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Your universal campus intelligence platform. Access staff directories, 
              get AI-powered answers, and solve doubts in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 glow-primary"
            >
              <Bot className="h-4 w-4" />
              Ask AI
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links + Events */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick Links */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`glass-card p-4 bg-gradient-to-br ${link.color} hover:border-primary/30 transition-all group`}
              >
                <link.icon className="h-8 w-8 text-foreground mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-semibold text-foreground">{link.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            Upcoming Events
          </h2>
          <div className="glass-card divide-y divide-border">
            {campusData.upcomingEvents.map((event) => (
              <div key={event.title} className="p-3">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  <span className="text-[10px] uppercase tracking-wide rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Calendar */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-success" />
          Academic Calendar
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {campusData.academicCalendar.map((item) => (
            <div key={item.event} className="glass-card p-4">
              <p className="text-sm font-medium text-foreground">{item.event}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
