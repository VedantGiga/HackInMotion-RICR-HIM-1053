# Koshin — Smart Expense Analyzer & Financial Health Dashboard

> *"Because you can't fix what you can't see — and most people can't see where their money actually goes."*

**Repository**: `HackInMotion-RICR-HIM-1053`  
**Team Code**: `RICR-HIM-1053`  
**Theme**: FinTech & Personal Finance  
**Framework**: Next.js 15 (App Router) + React 19 + Prisma + NextAuth + GSAP  

---

## 📌 Executive Summary & Problem Statement

Most people don't really know where their money goes each month. They earn, spend, and end the month surprised at how little remains — without understanding why. Bank statements are long, cryptic, and confusing (`TST* SBUX 4921` instead of `Food & Dining`). Traditional budgeting apps fail because manual transaction tagging is tedious and time-consuming.

**Koshin** is a smart, automated web application that turns raw transaction data into real financial understanding, honest plain-language guidance, and a dynamic 0–100 Financial Health Score. It acts like a **financial advisor in your pocket**.

---

## ⚡ Key Capabilities & Delivered Requirements

1. **User Accounts & Authentication**:
   - NextAuth.js session-based authentication with Prisma user models.
   - Secure account registration (`/api/v1/auth/register`), sign-in, and protected dashboard routing.

2. **Transaction Input & Bulk CSV/PDF Import**:
   - Manually add custom transactions with merchant, date, amount, and category tags.
   - Bulk import bank statement CSV files with automatic deduplication, multi-format date parsing (`DD/MM/YYYY`, `YYYY-MM-DD`), and auto-categorization enrichment (`/api/v1/transactions/import`).

3. **Hybrid NLP Vector & Levenshtein Categorization Engine**:
   - Classifies raw merchant strings into core category buckets: `Food & Dining`, `Housing & Rent`, `Subscriptions`, `Travel & Rides`, `Groceries`, `Utilities`, `Shopping`, `Income`, `Health & Medical`, and `Entertainment`.
   - Calculates character N-Gram token vector similarity and Levenshtein edit distance for typo-tolerant merchant normalization.
   - Assigns a 0.00 – 1.00 confidence rating and flags recurring subscription charges.

4. **Spending Pattern Analysis & Visual Dashboard**:
   - Real-time expense breakdown charts, category allocation bars, and MoM trend metrics.

5. **Dynamic Financial Health Score (0–100)**:
   - Evaluates savings velocity, net liquidity reserve, and subscription-to-income ratio.
   - Provides honest, actionable plain-language recommendations (*"You spent 40% more on food delivery this month — consider setting a limit to save $340/mo."*).

6. **Advanced SaaS Modules**:
   - **Subscription & Silent Bill Detector**: Identifies recurring monthly charges and flags unused free trials.
   - **"What-If" Savings Simulator**: Interactive slider controls projecting 1-year and 3-year compound savings.
   - **AI Natural-Language Assistant**: Ask questions in plain English (*"Where did I spend the most this month?"*) and receive instant data-backed answers.

---

## ⚙️ Categorization Engine Methodology

### Hybrid Rule-Based + Vector Cosine & Levenshtein Distance Algorithm
For automatic categorization, Koshin utilizes a high-throughput **hybrid classification engine** (`src/modules/categorization/index.ts`):

1. **Deterministic Pattern Matching** (Confidence: `0.95` – `0.99`):
   - Matches known merchant patterns (`Starbucks`, `Netflix`, `Uber`, `DoorDash`, `Amazon`, `Walmart`).
2. **N-Gram Character Vector Similarity** (Confidence: `0.80` – `0.94`):
   - Tokenizes unformatted bank descriptors into character tri-grams and computes vector similarity scores against category taxonomy clusters.
3. **Levenshtein Edit Distance** (Confidence: `0.70` – `0.85`):
   - Calculates string edit distances for typo-tolerant merchant normalization (`TST* SBUX 4921` → `Starbucks`).
4. **Normalized Merchant Cleanup**:
   - Strips transaction prefixes (`TST*`, `SQ*`, `PY*`), transaction IDs, and dates for clean UI display.

---

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom Fonts (Plus Jakarta Sans & Outfit), High-Contrast Typography
- **Animations & Interactivity**: GSAP 3, ScrollTrigger, Motion (Framer), Lenis Smooth Scroll
- **Backend API**: Next.js App Router API Routes (`/api/v1/transactions`, `/api/v1/budgets`, `/api/v1/goals`, `/api/v1/analysis/health`, `/api/v1/analysis/spending`)
- **Authentication**: NextAuth.js, JWT Sessions, Bcrypt Encryption
- **Database & ORM**: Prisma ORM (v7.9), SQLite / LibSQL Engine
- **Icons & CSV Parsing**: Lucide React, PapaParse

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```sh
npm install
```

### 2. Run Database Migrations & Prisma Setup
```sh
npx prisma generate
npx prisma db push
```

### 3. Start Development Server
```sh
npm run dev
```

### 4. Build & Lint for Production
```sh
npm run build
npm run lint
```

---

## 📄 Repository Deliverables & Assets

- `architecture-diagram.png` & `architecture-diagram.svg` — System Architecture Diagram
- `presentation.pptx` — Executive 7-slide Presentation Deck
- `api-documentation.md` — Complete REST API Documentation (/api/v1)
- `src/app/api/v1/` — Next.js 15 REST API endpoints
- `src/modules/categorization/index.ts` — Hybrid NLP Vector Categorization Module
- `src/components/site/KoshinDashboard.tsx` — Full SaaS Interactive Dashboard
- `README.md` — HackInMotion Audit Specification Compliance Document
