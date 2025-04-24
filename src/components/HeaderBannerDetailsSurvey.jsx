import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import banner images
import CaseActive from '../assets/img/banneractive.svg';
import CaseComingFinished from '../assets/img/bannercomingfinished.svg';
import CaseNotPublic from '../assets/img/bannernotpublic.svg';
import CaseFinished from '../assets/img/bannerfinished.svg';

// Import components
import HeaderBar from './HeaderBar';

/**
 * HeaderBannerDetailsSurvey - Component that manages banner display based on survey state
 * Includes survey title and status display
 * 
 * @param {Object} props - Component properties
 * @param {string} props.surveyState - The current state of the survey ('Activa', 'Próxima a Finalizar', 'Sin publicar', 'Finalizada')
 * @param {string} props.username - The username to display (received from localStorage)
 * @param {string} props.surveyTitle - The title of the survey
 * @returns {JSX.Element} - The rendered component
 */
const HeaderBannerDetailsSurvey = ({ surveyState, username, surveyTitle }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Consider mobile if width is less than 768px
    };

    handleResize(); // Execute when component loads
    window.addEventListener('resize', handleResize); // Listen for window size changes

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up event when unmounting
    };
  }, []);

  /**
   * Determines which banner image to display based on the survey state
   * @returns {string} - The path to the banner image
   */
  const getBannerByState = () => {
    switch (surveyState) {
      case 'Activa':
        return CaseActive;
      case 'Próxima a Finalizar':
        return CaseComingFinished;
      case 'Sin publicar':
        return CaseNotPublic;
      case 'Finalizada':
        return CaseFinished;
      default:
        return CaseNotPublic;
    }
  };

  return (
    <div className="banner-container relative">
      <div className="banner-image-wrapper relative">
        <img 
          src={getBannerByState()} 
          alt={`Estado: ${surveyState}`} 
          className="banner-image w-full h-auto rounded-t-lg"
        />
        
        {/* Contenido sobre el banner - ajustado más a la derecha */}
        <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-32 lg:pl-48 xl:pl-64 pr-8 md:pr-12 lg:pr-16">
          {/* Título de la encuesta */}
          <h1 className="text-white text-2xl md:text-4xl lg:text-7xl font-work-sans font-bold mb-3">
            {surveyTitle || 'Encuesta sin título'}
          </h1>
          
          {/* Separador blanco */}
          <div className="w-full max-w-2xl h-0.5 bg-white mb-3"></div>
          
          {/* Estado de la encuesta */}
          <div className="flex items-center">
            <span className="text-white text-lg md:text-xl font-work-sans mr-3">
              Estado de la Encuesta:
            </span>
            <span className="text-white text-lg md:text-xl font-work-sans font-semibold px-4 py-1 border border-white rounded-full">
              {surveyState}
            </span>
          </div>
        </div>
        
        {/* HeaderBar para mostrar el nombre de usuario */}
        <HeaderBar username={username} />
      </div>
    </div>
  );
};

// Define prop types
HeaderBannerDetailsSurvey.propTypes = {
  surveyState: PropTypes.oneOf(['Activa', 'Próxima a Finalizar', 'Sin publicar', 'Finalizada']),
  username: PropTypes.string,
  surveyTitle: PropTypes.string
};

// Define default props
HeaderBannerDetailsSurvey.defaultProps = {
  surveyState: 'Sin publicar',
  username: '',
  surveyTitle: ''
};

export default HeaderBannerDetailsSurvey;