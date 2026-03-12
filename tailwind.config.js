/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F7FE',
          100: '#E9EDF7',
          200: '#D0D9F1',
          300: '#B0BBD8',
          400: '#8A99C0',
          500: '#7551FF', // Primary brand color used in Dashboard
          600: '#5E3BEE',
          700: '#4A2BDB',
          800: '#4318FF',
          900: '#11047A',
        },
        navy: {
          50: '#EBEFFD',
          100: '#D2D9F9',
          200: '#AAB6F2',
          300: '#7B8CEB',
          400: '#5365E4',
          500: '#2E3DDC',
          600: '#2532B0',
          700: '#1B2585',
          800: '#111C44', // Dark mode background
          900: '#0B1437', // Body background
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif']
      },
      borderRadius: {
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}