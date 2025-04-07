import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import BackVector from '../assets/img/BackVector.svg';

/**
 * Componente inteligente para navegación hacia atrás en el flujo de creación de encuestas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.currentView - Vista actual ('SurveyCreate', 'QuestionsCreate', 'PreviewSurvey')
 * @param {string} props.className - Clases adicionales para el botón
 * @returns {JSX.Element} Botón de navegación hacia atrás contextual
 */
const NavigationBackButton = ({ currentView, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Configuración de navegación según la vista actual
  const navigationConfig = {
    'SurveyCreate': {
      label: 'Regresar al Home',
      target: '/Dashboard',
      isHashRoute: true
    },
    'QuestionsCreate': {
      label: 'Regresar a Datos Generales',
      target: '/SurveyCreate',
      isHashRoute: true
    },
    'PreviewSurvey': {
      label: 'Regresar a Preguntas',
      target: '/QuestionsCreate',
      isHashRoute: true
    }
  };

  // Determinar la configuración correcta según la vista actual
  const getCurrentConfig = () => {
    // Si se proporciona explícitamente la vista actual
    if (currentView && navigationConfig[currentView]) {
      return navigationConfig[currentView];
    }
    
    // Si no, intentar detectar automáticamente basado en la URL
    const path = location.hash 
      ? location.hash.substring(1) 
      : location.pathname;
    
    if (path.includes('SurveyCreate')) return navigationConfig['SurveyCreate'];
    if (path.includes('QuestionsCreate')) return navigationConfig['QuestionsCreate'];
    if (path.includes('PreviewSurvey')) return navigationConfig['PreviewSurvey'];
    
    // Por defecto, volver al Dashboard
    return navigationConfig['SurveyCreate'];
  };

  const config = getCurrentConfig();

  const handleClick = () => {
    if (config.isHashRoute) {
      window.location.href = `/login#${config.target}`;
    } else {
      navigate(config.target);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-dark-blue-custom text-white py-1.5 px-5 rounded-full hover:bg-blue-800 transition-colors shadow-md w-full md:w-auto ${className} mr-auto ml-12 mt-8`}
    >
      <img src={BackVector} alt="Regresar" className="w-5 h-5" />
      <span className="font-work-sans text-base font-medium">{config.label}</span>
    </button>
  );
};

NavigationBackButton.propTypes = {
  currentView: PropTypes.oneOf(['SurveyCreate', 'QuestionsCreate', 'PreviewSurvey']),
  className: PropTypes.string
};

export default NavigationBackButton;