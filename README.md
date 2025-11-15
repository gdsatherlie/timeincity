# TimeInCity

TimeInCity is a modern React + TypeScript single-page app that shows the current time and weather for any IANA time zone. It includes curated popular cities, embed tooling, monetization placeholders, and theming so the project is ready to grow into dedicated city pages.

## Features

- **Live world clock** that updates every second with a 12/24-hour toggle.
- **Popular city shortcuts** plus the full list of IANA time zones.
- **Open-Meteo integration** for temperature (°C/°F), precipitation, wind, and sunrise/sunset.
- **Dark/light theme toggle** persisted to `localStorage` (dark by default).
- **Ad placeholders** (top, inline, bottom) to prepare for monetization experiments.
- **Embed configurator** with iframe code snippet and live preview.
- **SEO-friendly title** that automatically reflects the active city.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to develop. The Vite dev server hot-reloads as you edit the files in `src/`.

To create an optimized production bundle:

```bash
npm run build
```

Preview the built output locally with:

```bash
npm run preview
```

## Environment variables

Open-Meteo’s public APIs do not require authentication, so you don’t need any environment variables.

## Super simple launch guide (explained like I'm five)

1. **Put the project on your computer.** Download or clone this folder so you can open it locally.
2. **Open a terminal in the folder.** On Windows you can use PowerShell; on macOS use Terminal.
3. **Type `npm install` and press Enter.** This grabs the tools the project needs.
4. **Type `npm run dev` and press Enter.** It tells you to open `http://localhost:5173`—do that to make sure everything looks good.
5. **Tell Git to remember the files.** Run `git init`, then `git add .`, then `git commit -m "Start TimeInCity"`.
6. **Make an empty home on GitHub.** Go to github.com, click **New repository**, name it (for example `timeincity`), and keep it empty—no README yet.
7. **Connect your computer to GitHub.** Follow the commands GitHub shows, like `git remote add origin https://github.com/YOURNAME/timeincity.git` and `git push -u origin main`.
8. **Let Vercel build it.** In vercel.com choose **New Project**, pick the GitHub repo, and keep the defaults Vercel suggests for Vite.
9. **Confirm the settings if Vercel asks.** Install command `npm install`, Build command `npm run build`, Output `dist`.
10. **Wait for the green checkmark.** Vercel will give you a live URL when it finishes building.

> ℹ️ I can’t push to your GitHub or click buttons in Vercel for you, but these steps walk you through it. If something looks different, read the message on the screen—Vercel and GitHub give helpful hints.

## Deploying to Vercel

1. Push this repository to GitHub (or another Git provider Vercel supports).
2. In Vercel, choose **New Project → Import Git Repository** and pick your repo.
3. Vercel usually auto-detects Vite. If it asks for confirmation, use:
   - **Framework preset:** `Vite`
   - **Install command:** `npm install`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Deploy. The included `vercel.json` rewrites `/city/*` routes back to the single-page app until dedicated city pages exist.

Once live, all weather and time data loads client-side so you don’t need any additional infrastructure.
