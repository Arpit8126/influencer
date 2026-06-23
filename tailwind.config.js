/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        luxuryBlack: "#0d0d0d",
        luxuryMauve: "#1a0f14",
        gold: {
          light: "#d9c39e",
          DEFAULT: "#c9a96e",
          dark: "#a3824b",
        },
        cream: "#f5efe6",
        mauve: "#c4a4b0",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        inter: ["'Inter'", "sans-serif"],
        mono: ["'Inter Mono'", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        widest: "0.2em",
      },
    },
  },
  plugins: [],
}
