import React, { useState, useEffect } from 'react';
import Plus from '../../assets/img/Plus.png';
import TrashCan from '../../assets/img/TrashCan.png';

const UniqueOption = ({ onInputChange }) => {
  const [options, setOptions] = useState([
    { id: 1, label: '', placeholder: 'Option 1' },
    { id: 2, label: '', placeholder: 'Option 2' },
  ]);
  const [selectedOption, setSelectedOption] = useState(null); // Estado para el radio seleccionado

  // Función para agregar un nuevo input de texto vacío con placeholder dinámico
  const handleAddOption = () => {
    const newOption = {
      id: options.length + 1,
      label: '',
      placeholder: `Option ${options.length + 1}`,
    };
    setOptions([...options, newOption]);
  };

  // Función para eliminar el último input
  const handleDeleteOption = () => {
    const updatedOptions = options.slice(0, -1);
    setOptions(updatedOptions);
  };

  // Función para manejar el cambio en el input de texto
  const handleOptionChange = (id, newLabel) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, label: newLabel } : option
    );
    setOptions(updatedOptions);
  };

  // Función para seleccionar la opción correcta
  const handleRadioChange = (id) => {
    setSelectedOption(id); // Guarda la opción seleccionada
  };

  // Notificar al componente padre cada vez que se selecciona o cambia una opción
  useEffect(() => {
    const formattedOptions = options.map(option => ({
      option: option.label, // La etiqueta de la opción
      selected: option.id === selectedOption // Si la opción está seleccionada
    }));
    onInputChange(formattedOptions); // Enviar al padre
  }, [selectedOption, options, onInputChange]);

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className="flex justify-between items-center">
          {/* Input de texto para cada opción */}
          <div className="flex items-center gap-2 mt-4 w-full">
            <input
              type="radio"
              name="uniqueChoice"
              checked={selectedOption === option.id}
              onChange={() => handleRadioChange(option.id)}
              className="custom-radio h-8 w-8 border-2 border-green-500 focus:ring-green-500"
            />
            <input
              type="text"
              value={option.label}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder={option.placeholder}
            />
          </div>
        </div>
      ))}

      {/* Íconos de añadir y eliminar */}
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

export default UniqueOption;
