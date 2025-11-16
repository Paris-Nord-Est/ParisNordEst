const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./source/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Amiko", ...defaultTheme.fontFamily.sans],
        amiko: ["Amiko", ...defaultTheme.fontFamily.sans],
        sharpie: ["Sharpie", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
