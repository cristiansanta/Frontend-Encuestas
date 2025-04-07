import React from 'react';
import PropTypes from 'prop-types';
import continues from '../assets/img/continue.svg';
import Button from './Button';

/**
 * Componente para mostrar los botones de navegación en el flujo de creación de encuestas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de botón ('continue', 'save', 'finish')
 * @param {function} props.onClick - Función a ejecutar al hacer clic en el botón
 * @param {boolean} props.disabled - Si el botón debe estar deshabilitado
 * @param {string} props.className - Clases adicionales para el botón
 * @returns {JSX.Element} - Botón de navegación
 */
const NavigationButtons = ({ 
  type = 'continue',
  onClick,
  disabled = false,
  className = ''
}) => {
  // Configuración según el tipo de botón
  const buttonConfig = {
    'continue': {
      text: 'Continuar',
      variant: 'continue',
      icon: <img src={continues} alt="Continuar" className="w-5 h-5" />
    },
    'save': {
      text: 'Guardar y continuar',
      variant: 'success',
      icon: <img src={continues} alt="Guardar" className="w-5 h-5" />
    },
    'finish': {
      text: 'Finalizar',
      variant: 'primary',
      icon: <img src={continues} alt="Finalizar" className="w-5 h-5" />
    },
    'publish': {
      text: 'Publicar',
      variant: 'publish'
    },
    'save-draft': {
      text: 'Guardar sin publicar',
      variant: 'save'
    }
  };

  const config = buttonConfig[type];

  return (
    <div className={`flex justify-end mt-4 pb-12 w-full ${className}`}>
      <Button
        variant={config.variant}
        text={config.text}
        icon={config.icon}
        size="md"
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};

NavigationButtons.propTypes = {
  type: PropTypes.oneOf(['continue', 'save', 'finish', 'publish', 'save-draft']),
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default NavigationButtons;