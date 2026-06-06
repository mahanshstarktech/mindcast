# MindCast — Your Exam Weather Station ⛅🌀

> A smart, calm mental wellness companion for Indian exam warriors.
> Built for Google Prompt Wars 2025.

## 🎯 Chosen Vertical
**Mental Wellness Tracker** for students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and Board exams.

## 💡 Core Concept: Exam Weather Metaphor
Your mental state is mapped to weather vocabulary — ☀️ Clear Skies when you're thriving, 🌀 Hurricane when you need immediate support. The dashboard reads like a personal weather station for your mind: intuitive, expressive, and emotionally resonant.

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript (strict) |
| UI Components | shadcn/ui + Tailwind CSS |
| Animations | Framer Motion 11 |
| State | Zustand with localStorage persistence |
| Validation | Zod + React Hook Form |
| Charts | Recharts |
| Testing | Jest + React Testing Library |
| Deploy | Vercel (free tier) |

## 🧠 How It Works

1. **Daily Mood Check-In** → You select a mood (1–5) via emoji buttons or slider
2. **Trigger Tracking** → Tag what's stressing you (up to 5 tags)
3. **Rule Engine** → 7 deterministic rules fire based on your mood + triggers + history
4. **Personalized Tips** → 2–4 tailored recommendations appear instantly (no AI API — pure logic)
5. **Reflection** → Rotating prompts help you process emotions in writing
6. **Weekly Report** → 7-day mood trend chart + top triggers + recovery streak
7. **Reset Mode** → Box breathing, hydration check, or 5-minute micro-break timer

## ⚡ Rule Engine Logic (no AI, fully deterministic)
- Mood ≤ 2 + sleep loss → Sleep Reset Protocol
- 3 consecutive low-mood days → "Your Mind Needs a Pit Stop"
- Mock test trigger → Pre-Test Power Ritual
- Comparison trigger → Run Your Own Race mindset shift
- Family pressure trigger → Communication script
- Mood ≥ 4 → Momentum maintenance
- Top weekly trigger pattern → Surfaced in Climate Report

## ♿ Accessibility
WCAG 2.1 AA compliant. Full keyboard navigation. ARIA landmarks, roles, and live regions throughout. Reduced-motion support. 44px minimum touch targets. Screen reader optimized.

## 🔒 Security
- Zero backend. Zero auth. All data lives in your browser.
- Input sanitization on all text fields (HTML strip, XSS prevention)
- Security headers: X-Frame-Options, CSP, X-Content-Type-Options
- localStorage data validated with Zod on every read (corrupt data handled gracefully)

## 🚀 Run Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 🧪 Tests
```bash
npm test
npm run test:coverage
```

## 📦 Assumptions
- Target audience: Indian students aged 16–28
- Single-user, single-device experience
- No account or login required — privacy-first
- Data persists across sessions via localStorage
- Crisis helplines are Indian numbers (iCall, Vandrevala Foundation, NIMHANS)

## 💙 Mental Health Resources
If you're experiencing severe distress:
- **iCall (TISS):** 9152987821
- **Vandrevala Foundation (24/7):** 1860-2662-345
- **NIMHANS:** 080-46110007
