import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react";
import { staffData, departments, type StaffMember } from "@/data/staffData";

const statusColors: Record<string, string> = {
  available: "bg-success",
  busy: "bg-destructive",
  away: "bg-warning",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  busy: "Busy",
  away: "Away",
};

function StaffCard({ member, index }: { member: StaffMember; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden hover:border-primary/30 transition-all"
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 font-display text-lg font-bold text-foreground">
            {member.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-foreground truncate">{member.name}</h3>
              <span className={`h-2 w-2 shrink-0 rounded-full ${statusColors[member.status]}`} title={statusLabels[member.status]} />
            </div>
            <p className="text-xs text-primary font-medium">{member.title}</p>
            <p className="text-xs text-muted-foreground">{member.department}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-3 flex flex-wrap gap-2">
          {member.specialization.map((s) => (
            <span key={s} className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : "Contact details"}
          <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-border bg-secondary/20 px-4 py-3 space-y-2"
        >
          <p className="text-xs text-muted-foreground">{member.bio}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 text-primary" />
              <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">{member.email}</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 text-primary" />
              {member.phone}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              {member.office}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-primary" />
              {member.officeHours}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function StaffDirectory() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return staffData.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.specialization.some((sp) => sp.toLowerCase().includes(search.toLowerCase())) ||
        s.department.toLowerCase().includes(search.toLowerCase());
      const matchesDept = departmentFilter === "All" || s.department === departmentFilter;
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [search, departmentFilter, statusFilter]);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Staff Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search {staffData.length} faculty members across {departments.length} departments
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department, specialization..."
            className="w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-secondary/50 pl-9 pr-8 py-2.5 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
            >
              <option value="All">All Depts</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-xs text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {staffData.length} members
      </p>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member, i) => (
          <StaffCard key={member.id} member={member} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No faculty members found matching your search.</p>
        </div>
      )}
    </div>
  );
}
