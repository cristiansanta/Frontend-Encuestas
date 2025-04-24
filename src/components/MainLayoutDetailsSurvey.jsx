import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import HeaderBannerDetailsSurvey from './HeaderBannerDetailsSurvey';
import HeaderBar from './HeaderBar';
import TopBanner from './TopBanner';

/**
 * Componente de Layout principal modificado para trabajar con el nuevo HeaderBannerDetailsSurvey
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido específico de la página
 * @param {string} props.headerTitle - Título a mostrar en el HeaderBar
 * @param {boolean} props.showTopBanner - Indica si se debe mostrar el banner superior
 * @param {boolean} props.showHeaderBanner - Indica si se debe mostrar el banner principal
 * @param {string} props.surveyState - Estado de la encuesta para el banner
 * @returns {JSX.Element} Estructura principal de la página
 */
const MainLayoutDetailsSurvey = ({ 
  children, 
  headerTitle = "",
  showTopBanner = true,
  showHeaderBanner = true,
  surveyState = "Sin publicar"
}) => {
  // Obtener el nombre de usuario directamente de localStorage
  const username = localStorage.getItem('userName') || "";
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-back-custom">
      {showTopBanner && <TopBanner />}
      <Navbar />
      <div className="flex-1 flex flex-col items-center">
        {showHeaderBanner && (
          <HeaderBannerDetailsSurvey 
            surveyState={surveyState}
            username={username}
          />
        )}
        <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Define prop types
MainLayoutDetailsSurvey.propTypes = {
  children: PropTypes.node.isRequired,
  headerTitle: PropTypes.string,
  showTopBanner: PropTypes.bool,
  showHeaderBanner: PropTypes.bool,
  surveyState: PropTypes.oneOf(['Activa', 'Próxima a Finalizar', 'Sin publicar', 'Finalizada'])
};

export default MainLayoutDetailsSurvey;