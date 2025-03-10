import React from 'react';

const NextButton = ({ onClick, disabled }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="w-full"> {/* Aseguramos que el contenedor ocupe todo el ancho */}
      <button
        className={`h-10 w-full pl-2 rounded-lg ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#39A900] hover:bg-green-700'
        } text-white`}
        onClick={handleClick}
        disabled={disabled}
      >
        Guardar Pregunta
      </button>
    </div>
  );
};

export default NextButton;
