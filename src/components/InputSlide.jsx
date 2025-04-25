import React from 'react';
import '../style/InputSlide.css'; // Asegúrate que esta ruta sea correcta

// **MODIFICADO**: Acepta las props 'value', 'onChange', y 'disabled'
const InputSlide = ({ value, onChange, disabled = false }) => {

  // Función de cambio interna que solo llama a onChange si no está deshabilitado
  const handleChange = (event) => {
    if (!disabled && onChange) {
      // Llama al onChange original pasado desde el padre
      // Directamente con el evento o podrías pasar !value si onChange espera el nuevo valor
      onChange(event); // O podrías hacer onChange(!value) dependiendo de qué espera QuestionsForm
    }
  };

  return (
    // **MODIFICADO**: Quitado el div contenedor innecesario aquí,
    // el estilo de layout se maneja mejor en el componente padre (SwitchOption)
    // Aplicar clase 'disabled' al label si la prop disabled es true
    <label className={`switch ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={value}       // Controlado por el estado del padre
        onChange={handleChange} // Usar el handler interno
        disabled={disabled}   // Aplicar el atributo disabled al input
      />
      {/* El span 'slider' será estilizado por CSS basado en el estado
          del input (:checked) y la clase .disabled en el label */}
      <span className="slider"></span>
    </label>
  );
};

export default InputSlide;