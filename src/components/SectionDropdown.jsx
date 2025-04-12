import React, { useState, useRef, useEffect } from 'react';
import { 
  getSections, 
  updateSections, 
  addSection, 
  removeSection 
} from '../services/SectionsStorage';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Constante para la longitud máxima del nombre de sección
const MAX_SECTION_NAME_LENGTH = 30;

// Componente para el elemento arrastrable
const DraggableItem = ({ id, index, section, selected, onSelect, moveItem }) => {
  const ref = useRef(null);
  
  // Configuración para arrastrar
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Configuración para soltar
  const [, drop] = useDrop({
    accept: 'SECTION_ITEM',
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // No reemplazar elementos consigo mismos
      if (dragIndex === hoverIndex) return;
      
      // Mover el elemento
      moveItem(dragIndex, hoverIndex);
      
      // Actualizar el índice del elemento arrastrado
      item.index = hoverIndex;
    },
  });
  
  // Combinar las referencias
  drag(drop(ref));
  
  return (
    <div 
      ref={ref}
      className={`flex items-center justify-between py-3 border-b border-gray-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center max-w-[80%]">
        {/* Puntos para arrastrar */}
        <span className="text-gray-400 mr-2 cursor-grab flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="5" r="1.5"/>
            <circle cx="4" cy="10" r="1.5"/>
            <circle cx="4" cy="15" r="1.5"/>
            <circle cx="10" cy="5" r="1.5"/>
            <circle cx="10" cy="10" r="1.5"/>
            <circle cx="10" cy="15" r="1.5"/>
          </svg>
        </span>
        <span 
          className="text-dark-blue-custom truncate"
          title={section.name.length > 20 ? section.name : ''}
        >
          {section.name}
        </span>
      </div>
      
      {/* Checkbox */}
      <div 
        className={`w-5 h-5 border-2 border-dark-blue-custom rounded-md flex items-center justify-center cursor-pointer flex-shrink-0 ${
          selected ? 'bg-dark-blue-custom' : 'bg-white'
        }`}
        onClick={() => onSelect(section.id)}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
};

const SectionDropdown = ({ 
  isOpen, 
  onOpenChange, 
  onAddSections,
  onCancel, // Añadido del segundo código
  existingSections = [],
  anchorRef
}) => {
  // Inicializamos con las secciones existentes o las del localStorage
  const [sections, setSections] = useState(() => {
    const storedSections = getSections();
    return storedSections.length > 0 ? storedSections : existingSections;
  });
  
  const [newSectionName, setNewSectionName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [inputError, setInputError] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Estado para el hover en los botones (del segundo código)
  const [hoverState, setHoverState] = useState({
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
      updateSections(combinedSections);
    }
  }, [existingSections]);
  
  // Importante: Añadido del segundo código para escuchar cambios en localStorage
  useEffect(() => {
    // Función para actualizar las secciones cuando cambia localStorage
    const handleSectionChange = () => {
      const storedSections = getSections();
      setSections(storedSections);
    };
    
    // Función para manejar el evento personalizado de eliminación
    const handleSectionRemoved = (event) => {
      setSections(event.detail.updatedSections);
    };
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'survey_sections') {
        handleSectionChange();
      }
    });
    
    // Escuchar el evento personalizado
    window.addEventListener('sectionRemoved', handleSectionRemoved);
    
    // Limpiar event listeners al desmontar
    return () => {
      window.removeEventListener('storage', handleSectionChange);
      window.removeEventListener('sectionRemoved', handleSectionRemoved);
    };
  }, []);
  
  // Función para validar y formatear el nombre de sección
  const validateSectionName = (name) => {
    // Eliminar espacios adicionales y limitar longitud
    return name.trim().replace(/\s+/g, ' ').substring(0, MAX_SECTION_NAME_LENGTH);
  };
  
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
  
  // Manejar entrada de texto con validación
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSectionName(value);
    setSearchText(value);
    
    // Validar longitud en tiempo real
    if (value.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`El nombre no debe exceder ${MAX_SECTION_NAME_LENGTH} caracteres`);
    } else if (value.trim() === '') {
      setInputError('');
    } else {
      // Verificar si ya existe una sección con este nombre
      const normalizedName = value.trim().toLowerCase();
      if (sections.some(s => s.name.toLowerCase() === normalizedName)) {
        setInputError('Ya existe una sección con este nombre');
      } else {
        setInputError('');
      }
    }
  };

  // Añadir nueva sección con validación
  const handleAddSection = () => {
    if (newSectionName.trim() === '') {
      setInputError('El nombre no puede estar vacío');
      return;
    }
    
    if (newSectionName.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`El nombre no debe exceder ${MAX_SECTION_NAME_LENGTH} caracteres`);
      return;
    }
    
    // Verificar si ya existe una sección con el mismo nombre
    const normalizedName = newSectionName.trim().toLowerCase();
    if (sections.some(s => s.name.toLowerCase() === normalizedName)) {
      setInputError('Ya existe una sección con este nombre');
      return;
    }
    
    const formattedName = validateSectionName(newSectionName);
    const newSection = {
      id: Date.now(),
      name: formattedName
    };
    
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setNewSectionName('');
    setSearchText('');
    setInputError('');
    
    // Guardar en localStorage
    addSection(newSection);
    updateSections(updatedSections);
    
    // También actualizar las secciones en el componente padre (del segundo código)
    onAddSections(updatedSections);
  };
  
  // Manejar tecla Enter en input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '' && !inputError) {
      handleAddSection();
    }
  };

  // Manejar selección de sección
  const handleSectionSelect = (sectionId) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
      setSelectAll(false);
    } else {
      setSelectedSections([...selectedSections, sectionId]);
      // Verificar si todos están seleccionados después de esta selección
      if (selectedSections.length + 1 === filteredSections.length) {
        setSelectAll(true);
      }
    }
  };

  // Manejar seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSections([]);
    } else {
      setSelectedSections(filteredSections.map(section => section.id));
    }
    setSelectAll(!selectAll);
  };

  // Confirmar la acción
  const handleAccept = () => {
    // Sincronizar con localStorage antes de cerrar
    updateSections(sections);
    
    onAddSections(sections);
    onOpenChange(false);
    setSelectedSections([]); // Del segundo código
  };

  // Cancelar - del segundo código
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
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
      updateSections(updatedSections);
      
      // También actualizar las secciones en el componente padre (del segundo código)
      onAddSections(updatedSections);
      
      setSelectedSections([]);
      setSelectAll(false);
    }
  };
  
  // Mover un elemento de una posición a otra
  const moveItem = (fromIndex, toIndex) => {
    const updatedSections = [...sections];
    const movedItem = updatedSections[fromIndex];
    updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);
    setSections(updatedSections);
    
    // Importante: actualizar también el localStorage y notificar al componente padre
    updateSections(updatedSections);
    onAddSections(updatedSections);
  };
  
  // Filtrar secciones basado en la búsqueda
  const filteredSections = sections.filter(section => 
    section.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // Verificar si el texto de búsqueda podría ser una nueva sección
  const isNewSection = newSectionName.trim() !== '' && 
    !sections.some(section => section.name.toLowerCase() === newSectionName.toLowerCase().trim()) &&
    !inputError;

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
      
      {/* Input para buscar/agregar sección */}
      <div className="relative mb-4">
        <input 
          ref={inputRef}
          type="text" 
          value={newSectionName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`w-full border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-2 pr-10 outline-none`}
          placeholder="Escriba el nombre de la nueva sección"
          maxLength={MAX_SECTION_NAME_LENGTH}
        />
        {inputError && (
          <p className="text-red-500 text-xs mt-1 ml-2">{inputError}</p>
        )}
        {isNewSection && (
          <button 
            onClick={handleAddSection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-dark-blue-custom"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Encabezado con título y checkbox "seleccionar todos" */}
      <div className="flex items-center justify-between font-bold text-dark-blue-custom mb-2">
        <span>Nombre de sección</span>
        <div 
          className={`w-5 h-5 border-2 border-dark-blue-custom rounded-md flex items-center justify-center cursor-pointer ${
            selectAll && filteredSections.length > 0 ? 'bg-dark-blue-custom' : 'bg-white'
          }`}
          onClick={handleSelectAll}
        >
          {selectAll && filteredSections.length > 0 && (
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      
      {/* Lista de secciones con DnD */}
      <DndProvider backend={HTML5Backend}>
        <div className="max-h-48 overflow-y-auto mb-4">
          {filteredSections.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay secciones creadas</p>
          ) : (
            filteredSections.map((section, index) => (
              <DraggableItem
                key={section.id}
                id={section.id}
                index={index}
                section={section}
                selected={selectedSections.includes(section.id)}
                onSelect={handleSectionSelect}
                moveItem={moveItem}
              />
            ))
          )}
        </div>
      </DndProvider>
      
      {/* Botones de acción */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={handleAccept}
          onMouseEnter={() => setHoverState({...hoverState, accept: true})}
          onMouseLeave={() => setHoverState({...hoverState, accept: false})}
          className={`bg-green-custom text-white py-1.5 px-8 rounded-full flex items-center text-sm hover:bg-green-700 transition-colors ${
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
          className={`py-1.5 px-8 rounded-full flex items-center text-sm transition-colors ${
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