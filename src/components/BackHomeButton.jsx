import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import BackVector from '../assets/img/BackVector.svg';

/**
 * Componente de botón para regresar al Dashboard
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto del botón (por defecto 'Regresar al Home')
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element} Botón de retorno al Dashboard
 */
const BackHomeButton = ({ label, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navegar al Dashboard usando la misma lógica que utiliza el Navbar
    window.location.href = '/dashboard';
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-dark-blue-custom text-white py-1.5 px-12 rounded-full hover:bg-blue-800 transition-colors shadow-md w-full md:w-auto ${className} mr-auto ml-12 mt-8`}
    >
      <img src={BackVector} alt="Regresar" className="w-5 h-5" />
      <span className="font-work-sans text-base font-medium">{label}</span>
    </button>
  );
};

BackHomeButton.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string
};

BackHomeButton.defaultProps = {
  label: 'Regresar al Home',
  className: ''
};

export default BackHomeButton;