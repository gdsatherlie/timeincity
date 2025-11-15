# TimeInCity

TimeInCity is a modern React experience that showcases the current time and weather for any IANA time zone. It ships with a polished UI, curated city shortcuts, live embeds, and monetization placeholders so the project can grow into a full product. The site runs entirely as static files in the browser, using import maps to pull React and Luxon from a CDN so no heavy build pipeline is required.

## Features

- **Live global clock** that updates every second with a 12/24-hour toggle.
- **Popular city buttons** plus the full list of IANA time zones.
- **Open-Meteo integration** for temperature (°C/°F), precipitation, wind, and sunrise/sunset.
- **Dark/light theme toggle** stored in `localStorage` (dark by default).
- **Ad placeholders** (top, inline, bottom) to prep for monetization.
- **Embed configurator** with live preview and iframe snippet generator.
- **SEO-friendly title** that reflects the active city and paves the way for `/city/*` pages.

## Getting started

```bash
npm install        # optional, creates package-lock.json but no extra downloads
npm run dev
```

Open http://localhost:5173 to view the app. The lightweight dev server serves the static files directly; refresh the browser after saving changes.

> **Why there’s nothing to download:** the project deliberately avoids packages that fetch from restricted registries. React, React DOM, and Luxon load at runtime from https://esm.sh, so `npm install` completes instantly even on locked-down networks.

> **Heads-up:** because the runtime code loads modules from CDN, keep an internet connection active while developing or running the app.

To build the production bundle:

```bash
npm run build
```

This copies the contents of `public/` and `src/` into `dist/` for static hosting. Preview the built output with:

```bash
npm run preview
```

## Environment variables

Open-Meteo’s APIs are public and do not require authentication, so you don’t need any environment variables.


## Super simple launch guide (explained like I'm five)

1. **Get the project onto your own computer.** Click the green `Code` button in GitHub (or download the ZIP from this workspace) and put the folder somewhere easy to find.
2. **Open a terminal in that folder.** On Windows you can use PowerShell; on macOS use Terminal.
3. **Type `npm install` and press Enter.** It finishes almost instantly—there are no extra downloads, it just makes sure Node is ready.
4. **Type `npm run dev` and press Enter.** A local playground opens. Your screen will say the site is at `http://localhost:5173`. Open that link in your browser to make sure everything works.
5. **Tell Git what to remember.** Run `git init`, then `git add .`, then `git commit -m "Start TimeInCity"`. Git now knows about your files.
6. **Create an empty home on GitHub.** Go to github.com, click **New repository**, name it (for example `timeincity`), and keep it empty—no README.
7. **Connect your computer to GitHub.** Follow the commands GitHub shows, which look like `git remote add origin https://github.com/YOURNAME/timeincity.git` and `git push -u origin main`. After this, your code lives on GitHub.
8. **Make Vercel build it.** Go to vercel.com, click **New Project**, and pick the GitHub repo you just pushed.
9. **Use the simple settings Vercel suggests.** If Vercel asks for details, pick the **Other** framework preset with Install command `npm install`, Build command `npm run build`, and Output `dist`. Click **Deploy**.
10. **Wait a minute.** Vercel will show a spinning animation while it builds. When it’s done, you get a live link you can share.

> ℹ️ I can’t push to your GitHub or click buttons in Vercel for you, but these steps walk you through it. If something looks different, read the message on the screen—Vercel and GitHub give helpful hints.

## Deploying to Vercel

1. Push this repository to GitHub (or another Git provider Vercel supports).
2. In Vercel, choose **New Project → Import Git Repository** and pick your repo.
3. Vercel may not auto-detect the framework. If it asks, choose **Other** and confirm these settings:
   - **Install command:** `npm install`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Deploy. The included `vercel.json` rewrites `/city/*` routes back to the single-page app until dedicated city pages exist.

Once live, all weather and time data loads client-side so you don’t need any additional infrastructure. The production bundle serves the TypeScript files directly, and Babel in the browser transpiles them on the fly.
