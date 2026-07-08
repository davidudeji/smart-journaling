A single-page, frontend-only web application that lets a user journal freely, runs a local (in-browser) NLP sentiment model over each entry, translates the raw model output into a "peak performance" psychological state, logs the result over time, and surfaces a science-backed intervention. No backend, no network calls after initial asset load — all inference and storage happen client-side.

## Features

### 📝 Smart Journal
- Private, local journaling with real-time sentiment analysis
- Automatic psychological state detection (Flow, Stress, Baseline)
- Contextual interventions based on detected state
- 7-day performance trend visualization
- Optional AES-256 encryption with passphrase protection
- Import/export journal entries as JSON

### 🎯 Performance Hub
- **Focus Engine**: 25-minute Pomodoro timer with auto-journaling completions
- **Daily Metrics Logger**: Track energy, focus, and sleep levels (1-10 scale)
- **Performance Analytics**: Multi-axis 7-day trend chart showing correlations between sleep, energy, and focus
- **Session History**: View completed focus sessions with timestamps

### 🔐 Privacy First
- 100% local computation — no backend, no network tracking
- Optional encryption using Web Crypto API (AES-256-GCM)
- All ML inference runs in-browser
- No personal data leaves your machine

### ⚡ Tech Stack
- Vanilla JavaScript (no frameworks)
- Browser-based ML: Xenova Transformers (distilBERT)
- Data visualization: Chart.js
- Storage: localStorage with encryption
- Deployment: Vercel

---

## Getting Started

1. **Open** [https://peak-journal.vercel.app](https://peak-journal.vercel.app) (or run locally)
2. **Journal**: Write freely about your day, click "Analyze & Save"
3. **Performance Hub**: Switch tabs to track metrics and manage focus sessions
4. **Encrypt** (optional): Enable encryption and set a passphrase for privacy

## Learning Resource

**→ See [explainer.md](explainer.md) for a complete technical breakdown**

This document covers:
- Architecture & data flow
- Feature deep dives with code examples
- How to extend the project
- Privacy & security guarantees
- Complete API reference

---

Primary user: a solo, performance-focused individual (founder, trader, student-athlete type) who wants a low-friction daily check-in tool with integrated performance tracking.

Core value proposition: journaling + real-time psychological signal extraction + trend visibility + performance metrics correlation + immediate, actionable next steps — all private, all local.
