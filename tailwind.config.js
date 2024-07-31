import { text } from "stream/consumers";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          base: "#1F2937",
          secondary: "#31363F",
          accent: "#76ABAE",
          text: "#EEEEEE",
        },
        light: {
          base: "#F7F9F2",
          secondary: "#91DDCF",
          accent: "#E8C5E5",
          secondaccent: "#F19ED2",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
