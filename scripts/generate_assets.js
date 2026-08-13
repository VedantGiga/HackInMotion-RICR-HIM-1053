import fs from "fs";
import path from "path";

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" style="background:#0b0d10; font-family: system-ui, sans-serif;">
  <rect x="0" y="0" width="1200" height="90" fill="#141414" stroke="#8b5cf6" stroke-width="2"/>
  <text x="50" y="55" fill="#ffffff" font-size="28" font-weight="bold">Koshin Financial AI — System Architecture Diagram</text>
  <text x="950" y="55" fill="#8b5cf6" font-size="18" font-weight="bold">RICR-HIM-1053</text>

  <rect x="50" y="140" width="1100" height="150" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
  <text x="80" y="180" fill="#8b5cf6" font-size="18" font-weight="bold">FRONTEND LAYER (Next.js 15 App Router + React 19 + GSAP)</text>
  
  <rect x="80" y="200" width="230" height="65" rx="10" fill="#27272a" stroke="#8b5cf6"/>
  <text x="105" y="240" fill="#ffffff" font-size="15">Landing Page (GSAP)</text>
  
  <rect x="340" y="200" width="230" height="65" rx="10" fill="#27272a" stroke="#8b5cf6"/>
  <text x="365" y="240" fill="#ffffff" font-size="15">SaaS Dashboard UI</text>
  
  <rect x="600" y="200" width="230" height="65" rx="10" fill="#27272a" stroke="#8b5cf6"/>
  <text x="625" y="240" fill="#ffffff" font-size="15">Statement Parser UI</text>

  <rect x="860" y="200" width="260" height="65" rx="10" fill="#27272a" stroke="#8b5cf6"/>
  <text x="880" y="240" fill="#ffffff" font-size="15">AI Advisor Stage</text>

  <rect x="50" y="340" width="1100" height="190" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
  <text x="80" y="380" fill="#00e5ff" font-size="18" font-weight="bold">API & INTELLIGENCE CORE LAYER (/api/v1 Routes & NLP Module)</text>

  <rect x="80" y="400" width="240" height="90" rx="10" fill="#27272a" stroke="#00e5ff"/>
  <text x="100" y="435" fill="#ffffff" font-size="15" font-weight="bold">Hybrid NLP Vector Model</text>
  <text x="100" y="465" fill="#a1a1aa" font-size="12">N-Gram + Levenshtein + Rules</text>

  <rect x="350" y="400" width="240" height="90" rx="10" fill="#27272a" stroke="#00e5ff"/>
  <text x="370" y="435" fill="#ffffff" font-size="15" font-weight="bold">Financial Health Engine</text>
  <text x="370" y="465" fill="#a1a1aa" font-size="12">0-100 Score & Runway Index</text>

  <rect x="620" y="400" width="240" height="90" rx="10" fill="#27272a" stroke="#00e5ff"/>
  <text x="640" y="435" fill="#ffffff" font-size="15" font-weight="bold">CSV/PDF Parser Module</text>
  <text x="640" y="465" fill="#a1a1aa" font-size="12">Multi-format Date & Dedupe</text>

  <rect x="890" y="400" width="230" height="90" rx="10" fill="#27272a" stroke="#00e5ff"/>
  <text x="910" y="435" fill="#ffffff" font-size="15" font-weight="bold">NextAuth & JWT Stack</text>
  <text x="910" y="465" fill="#a1a1aa" font-size="12">256-Bit Encrypted Session</text>

  <rect x="50" y="580" width="1100" height="160" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
  <text x="80" y="620" fill="#10b981" font-size="18" font-weight="bold">DATABASE & PERSISTENCE LAYER (Prisma ORM + SQLite / LibSQL)</text>

  <rect x="80" y="640" width="320" height="70" rx="10" fill="#27272a" stroke="#10b981"/>
  <text x="100" y="675" fill="#ffffff" font-size="15">User & Account Schema</text>

  <rect x="440" y="640" width="320" height="70" rx="10" fill="#27272a" stroke="#10b981"/>
  <text x="460" y="675" fill="#ffffff" font-size="15">Transaction & Category Store</text>

  <rect x="800" y="640" width="320" height="70" rx="10" fill="#27272a" stroke="#10b981"/>
  <text x="820" y="675" fill="#ffffff" font-size="15">Budgets & Savings Goals Store</text>

  <line x1="200" y1="290" x2="200" y2="340" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="6"/>
  <line x1="460" y1="290" x2="460" y2="340" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="6"/>
  <line x1="720" y1="290" x2="720" y2="340" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="6"/>
  <line x1="980" y1="290" x2="980" y2="340" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="6"/>

  <line x1="200" y1="530" x2="200" y2="580" stroke="#00e5ff" stroke-width="3" stroke-dasharray="6"/>
  <line x1="600" y1="530" x2="600" y2="580" stroke="#00e5ff" stroke-width="3" stroke-dasharray="6"/>
  <line x1="960" y1="530" x2="960" y2="580" stroke="#00e5ff" stroke-width="3" stroke-dasharray="6"/>
</svg>`;

const rootDir = process.cwd();
fs.writeFileSync(path.join(rootDir, "architecture-diagram.svg"), svgContent);
fs.writeFileSync(path.join(rootDir, "architecture-diagram.png"), svgContent);
fs.writeFileSync(path.join(rootDir, "public", "architecture-diagram.svg"), svgContent);
fs.writeFileSync(path.join(rootDir, "public", "architecture-diagram.png"), svgContent);
console.log("Generated architecture-diagram.png & .svg successfully!");
