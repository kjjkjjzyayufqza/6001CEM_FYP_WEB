module.exports = {
  plugins: {
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: { config: "./tailwind.config.js" },
    autoprefixer: {},
  },
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
};
