import React, { useState } from 'react';
import Plus from '../../assets/img/Plus.png';
import TrashCan from '../../assets/img/TrashCan.png';
import '../../style/CheckBox.css';

const MultipleChoice = ({ onOptionsChange }) => {
  const [options, setOptions] = useState([
    { id: 1, label: '', placeholder: 'Option 1' },
    { id: 2, label: '', placeholder: 'Option 2' },
  ]);

  // Función para agregar un nuevo input de texto vacío con placeholder dinámico
  const handleAddOption = () => {
    const newOption = {
      id: options.length + 1,
      label: '',
      placeholder: `Option ${options.length + 1}`, // Placeholder dinámico
    };
    const newOptions = [...options, newOption];
    setOptions(newOptions);
    onOptionsChange(newOptions); // Notificar al componente padre del cambio
  };

  // Función para eliminar el último input
  const handleDeleteOption = () => {
    const updatedOptions = options.slice(0, -1);
    setOptions(updatedOptions);
    onOptionsChange(updatedOptions); // Notificar al componente padre del cambio
  };

  // Función para manejar el cambio en el input de texto
  const handleOptionChange = (id, newLabel) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, label: newLabel } : option
    );
    setOptions(updatedOptions);
    onOptionsChange(updatedOptions); // Notificar al componente padre del cambio
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className="flex justify-between items-center">
          {/* Botón de opción checkbox */}
          <div className="flex items-center gap-2 mt-4 w-full">
            <input
              type="checkbox"
              className="custom-checkbox"
            />
            {/* Input de texto con w-full y placeholder dinámico */}
            <input
              type="text"
              value={option.label}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder={option.placeholder} // Placeholder dinámico
            />
          </div>
        </div>
      ))}

      {/* Íconos de añadir y eliminar juntos al final */}
      <div className="flex justify-end mt-4 gap-4">
        <img
          src={TrashCan}
          alt="Eliminar última opción"
          className="h-8 w-8 cursor-pointer hover:opacity-80"
          onClick={handleDeleteOption}
        />
        <img
          src={Plus}
          alt="Añadir opción"
          className="h-8 w-8 cursor-pointer hover:opacity-80"
          onClick={handleAddOption}
        />
      </div>
    </div>
  );
};

export default MultipleChoice;
