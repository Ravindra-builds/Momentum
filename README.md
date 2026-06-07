# ⚡ Momentum — Premium Habit & Study Tracker PWA

A premium, minimal, offline-first **Progressive Web App** for tracking study hours, habits, and todos. Designed with dark mode, smooth animations, and a calming aesthetic focused on **discipline**, **streaks**, and **consistency**.

> 🌐 Demo : https://momentum-chi-pink.vercel.app/

---

## ✨ Features

### Core

- 📊 **Study Hour Tracking** — Quick-log buttons (+0.5h to +6h), undo support, reset button
- ✅ **Habit Tracker** — Good habits & bad habits avoided, daily tap-to-complete
- 🔒 **Private Habits** — Blur names, custom aliases, lock icon (shame-free)
- 📋 **Todo System** — Today/Tomorrow planning, auto-activation on date change
- 🗺️ **GitHub-style Heatmaps** — Study, todo, and per-habit consistency grids (auto-scroll to today)
- 📈 **Stats Dashboard** — Streaks, total hours, success rates, 7-day bar chart

### PWA & Offline

- 📱 **Installable** — Add to Home Screen on Android, fullscreen standalone mode
- 💾 **Fully Offline** — Service worker precaches all assets (HTML, CSS, JS, icons, fonts)
- 🔄 **Auto-updating SW** — New versions activate immediately via `skipWaiting`
- 🧭 **Navigation Fallback** — All routes serve cached `index.html` when offline

### UX & Design

- 👆 **Swipe Navigation** — Swipe left/right between tabs (touch-optimized for mobile)
- 🎨 **Slide Animations** — Directional screen transitions with cubic-bezier easing
- 🔔 **Daily Reminders** — Scheduled notifications at your chosen time (fires while tab is open)
- 🌙 **Premium Dark Mode** — Matte black (#050505), green accents, Inter font
- 🎬 **Splash Screen** — Animated loading with 3-dot indicator, auto-dismisses
- 🖱️ **Button Feedback** — Scale-on-press micro-interactions, staggered list animations

### Data & Backup

- 💾 **Backup & Restore** — Export all data as JSON, import with validation
- 🛡️ **Persistent Completions** — Todo heatmap survives deletion (counts stored separately)
- ⚡ **localStorage Only** — No backend, no accounts, no tracking

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- A code editor (VS Code recommended)

### Installation

```bash
# 1. Clone or download the project
git clone https://momentum-chi-pink.vercel.app/
cd momentum

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder, ready for deployment.

---

## 📱 Install as PWA on Android

### Method 1: Direct from Browser

1. Open the app URL in **Chrome** on your Android phone
2. Wait a few seconds for the page to load fully
3. Chrome will show an **"Add to Home Screen"** banner, OR:
   - Tap the **⋮ menu** (three dots, top right)
   - Tap **"Install app"** or **"Add to Home Screen"**
4. Confirm the installation
5. The app icon appears on your home screen
6. Open it — it runs **fullscreen** like a native app!

### Method 2: Deploy on Vercel First (Recommended)

Deploying to Vercel gives you a public HTTPS URL, which is required for full PWA features:

#### Deploy to Vercel

**Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click **"New Project"**
4. Import your Git repository
5. Framework Preset: **Vite**
6. Click **Deploy**
7. Wait for deployment to complete
8. Copy the production URL

#### Then Install on Android

1. Open the **Vercel URL** on your Android phone's Chrome browser
2. **Visit once while online** — this triggers the service worker to cache everything
3. Tap **⋮ menu → Install app** (or "Add to Home Screen")
4. The app installs with:
   - ✅ Custom green "M" app icon
   - ✅ Fullscreen standalone mode (no browser bar)
   - ✅ Works fully offline after first visit
   - ✅ Splash screen on launch
   - ✅ All data persists locally

---

## 🌐 Deploy on Vercel (Detailed)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Momentum PWA"
git remote add origin https://github.com/YOUR_USERNAME/momentum.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**

### Step 3: Verify PWA

Once deployed:
1. Open the URL in Chrome
2. Open DevTools → **Application** tab
3. Check:
   - **Manifest** section shows app name, icons, theme color
   - **Service Workers** section shows registered & activated worker
   - **Cache Storage** shows precached assets (HTML, icons, webmanifest)

### Custom Domain (Optional)

In Vercel Dashboard → Settings → Domains:
- Add your custom domain
- Update DNS records as instructed
- PWA will work on your custom domain with HTTPS

---

## 📂 Project Structure

```
momentum/
├── public/
│   └── icons/
│       ├── icon-192x192.png       # PWA icon (Android)
│       └── icon-512x512.png       # PWA icon (Android/Splash)
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx           # Tab navigation (5 tabs)
│   │   ├── Heatmap.tsx             # GitHub-style heatmap grid (auto-scrolls)
│   │   └── Modal.tsx               # Reusable bottom-sheet modal
│   ├── hooks/
│   │   └── useAppData.tsx          # Central state + React Context provider
│   ├── screens/
│   │   ├── Dashboard.tsx           # Study logging, streaks, mini heatmap
│   │   ├── Habits.tsx              # Good/bad habit tracker with private mode
│   │   ├── Todos.tsx               # Today/Tomorrow todo system
│   │   ├── Heatmaps.tsx            # Full heatmaps (study, todo, per-habit)
│   │   ├── Stats.tsx               # Statistics, 7-day chart, success rates
│   │   └── Settings.tsx            # Profile, reminders, backup, reset
│   ├── services/
│   │   └── storage.ts              # localStorage + export/import backup
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── date.ts                 # Date utilities & streak calculation
│   ├── App.tsx                     # Root: navigation, swipe, notification scheduler
│   ├── index.css                   # Tailwind + custom animations + slides
│   └── main.tsx                    # Entry point + splash screen dismiss
├── index.html                      # HTML + PWA meta + inline SW registration + splash
├── vite.config.ts                  # Vite + PWA (workbox) + singlefile plugins
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Lucide React** | Icon library |
| **vite-plugin-pwa** | PWA manifest + service worker generation |
| **vite-plugin-singlefile** | Inlines JS/CSS into single HTML for offline |
| **Workbox** | Precaching, navigation fallback, font caching |
| **localStorage** | Client-side data persistence |

---

## 🔔 Notifications

### How They Work

The app uses the **Web Notification API** (browser-native, no push server needed).

**Daily Reminder:**
- Set your preferred time in Settings → Reminders
- A scheduler runs every 30 seconds while the app tab is open
- When current time matches your set time → fires a motivational notification
- Fires **once per day** (tracked via `momentum_last_notification_date` in localStorage)
- Works even if the tab is in the background (but must be open)

**Test Notification:**
- Tap "Send Test Notification" in Settings to verify it works
- Requires notification permission to be granted first

**Limitation:** Notifications only work while the browser/app tab is open. True background notifications require a server-side push service, which conflicts with the offline-first architecture. The scheduler approach works well for daily reminders since most users keep their habit tracker tab open.

---

## 💾 Backup System

### Export

Go to **Settings → Backup & Restore → Export Backup**

Downloads a JSON file containing all your data:
```json
{
  "__momentum_backup": true,
  "version": 1,
  "exportedAt": "2025-05-28T10:30:00.000Z",
  "data": {
    "momentum_study_logs": [...],
    "momentum_habits": [...],
    "momentum_todos": [...],
    "momentum_settings": {...},
    "momentum_todo_day_log": {...}
  }
}
```

### Import

Go to **Settings → Backup & Restore → Import Backup**

1. Select a previously exported `.json` file
2. The app validates the file structure before touching any data
3. Shows a **confirmation dialog** — "This will replace your current data"
4. On confirm: writes all data to localStorage using the same keys
5. Page reloads to reflect the restored data

**Safety features:**
- ✅ Validates `__momentum_backup` flag is present
- ✅ Checks version compatibility
- ✅ Validates data types (arrays, objects) for each section
- ✅ Requires explicit user confirmation before writing
- ✅ Never corrupts existing data on validation failure

---

## 🔑 Data Schema (localStorage)

All data is stored under these exact keys in localStorage:

| Key | Type | Description |
|---|---|---|
| `momentum_study_logs` | `StudyLog[]` | Study hour entries with id, date, hours |
| `momentum_habits` | `Habit[]` | Habits with completions map, private flag |
| `momentum_todos` | `Todo[]` | Todos with targetDate, completed flag |
| `momentum_settings` | `AppSettings` | User name, reminder enabled, reminder time |
| `momentum_todo_day_log` | `Record<string, number>` | Date → completed count (survives deletion) |
| `momentum_last_notification_date` | `string` | Last date a reminder was sent (internal) |

**No schema changes across updates.** New fields have defaults. Backward compatible.

---

## 🧭 Guide — How It Works

New to Momentum? The built-in **Guide** provides a short, visual walkthrough of every core feature so you can get started quickly.

- **Where to open it:** Tap the book icon in the top-right of the Dashboard, or go to **Settings → Guide → How It Works**.
- **What it covers:** Study hour logging, streaks, heatmaps (study/todos/per-habit), the todo system (today/tomorrow), habit tracking (good/bad/private), stats, daily reminders, backup & restore, and how to install the PWA.
- **How to use it:** Open the Guide, scan the illustrated sections, follow the numbered steps in each card, then tap **Start Tracking →** to return to the Dashboard and begin.

The Guide is ideal for first-time users and anyone who wants a quick refresher on how features behave and where to find them in the app.


## 🔐 Privacy & Security

- ✅ **100% offline** — no backend, no API calls, no data leaves your device
- ✅ **localStorage only** — all data stays on your device
- ✅ **No analytics** — zero tracking scripts
- ✅ **No accounts** — no sign-up, no login, no cloud sync
- ✅ **Private habits** — sensitive habits hidden with aliases

---

## 📝 Key Behaviors

### Study Hours
- Tap quick-log buttons to add hours (+0.5h to +6h)
- **Undo** available in toast notification after each log
- **Reset button** appears when hours > 0 (tap once to arm, tap again to confirm)

### Todos
- **Today** todos are immediately active and completable
- **Tomorrow** todos appear disabled until the date changes
- Only today's todos affect heatmaps and streaks
- **Deleting completed todos does NOT erase heatmap** — completions are counted in a separate persistent log

### Habits
- **Good Habits** — positive daily actions (Study, Workout, etc.)
- **Bad Habits Avoided** — tracking what you didn't do (Reels, Junk Food, etc.)
- **Private** — blur the name, add a custom alias like "Focus" or "Discipline"

### Streaks
- Current streak counts consecutive active days (must include today or yesterday)
- Longest streak tracks your all-time best
- Heatmaps use GitHub-style green intensity (darker = more activity)

### Swipe Navigation
- **Swipe left** → next tab (Home → Habits → Todos → Map → Stats)
- **Swipe right** → previous tab
- **60px minimum** swipe distance to prevent accidental triggers
- Horizontal swipe only — doesn't interfere with vertical scrolling

### Offline Support
- **First visit** (online): service worker caches all assets
- **Subsequent visits**: app loads from cache instantly, works offline
- **Navigation fallback**: any URL route serves the cached `index.html`
- **Google Fonts**: cached via StaleWhileRevalidate (shows cached version, updates in background)
- **App updates**: detected automatically, new SW activates on next load

---

## 🔧 How Offline Works (Technical)

```
Build Output (dist/):
├── index.html             ← Single file with all JS/CSS inlined (285KB)
├── sw.js                  ← Service worker generated by Workbox
├── workbox-*.js           ← Workbox runtime
├── registerSW.js          ← SW registration (also inlined in HTML)
├── manifest.webmanifest   ← PWA manifest
└── icons/                 ← App icons

Service Worker Precaches:
  ✅ index.html            (the entire app — JS + CSS inlined)
  ✅ manifest.webmanifest  (PWA metadata)
  ✅ icon-192x192.png      (app icon)
  ✅ icon-512x512.png      (app icon + splash)

Runtime Caches:
  ✅ Google Fonts CSS      (StaleWhileRevalidate, 1 year)
  ✅ Google Fonts files    (CacheFirst, 1 year)

Navigation Fallback:
  ✅ Any URL → index.html  (handles all routes offline)
```

---

## 📄 License

MIT — Free for personal use.

---

<p align="center">
  Made with 💚 for discipline & consistency<br/>
  <strong>Momentum</strong> — Show up every day.
</p>
