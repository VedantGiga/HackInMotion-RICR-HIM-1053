# Koshin — Smart Expense Analyzer & Financial Health Dashboard

> *"Because you can't fix what you can't see — and most people can't see where their money actually goes."*

---

## 📌 Executive Summary & Problem Statement

Most people don't really know where their money goes each month. They earn, spend, and end the month surprised at how little remains — without understanding why. Bank statements are long, cryptic, and confusing (`DD *DOORDASH SAN FRANCISCO` instead of `Food & Dining`). Traditional budgeting apps fail because manual transaction tagging is tedious and time-consuming.

**Koshin** is a smart, automated web application that turns raw transaction data into real financial understanding, honest plain-language guidance, and a dynamic 0–100 Financial Health Score. It acts like a **financial advisor in your pocket**.

---

## ⚡ Key Capabilities & Must-Haves

1. **User Accounts & Data Privacy**: Secure sign-up/login architecture with encrypted in-memory and local storage.
2. **Transaction Input & Bulk CSV Import**:
   - Manually add custom transactions with merchant, date, amount, and type.
   - Bulk import bank statement CSV files with automatic handling of inconsistent descriptions.
3. **Automatic Categorization Engine**:
   - Classifies raw merchant strings into 8 core categories: `Food & Dining`, `Housing & Rent`, `Subscriptions`, `Travel & Transport`, `Bills & Utilities`, `Shopping`, `Salary & Income`, and `Entertainment`.
   - Assigns a 0–100% confidence rating to every tagged transaction.
4. **Spending Pattern Analysis & Visual Dashboard**:
   - Real-time pie charts, expense distribution bars, and MoM trend comparisons.
5. **Dynamic Financial Health Score (0–100)**:
   - Evaluates savings rate, net liquidity reserve, and subscription-to-income ratio.
   - Provides honest, actionable plain-language recommendations (*"You spent 40% more on food delivery this month compared to last month — consider setting a limit."*).
6. **Advanced Modules**:
   - **Subscription & Trial Detector**: Identifies recurring monthly charges and flags unused free trials.
   - **Upcoming Bill Predictor**: Predicts recurring bill due dates and notifies users before deadlines.
   - **"What-If" Savings Simulator**: Drag interactive sliders to simulate cutting food delivery or subscriptions and visualize projected annual wealth impact.
   - **AI Natural-Language Assistant**: Ask questions in plain English (*"How much did I spend on food last month?"*) and receive instant data-backed answers.

---

## ⚙️ Categorization Engine Methodology & Architecture

### Approach Chosen: Hybrid Rule-Based Keyword Pattern + NLP Model
For the automatic categorization core, Koshin utilizes a high-throughput **hybrid classification engine**:
- **Deterministic Pattern Matching**: Matches known merchant prefixes (`DoorDash`, `Netflix`, `Uber`, `Whole Foods`, `ConEd`, `iCloud`) to primary categories with 95%+ confidence.
- **Natural Language Parsing**: Tokenizes unformatted bank descriptors, strips transaction codes/dates, and maps vector distances to category clusters.
- **Confidence Scoring**: Each output carries a `confidence` rating (0.00 – 1.00). Low confidence triggers a flag for user review.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19, TanStack Start (SSR & Vite build engine), TanStack Router
- **Styling**: Tailwind CSS v4, Custom OKLCH Color Palette, High-Contrast Editorial Typography
- **Animations & Interactivity**: GSAP 3, ScrollTrigger, Framer Motion, Lenis Smooth Scroll
- **Icons & Visuals**: Lucide React
- **Package Manager**: npm

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```sh
npm install
```

### 2. Start Development Server
```sh
npm run dev
```

### 3. Build for Production
```sh
npm run build
```

---

## 📄 Repository Deliverables

- `src/components/site/KoshinDashboard.tsx` — Full interactive Koshin Dashboard & AI Assistant sandbox
- `src/components/site/` — High-impact landing page components (Hero, Auto-Categorization Spotlight, Financial Health Score breakdown, Innovation Modules)
- `README.md` — Complete hackathon specification compliance document
