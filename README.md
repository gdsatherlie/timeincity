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

### Quick deployment check

If you want to double-check that the exact commands Vercel will run also succeed locally, execute:

```bash
npm run verify
```

The `verify` script runs the TypeScript compiler (`npm run typecheck`) followed by the production build (`npm run build`). When both steps pass locally you can be confident the same bundle will succeed on Vercel.

## Enabling Vercel Web Analytics

The project already imports Vercel’s lightweight analytics tracker, so once you turn on Analytics in the Vercel dashboard the widget starts sending page-view data automatically. Here’s the full flow:

1. In your Vercel project, open **Analytics → Get Started** and enable Web Analytics for the production domain. Vercel provisions the feature without needing extra DNS changes.
2. The `@vercel/analytics` package is listed in `package.json`, and `src/App.tsx` renders the `<Analytics />` component near the root of the app. Nothing else is required in code.
3. Deploy as usual (`npm run build` locally, then push to GitHub and let Vercel redeploy). Within about 30 seconds you should see live traffic in the Analytics tab—if you don’t, disable any ad blockers and refresh the deployed site.

Because the tracker runs entirely client-side and ships with Vite, it won’t interfere with the rest of the UI or your existing API calls.

## Keeping pull requests text-only

Some tooling (including Codex’ GitHub bridge) cannot open pull requests that contain binary files such as `.png`, `.svg`, or `.ico` assets. If you ever need to update imagery, land those files outside of the Codex workflow. For any Codex-driven PR:

1. Start from a clean branch (`git status` should report no changes).
2. Apply only text edits (TypeScript, JSON, HTML, Markdown, etc.).
3. Double-check with `git diff --stat` to ensure no binary extensions are listed.
4. Run `npm run build` so the PR includes a passing production build log.

These quick checks keep PR creation unblocked while still letting you land all required code and content updates.
