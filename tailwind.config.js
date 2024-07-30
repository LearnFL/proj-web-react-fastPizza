/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // define our own fontFamily
    fontFamily: {
      pizza: "Roboto Mono, monospace",
      // override default SANS font of tail wind
      sans: "Roboto Mono, monospace",
    },

    extend: {
      // Place colors in extent otherwise it will override all other colors and keep only this one
      colors: {
        pizza: "#123",
      },
    },
  },
  plugins: [],
};
