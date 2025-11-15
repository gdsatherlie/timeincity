# TimeInCity

TimeInCity is a modern React + Vite experience that showcases the current time and weather for any IANA time zone. It ships with a polished UI, curated city shortcuts, live embeds, and monetization placeholders so the project can grow into a full product.

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
npm install
npm run dev
```

Open http://localhost:5173 to view the app. The dev server hot-reloads as you edit files.

To build the production bundle:

```bash
npm run build
```

Then preview the static output with:

```bash
npm run preview
```

## Environment variables

Open-Meteo’s APIs are public and do not require authentication, so you don’t need any environment variables.


## Super simple launch guide (explained like I'm five)

1. **Get the project onto your own computer.** Click the green `Code` button in GitHub (or download the ZIP from this workspace) and put the folder somewhere easy to find.
2. **Open a terminal in that folder.** On Windows you can use PowerShell; on macOS use Terminal.
3. **Type `npm install` and press Enter.** This teaches the computer the tools the app needs. Wait until it finishes.
4. **Type `npm run dev` and press Enter.** A local playground opens. Your screen will say the site is at `http://localhost:5173`. Open that link in your browser to make sure everything works.
5. **Tell Git what to remember.** Run `git init`, then `git add .`, then `git commit -m "Start TimeInCity"`. Git now knows about your files.
6. **Create an empty home on GitHub.** Go to github.com, click **New repository**, name it (for example `timeincity`), and keep it empty—no README.
7. **Connect your computer to GitHub.** Follow the commands GitHub shows, which look like `git remote add origin https://github.com/YOURNAME/timeincity.git` and `git push -u origin main`. After this, your code lives on GitHub.
8. **Make Vercel build it.** Go to vercel.com, click **New Project**, and pick the GitHub repo you just pushed.
9. **Use the simple settings Vercel suggests.** When Vercel asks, let it keep the defaults: Install command `npm install`, Build command `npm run build`, Output `dist`. Click **Deploy**.
10. **Wait a minute.** Vercel will show a spinning animation while it builds. When it’s done, you get a live link you can share.

> ℹ️ I can’t push to your GitHub or click buttons in Vercel for you, but these steps walk you through it. If something looks different, read the message on the screen—Vercel and GitHub give helpful hints.

## Deploying to Vercel

1. Push this repository to GitHub (or another Git provider Vercel supports).
2. In Vercel, choose **New Project → Import Git Repository** and pick your repo.
3. Vercel auto-detects Vite. Confirm these settings if prompted:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Install command:** `npm install`
   - **Output directory:** `dist`
4. Deploy. The included `vercel.json` rewrites `/city/*` routes back to the single-page app until dedicated city pages exist.

Once live, all weather and time data loads client-side so you don’t need any additional infrastructure.
