import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Importaciones SVG Creacion de Encuestas 
import CaseSurveyCreate from '../assets/img/create_survey.svg';
import CaseSurveyCreateResponsive from '../assets/img/responsive_crate_survey.svg';

// Importaciones SVG DashBoard
import CaseDashBoard from '../assets/img/dashboard.svg';
import CaseDashBoardResponsive from '../assets/img/responsive_dashboard.svg';



import '../style/HeaderBanner.css';

import TopBanner from '../components/TopBanner';
import HeaderBar from '../components/HeaderBar';

const HeaderBanner = ({ showDashboardBanner, username }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Considerar móvil si el ancho es menor a 768px
    };

    handleResize(); // Ejecutar al cargar el componente
    window.addEventListener('resize', handleResize); // Escuchar cambios en el tamaño de la ventana

    return () => {
      window.removeEventListener('resize', handleResize); // Limpiar el evento al desmontar
    };
  }, []);

  // Seleccionar la imagen basada en el estado booleano y si es móvil
  const imageSrc = showDashboardBanner
    ? isMobile
      ? CaseDashBoardResponsive
      : CaseSurveyCreate
    : CaseSurveyCreate;

  return (
    <div className={`banner-container ${showDashboardBanner ? 'svg-container' : ''} relative`}>
      <TopBanner />
      <div className="banner-image-wrapper relative">
        <img
          src={imageSrc}
          alt="Banner Encuestas"
          className={`banner-image ${showDashboardBanner ? 'dashboard-svg' : ''}`}
        />
        <HeaderBar username={username} />
      </div>
    </div>
  );
};

// Definir los tipos de propiedades esperadas
HeaderBanner.propTypes = {
  showDashboardBanner: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

// Definir los valores por defecto de las propiedades
HeaderBanner.defaultProps = {
  showDashboardBanner: false,
  username: '',
};

export default HeaderBanner;