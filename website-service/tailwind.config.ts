import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "1280px": "1280px",
        "3xl": "1700px",
        "2k": "1921px",
        "3k": "2561px",
        "4k": "3073px",
        "4.5k": "3458px",
        "5k": "3841px",
        "6k": "5121px",
        "8k": "6017px",
        "10k": "7681px",
        "12k": "10241px",
      },
      fontFamily: {
        sora: ["var(--font-sora)"],
      },
      colors: {
        primary: {
          50: "#edefff",
          100: "#dee2ff",
          200: "#c4caff",
          300: "#a0a7ff",
          400: "#7c7aff",
          500: "#695bf9",
          600: "#5a3dee",
          700: "#482bc9",
          800: "#3f29aa",
          900: "#362986",
          950: "#22184e",
          1000: "#181235",
          1050: "#0D0A1A",
        },
        neutral: {
          10: "#fefefe",
          150: "#eeeeee",
        },
      },
      keyframes: {
        loading: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        loading: "loading 4.25s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
