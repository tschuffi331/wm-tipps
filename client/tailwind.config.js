/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wm: {
          green:  '#006847',
          red:    '#C8102E',
          gold:   '#F4A900',
          dark:   '#0D1B2A',
          light:  '#F0F4F8',
        },
      },
    },
  },
  plugins: [],
};
