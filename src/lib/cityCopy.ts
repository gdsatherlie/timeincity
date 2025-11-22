import type { CityMeta } from "../types/cityTypes";

function pickTemplateVariant(slug: string): "A" | "B" | "C" {
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mod = hash % 3;
  if (mod === 0) return "A";
  if (mod === 1) return "B";
  return "C";
}

function buildDstNote(city: CityMeta): string {
  if (city.observesDst) {
    return `${city.name} observes Daylight Saving Time, so clocks move forward in spring and back in fall.`;
  }
  return `${city.name} does not observe Daylight Saving Time, so the local clock stays the same year-round.`;
}

type CityCopy = {
  intro: string;
  timezone: string;
  usage: string;
  compare: string;
};

export function buildCityCopy(city: CityMeta): CityCopy {
  const variant = pickTemplateVariant(city.slug);
  const dstNote = buildDstNote(city);

  if (variant === "A") {
    return {
      intro: `The live clock above shows the current local time in ${city.name}, ${city.region}, in the ${city.timezoneLabel} time zone. TimeInCity keeps the time in sync down to the second so you always see the real local time in ${city.name}.`,
      timezone: `${city.name} follows ${city.timezoneLabel}, typically running on ${city.utcOffsetLabel} over the course of the year. ${dstNote} TimeInCity automatically handles these changes, so you don’t have to keep track of when the clocks move forward or back.`,
      usage: `If ${city.name} is part of your workday or travel plans, keep this page open to confirm the local time before you send a message, schedule a meeting, or book a flight.`,
      compare: `When you need to compare ${city.name} with another place, switch to a different city or time zone in the menu. Seeing both clocks side by side makes it easier to find overlapping working hours.`,
    };
  }

  if (variant === "B") {
    return {
      intro: `${city.name} is a city in ${city.region || city.country}, with its own local rhythm of work, commutes, and daily life. The live time shown above is based on the ${city.timezoneLabel} time zone, which locals use for everyday schedules.`,
      timezone: `In practical terms, ${city.name} usually runs on ${city.utcOffsetLabel}, with the clock adjusting during the year if Daylight Saving Time applies. ${dstNote} TimeInCity keeps the clock aligned with these rules so you can trust what you see here.`,
      usage: `If you’re planning a trip to ${city.name}, check the live time plus the weather, sunrise, and sunset info to get a feel for the day right now.`,
      compare: `Use this page to line up travel days, compare check-in times against your own time zone, or decide when to call someone in ${city.name} without catching them too early or late.`,
    };
  }

  return {
    intro: `If you collaborate with people in ${city.name}, ${city.region}, the live clock above is meant to make scheduling easier. It shows the current local time in ${city.name} using the ${city.timezoneLabel} time zone, updating every second so you don’t have to calculate offsets in your head.`,
    timezone: `${city.name} runs on ${city.timezoneLabel}, which typically corresponds to ${city.utcOffsetLabel} depending on the time of year. ${dstNote} TimeInCity adjusts automatically as official time changes come into effect.`,
    usage: `Remote teams keep this page open when lining up calls, deadlines, or hand-offs with colleagues in ${city.name}. By comparing the local time here with your own time zone, you can quickly see which hours overlap.`,
    compare: `When you need to check another location, switch cities or time zones from the menu. Using TimeInCity this way gives you a lightweight dashboard for coordinating work across multiple locations.`,
  };
}
