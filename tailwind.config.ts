import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e5e9ff",
          200: "#c8d0ff",
          300: "#9eadff",
          400: "#6d7cff",
          500: "#4a57f5",
          600: "#393fd8",
          700: "#2f34b0",
          800: "#282d8c",
          900: "#1d215f"
        }
      }
    }
  },
  plugins: []
};

export default config;
