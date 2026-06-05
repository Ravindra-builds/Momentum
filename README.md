# ⚡ Momentum — Premium Habit & Study Tracker PWA

A premium, minimal, offline-first **Progressive Web App** for tracking study hours, habits, and todos. Designed with dark mode, smooth animations, and a calming aesthetic focused on **discipline**, **streaks**, and **consistency**.

> 🌐 **Live Demo:** Deploy on Vercel and install on your Android device like a native app.

---

## ✨ Features

- 📊 **Study Hour Tracking** — Quick-log buttons (+0.5h to +6h), reset & undo support
- ✅ **Habit Tracker** — Good habits & bad habits avoided, daily tap-to-complete
- 🔒 **Private Habits** — Blur names, custom aliases, lock icon (shame-free)
- 📋 **Todo System** — Today/Tomorrow planning, auto-activation on date change
- 🗺️ **GitHub-style Heatmaps** — Study, todo, and per-habit consistency grids
- 📈 **Stats Dashboard** — Streaks, total hours, success rates, 7-day charts
- 🔔 **Notifications** — Daily reminders with customizable time
- 📱 **PWA Installable** — Add to Home Screen on Android, fullscreen app experience
- 🌙 **Dark Mode** — Matte black, premium green accents, Inter font
- 💾 **Offline First** — All data stored locally in localStorage, no backend needed
- 🎨 **Smooth Animations** — CSS animations for micro-interactions

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- A code editor (VS Code recommended)

### Installation

```bash
# 1. Clone or download the project
git clone https://github.com/Ravindra-builds/Momentum
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
2. Tap **⋮ menu → Install app** (or "Add to Home Screen")
3. The app installs with:
   - ✅ Custom app icon
   - ✅ Fullscreen standalone mode (no browser bar)
   - ✅ Offline support via service worker
   - ✅ Splash screen on launch
   - ✅ Local data persistence

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
   - **Service Workers** section shows registered worker
   - **Cache Storage** shows cached assets

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
│       ├── icon-192x192.png    # PWA icon (Android)
│       └── icon-512x512.png    # PWA icon (Android/Splash)
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx        # Tab navigation
│   │   ├── Heatmap.tsx          # GitHub-style heatmap grid
│   │   └── Modal.tsx            # Reusable modal component
│   ├── hooks/
│   │   └── useAppData.tsx       # Central state + context provider
│   ├── screens/
│   │   ├── Dashboard.tsx        # Main screen with study logging
│   │   ├── Habits.tsx           # Good/bad habit tracker
│   │   ├── Todos.tsx            # Today/tomorrow todo system
│   │   ├── Heatmaps.tsx         # Study/todo/habit heatmaps
│   │   ├── Stats.tsx            # Statistics & charts
│   │   └── Settings.tsx         # App settings & data management
│   ├── services/
│   │   └── storage.ts           # localStorage persistence layer
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── date.ts              # Date utilities & streak calculation
│   ├── App.tsx                  # Root component with navigation
│   ├── index.css                # Tailwind + custom animations
│   └── main.tsx                 # Entry point + splash screen dismiss
├── index.html                   # HTML with PWA meta tags + splash screen
├── vite.config.ts               # Vite + PWA plugin config
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
| **vite-plugin-pwa** | PWA (manifest + service worker) |
| **Workbox** | Offline caching strategies |
| **localStorage** | Client-side data persistence |

---

## 🔐 Privacy & Security

- ✅ **100% offline** — no backend, no API calls, no data leaves your device
- ✅ **localStorage only** — all data stays on your device
- ✅ **No analytics** — zero tracking scripts
- ✅ **No accounts** — no sign-up, no login
- ✅ **Private habits** — sensitive habits can be hidden with aliases

---

## 📝 Key Behaviors

### Study Hours
- Tap quick-log buttons to add hours
- **Reset button** appears when hours > 0 (tap once to show confirm, tap again to reset)
- **Undo** available in toast notification after each log

### Todos
- **Today** todos are immediately active and completable
- **Tomorrow** todos appear disabled until the date changes
- Only today's todos affect heatmaps and streaks

### Habits
- **Good Habits** — positive daily actions (Study, Workout, etc.)
- **Bad Habits Avoided** — tracking what you didn't do (Reels, Junk Food, etc.)
- **Private** — blur the name, add a custom alias like "Focus" or "Discipline"

### Streaks
- Current streak counts consecutive active days (must include today or yesterday)
- Longest streak tracks your all-time best
- Heatmaps use GitHub-style green intensity (darker = more activity)

---

## 📄 License

MIT — Free for personal use.

---

<p align="center">
  Made with 💚 for discipline & consistency<br/>
  <strong>Momentum</strong> — Show up every day.
</p>
