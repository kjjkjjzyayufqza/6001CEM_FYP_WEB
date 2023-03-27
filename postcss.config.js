module.exports = {
  plugins: {
    tailwindcss: { config: "./tailwind.config.js" },
    autoprefixer: {},
  },
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
};
