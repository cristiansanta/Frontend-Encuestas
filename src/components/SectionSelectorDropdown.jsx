import React, { useState, useEffect, useRef } from 'react';

const SectionSelectorDropdown = ({ 
  isOpen, 
  onClose, 
  onSave,
  existingSections = [], 
  triggerRef 
}) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [sections, setSections] = useState([...existingSections]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [inputActive, setInputActive] = useState(false);
  const dropdownRef = useRef(null);
  
  // Resetea los valores cuando se abre el dropdown
  useEffect(() => {
    if (isOpen) {
      setSections([...existingSections]);
      setSelectedSections([]);
      setNewSectionName('');
      setInputActive(false);
    }
  }, [isOpen, existingSections]);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          triggerRef && !triggerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, triggerRef]);

  // Maneja el cambio en el input de nueva sección
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSectionName(value);
    setInputActive(value.trim() !== '');
  };

  // Agrega una nueva sección
  const addSection = () => {
    if (newSectionName.trim() === '') return;
    
    // Sanitizar el nombre antes de agregarlo
    const sanitizedName = newSectionName.trim();
    
    // Agregar sección si no existe ya
    if (!sections.find(s => s.toLowerCase() === sanitizedName.toLowerCase())) {
      setSections([...sections, sanitizedName]);
    }
    
    // Limpiar el input
    setNewSectionName('');
    setInputActive(false);
  };

  // Maneja el cambio de selección de secciones
  const handleCheckboxChange = (index) => {
    if (selectedSections.includes(index)) {
      setSelectedSections(selectedSections.filter(i => i !== index));
    } else {
      setSelectedSections([...selectedSections, index]);
    }
  };

  // Elimina las secciones seleccionadas
  const handleDelete = () => {
    if (selectedSections.length === 0) return;
    
    const newSections = sections.filter((_, index) => !selectedSections.includes(index));
    setSections(newSections);
    setSelectedSections([]);
  };

  // Guarda los cambios
  const handleAccept = () => {
    onSave(sections);
    onClose();
  };

  // Maneja tecla Enter en el input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '') {
      addSection();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef} 
      className="absolute z-20 bg-white rounded-3xl shadow-lg w-full max-w-md mx-auto"
      style={{ maxWidth: '100%', width: '820px' }}
    >
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">Nueva Sección</h2>
        <p className="text-center text-gray-700 text-sm mb-6">
          Agrega una o varias secciones, elimina las que no necesites y cuando estes listo
          para continuar da click en aceptar para continuar el proceso de creación de encuesta.
        </p>
        
        {/* Input para agregar nueva sección */}
        <div className="relative flex items-center border border-gray-300 rounded-full mb-6">
          <input
            type="text"
            placeholder="Buscar seccion o agregar una nueva"
            value={newSectionName}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow py-2 px-4 rounded-full focus:outline-none text-gray-700"
          />
          <button
            onClick={addSection}
            disabled={!inputActive}
            className={`absolute right-2 p-1 rounded-full ${
              !inputActive 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        
        {/* Encabezado de la lista */}
        <div className="mb-2">
          <h3 className="font-bold text-blue-900">Nombre de sección</h3>
        </div>
      </div>
      
      {/* Lista de secciones con borde superior */}
      <div className="max-h-64 overflow-y-auto border-t border-gray-100">
        {sections.length > 0 ? (
          <div>
            {sections.map((section, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-6 border-b border-gray-100">
                <span className="text-blue-900 font-medium">{section}</span>
                <div className="h-6 w-6 border border-gray-300 rounded flex items-center justify-center">
                  {selectedSections.includes(index) && (
                    <div className="bg-blue-900 rounded-sm w-4 h-4 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                    className="opacity-0 absolute h-6 w-6 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4 px-6">No hay secciones agregadas</p>
        )}
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-center gap-4 p-6">
        {/* Botón Cancelar */}
        <button
          onClick={onClose}
          className="flex items-center justify-center px-6 py-2 rounded-full bg-purple-700 text-white hover:bg-purple-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cancelar
        </button>
        
        {/* Botón Aceptar */}
        <button
          onClick={handleAccept}
          className="flex items-center justify-center px-6 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Aceptar
        </button>
        
        {/* Botón Eliminar */}
        <button
          onClick={handleDelete}
          disabled={selectedSections.length === 0}
          className={`flex items-center justify-center px-6 py-2 rounded-full transition-colors duration-200 ${
            selectedSections.length === 0 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-orange-400 text-white hover:bg-orange-500'
          }`}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default SectionSelectorDropdown;