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
        'dark-blue-custom': '#002C4D',         
        'yellow-custom': '#FFC400',                
        'purple-custom': '#81217D',         
        'green-custom': '#00AA00',
        'dark-green-custom': '#007828',         
        'orange-custom': '#FF730E',         
        'celeste-custom': '#00919F',         
        'gray-custom': '#D9D9D9',       
        'gray-back-custom': '#F0F0F0',
      },
      fontFamily: {
        'work-sans': ['"Work Sans"', 'sans-serif'],
      },     
    },   
  },   
  plugins: [], 
};