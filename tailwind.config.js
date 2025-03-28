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
        'purple-custom': '#81217D',
        'gren-custom': '#00AA00',
        'orange-custom': '#FF730E',
        'celeste-custom': '#00919F',
      },
    },
  },
  plugins: [],
};
