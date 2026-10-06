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
        // The MaxiLotto logo blue. 500 is a shade darker than the logo itself
        // so that white text on a brand button stays readable (5:1).
        brand: {
          50: '#EFF8FC',
          100: '#D9EFF8',
          200: '#B3DFF0',
          300: '#7CC8E4',
          400: '#3FB0D8',
          500: '#0077A6', // Primary actions and accents
          600: '#00658D',
          700: '#005474',
          800: '#00435D',
          900: '#003347',
        },
        // Ink and surfaces. 50-200 are light tints, 600-900 are the dark
        // surfaces and the main text colour. 300-500 are the secondary text
        // tones: they come from CSS variables (assets/main.css) and lighten
        // in dark mode, so `text-navy-400` is readable on either background.
        navy: {
          50: '#F5F7FA',
          100: '#E9EEF4',
          200: '#D5DDE8',
          300: 'rgb(var(--ink-faint) / <alpha-value>)',
          400: 'rgb(var(--ink-muted) / <alpha-value>)',
          500: 'rgb(var(--ink-soft) / <alpha-value>)',
          600: '#34455F',
          700: '#1F2B41', // Main text on light; borders and hovers on dark
          800: '#111A2C', // Dark mode cards
          900: '#0B1220', // Dark mode page
        },
        // The two series every chart draws with; set per theme in assets/main.css
        chart: {
          1: 'rgb(var(--chart-1) / <alpha-value>)',
          2: 'rgb(var(--chart-2) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        '3xl': '16px',
      }
    },
  },
  plugins: [],
}
