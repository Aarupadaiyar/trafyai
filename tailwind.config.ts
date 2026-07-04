import type { Config } from "tailwindcss";

// Trafy design tokens — pulled 1:1 from the existing marketing site.
// Do not introduce new accent colors, gradients, or glass effects here.
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAFAF0", // page background
          dim: "#F3F3E7",     // secondary surface (e.g. sidebar wells)
        },
        ink: {
          DEFAULT: "#0B0B0B", // near-black text / black sections
          soft: "#1A1A1A",
        },
        lime: {
          DEFAULT: "#C8FF2C", // primary accent
          dim: "#DFF8A0",     // hover/tint state
        },
        gray: {
          body: "#6B6B63",    // muted body copy on cream
          bodyDark: "#A3A395" // muted body copy on ink
        },
        border: {
          DEFAULT: "#E4E4D8", // hairline borders on cream
          dark: "#2A2A24",    // hairline borders on ink
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["4.25rem", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-md": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      borderRadius: {
        card: "22px",       // standard card radius (20-24px range)
        "card-sm": "16px",
        pill: "999px",      // buttons / eyebrow chips
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,11,11,0.04), 0 8px 24px rgba(11,11,11,0.04)",
        "soft-lg": "0 4px 8px rgba(11,11,11,0.04), 0 16px 40px rgba(11,11,11,0.06)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
