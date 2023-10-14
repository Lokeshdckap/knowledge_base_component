/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#234E70',
        secondary: '#F2F2F2',
        textPrimary: "#23313E",
      }
    },
  },
  plugins: [],
}

