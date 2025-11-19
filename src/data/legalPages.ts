export interface LegalPageContent {
  slug: string;
  path: string;
  title: string;
  description: string;
  heading: string;
  body: string[];
}

export const LEGAL_PAGES: LegalPageContent[] = [
  {
    slug: "about",
    path: "/about",
    title: "About TimeInCity",
    description: "Learn more about TimeInCity — your global tool for local times, weather, sunrise, sunset, and time zone conversions.",
    heading: "About TimeInCity",
    body: [
      "TimeInCity was built to make it easy for anyone, anywhere in the world, to instantly check the local time, weather, sunrise, sunset, and essential location information for hundreds of cities.",
      "Our platform combines real-time clocks, weather data from trusted open APIs, timezone conversions, and growing tools like meeting planners and side-by-side comparisons.",
      "We believe the world is more connected than ever, and simple tools like accurate time and weather make life easier. TimeInCity aims to be the most user-friendly, ad-light, and accessible world clock on the internet."
    ]
  },
  {
    slug: "privacy",
    path: "/privacy",
    title: "Privacy Policy | TimeInCity",
    description: "Learn how TimeInCity collects, uses, and protects your data. Privacy-first global time platform.",
    heading: "Privacy Policy",
    body: [
      "TimeInCity is committed to protecting your privacy. We do not require account registration, and we use aggregated, non-identifiable data to maintain and improve the site.",
      "We may collect limited usage data, timezone detection, and cookie preferences to personalize your experience. Google Analytics and Google AdSense may collect anonymized data for analytics and advertising.",
      "You may block cookies, opt out of personalized ads, or contact us for questions about your data."
    ]
  },
  {
    slug: "terms",
    path: "/terms",
    title: "Terms of Service | TimeInCity",
    description: "Terms governing your use of TimeInCity’s world clock, weather, and time zone tools.",
    heading: "Terms of Service",
    body: [
      "TimeInCity provides clocks, weather, and location data for personal and informational use only. You agree not to use the site for unlawful activities or automated scraping.",
      "While we strive for accuracy, TimeInCity makes no guarantees regarding availability or completeness. Information is provided as-is.",
      "The site may display ads or outbound links, and we are not responsible for third-party content. Continued use of TimeInCity indicates acceptance of these terms."
    ]
  },
  {
    slug: "contact",
    path: "/contact",
    title: "Contact TimeInCity — Questions, Suggestions & Support",
    description: "Contact TimeInCity for support, suggestions, business inquiries, or technical assistance.",
    heading: "Contact TimeInCity",
    body: [
      "We value feedback, suggestions, and questions. Reach out if you have ideas for improvements, business opportunities, or if you spot an issue.",
      "Advertising partners and integration inquiries are welcome — we’d be happy to discuss options.",
      "Email support@timeincity.com and we’ll respond within 48–72 hours."
    ]
  }
];
