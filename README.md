# Cognix — Universal Campus Intelligence Platform 🎓

**Cognix** is an AI-powered application and a universal campus intelligence platform that bridges the communication gap between students and faculty. By centralizing staff data and campus resources into a single hub, it offers students a live doubt-solving interface and a dedicated AI chatbot for instant access to university information.

Whether on mobile or PC, Cognix streamlines campus life into one smart, open-source ecosystem designed to work for **any university**.

---

## 🚀 Features

### 1. AI Chatbot Hub (RAG-Powered)
- Context-aware chatbot that answers questions about university info
- **Retrieval-Augmented Generation (RAG)** — pulls from a modular campus knowledge base
- Covers: building locations, dean's office hours, library rules, events, contacts, academic calendar
- Suggested questions for quick access

### 2. Staff/Faculty Directory
- Searchable database of faculty profiles
- Contact info, office hours, specialization, department
- Filter by department and availability status
- Expandable profile cards with full details

### 3. Live Doubt-Solving Interface
- Real-time message board for student-faculty interaction
- Students post doubts, faculty and AI respond
- Status tracking: Open → Answered → Resolved
- Upvote system for prioritizing important questions
- Tag-based categorization

### 4. Unified Dashboard
- At-a-glance stats: faculty count, buildings, active doubts, AI queries
- Quick action cards for navigation
- Upcoming events and academic calendar
- Fully responsive — works on mobile, tablet, and desktop

### 5. Open Source & Modular
- All data stored in modular TypeScript files (`src/data/`)
- Swap `campusData.ts` and `staffData.ts` for any university
- Clean component architecture for easy customization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + Custom Design System |
| Animations | Framer Motion |
| Routing | React Router v6 |
| AI Logic | Local RAG (context search) — ready for LLM integration |
| State | React Hooks (useState, useMemo) |
| Build | Vite |

---

## 📁 Project Structure

```
src/
├── components/
│   └── AppLayout.tsx          # Main layout with sidebar navigation
├── data/
│   ├── campusData.ts          # 🔄 Swappable campus knowledge base
│   └── staffData.ts           # 🔄 Swappable staff directory data
├── pages/
│   ├── Dashboard.tsx           # Main dashboard with stats & events
│   ├── AiChat.tsx              # AI chatbot with RAG search
│   ├── StaffDirectory.tsx      # Searchable faculty directory
│   └── DoubtBoard.tsx          # Live doubt-solving interface
├── index.css                   # Design system tokens
└── App.tsx                     # Routing & app shell
```

---

## 🔄 How to Adapt for Your University

1. **Edit `src/data/campusData.ts`** — Replace with your university's buildings, contacts, library rules, events, and academic calendar
2. **Edit `src/data/staffData.ts`** — Replace with your faculty/staff profiles
3. **Update branding** — Change university name and colors in `src/index.css`

That's it — the AI chatbot, directory, and dashboard will automatically reflect your data.

---

## 📊 Progress Report

| Module | Status | Notes |
|--------|--------|-------|
| Core UI Architecture | ✅ Completed | Responsive layout with sidebar, routing, design system |
| Staff Database Integration | ✅ Functional | 8 faculty profiles, search, filter by dept/status |
| AI Chatbot V1 | ✅ Active | RAG-powered context search across campus knowledge base |
| Live Doubt Board | ✅ Functional | Post doubts, reply, upvote, status tracking |
| Multi-platform Responsiveness | ✅ Validated | Mobile-first design, tested across breakpoints |
| Real-time Database Sync | 🔄 In Progress | Frontend ready, backend integration pending |
| LLM Integration (OpenAI/Gemini) | 🔄 Planned | RAG logic complete, API connection next |
| Knowledge Upload (PDF) | 📋 Planned | Admin feature for training bot with documents |

---

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

Open source — built for the community. Feel free to fork, adapt, and deploy for your campus.

---

**Built with ❤️ for hackathons and campuses everywhere.**
