import React from 'react';
import Navbar from './Navbar';
import HeaderBanner from './HeaderBanner';
import HeaderBar from './HeaderBar';
import TopBanner from './TopBanner';

/**
 * Componente de Layout principal que define la estructura base de las páginas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido específico de la página
 * @param {string} props.headerTitle - Título a mostrar en el HeaderBar
 * @param {boolean} props.showTopBanner - Indica si se debe mostrar el banner superior
 * @param {boolean} props.showHeaderBanner - Indica si se debe mostrar el banner principal
 * @returns {JSX.Element} Estructura principal de la página
 */
const MainLayout = ({ 
  children, 
  headerTitle = "",
  showTopBanner = true,
  showHeaderBanner = true
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-back-custom">
      {showTopBanner && <TopBanner />}
      <Navbar />
      <div className="flex-1 flex flex-col items-center">
        {showHeaderBanner && <HeaderBanner username={localStorage.getItem('userName')}/>}
        {headerTitle && <HeaderBar props={headerTitle} />}
        <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;