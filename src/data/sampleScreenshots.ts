import { SampleScreenshot } from '../types';

// Helper to convert SVG string to base64 Data URI
function svgToDataUri(svg: string): string {
  // Clean whitespace
  const cleanSvg = svg.trim();
  const base64 = btoa(unescape(encodeURIComponent(cleanSvg)));
  return `data:image/svg+xml;base64,${base64}`;
}

// 1. Job Vacancy: Senior Full-Stack Engineer / HSE Manager
const jobVacancySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900" fill="none">
  <rect width="700" height="900" fill="#0F172A" />
  <rect x="30" y="30" width="640" height="840" rx="16" fill="#1E293B" stroke="#334155" stroke-width="2" />
  
  <!-- Header / Company -->
  <rect x="50" y="50" width="60" height="60" rx="12" fill="#3B82F6" />
  <text x="80" y="88" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="28" text-anchor="middle">AE</text>
  <text x="130" y="75" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="24">Apex Energy &amp; Infra Ltd.</text>
  <text x="130" y="98" fill="#94A3B8" font-family="sans-serif" font-size="16">Dubai, United Arab Emirates • Full-Time • Onsite</text>

  <!-- Job Title Badge -->
  <rect x="50" y="130" width="600" height="70" rx="12" fill="#1E3A8A" />
  <text x="75" y="172" fill="#60A5FA" font-family="sans-serif" font-weight="bold" font-size="22">HSE Lead Manager (Health, Safety &amp; Environment)</text>

  <!-- Details Row -->
  <rect x="50" y="220" width="180" height="50" rx="8" fill="#334155" />
  <text x="65" y="250" fill="#E2E8F0" font-family="sans-serif" font-size="14">💰 $95,000 - $125,000 /yr</text>
  <rect x="250" y="220" width="170" height="50" rx="8" fill="#334155" />
  <text x="265" y="250" fill="#E2E8F0" font-family="sans-serif" font-size="14">⏳ Deadline: Nov 15, 2026</text>
  <rect x="440" y="220" width="210" height="50" rx="8" fill="#334155" />
  <text x="455" y="250" fill="#E2E8F0" font-family="sans-serif" font-size="14">📍 Offshore &amp; Plant Operations</text>

  <!-- Key Requirements -->
  <text x="50" y="310" fill="#38BDF8" font-family="sans-serif" font-weight="bold" font-size="18">CORE QUALIFICATIONS &amp; CERTIFICATIONS:</text>
  <text x="60" y="340" fill="#CBD5E1" font-family="sans-serif" font-size="15">• NEBOSH International Diploma or CSP (Certified Safety Professional) required</text>
  <text x="60" y="370" fill="#CBD5E1" font-family="sans-serif" font-size="15">• 8+ years experience leading safety operations in Oil &amp; Gas or Renewable energy</text>
  <text x="60" y="400" fill="#CBD5E1" font-family="sans-serif" font-size="15">• Proven audit track record with ISO 45001 &amp; ISO 14001 compliance standards</text>
  <text x="60" y="430" fill="#CBD5E1" font-family="sans-serif" font-size="15">• Root Cause Analysis, HAZOP studies, emergency response leadership</text>
  <text x="60" y="460" fill="#CBD5E1" font-family="sans-serif" font-size="15">• Fluency in English (Arabic communication is an added advantage)</text>

  <!-- Skills tags -->
  <rect x="50" y="500" width="110" height="34" rx="17" fill="#0284C7" />
  <text x="105" y="522" fill="#FFFFFF" font-family="sans-serif" font-size="13" text-anchor="middle">NEBOSH</text>
  <rect x="170" y="500" width="90" height="34" rx="17" fill="#0284C7" />
  <text x="215" y="522" fill="#FFFFFF" font-family="sans-serif" font-size="13" text-anchor="middle">ISO 45001</text>
  <rect x="270" y="500" width="80" height="34" rx="17" fill="#0284C7" />
  <text x="310" y="522" fill="#FFFFFF" font-family="sans-serif" font-size="13" text-anchor="middle">HAZOP</text>
  <rect x="360" y="500" width="130" height="34" rx="17" fill="#0284C7" />
  <text x="425" y="522" fill="#FFFFFF" font-family="sans-serif" font-size="13" text-anchor="middle">Safety Leadership</text>

  <!-- How to apply box -->
  <rect x="50" y="560" width="600" height="150" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5" />
  <text x="75" y="600" fill="#38BDF8" font-family="sans-serif" font-weight="bold" font-size="18">HOW TO APPLY:</text>
  <text x="75" y="630" fill="#F1F5F9" font-family="sans-serif" font-size="15">Send your CV, NEBOSH copy and Cover Letter to:</text>
  <text x="75" y="660" fill="#38BDF8" font-family="sans-serif" font-weight="bold" font-size="18">recruitment@apexenergy-uae.com</text>
  <text x="75" y="688" fill="#94A3B8" font-family="sans-serif" font-size="14">Subject Line: "Application - HSE Lead Manager [Dubai] - Your Name"</text>

  <!-- Recruiter notes -->
  <text x="50" y="750" fill="#94A3B8" font-family="sans-serif" font-size="14">Hiring Manager: Marcus Vance (VP Operations) • Inquiries: +971 4 882 4910</text>
  <rect x="50" y="780" width="600" height="60" rx="8" fill="#22C55E" />
  <text x="350" y="818" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="18" text-anchor="middle">TAP SHARE BUTTON TO SEND TO SNAPACTION AI</text>
</svg>`;

// 2. SaaS Analytics Dashboard UI
const saasDashboardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
  <rect width="800" height="600" fill="#090D16" />
  
  <!-- Sidebar -->
  <rect x="0" y="0" width="180" height="600" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
  <circle cx="35" cy="40" r="14" fill="#6366F1" />
  <text x="60" y="46" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="18">NexusAI</text>
  
  <rect x="15" y="90" width="150" height="40" rx="8" fill="#4338CA" />
  <text x="50" y="115" fill="#FFFFFF" font-family="sans-serif" font-size="14">📊 Dashboard</text>
  <text x="50" y="155" fill="#94A3B8" font-family="sans-serif" font-size="14">👥 Customers</text>
  <text x="50" y="195" fill="#94A3B8" font-family="sans-serif" font-size="14">💳 Revenue</text>
  <text x="50" y="235" fill="#94A3B8" font-family="sans-serif" font-size="14">⚡ AI Models</text>
  <text x="50" y="275" fill="#94A3B8" font-family="sans-serif" font-size="14">⚙️ Settings</text>

  <!-- Top bar -->
  <rect x="180" y="0" width="620" height="60" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
  <text x="210" y="38" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="18">Cloud Metrics &amp; LLM Orchestration</text>
  <circle cx="750" cy="30" r="16" fill="#3B82F6" />
  <text x="750" y="36" fill="#FFF" font-family="sans-serif" font-size="12" text-anchor="middle">JD</text>

  <!-- KPI Cards -->
  <rect x="210" y="80" width="170" height="100" rx="12" fill="#1E293B" stroke="#334155" />
  <text x="225" y="110" fill="#94A3B8" font-family="sans-serif" font-size="13">Active Users</text>
  <text x="225" y="145" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="24">128,490</text>
  <text x="225" y="168" fill="#22C55E" font-family="sans-serif" font-size="12">▲ +14.2% vs last wk</text>

  <rect x="400" y="80" width="170" height="100" rx="12" fill="#1E293B" stroke="#334155" />
  <text x="415" y="110" fill="#94A3B8" font-family="sans-serif" font-size="13">Token Throughput</text>
  <text x="415" y="145" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="24">4.82 M/s</text>
  <text x="415" y="168" fill="#38BDF8" font-family="sans-serif" font-size="12">⚡ 48ms latency</text>

  <rect x="590" y="80" width="180" height="100" rx="12" fill="#1E293B" stroke="#334155" />
  <text x="605" y="110" fill="#94A3B8" font-family="sans-serif" font-size="13">Monthly Recurring</text>
  <text x="605" y="145" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="24">$42,950</text>
  <text x="605" y="168" fill="#22C55E" font-family="sans-serif" font-size="12">▲ +21.8% MRR</text>

  <!-- Chart area -->
  <rect x="210" y="200" width="560" height="220" rx="12" fill="#1E293B" stroke="#334155" />
  <text x="230" y="235" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="16">API Calls &amp; Latency Over Time (7 Days)</text>
  <path d="M 240 370 Q 320 310 400 330 T 540 260 T 730 240" fill="none" stroke="#6366F1" stroke-width="4" />
  <path d="M 240 380 Q 320 350 400 340 T 540 320 T 730 310" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="4" />

  <!-- Data table preview -->
  <rect x="210" y="440" width="560" height="135" rx="12" fill="#1E293B" stroke="#334155" />
  <text x="230" y="470" fill="#94A3B8" font-family="sans-serif" font-size="14">Agent / Worker</text>
  <text x="450" y="470" fill="#94A3B8" font-family="sans-serif" font-size="14">Status</text>
  <text x="650" y="470" fill="#94A3B8" font-family="sans-serif" font-size="14">Avg Response</text>
  <line x1="230" y1="485" x2="745" y2="485" stroke="#334155" />
  <text x="230" y="515" fill="#F8FAFC" font-family="sans-serif" font-size="14">gemini-3.8-flash-gateway</text>
  <text x="450" y="515" fill="#22C55E" font-family="sans-serif" font-size="14">● Operational</text>
  <text x="650" y="515" fill="#F8FAFC" font-family="sans-serif" font-size="14">120 ms</text>
  <text x="230" y="550" fill="#F8FAFC" font-family="sans-serif" font-size="14">vision-extraction-agent-v2</text>
  <text x="450" y="550" fill="#22C55E" font-family="sans-serif" font-size="14">● Operational</text>
  <text x="650" y="550" fill="#F8FAFC" font-family="sans-serif" font-size="14">184 ms</text>
</svg>`;

// 3. WhatsApp Client Chat
const whatsappChatSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#0B141A" />
  
  <!-- WhatsApp Header -->
  <rect x="0" y="0" width="600" height="70" fill="#202C33" />
  <circle cx="45" cy="35" r="20" fill="#00A884" />
  <text x="45" y="42" fill="#FFF" font-family="sans-serif" font-weight="bold" font-size="18" text-anchor="middle">SC</text>
  <text x="80" y="32" fill="#E9EDEF" font-family="sans-serif" font-weight="bold" font-size="16">Sarah Chen (Client VP)</text>
  <text x="80" y="52" fill="#8696A0" font-family="sans-serif" font-size="13">online</text>

  <!-- Message 1 (Incoming) -->
  <rect x="25" y="100" width="460" height="110" rx="12" fill="#202C33" />
  <text x="45" y="130" fill="#E9EDEF" font-family="sans-serif" font-size="15">Hey! We reviewed the mobile app release candidate.</text>
  <text x="45" y="155" fill="#E9EDEF" font-family="sans-serif" font-size="15">The board loved the screenshot action workflow, but</text>
  <text x="45" y="180" fill="#E9EDEF" font-family="sans-serif" font-size="15">can we push the Google Calendar sync live by Thursday?</text>
  <text x="430" y="195" fill="#8696A0" font-family="sans-serif" font-size="11">10:14 AM</text>

  <!-- Message 2 (Incoming follow up) -->
  <rect x="25" y="230" width="440" height="130" rx="12" fill="#202C33" />
  <text x="45" y="260" fill="#E9EDEF" font-family="sans-serif" font-size="15">Also, we need a quote for adding the enterprise</text>
  <text x="45" y="285" fill="#E9EDEF" font-family="sans-serif" font-size="15">receipt scanner module for 500 team seats.</text>
  <text x="45" y="310" fill="#E9EDEF" font-family="sans-serif" font-size="15">Let me know your availability for a 15-min sync.</text>
  <text x="45" y="335" fill="#53BDEB" font-family="sans-serif" font-size="14">sarah.chen@innovatecorp.com</text>
  <text x="410" y="348" fill="#8696A0" font-family="sans-serif" font-size="11">10:16 AM</text>

  <!-- Message 3 (Outgoing draft/preview) -->
  <rect x="150" y="380" width="425" height="90" rx="12" fill="#005C4B" />
  <text x="170" y="410" fill="#E9EDEF" font-family="sans-serif" font-size="15">Hi Sarah! Absolutely. Let me check with the team</text>
  <text x="170" y="435" fill="#E9EDEF" font-family="sans-serif" font-size="15">and get you a timeline and pricing proposal today.</text>
  <text x="515" y="455" fill="#8696A0" font-family="sans-serif" font-size="11">10:20 AM ✓✓</text>

  <!-- Context notice -->
  <rect x="50" y="520" width="500" height="80" rx="8" fill="#182229" stroke="#2A3942" />
  <text x="75" y="550" fill="#00A884" font-family="sans-serif" font-weight="bold" font-size="14">AI COMMUNICATION AGENT DETECTS:</text>
  <text x="75" y="575" fill="#8696A0" font-family="sans-serif" font-size="13">Client request: Feature timeline (Thursday) + Enterprise quote (500 seats)</text>
</svg>`;

// 4. Conference Event Poster
const eventPosterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900" fill="none">
  <rect width="700" height="900" fill="#0F172A" />
  
  <rect x="30" y="30" width="640" height="840" rx="20" fill="url(#eventGrad)" />
  <defs>
    <linearGradient id="eventGrad" x1="0" y1="0" x2="700" y2="900" gradientUnits="userSpaceOnUse">
      <stop stop-color="#312E81" />
      <stop offset="0.5" stop-color="#1E1B4B" />
      <stop offset="1" stop-color="#0F172A" />
    </linearGradient>
  </defs>

  <rect x="70" y="70" width="130" height="36" rx="18" fill="#EC4899" />
  <text x="135" y="94" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">GLOBAL SUMMIT</text>

  <text x="70" y="160" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="40">AI Vision &amp; Agents</text>
  <text x="70" y="210" fill="#A855F7" font-family="sans-serif" font-weight="bold" font-size="38">World Congress 2026</text>

  <text x="70" y="270" fill="#E2E8F0" font-family="sans-serif" font-size="20">The Premier Conference on Multimodal AI &amp; Autonomous Workflows</text>

  <rect x="70" y="320" width="560" height="110" rx="16" fill="#1E293B" stroke="#6366F1" stroke-width="2" />
  <text x="100" y="365" fill="#38BDF8" font-family="sans-serif" font-weight="bold" font-size="20">📅 DATE &amp; TIME:</text>
  <text x="100" y="398" fill="#F8FAFC" font-family="sans-serif" font-size="17">November 18-20, 2026 • 09:00 AM - 05:30 PM PST</text>

  <rect x="70" y="450" width="560" height="110" rx="16" fill="#1E293B" stroke="#6366F1" stroke-width="2" />
  <text x="100" y="495" fill="#38BDF8" font-family="sans-serif" font-weight="bold" font-size="20">📍 LOCATION / VENUE:</text>
  <text x="100" y="528" fill="#F8FAFC" font-family="sans-serif" font-size="17">Moscone West Center, 747 Howard St, San Francisco, CA</text>

  <rect x="70" y="580" width="560" height="130" rx="16" fill="#1E293B" stroke="#6366F1" stroke-width="2" />
  <text x="100" y="620" fill="#EC4899" font-family="sans-serif" font-weight="bold" font-size="18">🎟️ REGISTRATION &amp; PASSES:</text>
  <text x="100" y="650" fill="#F8FAFC" font-family="sans-serif" font-size="16">Early Bird Pass: $499 (Ends Oct 31) • VIP Pass: $899</text>
  <text x="100" y="680" fill="#38BDF8" font-family="sans-serif" font-size="16">URL: https://aivisioncongress2026.org/register</text>

  <text x="70" y="750" fill="#94A3B8" font-family="sans-serif" font-size="15">Organizer: Global AI Alliance • Contact: events@aivisioncongress2026.org</text>
  
  <rect x="70" y="780" width="560" height="60" rx="12" fill="#6366F1" />
  <text x="350" y="818" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="18" text-anchor="middle">ADD TO GOOGLE CALENDAR VIA SNAPACTION AI</text>
</svg>`;

// 5. Store Receipt / Expense
const receiptSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" fill="none">
  <rect width="600" height="850" fill="#F8FAFC" />
  
  <!-- Paper Receipt Style -->
  <rect x="40" y="30" width="520" height="790" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
  
  <!-- Merchant -->
  <text x="300" y="90" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="24" text-anchor="middle">BLUE BOTTLE COFFEE &amp; BISTRO</text>
  <text x="300" y="120" fill="#64748B" font-family="monospace" font-size="14" text-anchor="middle">315 University Ave, Palo Alto, CA 94301</text>
  <text x="300" y="142" fill="#64748B" font-family="monospace" font-size="14" text-anchor="middle">Tel: (650) 555-0199 • Tax ID: 84-2910481</text>

  <line x1="70" y1="170" x2="530" y2="170" stroke="#CBD5E1" stroke-dasharray="4" />
  
  <!-- Meta -->
  <text x="70" y="200" fill="#334155" font-family="monospace" font-size="14">Date: Oct 24, 2026</text>
  <text x="380" y="200" fill="#334155" font-family="monospace" font-size="14">Time: 12:45 PM</text>
  <text x="70" y="225" fill="#334155" font-family="monospace" font-size="14">Invoice #: INV-2026-9941</text>
  <text x="380" y="225" fill="#334155" font-family="monospace" font-size="14">Server: Michael B.</text>

  <line x1="70" y1="250" x2="530" y2="250" stroke="#0F172A" stroke-width="2" />
  <text x="70" y="275" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="14">ITEM DESCRIPTION</text>
  <text x="350" y="275" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="14">QTY</text>
  <text x="470" y="275" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="14">PRICE</text>
  <line x1="70" y1="290" x2="530" y2="290" stroke="#CBD5E1" />

  <!-- Items -->
  <text x="70" y="325" fill="#1E293B" font-family="monospace" font-size="14">Single Origin Pour-over</text>
  <text x="360" y="325" fill="#1E293B" font-family="monospace" font-size="14">2</text>
  <text x="470" y="325" fill="#1E293B" font-family="monospace" font-size="14">$14.00</text>

  <text x="70" y="360" fill="#1E293B" font-family="monospace" font-size="14">Avocado Tartine &amp; Egg</text>
  <text x="360" y="360" fill="#1E293B" font-family="monospace" font-size="14">2</text>
  <text x="470" y="360" fill="#1E293B" font-family="monospace" font-size="14">$36.00</text>

  <text x="70" y="395" fill="#1E293B" font-family="monospace" font-size="14">Almond Croissant</text>
  <text x="360" y="395" fill="#1E293B" font-family="monospace" font-size="14">1</text>
  <text x="470" y="395" fill="#1E293B" font-family="monospace" font-size="14">$6.50</text>

  <text x="70" y="430" fill="#1E293B" font-family="monospace" font-size="14">Sparkling Mineral Water</text>
  <text x="360" y="430" fill="#1E293B" font-family="monospace" font-size="14">2</text>
  <text x="470" y="430" fill="#1E293B" font-family="monospace" font-size="14">$8.00</text>

  <line x1="70" y1="460" x2="530" y2="460" stroke="#CBD5E1" />
  
  <text x="70" y="490" fill="#334155" font-family="monospace" font-size="14">Subtotal</text>
  <text x="470" y="490" fill="#334155" font-family="monospace" font-size="14">$64.50</text>
  <text x="70" y="520" fill="#334155" font-family="monospace" font-size="14">Sales Tax (9.25%)</text>
  <text x="470" y="520" fill="#334155" font-family="monospace" font-size="14">$5.97</text>
  <text x="70" y="550" fill="#334155" font-family="monospace" font-size="14">Tip (18%)</text>
  <text x="470" y="550" fill="#334155" font-family="monospace" font-size="14">$11.61</text>

  <line x1="70" y1="575" x2="530" y2="575" stroke="#0F172A" stroke-width="2" />
  <text x="70" y="615" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="20">TOTAL PAID (USD)</text>
  <text x="450" y="615" fill="#0F172A" font-family="monospace" font-weight="bold" font-size="22">$82.08</text>

  <text x="70" y="660" fill="#64748B" font-family="monospace" font-size="14">Payment: Visa ending in **** 4821</text>
  <text x="70" y="685" fill="#64748B" font-family="monospace" font-size="14">Auth Code: 092182 • Approved</text>

  <text x="300" y="740" fill="#0F172A" font-family="monospace" font-size="14" text-anchor="middle">THANK YOU FOR YOUR VISIT!</text>
  <text x="300" y="765" fill="#64748B" font-family="monospace" font-size="12" text-anchor="middle">Expense category: Business Meals &amp; Entertainment</text>
</svg>`;

// 6. Executive Business Card (Contact)
const businessCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="420" viewBox="0 0 700 420" fill="none">
  <rect width="700" height="420" rx="16" fill="#0B132B" stroke="#1C2541" stroke-width="3" />
  
  <rect x="50" y="50" width="8" height="320" rx="4" fill="#48CAE4" />
  
  <text x="80" y="100" fill="#F8FAFC" font-family="sans-serif" font-weight="bold" font-size="30">Dr. Elena Rostova</text>
  <text x="80" y="130" fill="#48CAE4" font-family="sans-serif" font-size="18">VP of Autonomous Systems &amp; Robotics</text>
  <text x="80" y="155" fill="#94A3B8" font-family="sans-serif" font-size="16">Cyberdyne Dynamics Inc.</text>

  <circle cx="95" cy="210" r="14" fill="#1C2541" />
  <text x="95" y="215" fill="#48CAE4" font-family="sans-serif" font-size="12" text-anchor="middle">📞</text>
  <text x="125" y="215" fill="#E2E8F0" font-family="sans-serif" font-size="16">+1 (415) 890-4321</text>

  <circle cx="95" cy="255" r="14" fill="#1C2541" />
  <text x="95" y="260" fill="#48CAE4" font-family="sans-serif" font-size="12" text-anchor="middle">✉️</text>
  <text x="125" y="260" fill="#E2E8F0" font-family="sans-serif" font-size="16">elena.rostova@cyberdyne-ai.io</text>

  <circle cx="95" cy="300" r="14" fill="#1C2541" />
  <text x="95" y="305" fill="#48CAE4" font-family="sans-serif" font-size="12" text-anchor="middle">🌐</text>
  <text x="125" y="300" fill="#E2E8F0" font-family="sans-serif" font-size="16">https://cyberdyne-ai.io/research</text>

  <circle cx="95" cy="345" r="14" fill="#1C2541" />
  <text x="95" y="350" fill="#48CAE4" font-family="sans-serif" font-size="12" text-anchor="middle">📍</text>
  <text x="125" y="345" fill="#94A3B8" font-family="sans-serif" font-size="15">500 Technology Square, Cambridge, MA 02139</text>

  <!-- QR placeholder -->
  <rect x="520" y="80" width="130" height="130" rx="8" fill="#FFFFFF" />
  <rect x="535" y="95" width="40" height="40" fill="#0B132B" />
  <rect x="595" y="95" width="40" height="40" fill="#0B132B" />
  <rect x="535" y="155" width="40" height="40" fill="#0B132B" />
  <rect x="585" y="145" width="20" height="20" fill="#0B132B" />
  <text x="585" y="235" fill="#94A3B8" font-family="sans-serif" font-size="12" text-anchor="middle">SCAN VCARD</text>
</svg>`;

// 7. Sensitive Data Warning Sample (Security Agent Demo)
const sensitiveDataSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <rect width="600" height="400" fill="#1E1E24" />
  <rect x="30" y="30" width="540" height="340" rx="12" fill="#2B2D42" stroke="#EF233C" stroke-width="2" />
  
  <text x="300" y="80" fill="#EF233C" font-family="sans-serif" font-weight="bold" font-size="22" text-anchor="middle">⚠️ SENSITIVE BANKING &amp; OTP VERIFICATION</text>
  
  <rect x="60" y="110" width="480" height="60" rx="8" fill="#1E1E24" />
  <text x="80" y="145" fill="#FFFFFF" font-family="monospace" font-size="18">Credit Card: 4532 •••• •••• 9821</text>
  <text x="380" y="145" fill="#FFB703" font-family="monospace" font-size="16">CVV: 891</text>

  <rect x="60" y="190" width="480" height="70" rx="8" fill="#1E1E24" />
  <text x="80" y="220" fill="#8D99AE" font-family="sans-serif" font-size="14">Your One-Time Passcode (OTP):</text>
  <text x="80" y="248" fill="#06D6A0" font-family="monospace" font-weight="bold" font-size="24">849-204</text>
  <text x="240" y="248" fill="#8D99AE" font-family="sans-serif" font-size="13">(Expires in 2 mins. Do not share!)</text>

  <text x="300" y="310" fill="#EDF2F4" font-family="sans-serif" font-size="14" text-anchor="middle">SnapAction Security Agent will flag sensitive info and suggest</text>
  <text x="300" y="335" fill="#EF233C" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">"Process Once — Do Not Save" privacy safeguard.</text>
</svg>`;

export const SAMPLE_SCREENSHOTS: SampleScreenshot[] = [
  {
    id: 'sample-job',
    title: 'Job Vacancy Poster',
    subtitle: 'HSE Lead Manager - Dubai ($95k-$125k, NEBOSH)',
    category: 'job_vacancy',
    badge: 'Flagship Job Match',
    thumbnailSvg: '💼',
    imageDataUri: svgToDataUri(jobVacancySvg),
    description: 'Real-world job opening with requirements, salary, deadline, and email. Tests CV Match, tailored resume bullets, cover letter, and application email review.',
  },
  {
    id: 'sample-ui',
    title: 'SaaS Analytics Dashboard',
    subtitle: 'Dark Mode UI with KPI cards, charts & agents table',
    category: 'ui_design',
    badge: 'Prompt Engine',
    thumbnailSvg: '📊',
    imageDataUri: svgToDataUri(saasDashboardSvg),
    description: 'Complex visual UI layout. Tests AI decomposition into Flutter / React prompts for Cursor, Claude, ChatGPT, and technical specifications.',
  },
  {
    id: 'sample-chat',
    title: 'Client WhatsApp Conversation',
    subtitle: 'Urgent deadline + enterprise quote inquiry',
    category: 'chat_message',
    badge: 'Communication',
    thumbnailSvg: '💬',
    imageDataUri: svgToDataUri(whatsappChatSvg),
    description: 'Customer chat message requiring quick professional, friendly, or firm replies and email follow-up.',
  },
  {
    id: 'sample-event',
    title: 'AI Vision World Congress 2026',
    subtitle: 'Conference poster with dates, Moscone Center & URL',
    category: 'event_poster',
    badge: 'Calendar & Maps',
    thumbnailSvg: '📅',
    imageDataUri: svgToDataUri(eventPosterSvg),
    description: 'Event poster. Tests date/time/venue extraction, Google Calendar link generation, and reminder setup.',
  },
  {
    id: 'sample-receipt',
    title: 'Coffee & Bistro Itemized Receipt',
    subtitle: 'Blue Bottle Coffee ($82.08 total, line items, tax)',
    category: 'receipt_invoice',
    badge: 'Expense Tracker',
    thumbnailSvg: '🧾',
    imageDataUri: svgToDataUri(receiptSvg),
    description: 'Itemized store bill. Tests line item breakdown, tax calculation, merchant extraction, and CSV export.',
  },
  {
    id: 'sample-contact',
    title: 'Executive Business Card',
    subtitle: 'Dr. Elena Rostova - VP Robotics, Phone, Email, Address',
    category: 'contact_card',
    badge: 'Contact Intent',
    thumbnailSvg: '📇',
    imageDataUri: svgToDataUri(businessCardSvg),
    description: 'Business card with contact info. Tests one-tap Call, SMS, WhatsApp, and vCard export.',
  },
  {
    id: 'sample-sensitive',
    title: 'Banking Card & OTP Screen',
    subtitle: 'Credit Card & Passcode (Privacy Safeguard Test)',
    category: 'code_error',
    badge: 'Security Agent',
    thumbnailSvg: '🛡️',
    imageDataUri: svgToDataUri(sensitiveDataSvg),
    description: 'Demonstrates real-time PII detection, redaction warnings, and automatic "Process Once — Do Not Save" privacy enforcement.',
  },
];
