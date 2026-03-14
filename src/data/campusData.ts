// Campus Context Data - Swap this file for any university
// This is the modular data layer that powers the AI chatbot's RAG system

export interface BuildingInfo {
  name: string;
  code: string;
  location: string;
  floors: number;
  facilities: string[];
  coordinates?: { lat: number; lng: number };
}

export interface OfficeHours {
  name: string;
  title: string;
  days: string;
  hours: string;
  location: string;
  appointmentRequired: boolean;
}

export interface LibraryRule {
  category: string;
  rules: string[];
}

export interface CampusEvent {
  title: string;
  date: string;
  location: string;
  type: string;
}

export interface CampusData {
  universityName: string;
  universityMotto: string;
  buildings: BuildingInfo[];
  deanOfficeHours: OfficeHours[];
  libraryRules: LibraryRule[];
  importantContacts: { name: string; phone: string; email: string; role: string }[];
  upcomingEvents: CampusEvent[];
  academicCalendar: { event: string; date: string }[];
}

export const campusData: CampusData = {
  universityName: "Cognix University",
  universityMotto: "Knowledge Without Boundaries",
  buildings: [
    {
      name: "Alan Turing Computer Science Building",
      code: "CSB",
      location: "North Campus, Block A",
      floors: 5,
      facilities: ["AI Lab", "Networking Lab", "Server Room", "Seminar Hall", "Cafeteria"],
    },
    {
      name: "Marie Curie Science Complex",
      code: "SCI",
      location: "Central Campus, Block B",
      floors: 4,
      facilities: ["Physics Lab", "Chemistry Lab", "Biology Lab", "Research Wing"],
    },
    {
      name: "Main Administrative Building",
      code: "ADM",
      location: "Central Campus, Main Gate",
      floors: 3,
      facilities: ["Dean's Office", "Registrar", "Finance Office", "Student Affairs"],
    },
    {
      name: "Central Library",
      code: "LIB",
      location: "East Campus",
      floors: 3,
      facilities: ["Reading Hall", "Digital Archive", "Group Study Rooms", "Rare Books Section"],
    },
    {
      name: "Innovation & Entrepreneurship Hub",
      code: "IEH",
      location: "West Campus",
      floors: 2,
      facilities: ["Incubation Center", "Maker Space", "Conference Rooms", "Pitch Arena"],
    },
    {
      name: "Sports Complex",
      code: "SPT",
      location: "South Campus",
      floors: 2,
      facilities: ["Indoor Stadium", "Swimming Pool", "Gymnasium", "Cricket Ground"],
    },
  ],
  deanOfficeHours: [
    {
      name: "Dr. Rajesh Sharma",
      title: "Dean of Academics",
      days: "Monday, Wednesday, Friday",
      hours: "10:00 AM - 1:00 PM",
      location: "ADM Building, Room 301",
      appointmentRequired: true,
    },
    {
      name: "Dr. Priya Nair",
      title: "Dean of Student Affairs",
      days: "Tuesday, Thursday",
      hours: "2:00 PM - 5:00 PM",
      location: "ADM Building, Room 205",
      appointmentRequired: false,
    },
    {
      name: "Dr. Arun Mehta",
      title: "Dean of Research",
      days: "Monday, Thursday",
      hours: "11:00 AM - 2:00 PM",
      location: "SCI Building, Room 401",
      appointmentRequired: true,
    },
  ],
  libraryRules: [
    {
      category: "General",
      rules: [
        "Library is open from 8:00 AM to 10:00 PM on weekdays",
        "Weekend hours: 9:00 AM to 6:00 PM",
        "Valid university ID card is required for entry",
        "Maintain silence in reading areas",
        "Food and beverages are not allowed inside",
      ],
    },
    {
      category: "Borrowing",
      rules: [
        "Undergraduate students can borrow up to 4 books for 14 days",
        "Postgraduate students can borrow up to 6 books for 21 days",
        "Faculty can borrow up to 10 books for 30 days",
        "Late fee: ₹5 per day per book",
        "Reference books cannot be borrowed",
      ],
    },
    {
      category: "Digital Resources",
      rules: [
        "Access to IEEE, Springer, and ACM digital libraries available on campus WiFi",
        "Remote access available through VPN with student credentials",
        "Printing: ₹2 per page (B/W), ₹10 per page (Color)",
        "20 free prints per student per month",
      ],
    },
  ],
  importantContacts: [
    { name: "Emergency Helpline", phone: "+91-9876543210", email: "emergency@cognixuni.edu", role: "Campus Security" },
    { name: "IT Help Desk", phone: "+91-9876543211", email: "it.help@cognixuni.edu", role: "Technical Support" },
    { name: "Student Counseling", phone: "+91-9876543212", email: "counseling@cognixuni.edu", role: "Mental Health" },
    { name: "Hostel Warden", phone: "+91-9876543213", email: "hostel@cognixuni.edu", role: "Hostel Management" },
    { name: "Placement Cell", phone: "+91-9876543214", email: "placements@cognixuni.edu", role: "Career Services" },
  ],
  upcomingEvents: [
    { title: "TechFest 2026", date: "2026-03-15", location: "Innovation Hub", type: "Technical" },
    { title: "Annual Cultural Night", date: "2026-03-20", location: "Main Auditorium", type: "Cultural" },
    { title: "Research Symposium", date: "2026-04-05", location: "Science Complex", type: "Academic" },
    { title: "Sports Day", date: "2026-04-12", location: "Sports Complex", type: "Sports" },
  ],
  academicCalendar: [
    { event: "Mid-Semester Exams", date: "2026-03-10 to 2026-03-18" },
    { event: "Spring Break", date: "2026-03-25 to 2026-03-31" },
    { event: "End-Semester Exams", date: "2026-05-01 to 2026-05-15" },
    { event: "Summer Vacation", date: "2026-05-20 to 2026-07-15" },
  ],
};

// Helper function to search campus data for RAG
export function searchCampusContext(query: string): string {
  const q = query.toLowerCase();
  const results: string[] = [];

  // Search buildings
  campusData.buildings.forEach((b) => {
    if (b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.facilities.some((f) => f.toLowerCase().includes(q))) {
      results.push(`📍 **${b.name}** (${b.code}): Located at ${b.location}, ${b.floors} floors. Facilities: ${b.facilities.join(", ")}`);
    }
  });

  // Search dean office hours
  campusData.deanOfficeHours.forEach((d) => {
    if (d.name.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || q.includes("dean") || q.includes("office hours")) {
      results.push(`🏛️ **${d.name}** - ${d.title}: ${d.days}, ${d.hours} at ${d.location}. ${d.appointmentRequired ? "Appointment required." : "Walk-in available."}`);
    }
  });

  // Search library rules
  if (q.includes("library") || q.includes("book") || q.includes("borrow") || q.includes("print")) {
    campusData.libraryRules.forEach((lr) => {
      results.push(`📚 **Library - ${lr.category}**:\n${lr.rules.map((r) => `  • ${r}`).join("\n")}`);
    });
  }

  // Search contacts
  campusData.importantContacts.forEach((c) => {
    if (c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || q.includes("contact") || q.includes("help")) {
      results.push(`📞 **${c.name}** (${c.role}): ${c.phone} | ${c.email}`);
    }
  });

  // Search events
  if (q.includes("event") || q.includes("fest") || q.includes("upcoming")) {
    campusData.upcomingEvents.forEach((e) => {
      results.push(`🎉 **${e.title}**: ${e.date} at ${e.location} (${e.type})`);
    });
  }

  // Search academic calendar
  if (q.includes("exam") || q.includes("vacation") || q.includes("break") || q.includes("calendar") || q.includes("semester")) {
    campusData.academicCalendar.forEach((a) => {
      results.push(`📅 **${a.event}**: ${a.date}`);
    });
  }

  if (results.length === 0) {
    // Return general info
    return `Here's some general information about ${campusData.universityName}:\n\n` +
      `🏫 ${campusData.universityName} — "${campusData.universityMotto}"\n\n` +
      `We have ${campusData.buildings.length} main buildings, ${campusData.deanOfficeHours.length} dean offices, and many resources available.\n\n` +
      `Try asking about specific buildings, library rules, dean office hours, events, or contacts!`;
  }

  return results.join("\n\n");
}
