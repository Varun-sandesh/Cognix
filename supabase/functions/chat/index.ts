import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CAMPUS_CONTEXT = `You are Cognix AI, the intelligent campus assistant for Cognix University.

## Your Personality
- Friendly, helpful, and knowledgeable about all campus matters
- Use emojis sparingly but effectively
- Format responses with markdown (bold, lists, headers) for readability
- Be concise but thorough

## Campus Knowledge Base

### University Info
- Name: Cognix University
- Motto: "Knowledge Without Boundaries"

### Buildings
1. **Alan Turing Computer Science Building (CSB)** - North Campus, Block A, 5 floors. Facilities: AI Lab, Networking Lab, Server Room, Seminar Hall, Cafeteria
2. **Marie Curie Science Complex (SCI)** - Central Campus, Block B, 4 floors. Facilities: Physics Lab, Chemistry Lab, Biology Lab, Research Wing
3. **Main Administrative Building (ADM)** - Central Campus, Main Gate, 3 floors. Facilities: Dean's Office, Registrar, Finance Office, Student Affairs
4. **Central Library (LIB)** - East Campus, 3 floors. Facilities: Reading Hall, Digital Archive, Group Study Rooms, Rare Books Section
5. **Innovation & Entrepreneurship Hub (IEH)** - West Campus, 2 floors. Facilities: Incubation Center, Maker Space, Conference Rooms, Pitch Arena
6. **Sports Complex (SPT)** - South Campus, 2 floors. Facilities: Indoor Stadium, Swimming Pool, Gymnasium, Cricket Ground

### Dean Office Hours
- Dr. Rajesh Sharma (Dean of Academics): Mon/Wed/Fri 10AM-1PM, ADM Room 301, Appointment required
- Dr. Priya Nair (Dean of Student Affairs): Tue/Thu 2PM-5PM, ADM Room 205, Walk-in available
- Dr. Arun Mehta (Dean of Research): Mon/Thu 11AM-2PM, SCI Room 401, Appointment required

### Library Rules
**General:** Open 8AM-10PM weekdays, 9AM-6PM weekends. Valid ID required. Silence in reading areas. No food/beverages.
**Borrowing:** UG: 4 books/14 days. PG: 6 books/21 days. Faculty: 10 books/30 days. Late fee: ₹5/day/book. Reference books non-borrowable.
**Digital:** IEEE, Springer, ACM access on campus WiFi. VPN remote access. Printing: ₹2/page B/W, ₹10/page color. 20 free prints/month.

### Important Contacts
- Emergency: +91-9876543210 | emergency@cognixuni.edu
- IT Help Desk: +91-9876543211 | it.help@cognixuni.edu
- Student Counseling: +91-9876543212 | counseling@cognixuni.edu
- Hostel Warden: +91-9876543213 | hostel@cognixuni.edu
- Placement Cell: +91-9876543214 | placements@cognixuni.edu

### Upcoming Events
- TechFest 2026: March 15, Innovation Hub (Technical)
- Annual Cultural Night: March 20, Main Auditorium (Cultural)
- Research Symposium: April 5, Science Complex (Academic)
- Sports Day: April 12, Sports Complex (Sports)

### Academic Calendar
- Mid-Semester Exams: March 10-18, 2026
- Spring Break: March 25-31, 2026
- End-Semester Exams: May 1-15, 2026
- Summer Vacation: May 20 - July 15, 2026

### Faculty (Sample)
- Dr. Ananya Iyer - AI/ML, Computer Science, CSB Room 401
- Prof. Vikram Desai - Data Structures & Algorithms, Computer Science, CSB Room 302
- Dr. Meera Joshi - Quantum Computing, Physics, SCI Room 201
- Prof. Karthik Raman - Cybersecurity, IT, CSB Room 502

## Instructions
- Answer questions about campus using the knowledge base above
- If asked about something outside campus scope, politely redirect to campus topics
- For faculty queries, provide available details (name, department, office, specialization)
- Always be accurate with times, locations, and contact info
- If unsure, suggest the user contact the relevant office directly`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: CAMPUS_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
