/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      colors: {
        surface: {
          light: "#f5f5f5",
          dark: "#111111",
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)",
        "separator": "0 1px 0 rgba(0, 0, 0, 0.05)",
        "separator-dark": "0 1px 0 rgba(255, 255, 255, 0.06)",
        "elevated": "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
        "image": "0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)",
      },
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 500ms cubic-bezier(0.23, 1, 0.32, 1) both",
        "fade-in": "fade-in 300ms ease-out both",
        "scale-in": "scale-in 300ms cubic-bezier(0.23, 1, 0.32, 1) both",
      },
    },
  },
  plugins: [],
};
