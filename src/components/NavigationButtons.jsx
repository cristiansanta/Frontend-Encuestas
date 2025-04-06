import React from 'react';
import PropTypes from 'prop-types';
import continues from '../assets/img/continue.svg';

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
            bgColor: 'bg-green-custom',
            hoverColor: 'hover:bg-dark-green-custom',
            icon: continues
        },
        'save': {
            text: 'Guardar y continuar',
            bgColor: 'bg-green-custom',
            hoverColor: 'hover:bg-dark-green-custom',
            icon: continues
        },
        'finish': {
            text: 'Finalizar',
            bgColor: 'bg-blue-custom',
            hoverColor: 'hover:bg-dark-blue-custom',
            icon: continues
        }
    };

    const config = buttonConfig[type];

    return (
        <div className={`flex justify-end mt-4 pb-12 w-full ${className}`}>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`flex items-center px-6 py-2 ${config.bgColor} text-white font-work-sans text-lg rounded-full ${config.hoverColor} transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <img src={config.icon} alt={config.text} className="mr-3 w-5 h-5" />
                <span>{config.text}</span>
            </button>
        </div>
    );
};

NavigationButtons.propTypes = {
    type: PropTypes.oneOf(['continue', 'save', 'finish']),
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string
};

export default NavigationButtons;