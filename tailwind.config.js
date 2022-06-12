const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./source/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        garet: ["Garet", ...defaultTheme.fontFamily.sans],
        akira: ["Akira", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
