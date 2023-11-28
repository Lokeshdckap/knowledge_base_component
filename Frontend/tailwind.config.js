/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        // primary: '#DEE0E4',
        primary: '#234E70',

        secondary: '#F2F2F2',
        textPrimary: "#23313E",
        // textPrimary: "black",
      }
    },
  },
  plugins: [],
}

