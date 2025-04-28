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

  // Configuración de navegación según la vista actual (actualizada para usar rutas normales)
  const navigationConfig = {
    'SurveyCreate': {
      label: 'Regresar al Home',
      target: '/dashboard'
    },
    'QuestionsCreate': {
      label: 'Regresar a Datos Generales',
      target: '/survey-create'
    },
    'PreviewSurvey': {
      label: 'Regresar a Preguntas',
      target: '/questions-create'
    }
  };

  // Determinar la configuración correcta según la vista actual
  const getCurrentConfig = () => {
    // Si se proporciona explícitamente la vista actual
    if (currentView && navigationConfig[currentView]) {
      return navigationConfig[currentView];
    }
    
    // Si no, intentar detectar automáticamente basado en la URL
    const path = location.pathname;
    
    if (path.includes('survey-create')) return navigationConfig['SurveyCreate'];
    if (path.includes('questions-create')) return navigationConfig['QuestionsCreate'];
    if (path.includes('preview-survey')) return navigationConfig['PreviewSurvey'];
    
    // Por defecto, volver al Dashboard
    return navigationConfig['SurveyCreate'];
  };

  const config = getCurrentConfig();

  const handleClick = () => {
    navigate(config.target);
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