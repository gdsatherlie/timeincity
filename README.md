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

Follow these steps the moment you are ready to go live:

1. **Make sure everything is committed locally.** Run `git status` and ensure there are no pending changes. If there are, commit them.
2. **Push to GitHub.** Use `git push origin main` (or the branch you want) so Vercel can read the latest code.
3. **Create the Vercel project.** In the Vercel dashboard click **New Project → Import Git Repository**, then choose the repo you just pushed.
4. **Confirm the build settings.** Vercel usually detects Vite automatically, but if it asks, set:
   - **Framework preset:** `Vite`
   - **Install command:** `npm install`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. **Deploy.** Click **Deploy** and wait for the build logs to finish. The included `vercel.json` already rewrites `/city/*` routes back to the single-page app.
6. **Share the live URL.** As soon as the build succeeds you’ll receive a `https://<project>.vercel.app` link that stays updated every time you push.

Because all time and weather data loads client-side, you don’t need any backend configuration—Vercel simply hosts the static bundle.

## City page template notes

- City detail pages live in `src/pages/city/[slug].tsx` and pull data from the shared catalog (`src/data/cities_over_50000_clean.json`).
- Update the reference list for the "Time difference from major cities" table inside that component if you want to compare against other hubs.
- The sunrise/sunset outlook shows the first few days returned by Open-Meteo; adjust the slice in the same file to change the number of rows.
- Per-city SEO copy comes from `src/utils/citySeo.ts` and renders through `CitySeoSection` so one edit updates every city page.
