import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5179ff",
        "dark-darken": "#171717",
        dark: "#222",
        "dark-light": "#2b2b2b",
        "dark-lighten": "#303030",
        "gray-txt": "#e4e6eb",
        // "gray-txt-2": "#8a8c8e",
        "gray-txt-2": "#b0b3b8",
        "gray-dark": "#727275",
        "gray-light": "#434343",
        "gray-lighten": "#34363b",
      },
      fontFamily: {
        roboto: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        sm: "repeat(auto-fill, minmax(130px, 1fr))",
        lg: "repeat(auto-fill, minmax(160px, 1fr))",
      },
    },
  },
  plugins: [],
};
