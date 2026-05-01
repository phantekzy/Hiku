/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        hiku: {
          bg: "#0d0d1a",
          surface: "#141428",
          surface2: "#1a1a35",
          border: "#1e1e3a",
          accent: "#7c3aed",
          "accent-hover": "#6d28d9",
          "accent-muted": "#4c1d95",
          text: "#e2e8f0",
          muted: "#94a3b8",
          danger: "#ef4444",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "slide-in": "slideIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideIn: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
