import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { CancelButton, AcceptButton, DeleteButton } from './ActionButtons';

const SectionModal = ({ isOpen, onClose, onSave, existingSections = [] }) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [sections, setSections] = useState([...existingSections]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [inputActive, setInputActive] = useState(false);
  
  // Resetea los valores cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setSections([...existingSections]);
      setSelectedSections([]);
      setNewSectionName('');
      setInputActive(false);
    }
  }, [isOpen, existingSections]);

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
    const sanitizedName = DOMPurify.sanitize(newSectionName.trim());
    
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

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center text-blue-custom mb-2">Nueva Sección</h2>
          <p className="text-center mb-6">
            Agrega una o varias secciones, elimina las que no necesites y cuando estes listo
            para continuar da click en aceptar para continuar el proceso de creación de encuesta.
          </p>
          
          {/* Input para agregar nueva sección */}
          <div className="relative flex items-center border border-gray-300 rounded-full px-4 py-2 mb-6">
            <input
              type="text"
              placeholder="Buscar seccion o agregar una nueva"
              value={newSectionName}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-grow focus:outline-none"
            />
            <button
              onClick={addSection}
              disabled={!inputActive}
              className={`ml-2 p-1 rounded-full ${
                !inputActive 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Lista de secciones */}
          <div className="max-h-60 overflow-y-auto mb-6">
            <h3 className="font-bold mb-2">Nombre de sección</h3>
            {sections.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center py-3 px-2">
                    <label className="flex items-center justify-between w-full cursor-pointer">
                      <span className="text-blue-custom font-medium">{section}</span>
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="h-5 w-5 rounded-md border-gray-300 text-blue-custom focus:ring-blue-custom"
                      />
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay secciones agregadas</p>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-center gap-4">
            <CancelButton onClick={onClose}>
              Cancelar
            </CancelButton>
            
            <AcceptButton onClick={handleAccept}>
              Aceptar
            </AcceptButton>
            
            <DeleteButton 
              onClick={handleDelete} 
              disabled={selectedSections.length === 0}
              tooltipText="Eliminar secciones seleccionadas"
            >
              Eliminar
            </DeleteButton>
          </div>
        </div>
      </div>
    )
  );
};

export default SectionModal;