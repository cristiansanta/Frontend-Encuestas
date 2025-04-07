import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle } from 'lucide-react'; // Si tienes un paquete de iconos
import SaveIcon from '../assets/img/save.svg'; // Ajusta la ruta según la ubicación de tus iconos

/**
 * Componente Button reutilizable para diferentes tipos de botones en la aplicación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del botón ('primary', 'secondary', 'success', 'danger', 'save', 'publish')
 * @param {string} props.size - Tamaño del botón ('sm', 'md', 'lg')
 * @param {string} props.text - Texto a mostrar en el botón
 * @param {function} props.onClick - Función a ejecutar al hacer clic
 * @param {boolean} props.disabled - Si el botón debe estar deshabilitado
 * @param {node} props.icon - Icono personalizado (opcional)
 * @param {boolean} props.iconPosition - Posición del icono ('left', 'right')
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element} - Componente de botón
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  text, 
  onClick, 
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...restProps
}) => {
  // Configuración de estilos según la variante
  const variantStyles = {
    primary: 'bg-blue-custom text-white hover:bg-dark-blue-custom',
    secondary: 'bg-gray-custom text-blue-custom hover:bg-gray-200',
    success: 'bg-green-custom text-white hover:bg-dark-green-custom',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    save: 'bg-teal-600 text-white hover:bg-teal-700',
    publish: 'bg-green-custom text-white hover:bg-dark-green-custom',
    continue: 'bg-green-custom text-white hover:bg-dark-green-custom',
  };

  // Configuración de tamaños
  const sizeStyles = {
    sm: 'py-1 px-4 text-sm',
    md: 'py-1.5 px-6 text-base',
    lg: 'py-2 px-8 text-lg',
  };

  // Determinar el icono basado en la variante si no se proporciona uno
  const getDefaultIcon = () => {
    switch(variant) {
      case 'publish':
        return <CheckCircle className="w-5 h-5" />;
      case 'save':
        return <img src={SaveIcon} alt="Guardar" className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Usar el icono proporcionado o el predeterminado
  const buttonIcon = icon || getDefaultIcon();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant] || variantStyles.primary} 
        ${sizeStyles[size] || sizeStyles.md}
        font-work-sans font-medium rounded-full
        transition-colors duration-300
        flex items-center justify-center 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...restProps}
    >
      {buttonIcon && iconPosition === 'left' && (
        <span className="mr-2">{buttonIcon}</span>
      )}
      
      {text}
      
      {buttonIcon && iconPosition === 'right' && (
        <span className="ml-2">{buttonIcon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'save', 'publish', 'continue']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

export default Button;