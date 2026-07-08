Smart Peak Performance & Mental Fitness Journal — Software Specification

1. Overview

A single-page, frontend-only web application that lets a user journal freely, runs a local (in-browser) NLP sentiment model over each entry, translates the raw model output into a "peak performance" psychological state, logs the result over time, and surfaces a science-backed intervention. No backend, no network calls after initial asset load — all inference and storage happen client-side.

Primary user: a solo, performance-focused individual (founder, trader, student-athlete type) who wants a low-friction daily check-in tool.

Core value proposition: journaling + real-time psychological signal extraction + trend visibility + an immediate, actionable next step — all private, all local.

2. Goals & Non-Goals

Goals

Zero-install, zero-signup, works from one index.html file opened in a modern browser.

Real user data never leaves the device.

Fast enough that analysis feels "live" (sub-2s after model warm-up).

Historical trend visible after as few as 2 entries.

Non-goals (MVP)

No multi-user accounts, no cloud sync, no server.

No clinical diagnostic claims — this is a performance-coaching framing, not a mental-health diagnostic tool.

No mobile app; responsive web only.

3. Architecture

index.html
 ├── <head>: CDN imports (Chart.js, Transformers.js as ES module), inline <style>
 ├── <body>
 │    ├── Header (title, model-load status indicator)
 │    ├── Section 1: Editor
 │    ├── Section 2: Real-time Analytics Panel
 │    ├── Section 3: Historical Performance Tracker (Chart.js canvas)
 │    └── Section 4: Intervention Engine
 └── <script type="module">: app logic

No build step. Transformers.js loaded via jsDelivr ESM URL; Chart.js via CDN <script> or ESM.

Model: Xenova/distilbert-base-uncased-finetuned-sst-2-english, run via pipeline('sentiment-analysis', ...). Runs in-browser via WASM/WebGPU backend (auto-selected by Transformers.js). Model weights are cached by the browser after first load (~250MB WASM runtime + model files, so first load requires internet; subsequent loads work offline via cache).

Persistence: localStorage, one JSON array of entry objects under a single key (e.g. ppj_entries).

Optional encryption layer: Web Crypto API (AES-GCM) with a passphrase-derived key (PBKDF2), toggle-controlled. When off, entries are stored as plain JSON (clearly labeled as such in the UI so the user isn't misled about privacy guarantees).

4. Functional Requirements by Section

4.1 The Editor

Large, distraction-free <textarea>, no toolbar, generous line-height, autofocus on load.

Word/character counter (subtle, corner of textarea).

"Analyze & Save" button — disabled while the model is loading or actively inferring, with a spinner state.

Minimum length guard: entries under ~10 words show a gentle inline prompt ("Try writing a bit more for an accurate read") rather than blocking submission.

On submit: text is sent to the sentiment pipeline, never cleared until analysis succeeds (so the user doesn't lose input on failure).

Textarea clears only after a successful save.

4.2 Real-Time Analytics Panel

Appears/updates immediately after analysis completes.

Displays:

Raw label (POSITIVE/NEGATIVE) and confidence score (0–100%), shown as secondary/small text — this is "under the hood" data, not the headline.

Headline state — one of the three mapped performance profiles (see §6), shown large, with its emoji/icon.

Timestamp of the entry just analyzed.

Visual treatment: color-coded panel background or accent (e.g., cool blue for flow, amber/red for elevated stress, slate for baseline) — consistent with the dark palette in §7.

4.3 Historical Performance Tracker

Chart.js line chart, x-axis = entry timestamps (last 7 entries, most recent on the right), y-axis = a normalized performance score.

Score normalization: convert each entry to a single scalar for charting, e.g. score = label === 'POSITIVE' ? confidence : -confidence (range -1 to 1, or rescale to 0–100 with 50 as neutral midpoint — pick one and apply consistently; recommend 0–100 with 50 as baseline for readability).

Chart updates immediately after each new save (re-render, don't reload page).

If fewer than 2 entries exist, show an empty-state message instead of a chart ("Your trend line will appear after your second entry").

Hover tooltip shows: date/time, mapped state label, raw confidence.

Optional (nice-to-have, not MVP-blocking): small stat row above the chart — 7-entry average, best day, current streak.

4.4 The Intervention Engine

Directly below or beside the Analytics Panel.

Shows the intervention text (see §6) matching the current entry's mapped state.

"Copy protocol" button to copy the intervention text to clipboard.

Interventions are static strings per state for MVP (not model-generated) — deterministic, testable, no hallucination risk.

5. Data Model

Single localStorage key ppj_entries, value = JSON array of:

{
  "id": "uuid-v4",
  "timestamp": "2026-07-08T14:32:00.000Z",
  "text": "raw or encrypted journal text",
  "encrypted": false,
  "label": "POSITIVE",
  "confidence": 0.9421,
  "normalizedScore": 94.21,
  "state": "flow",          // "flow" | "stress" | "baseline"
  "wordCount": 87
}

state is derived once at save time using the thresholds in §6 and stored, not recomputed on every render — keeps history stable even if thresholds are tuned later (store the mapping version if thresholds change post-launch).

Settings (e.g., encryption toggle, passphrase salt) stored under a separate key, ppj_settings.

6. Psychology Mapping Logic (Scoring Rules)

Condition

State

Label

Intervention

label === 'POSITIVE' and confidence >= 0.75

Flow

🚀 High Resilience / Flow State Profile

"You are operating in a high-leverage mental state. Capitalize on this momentum by tackling your deepest, most creative tasks right now."

label === 'NEGATIVE' and confidence >= 0.75

Stress

⚠️ Elevated Stress / Cognitive Load

"Your entry indicates high friction or autonomic arousal. Action step: Perform a 2-minute Physiological Sigh (two deep inhales through the nose, one sharp exhale through the mouth) to reset your nervous system."

Everything else (confidence < 0.75 regardless of label, i.e. low-confidence/ambiguous)

Baseline

⚖️ Balanced / Baseline Executive Function

"You are maintaining steady cognitive reserves. Set one clear target for the next 90 minutes."

The 0.75 threshold is a starting default — expose it as a named constant (CONFIDENCE_THRESHOLD) so it's trivially tunable without touching logic elsewhere.

Important limitation to surface in UI copy (footer disclaimer): this is a binary sentiment classifier (positive/negative movie-review-style model), not a validated psychometric instrument. The mapping is a heuristic framing layer, not a clinical measurement. This should be stated plainly to the user once (e.g., in an "About" collapsible) so expectations are calibrated.

7. Visual Design

Dark mode only for MVP. Palette: slate gray background (#0f172a–#1e293b range), blue accents (#3b82f6/#60a5fa) for neutral/flow, amber/red (#f59e0b/#ef4444) for stress state, muted slate for baseline.

Typography: system font stack or a single clean sans-serif (e.g., Inter via CDN font or system-ui fallback) for legibility during long writing sessions.

Layout: single column on mobile; two-column grid on desktop (Editor left/top, Analytics + Chart + Interventions right/stacked or below).

Minimal chrome — no nav bar needed for a one-page tool. A small header with app name + model status pill ("Model: ready" / "Loading model…").

8. Technical Requirements

No build step. Everything in one index.html; JS in a <script type="module"> block, CSS inline in <style>.

CDN imports:

Transformers.js: jsDelivr ESM URL (pin a specific version, don't use @latest, to avoid silent breaking changes).

Chart.js: unpkg or cdnjs.

Model load UX: show a loading state (progress text or spinner) from page load until the pipeline is ready; disable the Analyze button until then. First load requires network access to fetch model weights (cached afterward via browser cache/IndexedDB that Transformers.js manages internally).

Inference: run on submit, not on every keystroke (keystroke-level analysis would be excessive compute and noisy signal).

Error handling:

Model fails to load (no internet, CDN blocked) → visible error state with retry button, editor still allows writing/saving without analysis (score deferred/marked "unanalyzed").

Inference throws → toast/inline error, text preserved in textarea, user can retry.

localStorage quota exceeded → warn user, offer to export/clear old entries.

Data export/import (recommended, not strictly MVP-blocking): "Export as JSON" and "Import JSON" buttons, since this is the only backup mechanism available without a backend.

Privacy/encryption toggle:

Off (default for MVP simplicity): entries stored as plain text in localStorage, UI clearly labels this.

On: AES-GCM via Web Crypto, key derived from a user-entered passphrase (PBKDF2, stored salt only — never the passphrase itself). If the user forgets the passphrase, entries are unrecoverable — UI must warn about this tradeoff explicitly.

9. Acceptance Criteria (MVP "done" definition)

Opening index.html in Chrome/Edge/Firefox with no server needed (file:// or simple static host) loads the full UI.

Model loads and status indicator flips from "loading" to "ready" without console errors.

Writing an entry and clicking "Analyze & Save":

produces a visible state (flow/stress/baseline) with matching intervention text within ~2s post-warm-up,

persists the entry to localStorage,

updates the chart.

Reloading the page restores all prior entries and re-renders the chart from localStorage (no data loss).

After 2+ entries, the chart renders a visible trend line with working tooltips.

Toggling encryption on, saving an entry, reloading, and correctly decrypting with the right passphrase works; wrong passphrase fails gracefully (no crash).

No entry data appears in any network request after initial page/model load (verifiable via browser dev tools Network tab).

10. Open Questions / Future Iterations (out of MVP scope)

Should the confidence threshold be user-adjustable in settings?

Multi-model ensemble (e.g., add an emotion-classification model alongside sentiment) for richer state mapping?

Tagging entries by context (work / trading / relationships) to segment trend charts?

Weekly digest / summary view?

Light mode?

11. Key Risks

Model size/load time: ~250MB+ download on first use could be a poor first-run experience on slow connections — worth a clear one-time warning ("First load downloads the AI model, ~X MB, then works offline").

Overclaiming psychological validity: a binary sentiment classifier is a thin proxy for constructs like "flow state" or "cognitive load." The spec intentionally frames this as a coaching heuristic, not a diagnostic, and requires a disclaimer — this should not be softened during implementation.

Data loss risk: since there's no backend, a cleared browser cache/localStorage = permanent data loss. Export/import functionality mitigates this and should be prioritized early rather than deferred indefinitely.