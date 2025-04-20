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
        'cyan-custom': '#00919F',
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
  plugins: [
    function({ addUtilities, theme }) {
      const scrollbarUtilities = {
        '.scrollbar-image-match': {
          // Para Firefox
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.dark-blue-custom')} #E5E7EB`,
          
          // Para Webkit (Chrome, Safari, Edge)
          '&::-webkit-scrollbar': {
            'width': '8px', // Ancho total de la barra
          },
          '&::-webkit-scrollbar-track': {
            'background': '#E5E7EB', // Gris claro (similar a gray-200)
            'border-radius': '4px', // Radio de borde sutil
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': theme('colors.dark-blue-custom'),
            'border-radius': '4px', // Radio de borde que coincide con el track
            // Sin borde para mantener el aspecto de la imagen
          },
        },
      };
      
      addUtilities(scrollbarUtilities);
    },
  ],
};