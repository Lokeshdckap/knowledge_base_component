/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F72FD",
        textPrimary: "#241825",
      }
    },
    screens: {
        'lg': {'min': '1024px', 'max': '1299px'},
        'xl': {'min': '1300px', 'max': '1440px'},
        'md': {'min': '1440px', 'max': '1920px'},
    }
  },
plugins: [],
}

