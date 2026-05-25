import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      colors: {
        gold: {
          50:  "#fdf8ec",
          100: "#f9eed0",
          200: "#f2d89d",
          300: "#e8bc5e",
          400: "#D4A017",
          500: "#B8860B",
          600: "#9a7209",
          700: "#7c5b08",
          800: "#5e4506",
          900: "#3f2e04",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
