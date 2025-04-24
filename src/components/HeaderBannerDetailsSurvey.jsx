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
 * Adapted to match the structure and functionality of HeaderBanner
 * 
 * @param {Object} props - Component properties
 * @param {string} props.surveyState - The current state of the survey ('Activa', 'Próxima a Finalizar', 'Sin publicar', 'Finalizada')
 * @param {string} props.username - The username to display (received from localStorage)
 * @returns {JSX.Element} - The rendered component
 */
const HeaderBannerDetailsSurvey = ({ surveyState, username }) => {
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
        <HeaderBar username={username} />
      </div>
    </div>
  );
};

// Define prop types
HeaderBannerDetailsSurvey.propTypes = {
  surveyState: PropTypes.oneOf(['Activa', 'Próxima a Finalizar', 'Sin publicar', 'Finalizada']),
  username: PropTypes.string
};

// Define default props
HeaderBannerDetailsSurvey.defaultProps = {
  surveyState: 'Sin publicar',
  username: ''
};

export default HeaderBannerDetailsSurvey;