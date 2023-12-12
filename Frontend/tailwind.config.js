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
      'sm' :	'640px',
      'md' :	'768px',
      'lg' :	'1024px',
      'xl' :	'1280px',
      '2xl':	'1530px',
    }
  },
plugins: [],
}

