/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7573FA",
        textPrimary: "#2d2d35",
      }
    },
    screens: {
        'lg': {'min': '1024px', 'max': '1299px'},
        'xl': {'min': '1300px', 'max': '1440px'},
    }
  },
plugins: [],
}

