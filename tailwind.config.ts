/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sook: {
          plum: "#300a22", // pour <span> SOOK!
          accent: "#dfa080bd", // bouton / newsletter (rgba conservé)
          accentHover: "#c87660", // hover bouton
        },
      },
      dropShadow: {
        title: "0 0 20px rgba(252,124,124,0.8)", // ex: drop-shadow-title
      },
      fontFamily: {
        krub: ["Krub", "sans-serif"],
      },
    },
  },
  plugins: [],
};
