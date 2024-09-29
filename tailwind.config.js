/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "login-svg": "url('/login.svg')",
      },
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
          tealBg: "#DEF5E5",
          teal: "#50B498",
          accent: "#E8C5E5",
          secondaccent: "#F19ED2",
        },
        boxShadow: {
          custom: "0 0 0 4px oklch(1 0 0) inset, 0 0 0 4px oklch(1 0 0) inset",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
