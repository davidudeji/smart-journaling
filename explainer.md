# Smart Peak Journal Explainer

This project is a simple, private journal app that runs in the browser. It combines note-taking, voice input, local AI analysis, and basic performance tracking in one page.

## What the app does

- Lets you write journal entries by typing
- Supports voice dictation with the browser speech API
- Analyzes text locally with a small transformer model
- Measures a simple vocal stress signal while recording
- Saves entries locally and shows trends over time
- Offers optional encryption and JSON import/export

## How it works

1. You write or dictate an entry.
2. The app analyzes the text locally.
3. It creates a summary with sentiment, confidence, flow state, stress score, and an intervention.
4. The result is stored in local storage so it stays on your device.
5. Recent entries are shown in a trend chart and the latest analysis appears in the analytics panel.

## Main pieces

- HTML: the app layout and controls
- CSS: styling and responsive layout
- JavaScript: journal logic, voice recording, storage, charts, and local analysis
- app-logic.js: helper functions for scoring and intervention mapping

## Voice and stress features

- Voice dictation uses the browser speech recognition API
- Audio analysis uses the Web Audio API and AnalyserNode
- The app tracks volume and converts it into a simple stress score
- Recording UI includes a live meter and status indicator

## Privacy model

- No backend is required
- Data stays in the browser
- Optional encryption is handled with the Web Crypto API
- The app avoids sending journal text to third-party services after the initial model download

## File overview

- index.html: main UI and app script
- styles.css: styles for the journal, charts, and controls
- app-logic.js: shared logic for analysis mapping
- package.json: build script for copying files to dist

## Simple usage flow

- Type a journal entry and click Analyze & Save
- Or use Dictate Entry to add spoken text
- Open the Performance Hub to use the focus timer and daily metrics tools
- Export your entries as JSON if you want a backup
  └──────────────────────────────┘

```

### Performance Hub: View Toggle → Metrics → Charts
```

┌────────────────────────────┐
│ User clicks "Performance │
│ Hub" view toggle button │
└─────────┬──────────────────┘
│
▼
┌────────────────────────────────────┐
│ Hide journalView, Show │
│ performanceView │
│ │
│ Left Sidebar: │
│ • Focus timer (25m countdown) │
│ • Metrics form (sliders) │
│ │
│ Right Panel: │
│ • Charts (performance trends) │
│ • Sessions list (past completions) │
└────────┬─────────────────────────────┘
│
▼ (User saves metrics)
┌──────────────────────────────┐
│ saveMetricsButton click: │
│ • Read Energy (1-10) │
│ • Read Focus (1-10) │
│ • Read Sleep (hours) │
│ • Create metric object │
│ • Append to localStorage │
└─────────┬────────────────────┘
│
▼
┌─────────────────────────────────┐
│ renderPerformanceChart(): │
│ • Load last 7 metrics │
│ • Plot Energy, Focus, Sleep │
│ • Multi-axis: left (1-10) │
│ right (scaled sleep) │
│ • Draw on Chart.js canvas │
└─────────────────────────────────┘

````

---

## 🎯 Key Design Patterns

### 1. **Separation of Concerns**
- **Data Layer**: localStorage functions (load/save)
- **Logic Layer**: Analysis, state derivation, aggregation
- **UI Layer**: DOM manipulation, event listeners, rendering

### 2. **Event-Driven Architecture**
```javascript
// Every user action is an event listener
analyzeButton.addEventListener("click", saveCurrentEntry);
energySlider.addEventListener("input", () => { energyValue.textContent = energySlider.value; });
timerPlayButton.addEventListener("click", startTimer);
````

### 3. **Immutable Data Patterns**

```javascript
// Load, modify, save (don't mutate in place)
let entries = loadEntries();
const newEntry = makeEntry(text, analysis);
entries.push(newEntry);
saveEntries(); // Write entire array back
```

### 4. **State Derivation (Not State Storage)**

```javascript
// Don't store "state" on entry—derive it from analysis
const state = deriveState(label, confidence);

// This ensures logic is centralized and testable
// If state logic changes, all entries use new logic
```

---

## 🚀 How to Extend the Project

### Add a New Metric Type

1. **Update HTML**: Add slider/input to metrics form
2. **Update Storage**: Extend metric object schema
3. **Update Chart**: Add new dataset to Chart.js config
4. **Update Rendering**: Modify `renderPerformanceChart()`

### Example: Add "Mood" Metric (1-10)

```html
<!-- HTML -->
<div class="metric-input">
  <label for="moodSlider">Mood: <span id="moodValue">5</span>/10</label>
  <input type="range" id="moodSlider" min="1" max="10" value="5" />
</div>

<!-- JavaScript -->
const moodSlider = document.getElementById("moodSlider"); const moodValue =
document.getElementById("moodValue"); moodSlider.addEventListener("input", () =>
{ moodValue.textContent = moodSlider.value; }); // Modify saveMetricsButton
handler: const mood = parseInt(moodSlider.value); metrics.push({ ..., mood });
// Modify chart: { label: "Mood (1-10)", data: recentMetrics.map(m => m.mood),
borderColor: "#ec4899", // Pink // ... other config }
```

### Add Long-Term Trend View (Weekly/Monthly)

```javascript
// Create new function
const renderMonthlyChart = () => {
  const metrics = loadMetrics();
  // Aggregate by week
  const weeks = groupByWeek(metrics);
  // Calculate averages per week
  // Render new chart
};

// Add view toggle button
// Wire up event listener
```

### Add Export to CSV

```javascript
const exportMetricsCSV = () => {
  const metrics = loadMetrics();
  let csv = "Date,Energy,Focus,Sleep\n";

  metrics.forEach((m) => {
    const date = new Date(m.timestamp).toLocaleDateString();
    csv += `${date},${m.energy},${m.focus},${m.sleep}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "metrics.csv";
  a.click();
};
```

---

## 🧪 Testing & Debugging

### Browser DevTools Console Commands

```javascript
// Check all entries
localStorage.getItem("ppj_entries");

// Clear all data
localStorage.clear();

// Inspect metrics
JSON.parse(localStorage.getItem("ppj_metrics"));

// Manually trigger analysis
await analyzeText("I feel amazing!");

// Check model status
sentimentPipeline; // Should exist if loaded
```

### Common Issues & Solutions

**Chart not displaying?**

- Check if Chart.js loaded: `window.Chart` should exist
- Check entries array: `entries.length >= 2`
- Open DevTools console for errors

**Encryption not working?**

- Verify passphrase input has text
- Check `encryptionToggle.checked === true`
- Try decrypting with correct passphrase

**Model failing to load?**

- Check network tab for transformer download
- May be blocked by CORS or content policy
- Falls back gracefully to unanalyzed entries

**localStorage Full?**

- Export data: click "Export JSON"
- Clear entries: open DevTools, run `localStorage.clear()`
- Safari has ~5MB, others have ~10MB limits

---

## 📈 How Data Flows: Complete Example

### Scenario: User's Complete Workflow

**Step 1: User opens app**

```
App loads → localStorage.getItem("ppj_entries")
→ Parse JSON → renders last 7 entries trend chart
→ localStorage.getItem("ppj_settings") → load encryption settings
```

**Step 2: Model loads (first time)**

```
loadModel() → import transformers from CDN
→ Download ONNX model (~100MB, cached by browser)
→ sentimentPipeline ready → UI updates "Model: ready"
```

**Step 3: User writes entry**

```
textarea input event → updateCounters()
→ Display "127 words, 892 characters"
→ Show/hide "Try writing more" prompt if < 10 words
```

**Step 4: User clicks "Analyze & Save"**

```
saveCurrentEntry() → Validate (min. text length)
→ analyzeText(text) → sentimentPipeline(text)
→ Returns { label: "POSITIVE", score: 0.92 }
→ deriveState("POSITIVE", 0.92) → Returns "flow"
→ makeEntry() → Creates entry object with metadata
→ Optional: encryptText() if encryption enabled
→ entries.push(entry)
→ localStorage.setItem("ppj_entries", JSON.stringify(entries))
→ renderEntries() → Update analysis card & chart
→ Clear textarea, show success message
```

**Step 5: User switches to Performance Hub**

```
View toggle click → Hide journal, show performance
→ renderPerformanceChart() → Load last 7 metrics
→ Draw multi-axis chart (Energy, Focus, Sleep)
→ renderFocusSessions() → List recent timer completions
```

**Step 6: User starts focus timer**

```
Play click → Set timerRunning = true
→ setInterval every 1000ms: decrement timerTimeRemaining
→ updateTimerDisplay() → Update UI "24:52", "24:51", ...
```

**Step 7: Timer reaches zero**

```
timerTimeRemaining <= 0 → completeTimerSession()
→ Make entry "Completed 25-minute Deep Work..."
→ entries.push(entry)
→ saveEntries()
→ Save session { id, timestamp, duration }
→ renderFocusSessions() → Show new completion in list
→ Reset timer after 2 seconds
```

---

## 🔐 Privacy & Security Guarantees

### What's Private

- **All journal entries**: Never leave browser
- **All metrics**: Never sent anywhere
- **Focus sessions**: Local tracking only
- **ML inference**: Runs in-browser

### What's NOT Private (Unavoidable)

- **Model download**: First load downloads ~100MB from CDN
  - This happens over your ISP/network, not anonymous
  - But model itself is open-source
- **Browser metadata**: Browser history knows you visited this site
  - Use private browsing if concerned

### Encryption Strength

- **PBKDF2**: 250,000 iterations (OWASP standard)
- **AES-256-GCM**: Military-grade, authenticated
- **Key derivation**: Unique per entry (random salt/IV)
- **Passphrase strength**: Only as strong as user sets it

---

## 📚 Code Organization

### Files Included

```
index.html         - HTML markup + complete script inline
styles.css         - All styling
package.json       - Metadata + build script
vercel.json        - Vercel deployment config
```

### Why Single HTML File?

- **Simplicity**: One file to maintain
- **Portability**: Share/backup easily
- **No build step needed**: Run anywhere
- **Works offline**: After first load

### JavaScript Module Structure (Within Single File)

```javascript
// Constants & Config
const STORAGE_KEY = "ppj_entries";
const stateConfig = { flow: {...}, stress: {...}, baseline: {...} };

// Core Functions
const analyzeText = async (text) => { ... };
const makeEntry = async (text, analysis) => { ... };
const deriveState = (label, confidence) => { ... };

// Storage Functions
const loadEntries = () => { ... };
const saveEntries = () => { ... };

// UI Functions
const renderLatestAnalysis = (entry) => { ... };
const renderChart = () => { ... };

// Event Listeners
analyzeButton.addEventListener("click", saveCurrentEntry);
encryptionToggle.addEventListener("change", ...);

// Initialization
loadSettings();
loadEntries();
loadModel();
```

---

## 🎓 Learning Outcomes

By studying this project, you'll learn:

1. **Browser APIs**
   - localStorage for persistence
   - SubtleCrypto for encryption
   - Fetch/CDN loading for models

2. **Data Visualization**
   - Chart.js multi-axis charts
   - Responsive canvas sizing
   - Interactive tooltips

3. **ML Integration**
   - Using transformers.js in browser
   - Model caching & inference
   - Handling model load failures

4. **UX Patterns**
   - State management without framework
   - Real-time counters & updates
   - View toggling & modal patterns

5. **Privacy/Security**
   - Encryption/decryption workflows
   - Key derivation functions
   - Secure data handling

6. **Performance**
   - Efficient DOM updates
   - localStorage optimization
   - Timer precision with setInterval

---

## 🚀 Deployment (Vercel)

### Key Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Why This Setup?

- **Rewrite rule**: Single-page app—all routes go to index.html
- **Build script**: Copies index.html + styles.css to dist/
- **CSS path**: Changed from relative `styles.css` to absolute `/styles.css`
  - Ensures CSS loads correctly regardless of URL depth

### Deploy Process

```bash
git add .
git commit -m "Update Peak Journal with performance hub"
git push -u origin main
# Vercel auto-detects push → builds → deploys
```

---

## 🎯 Future Enhancement Ideas

### Short Term

- [ ] Weekly/monthly trend aggregation
- [ ] Goal-setting interface
- [ ] Custom timer durations
- [ ] Dark/light theme toggle

### Medium Term

- [ ] Data backup to Google Drive / Dropbox
- [ ] PWA manifest for installable app
- [ ] Voice note transcription
- [ ] Correlation analysis (sleep vs focus)

### Long Term

- [ ] Optional cloud sync (with end-to-end encryption)
- [ ] Mobile native app
- [ ] Team/group journaling features
- [ ] Advanced ML (personalized interventions)

---

## 📖 Resources & References

### Technologies Used

- **Xenova Transformers**: https://huggingface.co/docs/transformers.js/
- **Chart.js**: https://www.chartjs.org/
- **Web Crypto API**: https://mdn.io/webcrypto
- **localStorage**: https://mdn.io/localStorage

### Sentiment Model

- **Model**: distilbert-base-uncased-finetuned-sst-2-english
- **Task**: Binary sentiment classification (POSITIVE/NEGATIVE)
- **Performance**: ~92% accuracy on SST-2 benchmark

---

## ✅ Checklist: What You've Learned

After studying this project, you should understand:

- [ ] How localStorage persists data across sessions
- [ ] How to load and run ML models in the browser
- [ ] How to build multi-view applications without a framework
- [ ] How to encrypt/decrypt data using Web Crypto API
- [ ] How to visualize time-series data with Chart.js
- [ ] How to manage state and events with vanilla JavaScript
- [ ] How to handle form inputs and real-time updates
- [ ] How to deploy single-page apps to Vercel

---

## 🎬 Next Steps

1. **Fork/clone this project**
2. **Modify the metrics** (add mood, heart rate, etc.)
3. **Extend the charts** (monthly view, correlations)
4. **Add new features** (goals, reminders, exports)
5. **Deploy your version** to Vercel/Netlify
6. **Share** and get feedback

Happy journaling and tracking! 🚀

---

**Last Updated**: July 2024  
**Author**: Smart Peak Performance Journal  
**License**: Open source - modify and share freely
