import React, { useState } from 'react';

// Botón Eliminar con 3 estados (deshabilitado, habilitado, hover)
export const DeleteButton = ({ onClick, disabled = false, children, tooltipText = "Eliminar" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Determina la clase de color basada en el estado
  const getButtonClass = () => {
    if (disabled) return "bg-gray-400 cursor-not-allowed"; // Deshabilitado (gris)
    if (isHovered) return "bg-orange-600"; // Hover (naranja oscuro)
    return "bg-orange-400"; // Normal (naranja claro)
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={`flex items-center justify-center px-8 py-2 rounded-full text-white transition-colors duration-200 ${getButtonClass()}`}
        onClick={!disabled ? onClick : undefined}
        onMouseEnter={() => {
          if (!disabled) {
            setIsHovered(true);
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        disabled={disabled}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {children || "Eliminar"}
      </button>
      
      {/* Tooltip */}
      {showTooltip && !disabled && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-2 w-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Botón Cancelar con 2 estados (normal, hover)
export const CancelButton = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determina la clase de color basada en el estado
  const getButtonClass = () => {
    if (isHovered) return "bg-purple-800"; // Hover (morado oscuro)
    return "bg-purple-700"; // Normal (morado claro)
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-center px-8 py-2 rounded-full text-white transition-colors duration-200 ${getButtonClass()}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children || "Cancelar"}
    </button>
  );
};

// Botón Aceptar con 2 estados (normal, hover)
export const AcceptButton = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determina la clase de color basada en el estado
  const getButtonClass = () => {
    if (isHovered) return "bg-green-600"; // Hover (verde oscuro)
    return "bg-green-500"; // Normal (verde claro)
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-center px-8 py-2 rounded-full text-white transition-colors duration-200 ${getButtonClass()}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children || "Aceptar"}
    </button>
  );
};