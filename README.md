# Smart Peak Journal

Smart Peak Journal is a private, browser-based journaling app for daily reflection, focus tracking, and simple performance coaching. It runs fully in the browser and keeps your data on your device.

## What it does

- Lets you write or dictate journal entries
- Analyzes entries locally with a small sentiment model
- Tracks a simple vocal stress signal while recording
- Shows cognitive and physiological insights in one view
- Saves entries locally, with optional encryption
- Supports export, import, and clearing history

## Main features

- Journal editor with word and character counts
- Voice dictation with microphone status and live audio meter
- Local sentiment analysis and intervention suggestions
- Historical trend chart for recent entries
- Performance hub with a focus timer and daily metrics

## Project files

- index.html: main app layout and UI
- styles.css: visual styling
- app-logic.js: helper functions for analysis and state mapping
- package.json: simple build script

## How to run

1. Open index.html in a browser, or serve the folder with any static server.
2. Optionally run npm run build to generate a dist folder.

## Privacy notes

- No backend is required.
- Journal data stays in the browser.
- Optional encryption uses the Web Crypto API.
- The first model load may need a network connection, but the app is designed to work locally afterward.

## More detail

See [explainer.md](explainer.md) for a simple walkthrough of the app structure and how the main features work.
