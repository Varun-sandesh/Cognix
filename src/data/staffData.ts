// Staff/Faculty Directory Data - Modular & swappable for any university

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  officeHours: string;
  specialization: string[];
  avatar: string;
  status: "available" | "busy" | "away";
  bio: string;
}

export const staffData: StaffMember[] = [
  {
    id: "1",
    name: "Dr. Rajesh Sharma",
    title: "Professor & Dean of Academics",
    department: "Computer Science",
    email: "rajesh.sharma@cognixuni.edu",
    phone: "+91-9876543101",
    office: "ADM 301",
    officeHours: "Mon, Wed, Fri: 10 AM - 1 PM",
    specialization: ["Artificial Intelligence", "Machine Learning", "Data Science"],
    avatar: "RS",
    status: "available",
    bio: "20+ years of experience in AI research. Published 150+ papers in top-tier conferences.",
  },
  {
    id: "2",
    name: "Dr. Priya Nair",
    title: "Associate Professor & Dean of Student Affairs",
    department: "Electronics & Communication",
    email: "priya.nair@cognixuni.edu",
    phone: "+91-9876543102",
    office: "ADM 205",
    officeHours: "Tue, Thu: 2 PM - 5 PM",
    specialization: ["VLSI Design", "Embedded Systems", "IoT"],
    avatar: "PN",
    status: "available",
    bio: "Expert in VLSI design with industry experience at Intel and Texas Instruments.",
  },
  {
    id: "3",
    name: "Dr. Arun Mehta",
    title: "Professor & Dean of Research",
    department: "Physics",
    email: "arun.mehta@cognixuni.edu",
    phone: "+91-9876543103",
    office: "SCI 401",
    officeHours: "Mon, Thu: 11 AM - 2 PM",
    specialization: ["Quantum Computing", "Theoretical Physics", "Nanotechnology"],
    avatar: "AM",
    status: "busy",
    bio: "Leading researcher in quantum computing applications. ISRO consultant.",
  },
  {
    id: "4",
    name: "Prof. Sneha Gupta",
    title: "Assistant Professor",
    department: "Computer Science",
    email: "sneha.gupta@cognixuni.edu",
    phone: "+91-9876543104",
    office: "CSB 208",
    officeHours: "Mon-Fri: 3 PM - 5 PM",
    specialization: ["Web Development", "Cloud Computing", "DevOps"],
    avatar: "SG",
    status: "available",
    bio: "Former Google engineer. Passionate about teaching modern web technologies.",
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    title: "Professor",
    department: "Mathematics",
    email: "vikram.singh@cognixuni.edu",
    phone: "+91-9876543105",
    office: "SCI 302",
    officeHours: "Tue, Wed, Fri: 9 AM - 12 PM",
    specialization: ["Cryptography", "Number Theory", "Linear Algebra"],
    avatar: "VS",
    status: "away",
    bio: "Contributed to India's encryption standards. Author of 3 textbooks.",
  },
  {
    id: "6",
    name: "Dr. Meera Krishnan",
    title: "Associate Professor",
    department: "Computer Science",
    email: "meera.krishnan@cognixuni.edu",
    phone: "+91-9876543106",
    office: "CSB 310",
    officeHours: "Mon, Wed: 1 PM - 4 PM",
    specialization: ["Natural Language Processing", "Computer Vision", "Deep Learning"],
    avatar: "MK",
    status: "available",
    bio: "PhD from IIT Bombay. Active contributor to open-source AI projects.",
  },
  {
    id: "7",
    name: "Prof. Ankit Joshi",
    title: "Assistant Professor",
    department: "Information Technology",
    email: "ankit.joshi@cognixuni.edu",
    phone: "+91-9876543107",
    office: "CSB 105",
    officeHours: "Mon-Thu: 10 AM - 12 PM",
    specialization: ["Cybersecurity", "Network Security", "Ethical Hacking"],
    avatar: "AJ",
    status: "available",
    bio: "Certified ethical hacker. Previously worked with CERT-In.",
  },
  {
    id: "8",
    name: "Dr. Kavita Reddy",
    title: "Professor & HOD",
    department: "Biotechnology",
    email: "kavita.reddy@cognixuni.edu",
    phone: "+91-9876543108",
    office: "SCI 201",
    officeHours: "Wed, Fri: 11 AM - 2 PM",
    specialization: ["Genomics", "Bioinformatics", "Molecular Biology"],
    avatar: "KR",
    status: "busy",
    bio: "Pioneer in computational genomics research in India. DBT grant recipient.",
  },
];

export const departments = [...new Set(staffData.map((s) => s.department))];

export function searchStaff(query: string): StaffMember[] {
  const q = query.toLowerCase();
  return staffData.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.specialization.some((sp) => sp.toLowerCase().includes(q)) ||
      s.title.toLowerCase().includes(q)
  );
}
