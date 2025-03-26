/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-custom': '#00324D',
        'yellow-custom': '#FFC400',
      },
    },
  },
  plugins: [],
};
