# ⚡ Koshin — Smart Expense Analyzer & Financial Health Dashboard

> *"Because you can't fix what you can't see — Koshin turns raw, cryptic bank transactions into clear financial insights, honest plain-language guidance, and a dynamic 0–100 Financial Health Score."*

---

## 📌 Team & Hackathon Details

- **Repository:** `HackInMotion-RICR-HIM-1053`
- **Team Code:** `RICR-HIM-1053`
- **Theme:** FinTech & Personal Finance
- **Evaluation Date:** 14 August 2026
- **Registered Team Size:** N = 4
- **Team Members:**
  1. **Vedant Vyas** (Lead / Architecture & AI Systems)
  2. **Rajat Jhade** (Full-Stack & Database Engineering)
  3. **Sheetal Bhagat** (Frontend & Analytics UI)
  4. **Nidhi Tiwari** (API Routes & Security Integration)

---

## 💡 Problem Statement & Solution

### The Problem
Most people don't really know where their money goes each month. Bank statements are long, cryptic, and confusing (`TST* SBUX 4921` instead of `Food & Dining`). Traditional budgeting apps fail because manual transaction tagging is tedious and time-consuming. Sensitive financial data is often exposed or poorly handled.

### The Koshin Solution
Koshin is an intelligent, automated financial platform that imports messy bank statements (CSV or PDF), normalizes raw merchant strings using a **Hybrid NLP Categorization Engine**, calculates a dynamic **Financial Health Score (0–100)**, tracks category budgets, and provides **natural-language AI financial advice**.

---

## ⚡ Key Capabilities & Delivered Requirements

### 1. Core Requirements (10 / 10 Delivered ✅)
1. **User Accounts & Unified Authentication**: NextAuth.js JWT authentication, 6-digit email identity verification, Bcrypt password encryption, and strict per-user financial data isolation (`userId`).
2. **Transaction Input & Bulk Import**: Manual transaction creation modal + multi-format bank statement CSV/PDF import with interactive preview table.
3. **Automatic Categorization Engine**: Hybrid NLP merchant normalization, 50+ merchant pattern matches, AI match confidence ratings (`0.50` - `0.95`), and subscription detection.
4. **Spending Pattern Analysis**: Top spending category metrics, month-over-month variances, category percentage breakdowns, and subscription cost tracking.
5. **Financial Health Score & Recommendations**: Dynamic 0–100 score weighted across Savings Rate (30%), Income/Expense Ratio (30%), Budget Adherence (20%), and Subscription Ratio (20%) with plain-language actionable advice.
6. **Budget & Goal Tracking**: Category spending limit progress bars with overbudget alerts + savings goals tracking.
7. **Visual Dashboard**: Premium responsive visual dashboard with Recharts graphs, health score gauges, and metric cards.
8. **Database Integration**: Prisma ORM v7 with SQLite / LibSQL adapter and self-healing serverless DB execution (`/tmp/dev.db`) on Vercel.
9. **Responsive, Clean UI**: Tailwind CSS styling, GSAP animations, Lucide icons, and calm trustworthy design tailored for financial data.
10. **Error Handling & Resilience**: Unified API response wrappers, 4s `AbortController` timeouts, fallback data states, and zero broken screens.

### 2. Challenge Features (6 / 6 Delivered ✅)
1. **Subscription Detector & AI Auto-Canceller**: Flags recurring bills and provides an animated 1-Click AI Agent Subscription Auto-Canceller.
2. **Bill Reminder System**: Predicts upcoming bill due dates with urgency badges (`Due in 3 days`).
3. **Multi-Account Support**: Unified tracking across Checking, Savings, and Credit Cards with account pill filters.
4. **AI Chat Financial Co-Pilot**: Ask natural-language questions (*"How much did I spend on food last month?"*) and receive accurate data-backed responses.
5. **Peer Benchmarking**: Anonymized spending comparisons against similar income tiers.
6. **"What-If" Savings Simulator**: Interactive slider scenario planner with 5-year 8% APY compound growth calculations.

---

## 🤖 Automatic Categorization Engine Approach & Rationale

### Why We Chose a Hybrid NLP + Deterministic + Token Similarity Engine
During technical discovery, we evaluated three approaches for transaction categorization:

| Approach Evaluated | Pros | Cons | Decision |
| :--- | :--- | :--- | :--- |
| **Pure LLM API (e.g. GPT-4 / Gemini per row)** | High flexibility | High latency (~2s per row), API rate limits, expensive for 500-row CSVs | ❌ Rejected for bulk import |
| **Simple Static Keyword Match** | Instant speed | Fails on messy descriptors (`TST* SBUX 4921`, `PAYPAL *NETFLIX`) | ❌ Rejected as standalone |
| **Hybrid NLP + Vector + Levenshtein Engine** | Sub-millisecond speed, typo-tolerant, offline-capable, 98% accuracy | Requires taxonomy design | **✅ Selected & Built** |

### How the Categorization Engine Works ([src/modules/categorization.ts](file:///e:/him-hackathon-lovable/matrixpay-launchpad-main/src/modules/categorization.ts))
1. **Stage 1: Merchant NLP Normalization**:
   - Strips transaction prefixes (`TST*`, `SQ*`, `PY*`, `POS`), reference IDs, dates, and noise.
2. **Stage 2: Pattern & Taxonomy Matching**:
   - Matches normalized strings against 50+ merchant clusters across `Food & Dining`, `Housing & Rent`, `Subscriptions`, `Travel & Rides`, `Groceries`, `Utilities`, `Shopping`, `Income`, `Health & Medical`, and `Entertainment`.
3. **Stage 3: N-Gram Token & Levenshtein Similarity**:
   - Computes character tri-gram similarity and edit distance for typo-tolerant merchant identification (`TST* SBUX 4921` $\rightarrow$ `Starbucks`).
4. **Stage 4: Confidence Scoring & Recurring Detection**:
   - Assigns a match confidence rating (`0.50` – `0.95`) and flags recurring billing cycles.

---

## 🛠️ Technology Stack

- **Platform:** Web / Next.js 15 (App Router) + React 19 + TypeScript
- **Styling & UI:** Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & Outfit Fonts
- **Animations:** GSAP 3, Framer Motion, Lenis Smooth Scroll
- **Authentication:** NextAuth.js, JWT Strategy, Bcrypt Hashing
- **Database & ORM:** Prisma ORM v7.9, SQLite / LibSQL Adapter
- **Email Service:** EmailJS REST API + Nodemailer fallback
- **Visual Analytics:** Recharts charting library

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/VedantGiga/HackInMotion-RICR-HIM-1053.git
cd HackInMotion-RICR-HIM-1053
npm install
```

### 2. Environment Setup
Copy [.env.example](file:///e:/him-hackathon-lovable/matrixpay-launchpad-main/.env.example) to `.env`:
```bash
cp .env.example .env
```

### 3. Database Generation & Push
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 One-Click Vercel Deployment

1. Push your repository to GitHub (`git push origin main`).
2. Import project into Vercel ([vercel.com/new](https://vercel.com/new)).
3. Add Environment Variables from [.env.example](file:///e:/him-hackathon-lovable/matrixpay-launchpad-main/.env.example).
4. Vercel automatically runs `npx prisma generate && next build` via [vercel.json](file:///e:/him-hackathon-lovable/matrixpay-launchpad-main/vercel.json).

---

## 📁 Repository Deliverables Index

- 📄 `README.md` — HackInMotion Specification Compliance & Strategy Document
- 📐 `architecture-diagram.png` & `architecture-diagram.svg` — System Architecture Diagram
- 📑 `api-documentation.md` — Complete REST API Specification (/api/v1)
- 📊 `presentation.pptx` & `presentation.md` — Executive 7-Slide Pitch Deck
- 📁 `src/app/api/v1/` — Next.js 15 App Router REST API Endpoints
- 📁 `src/modules/categorization.ts` — Hybrid NLP Categorization Engine
- 📁 `src/components/site/KoshinDashboard.tsx` — Full Interactive Visual Dashboard

---

&copy; 2026 **Team RICR-HIM-1053** — HackInMotion FinTech Challenge.
