# Smart Peak Performance & Mental Fitness Journal — Unified Software Specification (Voice + AI + Biometric)

## 1. Project Overview

Build a **single-file, frontend-only HTML5 application** that allows users to journal using either typing or voice dictation while performing **dual-layer analysis** entirely inside the browser.

The application combines:

* Free-form journaling
* Local AI sentiment analysis
* Real-time voice-to-text transcription
* Acoustic biometric stress analysis
* Historical trend visualization
* Science-based intervention recommendations

Everything must execute **client-side**. No backend, no database, no cloud APIs, and no network requests after the initial AI model download.

---

# 2. Core Principles

* Single `index.html`
* No build tools
* No frameworks
* No backend
* Offline after first model download
* Privacy-first
* Zero external AI APIs
* All journal entries remain on the user's device

---

# 3. Tech Stack

## Core

* HTML5
* CSS3
* JavaScript ES Modules

## AI

* Transformers.js
* Xenova/distilbert-base-uncased-finetuned-sst-2-english

## Charts

* Chart.js

## Browser APIs

* Web Speech API
* Web Audio API
* localStorage
* Web Crypto API
* Clipboard API
* WebAssembly/WebGPU

## CDN

* jsDelivr
* unpkg/cdnjs

---

# 4. Application Layout

Header

↓

Journal Editor

↓

Voice Dictation Controls

↓

Live Audio Meter

↓

Real-Time Analytics Panel

↓

Intervention Engine

↓

Historical Dashboard

↓

Privacy & Export Section

---

# 5. Journal Editor

The editor must include

* Large distraction-free textarea
* Character counter
* Word counter
* Analyze & Save button
* Voice Dictation button
* Live microphone status
* Live waveform/volume meter

Requirements

* Never erase manually typed text
* Voice transcription must append seamlessly
* Minimum 10-word recommendation
* Disable Analyze while AI model loads
* Preserve journal text if analysis fails

---

# 6. Voice Dictation Module

Use the native Web Speech API.

Initialize

* SpeechRecognition
* webkitSpeechRecognition fallback

Configuration

* continuous = true
* interimResults = true
* lang = "en-US"

UI Requirements

Normal

🎙️ Dictate Entry

Recording

🛑 Stop Dictation

During recording

* Button turns red
* Pulse animation
* Recording indicator
* Microphone icon glows

Speech must stream into the textarea continuously.

Never overwrite existing content.

---

# 7. Browser Compatibility

If SpeechRecognition is unavailable

* Disable the Dictation button
* Show tooltip

"Voice-to-text is not supported on this browser."

Supported browsers include

* Chrome
* Edge
* Safari

---

# 8. Permission Handling

If microphone permission is denied

Display a clean notification

"Microphone permission was denied. Enable microphone access in your browser settings to use voice dictation."

Application must continue functioning normally without voice input.

---

# 9. Acoustic Biometric Analysis

While recording, simultaneously analyze the microphone stream using the Web Audio API.

Use

* AudioContext
* MediaStreamSource
* AnalyserNode

Configure

* fftSize = 256

Capture

Time-domain waveform

Calculate

Root Mean Square (RMS)

Track

Volume history

Ignore silence below RMS 0.01

When recording stops

Calculate

* Mean amplitude
* Variance
* Standard deviation

Convert into a stress score

Range

10–100

---

# 10. Biometric Stress Classification

Stress Score ≤45

🟢 Optimal Autonomic Regulation

46–75

🟡 Moderate Arousal

76–100

🚨 High Vocal Tension

Display

Numeric score

Example

Biometric Vocal Stress

82 / 100

State

🚨 High Vocal Tension

---

# 11. AI Sentiment Analysis

Analyze journal entries using

Transformers.js

Model

Xenova/distilbert-base-uncased-finetuned-sst-2-english

Store

* Label
* Confidence
* Normalized score

---

# 12. Dual-Core Analysis

Every saved journal entry must generate two independent analyses.

## Cognitive Analysis

AI sentiment

Produces

* Positive
* Negative
* Confidence
* Flow State Mapping

## Physiological Analysis

Voice biometrics

Produces

* Stress Score
* Stress Classification

Both analyses are displayed together.

---

# 13. Psychology Mapping

Flow

Positive confidence ≥75%

🚀 High Resilience / Flow

Stress

Negative confidence ≥75%

⚠ Elevated Stress

Baseline

Everything else

⚖ Balanced Executive Function

---

# 14. Analytics Dashboard

Display

Current journal timestamp

Text Sentiment

Confidence

Flow State

Biometric Vocal Stress

Stress Level

Normalized Cognitive Score

---

# 15. Historical Dashboard

Chart.js must display two independent trend lines.

Line 1

Cognitive Sentiment

Line 2

Physiological Stress

X-axis

Journal timestamps

Y-axis

0–100

Hover tooltip

Display

* Date
* Time
* Cognitive score
* Vocal stress
* Flow state

---

# 16. Live Audio Visualization

During recording

Render either

* Live waveform

or

* Real-time volume meter

Must animate only while recording.

Automatically stop after recording ends.

---

# 17. Intervention Engine

After analysis

Recommend interventions using both analyses.

Example

High Flow + Low Stress

Deep work recommendation

High Flow + High Stress

Recovery breathing before continuing work

Negative Sentiment + High Stress

Physiological Sigh

Negative Sentiment + Low Stress

Goal-setting exercise

Recommendations must be deterministic.

No LLM-generated advice.

---

# 18. Data Model

Each journal entry stores

* UUID
* Timestamp
* Journal text
* Encryption status
* Sentiment label
* Confidence
* Cognitive score
* Flow state
* Vocal stress score
* Vocal stress state
* Word count

Store under

`ppj_entries`

---

# 19. Privacy

Optional encryption

AES-GCM

PBKDF2

Never store passphrases.

Warn users that forgotten passphrases cannot be recovered.

---

# 20. Data Management

Support

* Export JSON
* Import JSON
* Copy intervention
* Clear history

---

# 21. Error Handling

Gracefully handle

* AI model loading failure
* Browser incompatibility
* SpeechRecognition failure
* Microphone denial
* localStorage quota exceeded
* Encryption failures

No application crashes.

---

# 22. Performance Requirements

* Single `index.html`
* No build tools
* No frameworks
* No React
* No Next.js
* No backend
* Offline after initial model download
* Analysis completes in approximately 2 seconds after model warm-up
* Smooth 60 FPS waveform animation
* Efficient memory usage
* Zero data transmitted after the initial AI model download

---

# 23. Acceptance Criteria

The application is considered complete when:

1. It runs directly from a single `index.html`.
2. Users can type or dictate journal entries.
3. Voice transcription appends without overwriting existing text.
4. Live waveform or volume meter works during recording.
5. AI sentiment analysis completes successfully.
6. Acoustic biometric stress analysis completes successfully.
7. The Analytics Panel displays both cognitive and physiological metrics.
8. The Chart.js dashboard plots both Cognitive Sentiment and Biometric Vocal Stress over time.
9. Journal entries persist in `localStorage`.
10. Optional AES-GCM encryption functions correctly.
11. Export/import features work.
12. No journal content or biometric data is transmitted over the internet after the initial AI model download.
13. All functionality is implemented using the specified browser-native technologies and open-source libraries only.
