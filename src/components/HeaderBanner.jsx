import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom'; // Importamos useLocation para obtener la ruta actual

// Importaciones SVG Creacion de Encuestas 
import CaseSurveyCreate from '../assets/img/create_survey.svg';
import CaseSurveyCreateResponsive from '../assets/img/responsive_crate_survey.svg';

// Importaciones SVG DashBoard
import CaseDashBoard from '../assets/img/dashboard.svg';
import CaseDashBoardResponsive from '../assets/img/responsive_dashboard.svg';

import '../style/HeaderBanner.css';

import TopBanner from '../components/TopBanner';
import HeaderBar from '../components/HeaderBar';

const HeaderBanner = ({ username }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation(); // Obtenemos la ubicación actual
  const currentPath = location.pathname;

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

  // Función para determinar qué imagen mostrar según la ruta y el dispositivo
  const getImageForRoute = () => {
    // Si es dispositivo móvil
    if (isMobile) {
      // Selección basada en la ruta para dispositivos móviles
      if (currentPath === '/dashboard' || currentPath === '/') {
        return CaseDashBoardResponsive;
      } else if (currentPath === '/survey-create') {
        return CaseSurveyCreateResponsive;
      }
      // Valor por defecto para móviles si no coincide ninguna ruta
      return CaseSurveyCreateResponsive;
    } 
    // Si es escritorio
    else {
      // Selección basada en la ruta para escritorio
      if (currentPath === '/dashboard' || currentPath === '/') {
        return CaseDashBoard;
      } else if (currentPath === '/survey-create') {
        return CaseSurveyCreate;
      }
      // Valor por defecto para escritorio si no coincide ninguna ruta
      return CaseSurveyCreate;
    }
  };

  // Determinar si se debe mostrar el estilo de dashboard
  const isDashboardView = currentPath === '/dashboard' || currentPath === '/';

  // Obtener la imagen apropiada
  const imageSrc = getImageForRoute();

  return (
    <div className={`banner-container ${isDashboardView ? 'svg-container' : ''} relative`}>
      <TopBanner />
      <div className="banner-image-wrapper relative">
        <img
          src={imageSrc}
          alt="Banner Encuestas"
          className={`banner-image ${isDashboardView ? 'dashboard-svg' : ''}`}
        />
        <HeaderBar username={username} />
      </div>
    </div>
  );
};

// Definir los tipos de propiedades esperadas
HeaderBanner.propTypes = {
  username: PropTypes.string.isRequired,
};

// Definir los valores por defecto de las propiedades
HeaderBanner.defaultProps = {
  username: '',
};

export default HeaderBanner;