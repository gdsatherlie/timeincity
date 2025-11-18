export type StaticPageSlug = "about" | "privacy" | "terms" | "contact";

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

const UPDATED_DATE = "July 2024";

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
          "Our platform combines real-time browser-based clocks, weather data from trusted open APIs, timezone conversions, and planning helpers like meeting planners and side-by-side comparisons. Everything is designed to update instantly and display clearly across phones, tablets, and desktops."
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
          "TimeInCity (“we”, “our”, “the site”) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data. We do not require account registration or login to use TimeInCity."
        ]
      },
      {
        heading: "Information We Collect",
        list: [
          "Usage data sent by your browser, such as anonymized IP address where possible, device details, pages visited, and referring websites.",
          "Approximate timezone information so we can show the correct local time. This detection is processed on your device and is not used to personally identify you.",
          "Cookies or local storage that remember your theme preference, saved cities, or other functionality that keeps the experience smooth."
        ]
      },
      {
        heading: "Google Analytics",
        paragraphs: [
          "We use Google Analytics to understand how visitors use TimeInCity. Google may collect anonymized IP addresses, device data, and interaction information to provide aggregated reports. You can opt out with the Google Analytics opt-out browser add-on: https://tools.google.com/dlpage/gaoptout/."
        ]
      },
      {
        heading: "Google AdSense & Ads",
        paragraphs: [
          "TimeInCity displays ads served by Google AdSense. Google may use cookies, personalized or non-personalized ad identifiers, and general region/location signals to deliver ads. Users in regions covered by GDPR or similar laws may see a consent banner. Learn more at https://policies.google.com/technologies/ads."
        ]
      },
      {
        heading: "How We Use Information",
        paragraphs: [
          "We use aggregated, non-identifiable data to maintain and improve site performance, understand user behavior, deliver relevant advertising, and enhance the overall experience."
        ]
      },
      {
        heading: "Data Security & Your Choices",
        paragraphs: [
          "We do not sell personal information. Standard security measures protect all usage data. You may block cookies in your browser settings, opt out of personalized ads when prompted by Google, or contact us to request removal or clarification."
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
          "Welcome to TimeInCity. By accessing or using the site, you agree to these Terms of Service."
        ]
      },
      {
        heading: "Use of the Site",
        paragraphs: [
          "TimeInCity provides real-time clocks, weather information, and location-based data for personal and informational use. You agree not to use the site for unlawful activities, automated scraping, interfering with site functionality, or redistributing content without permission."
        ]
      },
      {
        heading: "Accuracy of Information",
        paragraphs: [
          "We strive to provide accurate, up-to-date information using reputable public APIs. However, TimeInCity makes no guarantees regarding absolute accuracy, availability, completeness, or timeliness. All data is provided “as is.”"
        ]
      },
      {
        heading: "External Links & Advertising",
        paragraphs: [
          "TimeInCity may display ads or outbound links. We are not responsible for the content, services, or practices of third-party websites. Advertising is provided through Google AdSense, and by using the site you agree to applicable ad-serving terms."
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
          "TimeInCity is not liable for damages from inaccurate data, temporary outages, decisions made based on site information, or third-party ads and links. Use of the site is at your own risk."
        ]
      },
      {
        heading: "Changes & Contact",
        paragraphs: [
          "We may update these Terms periodically. Continued use of the site indicates acceptance of the updated Terms. For questions, visit https://www.timeincity.com/contact."
        ]
      }
    ]
  },
  contact: {
    title: "Contact TimeInCity",
    sections: [
      {
        paragraphs: [
          "We value feedback, suggestions, and questions. If you’d like to reach out regarding improvements, business inquiries, partnerships, or technical issues, you can contact us below."
        ]
      },
      {
        heading: "General Inquiries",
        paragraphs: [
          "For any questions about the site, features, or recommendations, send us a message using the contact form (coming soon) or reach out via email."
        ]
      },
      {
        heading: "Advertising & Partnerships",
        paragraphs: [
          "If you’re interested in advertising, sponsoring sections of TimeInCity, or integrating our tools into your website, we’re happy to discuss options and custom embeds."
        ]
      },
      {
        heading: "Report Issues",
        paragraphs: [
          "Spot a bug or notice data accuracy problems? Let us know so we can investigate quickly and keep the clocks and weather feeds up to date."
        ]
      },
      {
        heading: "How to Reach Us",
        paragraphs: [
          "Email support@timeincity.com and we’ll reply within 48–72 hours. You can also use the contact page form once it launches to share more details about your request."
        ]
      }
    ]
  }
};
