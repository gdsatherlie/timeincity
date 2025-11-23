export type Article = {
  slug: string;
  title: string;
  description: string;
  content: string;
};

export const articles: Article[] = [
  {
    slug: "what-are-time-zones",
    title: "What Are Time Zones? A Simple Guide for Normal People",
    description: "Time zones explained in plain English, and how TimeInCity helps you stop doing mental math.",
    content: `# What Are Time Zones? A Simple Guide for Normal People

Time zones feel confusing until you remember what they really are: **agreements**.

They’re not a law of physics. They’re a global handshake that says, “People in this region will call it 3:00 p.m. when the sun is about *here* in the sky.”

Once you see time zones as agreements instead of mysteries, they get a lot easier to work with.

---

## Why time zones exist in the first place

A long time ago, every town kept its own local time. Noon was when the sun was highest overhead. That sort of worked when travel was slow and communication was local.

Then trains and telegraphs showed up.

Suddenly people were moving quickly between cities. A train schedule couldn’t use “noon in every town” because noon in one city might be 12:14 in another. That’s when the idea of **standard time zones** took off:

- The world was divided into regions.
- Each region agreed to use the same clock time.
- Those regions came to be known as **time zones**.

---

## The basic idea: UTC as the anchor

Under the hood, every time zone is defined by its offset from **Coordinated Universal Time (UTC)**.

You’ll see offsets written like:

- UTC−5 (five hours behind UTC)
- UTC+1 (one hour ahead of UTC)

So when you see something like:

- New York: UTC−5 in winter, UTC−4 in summer
- London: UTC+0 in winter, UTC+1 in summer
- Tokyo: always UTC+9

what you’re really seeing is “how far from UTC is this place right now?”

TimeInCity uses this same UTC anchor behind the scenes to keep local time for each city accurate.

---

## Why some places change time and others don’t

You’ve probably heard of **daylight saving time (DST)**. Some regions shift their clocks forward and back during the year:

- In spring, they move forward one hour to get more evening daylight.
- In fall, they move back one hour to go back to standard time.

That’s why many time zones have two offsets during the year:

- New York: UTC−5 in winter, UTC−4 in summer
- Berlin: UTC+1 in winter, UTC+2 in summer

Other places never change:

- Tokyo: always UTC+9
- Most of Arizona: always UTC−7

TimeInCity handles these changes automatically for every city, so you don’t have to remember when the shift happens.

---

## Time zones vs. regions: the naming confusion

You’ll often see two different labels for time:

1. The **time zone name**  
   - Example: “Pacific Time (PT)” or “Central European Time (CET)”
2. The **region or city name**  
   - Example: “Los Angeles time” or “Berlin time”

Under the hood, both are tied back to a time zone database name like:

- America/Los_Angeles
- Europe/Berlin
- America/Denver

This is what TimeInCity uses. When you load a city page like /city/denver, the app looks up the correct IANA time zone for that city and adjusts for offset and daylight saving behind the scenes.

---

## Why time zones feel so tricky in real life

Time zones are simple on paper. They get messy because:

- Countries change their daylight saving rules.
- Not every region in a country follows the same rules.
- Your calendar app may be using a different time zone than you think.
- People say things like “Let’s meet at 3 p.m. my time” without saying where they are.

That’s why tools like TimeInCity exist. Instead of doing mental math, you:

1. Open the city page for where someone lives.
2. Look at the live local time.
3. Decide if it’s reasonable to call, schedule, or ship something.

---

## How to make time zones less painful in your day

A few habits make time zones way easier to live with:

- **Always include the city or time zone.**  
  Say “3 p.m. London time” or “3 p.m. Pacific” instead of just “3 p.m.”

- **Check before you send.**  
  Before messaging someone in another city, quickly check their local time. If it’s 2 a.m. there, maybe schedule the message to send later.

- **Use one source of truth.**  
  Keep a TimeInCity tab open for the places you care about. That way you’re matching what your teammates or friends actually see on their clocks.

---

## Use TimeInCity as your quick time zone translator

Next time you think:

- “What time is it in Denver right now?”
- “Is it too late to call London?”
- “What will the time be in Tokyo when my flight lands?”

You don’t need to do math or guess.

Just:

1. Open TimeInCity.
2. Go to the city page you care about.
3. Let the live clock and weather do the work for you.

Time zones may be human-made agreements, but with the right tools, they don’t have to be confusing.
`,
  },
  {
    slug: "schedule-meetings-across-time-zones",
    title: "How to Schedule Meetings Across Time Zones Without Driving Everyone Crazy",
    description: "A simple playbook for remote teams to schedule calls fairly across multiple time zones.",
    content: `# How to Schedule Meetings Across Time Zones Without Driving Everyone Crazy

Remote work is great—right up until you try to schedule a meeting with people in three different time zones and realize everyone hates the time you picked.

The good news: with a simple process (and a world clock like TimeInCity), you can schedule meetings that feel fair and predictable for everyone.

---

## Step 1: Start with where people actually are

Instead of asking “What time works for everyone?”, start by listing **cities**:

- “We’ve got people in Denver, New York, and London.”
- “We’ve got a designer in Los Angeles and an engineer in Berlin.”
- “We’ve got support in Chicago and a partner in Tokyo.”

Once you know the cities, you can look up the live local time for each one.

Open TimeInCity and, for each person:

1. Search for their city (for example, /city/denver or /city/london).
2. Note the local time and time zone.
3. Keep those tabs open while you plan.

This turns a fuzzy “across time zones” problem into something concrete.

---

## Step 2: Find the overlap, not a perfect time

There is no perfect meeting time. Someone will always be closer to the edges of their day.

What you’re really looking for is **overlap**:

- Hours when it’s not the middle of the night for anyone.
- Hours that land in at least a reasonable part of the workday on both sides.

Common patterns:

- US East + US West → late morning East / early morning West  
- US + Europe → US morning / Europe afternoon  
- US + Asia → US late afternoon / Asia morning next day

You can eyeball these overlaps by opening each relevant city in TimeInCity and looking at the clocks side by side.

---

## Step 3: Rotate the pain when it can’t be perfect

Sometimes there is no comfortable overlap. Someone will always be early or late.

In those cases, make it **explicitly fair**:

- Rotate the inconvenient time each week or month.
- Note in the calendar: “Late for Denver, early for Berlin—will rotate next time.”
- Use async updates (docs, recordings, notes) for the people getting the worst slot.

Fairness matters more than perfection. People tolerate bad times much better when they see that:

1. It’s acknowledged, and  
2. It moves around, not always hitting the same person.

---

## Step 4: Always include the time zone

Tiny habit, huge impact: **always include the time zone in the invite.**

Instead of:

> Weekly standup – 9:00

Try:

> Weekly standup – 9:00 a.m. Denver / 4:00 p.m. London

Inside the event, specify:

- The primary anchor city (for example, “This meeting is anchored to Denver time (Mountain Time)”).
- A short list of reference times if there are multiple regions.

---

## Step 5: Double-check live time before you hit send

Time zone rules change. People move. Calendars glitch.

Before you send an invite or ping someone for a call:

1. Open the TimeInCity page for their city.
2. Look at the live local time.
3. Ask: “If I were there, would this feel reasonable?”

If it’s after 7 p.m. or before 7 a.m. for them, consider async or a different slot.

---

## Step 6: Use recurring overlap windows

For ongoing collaboration with people in other regions, pick:

- One or two recurring overlap windows per week.
- Times that are good enough for everyone.
- Then schedule most live calls inside those windows.

Examples:

- US–Europe team: Tuesday & Thursday, 9–11 a.m. New York / 3–5 p.m. Berlin
- US–Asia sync: Monday, 4–6 p.m. Denver / Tuesday, 7–9 a.m. Tokyo

Once everyone knows the pattern, it’s easier to:

- Protect those hours.
- Plan deep work around them.
- Avoid surprise 6 a.m. meetings.

---

## Step 7: Make TimeInCity your default sanity check

Here’s a simple workflow you can adopt:

1. When you start your day, open TimeInCity tabs for:
   - Where you are
   - Where your key teammates or clients are
2. Leave them open in a browser window.
3. Any time you’re about to book a call:
   - Glance at the clocks.
   - Pick a time that lands in the overlap window.
   - Mention the city times explicitly in the invite.

Meetings don’t have to be a time zone nightmare. You just need to know where people are, see live local time, and apply a little fairness.
`,
  },
  {
    slug: "what-is-utc",
    title: "What Is UTC? The Beginner’s Guide to Coordinated Universal Time",
    description: "UTC is the master clock of the world. This guide explains what it is, how it differs from GMT, and why it matters.",
    content: `# What Is UTC? The Beginner’s Guide to Coordinated Universal Time

You’ll see UTC pop up all over time settings, clocks, and calendars, but it’s rarely explained in plain English.

Let’s fix that.

---

## The one-sentence definition

**UTC (Coordinated Universal Time)** is the **master reference time** the world uses to define all other time zones.

Every local time (New York, London, Tokyo, you name it) is just:

> UTC plus or minus some number of hours and minutes.

---

## UTC vs. local time: a quick example

Imagine UTC is 18:00 (6:00 p.m.) right now.

Then:

- New York in winter (UTC−5) → 13:00  
- London in winter (UTC+0) → 18:00  
- Berlin in winter (UTC+1) → 19:00  
- Tokyo (UTC+9) → 03:00 the next day

TimeInCity uses this relationship behind the scenes:

1. It starts from UTC.
2. Applies the correct offset for the city’s time zone.
3. Shows you the live local time on the city page.

---

## Is UTC the same as GMT?

You’ll also see GMT (Greenwich Mean Time) thrown around. They’re related but not identical:

- GMT is an older term based on the mean solar time at the Royal Observatory in Greenwich.
- UTC is a modern standard that uses atomic clocks plus tiny adjustments (leap seconds) to stay in sync with Earth’s rotation.

For everyday use, people often treat “UTC” and “GMT” as the same offset (UTC+0), especially in winter. But in systems and APIs, UTC is the standard.

---

## Why systems love UTC

Computer systems, servers, and APIs love UTC because:

- It never changes for daylight saving time.
- There’s no concept of “local exception” or “this state opted out.”
- You can log events in UTC and convert later when displaying to humans.

Typical pattern:

1. Store timestamps in UTC.  
2. Convert to local time on display.

TimeInCity is basically a human-friendly display layer for local time based on UTC and accurate time zone rules.

---

## Daylight saving time and UTC

Here’s the nice part: **UTC never changes** for daylight saving time.

Instead, **local time shifts** relative to UTC:

- New York: UTC−5 in winter, UTC−4 in summer  
- London: UTC+0 in winter, UTC+1 in summer

From UTC’s perspective, nothing special happened. It’s the local clocks that jumped.

TimeInCity keeps track of those rules for each city using the IANA time zone database, so the city page always reflects the correct offset at that moment.

---

## How to think in UTC without going crazy

You don’t need to memorize every offset. A few simple tricks:

1. Know your own UTC offset (for example, “Denver is usually UTC−7, UTC−6 in summer”).  
2. Know one or two key partner offsets.  
3. Use tools instead of your head. Open TimeInCity and let the city pages tell you the current local time and offset.

Over time you’ll naturally internalize common differences, like “London is usually 6–7 hours ahead of US Central.”

---

## Using TimeInCity as your UTC lens

Here’s a practical way to use TimeInCity with UTC:

1. Open the city page you care about (for example, /city/denver or /city/london).
2. Note the local time and the UTC offset in the details.
3. When someone says “Deployment at 22:00 UTC,” convert:
   - “Denver is UTC−7 right now → 22:00 UTC is 15:00 (3 p.m.) Denver time.”

If you remember just one thing, let it be this:

> UTC is the world’s master clock. Every local time is just UTC plus or minus an offset.

Once that clicks, time zones and daylight saving time become a lot easier to handle—especially with a live world clock helping you.
`,
  },
  {
    slug: "us-time-zones-guide",
    title: "Time Zones in the United States: EST, CST, MST, PST and Beyond",
    description: "A friendly guide to US time zones, their offsets, and how daylight saving time affects them.",
    content: `# Time Zones in the United States: EST, CST, MST, PST and Beyond

If you live in the US, you’ve probably heard people toss around EST, CST, MST, and PST. It sounds simple until you try to schedule a call across all four.

This guide walks through the main US time zones and how TimeInCity helps you keep them straight.

---

## The four big continental US time zones

Across the lower 48 states, you’ll mostly see four time zones:

- **Eastern Time (ET)** – New York, Miami, Boston, Atlanta
- **Central Time (CT)** – Chicago, Dallas, Minneapolis, New Orleans
- **Mountain Time (MT)** – Denver, Phoenix (with a twist), Salt Lake City
- **Pacific Time (PT)** – Los Angeles, San Francisco, Seattle

In standard time (roughly November to March), their UTC offsets look like this:

- Eastern Standard Time (EST): **UTC−5**
- Central Standard Time (CST): **UTC−6**
- Mountain Standard Time (MST): **UTC−7**
- Pacific Standard Time (PST): **UTC−8**

In daylight saving time (roughly March to November), they shift one hour forward:

- Eastern Daylight Time (EDT): **UTC−4**
- Central Daylight Time (CDT): **UTC−5**
- Mountain Daylight Time (MDT): **UTC−6**
- Pacific Daylight Time (PDT): **UTC−7**

TimeInCity keeps track of which label and offset is in effect for each city at any moment.

---

## The Arizona exception (and a few others)

Not every state follows daylight saving time.

- Most of **Arizona** stays on **Mountain Standard Time all year** (UTC−7).  
- The **Navajo Nation** within Arizona does observe daylight saving, adding another twist.  
- **Hawaii** also skips daylight saving and stays on Hawaii Standard Time (UTC−10).

This is why “Mountain Time” can be confusing. Phoenix and Denver are often out of sync part of the year.

When you open a city page like /city/phoenix or /city/denver in TimeInCity, you see the correct local time based on these rules—without memorizing who opted out.

---

## US territories and extra time zones

Outside the continental US, there are more time zones:

- **Alaska Time** – Anchorage, Juneau (UTC−9 standard, UTC−8 daylight)
- **Hawaii-Aleutian Time** – Hawaii and parts of the Aleutian Islands (UTC−10)
- **Puerto Rico & US Virgin Islands** – Atlantic Standard Time (UTC−4), no daylight saving

If you’re coordinating with people or partners in these regions, it helps to think in terms of **cities**, not just generic time zone names.

---

## A simple way to remember US time differences

For most of the year, this mental model works:

- Pacific is **3 hours behind** Eastern  
- Mountain is **2 hours behind** Eastern  
- Central is **1 hour behind** Eastern  

So if it’s 3 p.m. in New York:

- Chicago: 2 p.m.
- Denver: 1 p.m.
- Los Angeles: 12 p.m.

But around daylight saving transitions (and for Arizona/Hawaii), the easiest thing is to check a live source.

---

## How TimeInCity helps with US time zones

Instead of thinking in abbreviations, think in **cities**:

- Want Eastern Time? Open /city/new-york or /city/atlanta.
- Want Central Time? Open /city/chicago or /city/dallas.
- Want Mountain Time? Open /city/denver.
- Want Pacific Time? Open /city/los-angeles.

TimeInCity shows:

- A live clock that updates every second
- The current time zone label (EST vs EDT, CST vs CDT, etc.)
- The current UTC offset
- Weather and daylight info to give context

If you regularly coordinate across the US, keep a few city pages pinned in your browser so you always have a quick reference.

---

## When in doubt, check the city, not the code

EST vs EDT, CST vs CDT, MST vs MDT… it adds up fast.

If you’re ever unsure:

1. Ask someone which **city** they’re in.
2. Open that city in TimeInCity.
3. Let the app handle the codes and offsets.

That way you’re always scheduling against the time people actually see on their clocks, not just a three-letter acronym.
`,
  },
  {
    slug: "europe-time-zones-guide",
    title: "Time Zones in Europe: CET, GMT, and How Daylight Saving Works",
    description: "A clear overview of European time zones, including GMT, CET, and the impact of daylight saving time.",
    content: `# Time Zones in Europe: CET, GMT, and How Daylight Saving Works

If you work with people in Europe, you’ll see time zone labels like GMT, CET, and CEST. They’re not as intimidating as they look once you break them down.

This guide covers the main European time zones and how to make sense of them with TimeInCity.

---

## GMT and the UK

Historically, **Greenwich Mean Time (GMT)** is based on the mean solar time at Greenwich, in London. It’s what a lot of people think of as “zero” on the time zone map.

In practice:

- In winter, the UK uses **GMT (UTC+0)**.
- In summer, the UK switches to **British Summer Time (BST, UTC+1)**.

So London is not always “GMT” in the strict sense. When you open /city/london in TimeInCity, you’ll see either GMT or BST depending on the time of year, with the correct UTC offset.

---

## CET and CEST across much of Europe

A large chunk of Europe uses **Central European Time (CET)** and its daylight version, **Central European Summer Time (CEST)**.

- CET: **UTC+1**
- CEST: **UTC+2**

Countries that use CET/CEST include:

- Germany
- France
- Italy
- Spain
- Poland
- Many others in central and western Europe

So if it’s 12:00 in London (winter, GMT), it’s usually 13:00 in Berlin or Paris (CET).

Open /city/berlin or /city/paris in TimeInCity and you’ll see the current local time and offset.

---

## Other European time zones

There are more time zones once you zoom out:

- **Eastern European Time (EET)** / **EEST** (UTC+2 / UTC+3) used in places like Greece, Finland, and parts of Eastern Europe.
- **Western European Time (WET)** / **WEST** (UTC+0 / UTC+1) used in Portugal and some Atlantic islands.
- **Further east** (Russia and beyond) you’ll see multiple additional time zones.

But day-to-day, if you’re dealing with EU business hubs, you’ll mostly think in terms of:

- London (GMT/BST)
- “Mainland Europe” (CET/CEST)

---

## European daylight saving time

Most European countries that use CET, CEST, EET, or EEST also observe daylight saving time:

- Clocks move **forward** one hour in spring.
- Clocks move **back** one hour in autumn.

Importantly, Europe’s daylight saving change dates are not always the same as those in North America. For a few weeks each year, the time difference between Europe and the US can temporarily shift by one hour.

This is where having live city clocks is extremely useful.

---

## Working with Europe from the US

Here’s a simple way to think about overlap:

- Morning in the US is afternoon in Europe.
- For US East Coast + Central Europe:
  - 9:00 a.m. New York ≈ 3:00 p.m. Berlin (depending on the season).
- For US West Coast + Central Europe:
  - 9:00 a.m. Los Angeles ≈ 18:00 (6:00 p.m.) in Berlin.

If you keep the relevant city pages open in TimeInCity (for example, /city/new-york and /city/berlin), you can quickly see where the workday overlaps and schedule accordingly.

---

## How TimeInCity helps with European time zones

Instead of memorizing all the acronyms, anchor on cities:

- London for GMT/BST
- Berlin, Paris, Madrid for CET/CEST
- Athens or Helsinki for EET/EEST

TimeInCity shows:

- The live local time
- The current time zone label (CET vs CEST, GMT vs BST)
- The UTC offset
- Sunrise, sunset, and weather to give context

When in doubt, open the city page and let the app handle the acronyms and seasonal changes for you.

---

## The simple rule

Europe’s time zones aren’t that scary if you remember:

- London is usually your GMT/BST reference.
- Much of Europe is one hour ahead (CET/CEST).
- Daylight saving time can shift things by an extra hour, but tools like TimeInCity handle that for you.

Think in cities, not codes, and coordinating with Europe becomes much easier.
`,
  },
  {
    slug: "traveling-across-time-zones",
    title: "Traveling Across Time Zones: How to Plan Flights, Jet Lag, and Calls Back Home",
    description: "Practical tips for handling time changes when you travel, using city pages as your planning cheat sheet.",
    content: `# Traveling Across Time Zones: How to Plan Flights, Jet Lag, and Calls Back Home

Travel is fun. Time changes are not.

The good news is you can use a world clock like TimeInCity to take most of the guesswork out of flights, jet lag, and staying in touch with people back home.

---

## Step 1: Get clear on departure and arrival cities

Before you book anything, write down:

- Your departure city
- Your arrival city
- Any layover cities

For each one, open the city page in TimeInCity and note:

- The local time right now
- The time zone and UTC offset
- Sunrise and sunset times

This gives you a feel for how far apart the days really are.

---

## Step 2: Translate flight times into real-world time

Airlines always list departure and arrival times in **local time**.

For example:

- Depart Chicago at 18:00
- Arrive London at 07:30 (next day)

On paper that’s 7.5 hours, but in reality:

- Chicago might be on Central Time
- London might be on GMT or BST depending on the season

Open /city/chicago and /city/london in TimeInCity and think through:

- “When I take off, what does it look like outside in Chicago?”
- “When I land, is London just waking up, in the middle of the workday, or late at night?”

This helps you plan whether to sleep on the plane, stay awake, or split the difference.

---

## Step 3: Shift your schedule before you fly (for big jumps)

If you’re crossing more than 3–4 hours of time difference, it helps to **start shifting a bit early**:

- A few days before your trip, use TimeInCity to check the local time at your destination.
- Move your bedtime and wake-up time 30–60 minutes in that direction each day.
- Nudge meal times slightly as well.

You don’t have to fully match the new time zone before you land, but getting “closer” makes the first couple of days easier.

---

## Step 4: Use light and timing to fight jet lag

Jet lag isn’t just about clocks—it’s about light.

General tips:

- If you arrive in the morning, try to **get sunlight** in the new location.
- If you arrive late at night, lean into the darkness, wind down, and sleep.

Check the sunrise and sunset on your destination’s TimeInCity page:

- Plan outdoor time around those windows.
- Avoid staying locked in hotel lighting with no sense of when it’s actually day or night.

---

## Step 5: Plan calls back home with city pages

While you’re away, you still need to talk to people back home.

Instead of guessing:

1. Open your destination city page (for example, /city/london).
2. Open your home city page (for example, /city/denver).
3. Look at both clocks and find slots that are reasonable for both sides.

Try to avoid:

- Super late-night calls for the traveler when they’re already jet-lagged.
- Very early morning calls for people back home.

If you have family, pick a couple of “standing windows” where calls are likely, and stick to those.

---

## Step 6: Expect a few off days and plan around them

Even with good planning, big time jumps feel weird for a couple of days.

- Don’t schedule mission-critical meetings immediately after you land.
- Give yourself one or two lighter days to adjust.
- Use TimeInCity to regularly re-ground yourself: “What time is it back home right now? What time is it here?”

The more you check a reliable source, the less mental overhead you spend trying to remember.

---

## Travel is easier when you see the whole picture

Travel across time zones doesn’t have to be disorienting. If you:

- Think in cities instead of just numbers
- Use a world clock to see real local time at a glance
- Adjust your schedule gradually and use light strategically

…you’ll feel a lot more human on the road.

TimeInCity is a simple way to do that: keep tabs open for “home” and “away,” and let the live clocks keep you oriented.
`,
  },
  {
    slug: "offshore-teams-best-meeting-times",
    title: "Working With Offshore Teams: Best Meeting Times for US, Europe, and Asia",
    description: "A practical guide for picking fair meeting times across US, Europe, and Asia using time zone overlap.",
    content: `# Working With Offshore Teams: Best Meeting Times for US, Europe, and Asia

If your team spans the US, Europe, and Asia, coordinating live meetings can feel like a puzzle.

This guide gives you practical overlap windows and a way to use TimeInCity to keep things fair.

---

## The basic time zone triangle

Let’s use three anchor cities:

- **Denver** (US Mountain Time)
- **London** (UK)
- **Singapore** (as a stand-in for much of Southeast Asia)

The exact offsets shift with daylight saving time, but broadly:

- London is ahead of Denver by 6–7 hours.
- Singapore is ahead of London by 7–8 hours.
- Singapore is ahead of Denver by 13–15 hours.

You can see these live at any moment by opening /city/denver, /city/london, and /city/singapore in TimeInCity.

---

## Overlap windows that usually work

### US + Europe

Best live meeting window:

- US morning / Europe afternoon

Examples (depending on season):

- 8–11 a.m. Denver
- 3–6 p.m. London

### Europe + Asia

Best live meeting window:

- Europe morning / Asia afternoon or evening

Examples:

- 8–11 a.m. London
- 3–6 p.m. Singapore

### US + Asia

Best live meeting window:

- US late afternoon / Asia morning next day

Examples:

- 4–7 p.m. Denver
- 7–10 a.m. Singapore (next day)

If you need **all three regions** at once, you’re often looking at:

- US morning
- Europe late afternoon
- Asia late evening

or

- US evening
- Europe early morning
- Asia mid-day

Use TimeInCity city pages to visualize this in real time before sending invites.

---

## Make a “meeting time ladder”

For recurring cross-region collaboration:

1. Pick one representative city per region.
2. Open those city pages in TimeInCity.
3. Look for 1–2 hour blocks where:
   - The US side is within 8 a.m.–6 p.m.
   - The Europe side is within 8 a.m.–7 p.m.
   - The Asia side is within 8 a.m.–9 p.m.

Mark those blocks as your “ladder rungs” for meetings. Use them consistently so people can plan around them.

---

## Rotate who gets the tough slot

Sometimes there is no perfect window. In that case:

- Rotate which region gets the early or late slot.
- Document the rotation in your team agreement.
- Use recordings and written summaries so people who miss live calls can still stay in the loop.

For example:

- Week 1: Slightly painful for Asia
- Week 2: Slightly painful for Europe
- Week 3: Slightly painful for US

You can even note this in the calendar description.

---

## Use TimeInCity as your control panel

Here’s a simple way to operate day to day:

1. Pin city tabs for your core regions (for example, /city/denver, /city/london, /city/singapore).
2. Before booking anything, glance at all three clocks.
3. Choose a time that:
   - Lands in your predefined overlap window, or
   - Clearly rotates the burden if it has to be rough for someone.

You don’t have to memorize offsets or track daylight saving changes. The live clocks do that for you.

---

Working with offshore teams will always involve trade-offs, but with a clear overlapping window and a shared reference like TimeInCity, it becomes manageable—and a lot less chaotic.
`,
  },
  {
    slug: "check-time-in-any-city",
    title: "How to Quickly Check the Time in Any City (and Stop Googling It 10 Times a Day)",
    description: "A simple workflow for using TimeInCity as your default world clock instead of constant one-off searches.",
    content: `# How to Quickly Check the Time in Any City (and Stop Googling It 10 Times a Day)

If you constantly type “time in [city]” into a search bar, you’re doing more work than you need to.

Here’s a simpler way to keep track of the places you care about using TimeInCity.

---

## The problem with one-off searches

One-off searches are fine when you rarely deal with other time zones. But if you:

- Work with a remote team
- Have friends or family overseas
- Travel often

…you end up repeating the same searches over and over with no memory of what you learned last time.

You need a **persistent view**, not just a one-time answer.

---

## Step 1: Pick your “core cities”

Write down the cities you most often care about:

- Where you live
- Where your team or clients are
- Where your closest friends or family live
- Any frequent travel destinations

For many people, that’s 3–6 cities.

---

## Step 2: Open each city in TimeInCity

For each city, open the TimeInCity page, for example:

- /city/denver
- /city/new-york
- /city/london
- /city/tokyo

Each page shows:

- A live clock that updates every second
- The local time zone and UTC offset
- Weather, sunrise, and sunset for extra context

---

## Step 3: Pin or bookmark a “world clock” window

Instead of searching from scratch each time:

- Keep one browser window dedicated to your “world clock.”
- Open a tab for each city you care about.
- Pin the tabs or bookmark them in a single folder.

Now, any time you wonder “What time is it in London right now?”, you:

1. Switch to the world clock window.
2. Click the London tab.
3. See the answer instantly.

No searching, no ads, no hunting through results.

---

## Step 4: Use it before you ping or schedule

Make this a habit:

- Before you send a message to someone in another city, glance at their city page.
- Before you send a calendar invite, glance at everyone’s city pages.

This takes a few seconds and prevents:

- Middle-of-the-night notifications
- Meetings that always favor one time zone
- “Wait, I thought you were five hours ahead, not six” confusion

---

## Step 5: Add new cities as your world grows

As you meet new people or take on new clients:

1. Ask which city they’re in.
2. Add that city to your TimeInCity bookmarks.
3. Use it as part of your normal check-in routine.

You don’t need to remember the offset—just the city name.

---

## Step 6: Let TimeInCity handle the weird stuff

Daylight saving changes?  
Certain regions opting out?  
Temporary offset shifts?

You don’t have to track any of it. When you open a city page, TimeInCity uses up-to-date time zone rules to show:

- The correct local time
- The correct relationship to UTC
- The current label (like PST vs PDT or CET vs CEST)

All you see is “What time is it there right now?”—which is what you really care about.

---

## A better mental model for world time

Instead of thinking in abstract offsets, think in:

- **People** (who you’re talking to)
- **Cities** (where they are)
- **Live clocks** (what they’re actually seeing)

TimeInCity exists to make that easy. Keep a small set of city pages open, and you’ll never have to Google “time in [city]” five times a day again.
`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return articles;
}
