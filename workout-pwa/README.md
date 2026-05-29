# Daily Workout Tracker — PWA Setup Guide

## What you need
- A free GitHub account: https://github.com
- A free Netlify account: https://netlify.com

Both can be created on your phone in a few minutes.

---

## Step 1 — Upload to GitHub

1. Go to https://github.com and sign in
2. Tap the **+** icon → **New repository**
3. Name it `workout-tracker`, set to **Public**, tap **Create repository**
4. On the next screen tap **uploading an existing file**
5. Upload ALL files from this folder, keeping the folder structure:
   - `src/App.jsx`
   - `src/index.js`
   - `public/index.html`
   - `public/manifest.json`
   - `public/service-worker.js`
   - `public/icon-192.png`
   - `public/icon-512.png`
   - `package.json`
   - `netlify.toml`
6. Tap **Commit changes**

---

## Step 2 — Deploy on Netlify

1. Go to https://netlify.com and sign in (you can log in with your GitHub account)
2. Tap **Add new site** → **Import an existing project**
3. Choose **GitHub** and select your `workout-tracker` repo
4. Netlify will auto-detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Tap **Deploy site**
6. Wait ~2 minutes — Netlify builds and gives you a live URL like `https://shiny-name-123.netlify.app`

---

## Step 3 — Install on your Android phone

1. Open **Chrome** on your Android phone
2. Go to your Netlify URL
3. Tap the **three-dot menu** (top right)
4. Tap **"Add to Home screen"**
5. Tap **Add** on the confirmation

The app will appear on your home screen with the dumbbell icon, opens fullscreen with no browser UI, and works offline.

---

## Updating the app later

If you change `App.jsx` and want to update:
1. Go to your GitHub repo
2. Navigate to `src/App.jsx` and tap the pencil ✏️ icon to edit
3. Paste the new code and commit
4. Netlify automatically rebuilds and deploys within ~2 minutes

---

## Your data

All workout data is stored locally on your device in the browser's localStorage.
It persists between sessions and survives app restarts.
Note: clearing Chrome's site data will erase it.
