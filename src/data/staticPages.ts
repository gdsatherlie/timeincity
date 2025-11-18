export type StaticPageSlug =
  | "about"
  | "privacy"
  | "terms"
  | "contact"
  | "world-time-converter"
  | "time-zone-map"
  | "what-time-is-it"
  | "why-time-zones"
  | "dst-guide"
  | "utc-explained";

export interface StaticPageSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface StaticPageContent {
  title: string;
  intro?: string;
  sections: StaticPageSection[];
}

export interface StaticPageRouteMeta {
  label: string;
  path: string;
  priority: number;
  group: "info" | "tools" | "guides";
}

export const STATIC_PAGE_ROUTES: Record<StaticPageSlug, StaticPageRouteMeta> = {
  about: { label: "About", path: "/about", priority: 0.5, group: "info" },
  privacy: { label: "Privacy Policy", path: "/privacy", priority: 0.5, group: "info" },
  terms: { label: "Terms of Service", path: "/terms", priority: 0.5, group: "info" },
  contact: { label: "Contact", path: "/contact", priority: 0.5, group: "info" },
  "world-time-converter": {
    label: "World Time Converter",
    path: "/tools/world-time-converter",
    priority: 0.8,
    group: "tools"
  },
  "time-zone-map": { label: "Time Zone Map", path: "/tools/time-zone-map", priority: 0.7, group: "tools" },
  "what-time-is-it": {
    label: "What Time Is It Around the World?",
    path: "/guides/what-time-is-it-around-the-world",
    priority: 0.7,
    group: "guides"
  },
  "why-time-zones": {
    label: "Why Time Zones Exist",
    path: "/guides/why-time-zones-exist",
    priority: 0.7,
    group: "guides"
  },
  "dst-guide": {
    label: "Daylight Saving Time Guide",
    path: "/guides/daylight-saving-time",
    priority: 0.6,
    group: "guides"
  },
  "utc-explained": { label: "UTC Explained", path: "/guides/utc-explained", priority: 0.6, group: "guides" }
};

const UPDATED_DATE = "August 2024";

export const STATIC_PAGE_CONTENT: Record<StaticPageSlug, StaticPageContent> = {
  about: {
    title: "About TimeInCity",
    sections: [
      {
        paragraphs: [
          "TimeInCity was built to make it easy for anyone, anywhere in the world, to instantly check the local time, weather, sunrise, sunset, and essential location information for hundreds of cities. Whether you’re coordinating meetings across time zones, planning travel, working remotely with a global team, or simply curious about what time it is somewhere else, TimeInCity provides a clean, accurate, fast experience."
        ]
      },
      {
        paragraphs: [
          "Our platform combines real-time browser-based clocks, weather data from trusted open APIs, timezone conversions, and upcoming features like dedicated world time converters and side-by-side time comparisons. Everything is designed to update instantly and display clearly across all devices."
        ]
      },
      {
        paragraphs: [
          "We believe the world is more connected than ever, and simple tools like accurate time and weather make life easier — whether you're a traveler, a student, a professional, or someone who just wants a convenient reference. TimeInCity aims to be the most user-friendly, ad-light, and accessible world clock on the internet."
        ]
      },
      {
        paragraphs: [
          "If you have suggestions or requests for new features, we’d love to hear from you. TimeInCity grows based on user feedback, and we’re committed to improving it week by week."
        ]
      }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    intro: `Last updated: ${UPDATED_DATE}`,
    sections: [
      {
        paragraphs: [
          "TimeInCity (“we”, “our”, “the site”) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data."
        ]
      },
      {
        heading: "Information We Collect",
        paragraphs: [
          "We do not require account registration or login to use TimeInCity. However, we may collect limited information to keep the site running smoothly."
        ],
        list: [
          "Usage Data – your browser automatically shares an anonymized IP address where possible, device type, pages visited, and referring websites.",
          "Location/Timezone Data – we may detect your approximate timezone to provide accurate local times. This information stays on your device and is not used to identify you.",
          "Cookies & Web Storage – we may remember your theme preference (light/dark), saved or recently viewed cities, and other settings that improve usability."
        ]
      },
      {
        heading: "Google Analytics",
        paragraphs: [
          "We use Google Analytics to understand how visitors use TimeInCity. Google may collect anonymized IP addresses, device data, and interaction information. You can opt out with the Google Analytics opt-out browser add-on: https://tools.google.com/dlpage/gaoptout/."
        ]
      },
      {
        heading: "Google AdSense & Ads",
        paragraphs: [
          "TimeInCity displays ads served by Google AdSense. Google may use cookies, personalized/non-personalized ad identifiers, and general region/location signals. Users in the EEA/UK/SW may see a consent banner required under GDPR. Learn more at https://policies.google.com/technologies/ads."
        ]
      },
      {
        heading: "How We Use Information",
        paragraphs: [
          "We use aggregated, non-identifiable data to maintain and improve site performance, understand user behavior, deliver relevant advertising, and enhance user experience."
        ]
      },
      {
        heading: "Data Security",
        paragraphs: [
          "We do not store or sell personal information. Standard security measures protect all usage data."
        ]
      },
      {
        heading: "Your Choices",
        paragraphs: [
          "You may block cookies in your browser settings, opt out of personalized ads when prompted by Google, or contact us for removal or clarification via the contact page."
        ]
      },
      {
        heading: "Contact",
        paragraphs: [
          "If you have questions about this Privacy Policy, visit https://www.timeincity.com/contact or email support@timeincity.com."
        ]
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    intro: `Last updated: ${UPDATED_DATE}`,
    sections: [
      {
        paragraphs: [
          "Welcome to TimeInCity. By accessing or using the site, you agree to the following Terms of Service."
        ]
      },
      {
        heading: "Use of the Site",
        paragraphs: [
          "TimeInCity provides real-time clocks, weather information, and location-based data for personal and informational use. You agree not to use the site for unlawful activities, automated scraping or data mining, interfering with site functionality, or redistributing content without permission."
        ]
      },
      {
        heading: "Accuracy of Information",
        paragraphs: [
          "We strive to provide accurate, up-to-date information using reputable public APIs. However, TimeInCity makes no guarantees regarding absolute accuracy, availability, completeness, or timeliness of data. All information is provided “as is.”"
        ]
      },
      {
        heading: "External Links",
        paragraphs: [
          "TimeInCity may display ads or outbound links. We are not responsible for the content, services, or practices of third-party websites."
        ]
      },
      {
        heading: "Intellectual Property",
        paragraphs: [
          "All design, layout, content, and code are either owned by TimeInCity or used under appropriate licenses. You may not reproduce or repurpose the platform without permission."
        ]
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "TimeInCity is not liable for damages from inaccurate data, temporary outages, decisions made based on site information, or third-party ads or links. Use of the site is at your own risk."
        ]
      },
      {
        heading: "Advertising",
        paragraphs: [
          "The site displays ads through Google AdSense. By using the site, you agree to any applicable ad-serving terms."
        ]
      },
      {
        heading: "Changes to the Terms",
        paragraphs: [
          "We may update these Terms periodically. Continued use of the site indicates acceptance of the updated Terms."
        ]
      },
      {
        heading: "Contact",
        paragraphs: [
          "For questions, visit https://www.timeincity.com/contact."
        ]
      }
    ]
  },
  contact: {
    title: "Contact TimeInCity",
    sections: [
      {
        paragraphs: [
          "We value feedback, suggestions, and questions. If you’d like to reach out regarding improvements, business inquiries, partnerships, or technical issues, you may contact us below."
        ]
      },
      {
        heading: "General Inquiries",
        paragraphs: [
          "For any general questions about the site, features, or recommendations, please send us a message using the form below (coming soon) or via email."
        ]
      },
      {
        heading: "Advertising & Partnerships",
        paragraphs: [
          "If you’re interested in advertising, sponsoring sections of TimeInCity, or integrating our tools into your business or website, we’d be happy to discuss options."
        ]
      },
      {
        heading: "Report Issues",
        paragraphs: [
          "If you find a bug or a data accuracy problem (weather, timezone, etc.), let us know so we can fix it quickly and keep every city up to date."
        ]
      },
      {
        heading: "How to Reach Us",
        paragraphs: [
          "Email support@timeincity.com and we’ll aim to respond within 48–72 hours. You can also use the contact page form once it launches to share more details about your request."
        ]
      }
    ]
  },
  "world-time-converter": {
    title: "World Time Converter",
    sections: [
      {
        paragraphs: [
          "Convert time instantly between any two cities or time zones. Whether you're planning a meeting, scheduling a flight, or coordinating across continents, this tool helps you see exactly what time it will be somewhere else.",
          "Select your starting city and destination city to view the current time in both places and the difference in hours. TimeInCity supports hundreds of destinations and accounts for daylight saving time changes automatically."
        ]
      },
      {
        paragraphs: [
          "Use the world time converter whenever you need a clear answer to “what time is it in [city]?” or need a quick way to compare schedules without doing mental math."
        ]
      }
    ]
  },
  "time-zone-map": {
    title: "World Time Zone Map",
    sections: [
      {
        paragraphs: [
          "Time zones divide the world into regions where clocks show the same time. They help keep local schedules aligned with daylight hours, especially sunrise and sunset.",
          "Explore how time zones are arranged, how offset differences work, and why UTC serves as the baseline for global coordination. Understanding the map helps you plan travel, remote work, and conversations across continents."
        ]
      },
      {
        paragraphs: [
          "Time zones are based on the Earth’s rotation and the prime meridian at Greenwich, which defines UTC (Coordinated Universal Time). Each offset represents how far ahead or behind UTC a region runs."
        ]
      }
    ]
  },
  "what-time-is-it": {
    title: "What Time Is It Around the World?",
    sections: [
      {
        paragraphs: [
          "Curious what time it is across the globe right now? This page shows how drastically the clock can vary from place to place, from early morning to late night — all at the same moment.",
          "Different parts of the world use unique time zones, often offset by whole hours, but sometimes by half-hour or quarter-hour increments. TimeInCity helps you explore the current time across hundreds of cities worldwide."
        ]
      },
      {
        paragraphs: [
          "Use our tools to quickly find the time difference between any two locations and understand how the world stays connected despite distance."
        ]
      }
    ]
  },
  "why-time-zones": {
    title: "Why Time Zones Exist",
    sections: [
      {
        paragraphs: [
          "Before time zones, local solar time was used — noon occurred when the sun was highest in the sky for each town. That changed with the introduction of railroads, telegraphs, and long-distance travel, which required a unified way to measure time.",
          "Time zones were created in the late 1800s to simplify communication and scheduling. Instead of every city keeping its own time, regions adopted standardized offsets from UTC."
        ]
      },
      {
        paragraphs: [
          "This guide explains the history of timekeeping, how time zones evolved, and why modern life depends on accurate global timing for aviation, trade, and online collaboration."
        ]
      }
    ]
  },
  "dst-guide": {
    title: "Daylight Saving Time (DST) Guide",
    sections: [
      {
        paragraphs: [
          "Daylight Saving Time shifts clocks forward by one hour during warmer months to extend evening daylight. Not all regions observe DST, and the start/end dates vary by country.",
          "If you travel, work across time zones, or coordinate events globally, understanding DST is essential."
        ]
      },
      {
        heading: "This guide covers:",
        list: [
          "A simple explanation of DST",
          "Why some countries use it",
          "When DST starts and ends this year",
          "How DST affects world clocks",
          "A quick reference for major cities"
        ]
      }
    ]
  },
  "utc-explained": {
    title: "What Is UTC?",
    sections: [
      {
        paragraphs: [
          "UTC — Coordinated Universal Time — is the global time standard used by airlines, governments, servers, satellites, and world clocks.",
          "UTC does not change for daylight saving time and acts as the baseline for all other time zones, which offset from UTC by a fixed amount (e.g., UTC−5, UTC+8)."
        ]
      },
      {
        paragraphs: [
          "This page explains what UTC means, why it replaced GMT, how offsets work, and how UTC is used daily. Every city on TimeInCity ultimately maps back to UTC, which ensures accurate time anywhere in the world."
        ]
      }
    ]
  }
};
