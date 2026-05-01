/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "monospace"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["JetBrains Mono", "monospace"],
      },
      colors: {
        hiku: {
          bg: "#0a0f0a",
          surface: "#0f1a0f",
          surface2: "#162016",
          border: "#1e331e",
          "border-light": "#2a4a2a",
          accent: "#4a7c59",
          "accent-hover": "#5a9669",
          "accent-bright": "#6db87e",
          "accent-muted": "#2a4a35",
          cream: "#e8dfc8",
          "cream-dim": "#b8ad94",
          "cream-muted": "#7a7264",
          text: "#e8dfc8",
          muted: "#8a9e8a",
          danger: "#c0392b",
          "danger-muted": "#7a2020",
          moss: "#3d5c3d",
          pine: "#1a2e1a",
        },
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.5rem" }],
        lg: ["1rem", { lineHeight: "1.6rem" }],
        xl: ["1.125rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.25rem", { lineHeight: "1.875rem" }],
        "3xl": ["1.5rem", { lineHeight: "2rem" }],
        "4xl": ["2rem", { lineHeight: "2.5rem" }],
        "5xl": ["2.5rem", { lineHeight: "3rem" }],
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
        xl: "8px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
        blink: "blink 1.2s step-end infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(74,124,89,0.15)",
        glow: "0 0 24px rgba(74,124,89,0.2)",
        "glow-lg": "0 0 48px rgba(74,124,89,0.25)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
