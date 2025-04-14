/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        xs: "400px",
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
      fontFamily: {
        satoshi: ["Satoshi-Regular", "sans-serif"],
        "satoshi-Black": ["Satoshi-Black", "sans-serif"],
        "satoshi-BlackItalic": ["Satoshi-BlackItalic", "sans-serif"],
        "satoshi-Bold": ["Satoshi-Bold", "sans-serif"],
        "satoshi-BoldItalic": ["Satoshi-BoldItalic", "sans-serif"],
        "satoshi-Italic": ["Satoshi-Italic", "sans-serif"],
        "satoshi-Light": ["Satoshi-Light", "sans-serif"],
        "satoshi-LightItalic": ["Satoshi-LightItalic", "sans-serif"],
        "satoshi-Medium": ["Satoshi-Medium", "sans-serif"],
        "satoshi-MediumItalic": ["Satoshi-MediumItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
