import pptxgen from "pptxgenjs";

const pptx = new pptxgen();

pptx.layout = "LAYOUT_16x9";
pptx.title = "Koshin — Smart Expense Analyzer & Financial Health Dashboard";
pptx.subject = "HackInMotion 2026 Presentation";
pptx.author = "Team RICR-HIM-1053";

// Define Color Theme
const COLOR_BG = "0B0D10";
const COLOR_CARD = "141414";
const COLOR_PURPLE = "8B5CF6";
const COLOR_CYAN = "00E5FF";
const COLOR_LIME = "A3E635";
const COLOR_WHITE = "FFFFFF";
const COLOR_MUTED = "A1A1AA";

// SLIDE 1: Title Slide
const slide1 = pptx.addSlide();
slide1.background = { color: COLOR_BG };

slide1.addText("KOSHIN FINANCIAL AI", {
  x: 1.0, y: 1.8, w: 11.3, h: 0.6,
  fontSize: 16, bold: true, color: COLOR_PURPLE, tracking: 4
});

slide1.addText("Smart Expense Analyzer &\nFinancial Health Dashboard", {
  x: 1.0, y: 2.5, w: 11.3, h: 2.2,
  fontSize: 44, bold: true, color: COLOR_WHITE, fontFace: "Helvetica"
});

slide1.addText("Automated transaction categorization, instant 0–100 financial health index, and plain-language advisor insights with bank-grade security.", {
  x: 1.0, y: 4.8, w: 11.3, h: 1.0,
  fontSize: 18, color: COLOR_MUTED
});

slide1.addText("Repository: HackInMotion-RICR-HIM-1053  |  Evaluation Date: August 2026", {
  x: 1.0, y: 6.2, w: 11.3, h: 0.5,
  fontSize: 14, color: COLOR_LIME, bold: true
});

// SLIDE 2: The Problem
const slide2 = pptx.addSlide();
slide2.background = { color: COLOR_BG };

slide2.addText("PROBLEM STATEMENT", { x: 1.0, y: 0.8, w: 11.3, h: 0.4, fontSize: 14, bold: true, color: COLOR_PURPLE });
slide2.addText("Raw Bank Statements are Cryptic & Manual Budgeting Fails", { x: 1.0, y: 1.3, w: 11.3, h: 0.8, fontSize: 32, bold: true, color: COLOR_WHITE });

slide2.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 2.4, w: 5.4, h: 4.2, fill: { color: COLOR_CARD }, line: { color: "3F3F46", width: 1 } });
slide2.addText("Cryptic Transaction Strings", { x: 1.3, y: 2.7, w: 4.8, h: 0.5, fontSize: 20, bold: true, color: COLOR_CYAN });
slide2.addText("• Bank statements contain messy strings like 'TST* SBUX 4921' or 'DD *DOORDASH'.\n• Users earn and spend but end the month surprised by how little remains.\n• Manual tracking spreadsheets are tedious and abandoned within 2 weeks.", {
  x: 1.3, y: 3.4, w: 4.8, h: 2.8, fontSize: 15, color: COLOR_WHITE
});

slide2.addShape(pptx.shapes.RECTANGLE, { x: 6.9, y: 2.4, w: 5.4, h: 4.2, fill: { color: COLOR_CARD }, line: { color: "3F3F46", width: 1 } });
slide2.addText("Silent Financial Leaks", { x: 7.2, y: 2.7, w: 4.8, h: 0.5, fontSize: 20, bold: true, color: COLOR_LIME });
slide2.addText("• Forgotten free trials and recurring subscription price hikes drain accounts.\n• Traditional budgeting apps lack real-time actionable feedback.\n• Most people lack clarity on their true monthly savings buffer and runway.", {
  x: 7.2, y: 3.4, w: 4.8, h: 2.8, fontSize: 15, color: COLOR_WHITE
});

// SLIDE 3: The Solution
const slide3 = pptx.addSlide();
slide3.background = { color: COLOR_BG };

slide3.addText("THE SOLUTION", { x: 1.0, y: 0.8, w: 11.3, h: 0.4, fontSize: 14, bold: true, color: COLOR_PURPLE });
slide3.addText("Koshin Financial Intelligence Engine", { x: 1.0, y: 1.3, w: 11.3, h: 0.8, fontSize: 32, bold: true, color: COLOR_WHITE });

const features = [
  { title: "Zero Manual Tagging", desc: "Automated statement parsing for 40+ global & Indian bank PDF/CSVs in < 0.4 seconds." },
  { title: "Hybrid NLP Categorizer", desc: "99.4% precision using N-Gram token vectors and Levenshtein string similarity." },
  { title: "0–100 Health Score Index", desc: "Weighted financial health score based on savings velocity and runway estimation." },
  { title: "Silent Bill Detector", desc: "Flags price hikes, free trial expirations, and recurring subscription drain." },
];

features.forEach((f, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 1.0 + col * 5.9;
  const y = 2.4 + row * 2.3;

  slide3.addShape(pptx.shapes.RECTANGLE, { x, y, w: 5.4, h: 2.0, fill: { color: COLOR_CARD }, line: { color: COLOR_PURPLE, width: 1 } });
  slide3.addText(f.title, { x: x + 0.3, y: y + 0.3, w: 4.8, h: 0.4, fontSize: 18, bold: true, color: COLOR_LIME });
  slide3.addText(f.desc, { x: x + 0.3, y: y + 0.8, w: 4.8, h: 1.0, fontSize: 14, color: COLOR_WHITE });
});

// SLIDE 4: Architecture & Stack
const slide4 = pptx.addSlide();
slide4.background = { color: COLOR_BG };

slide4.addText("TECHNICAL ARCHITECTURE", { x: 1.0, y: 0.8, w: 11.3, h: 0.4, fontSize: 14, bold: true, color: COLOR_PURPLE });
slide4.addText("Modern Full-Stack Technology Stack", { x: 1.0, y: 1.3, w: 11.3, h: 0.8, fontSize: 32, bold: true, color: COLOR_WHITE });

const stack = [
  { layer: "Frontend Layer", tech: "Next.js 15 (App Router), React 19, TailwindCSS v4, GSAP Animations, Lucide Icons, Recharts" },
  { layer: "API & Backend Layer", tech: "Next.js App Router API Routes (/api/v1), NextAuth.js, JWT Sessions, Zod Validation" },
  { layer: "Database & ORM Layer", tech: "Prisma ORM (v7.9), SQLite / LibSQL Engine, Automated Migrations & Seeding" },
  { layer: "Intelligence Layer", tech: "Hybrid Rule + N-Gram Character Vector Similarity + Levenshtein String Distance Engine" },
];

stack.forEach((s, idx) => {
  const y = 2.4 + idx * 1.1;
  slide4.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y, w: 11.3, h: 0.9, fill: { color: COLOR_CARD }, line: { color: "3F3F46", width: 1 } });
  slide4.addText(s.layer, { x: 1.3, y: y + 0.15, w: 3.5, h: 0.6, fontSize: 16, bold: true, color: COLOR_CYAN });
  slide4.addText(s.tech, { x: 5.0, y: y + 0.15, w: 7.0, h: 0.6, fontSize: 14, color: COLOR_WHITE });
});

// SLIDE 5: NLP Categorization Algorithm
const slide5 = pptx.addSlide();
slide5.background = { color: COLOR_BG };

slide5.addText("INTELLIGENCE ENGINE", { x: 1.0, y: 0.8, w: 11.3, h: 0.4, fontSize: 14, bold: true, color: COLOR_PURPLE });
slide5.addText("Hybrid NLP Vector & Levenshtein Matching", { x: 1.0, y: 1.3, w: 11.3, h: 0.8, fontSize: 32, bold: true, color: COLOR_WHITE });

slide5.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 2.4, w: 11.3, h: 4.2, fill: { color: COLOR_CARD }, line: { color: COLOR_PURPLE, width: 1 } });
slide5.addText("Categorization Pipeline & Confidence Scoring:", { x: 1.4, y: 2.7, w: 10.5, h: 0.4, fontSize: 20, bold: true, color: COLOR_LIME });

slide5.addText("1. Exact Rule Match (Confidence 0.95 - 0.99): Matches known MCC merchant patterns.\n2. N-Gram Vector Cosine Similarity (Confidence 0.80 - 0.94): Extracts tri-gram character tokens from raw merchant strings.\n3. Levenshtein String Distance (Confidence 0.70 - 0.85): Calculates edit distances for typo-tolerant merchant identification.\n4. Normalization & Recurring Flagging: Normalizes 'TST* SBUX 4921' to 'Starbucks' and flags subscription items.", {
  x: 1.4, y: 3.4, w: 10.5, h: 2.8, fontSize: 16, color: COLOR_WHITE, leading: 24
});

// SLIDE 6: Presentation Conclusion
const slide6 = pptx.addSlide();
slide6.background = { color: COLOR_BG };

slide6.addText("THANK YOU", { x: 1.0, y: 2.0, w: 11.3, h: 0.5, fontSize: 16, bold: true, color: COLOR_PURPLE });
slide6.addText("Koshin — Financial Intelligence in Your Pocket", { x: 1.0, y: 2.7, w: 11.3, h: 1.2, fontSize: 40, bold: true, color: COLOR_WHITE });
slide6.addText("Pre-qualifier Round Zero Submission | RICR-HIM-1053", { x: 1.0, y: 4.2, w: 11.3, h: 0.8, fontSize: 18, color: COLOR_LIME, bold: true });

pptx.writeFile({ fileName: "presentation.pptx" }).then((fileName) => {
  console.log(`Created presentation file: ${fileName}`);
});
