import React, { useState, useRef, useEffect } from 'react';
import { 
  getSections, 
  updateSections, 
  addSection, 
  removeSection 
} from '../services/SectionsStorage'; // Importamos las funciones de almacenamiento

const SectionDropdown = ({ 
  isOpen, 
  onOpenChange, 
  onAddSections,
  onCancel,
  existingSections = [],
  anchorRef // Referencia al botón para posicionar el dropdown
}) => {
  // Inicializamos con las secciones del localStorage o las proporcionadas
  const [sections, setSections] = useState(() => {
    const storedSections = getSections();
    return storedSections.length > 0 ? storedSections : existingSections;
  });
  
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Estado para el hover en los botones
  const [hoverState, setHoverState] = useState({
    cancel: false,
    delete: false,
    accept: false
  });
  
  // Sincronizar con existingSections si cambian
  useEffect(() => {
    if (existingSections.length > 0) {
      const combinedSections = [...sections];
      
      // Añadir secciones que no existan en combinedSections
      existingSections.forEach(newSection => {
        if (!combinedSections.some(s => s.id === newSection.id)) {
          combinedSections.push(newSection);
        }
      });
      
      setSections(combinedSections);
      updateSections(combinedSections); // Actualizar en localStorage
    }
  }, [existingSections]);
  
  // Enfocar el input cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          anchorRef.current && !anchorRef.current.contains(event.target)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOpenChange, anchorRef]);

  // Manejar entrada de texto
  const handleInputChange = (e) => {
    setNewSectionName(e.target.value);
  };

  // Añadir nueva sección inmediatamente
  const handleAddSection = () => {
    if (newSectionName.trim() !== '') {
      const newSection = {
        id: Date.now(), // Genera un ID único
        name: newSectionName.trim()
      };
      
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);
      setNewSectionName(''); // Limpiar el input
      
      // Guardar en localStorage
      addSection(newSection);
      
      // También actualizar las secciones en el componente padre
      onAddSections(updatedSections);
    }
  };
  
  // Manejar tecla Enter en input de nueva sección
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '') {
      handleAddSection();
    }
  };

  // Manejar selección de sección
  const handleSectionSelect = (sectionId) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  // Confirmar la acción
  const handleAccept = () => {
    // Sincronizar con localStorage antes de cerrar
    updateSections(sections);
    
    onAddSections(sections);
    onOpenChange(false);
    setSelectedSections([]);
  };

  // Cancelar
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
    setSelectedSections([]);
  };

  // Eliminar secciones seleccionadas
  const handleDeleteSelectedSections = () => {
    if (selectedSections.length > 0) {
      const updatedSections = sections.filter(section => !selectedSections.includes(section.id));
      setSections(updatedSections);
      
      // Actualizar en localStorage
      selectedSections.forEach(id => removeSection(id));
      
      // También actualizar las secciones en el componente padre
      onAddSections(updatedSections);
      
      setSelectedSections([]);
    }
  };

  // Si no está abierto, no mostrar
  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute z-10 mt-2 bg-white shadow-lg rounded-3xl p-4 w-96"
      style={{ 
        top: anchorRef.current ? anchorRef.current.offsetTop + anchorRef.current.offsetHeight + 5 : '0px',
        left: anchorRef.current ? anchorRef.current.offsetLeft : '0px' 
      }}
    >
      {/* Encabezado */}
      <h2 className="text-xl font-bold text-center text-dark-blue-custom mb-2">Nueva Sección</h2>
      
      {/* Descripción */}
      <p className="text-center text-sm text-gray-600 mb-4">
        Agrega una o varias secciones, elimina las que no necesites y cuando estés listo
        para continuar da click en aceptar.
      </p>
      
      {/* Barra de búsqueda/input con botón + */}
      <div className="relative mb-4 flex items-center border border-gray-300 rounded-full px-4 py-2">
        <input 
          ref={inputRef}
          type="text" 
          value={newSectionName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow outline-none text-gray-700 text-sm"
          placeholder="Buscar seccion o agregar una nueva"
        />
        <button 
          onClick={handleAddSection}
          disabled={newSectionName.trim() === ''}
          className={`rounded-full p-1 ml-2 transition-opacity ${
            newSectionName.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#0A3761" strokeWidth="2"/>
            <path d="M12 8V16" stroke="#0A3761" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12H16" stroke="#0A3761" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      {/* Título para lista de secciones */}
      <div className="font-bold text-dark-blue-custom mb-2">
        Nombre de sección
      </div>
      
      {/* Lista de secciones con checkbox a la DERECHA */}
      <div className="max-h-48 overflow-y-auto mb-4">
        {sections.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No hay secciones creadas</p>
        ) : (
          sections.map((section) => (
            <div 
              key={section.id} 
              className="flex items-center justify-between py-2 border-b border-gray-200"
            >
              <span className="text-dark-blue-custom text-sm">
                {section.name}
              </span>
              
              {/* Checkbox a la derecha */}
              <div 
                className={`w-5 h-5 border-2 border-dark-blue-custom rounded-md flex items-center justify-center cursor-pointer ${
                  selectedSections.includes(section.id) ? 'bg-dark-blue-custom' : 'bg-white'
                }`}
                onClick={() => handleSectionSelect(section.id)}
              >
                {selectedSections.includes(section.id) && (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-between">
        <button 
          onClick={handleCancel}
          onMouseEnter={() => setHoverState({...hoverState, cancel: true})}
          onMouseLeave={() => setHoverState({...hoverState, cancel: false})}
          className={`bg-purple-custom text-white py-1.5 px-4 rounded-full flex items-center text-sm transition-colors ${
            hoverState.cancel ? 'bg-purple-800' : ''
          }`}
        >
          <span className="mr-1">✕</span> Cancelar
        </button>
        
        <button 
          onClick={handleAccept}
          onMouseEnter={() => setHoverState({...hoverState, accept: true})}
          onMouseLeave={() => setHoverState({...hoverState, accept: false})}
          className={`bg-green-custom text-white py-1.5 px-4 rounded-full flex items-center text-sm transition-colors ${
            hoverState.accept ? 'bg-green-700' : ''
          }`}
        >
          <span className="mr-1">✓</span> Aceptar
        </button>
        
        <button 
          onClick={handleDeleteSelectedSections}
          disabled={selectedSections.length === 0}
          onMouseEnter={() => setHoverState({...hoverState, delete: true})}
          onMouseLeave={() => setHoverState({...hoverState, delete: false})}
          className={`py-1.5 px-4 rounded-full flex items-center text-sm transition-colors ${
            selectedSections.length === 0 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : hoverState.delete 
                ? 'bg-orange-700 text-white'
                : 'bg-orange-custom text-white'
          }`}
        >
          <svg className="mr-1" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4" stroke="white" strokeWidth="2"/>
            <path d="M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4" stroke="white" strokeWidth="2"/>
          </svg>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default SectionDropdown;