import React, { useState, useRef, useEffect } from 'react';
import {
  getSections,
  updateSections,
  addSection,
  removeSection
} from '../services/SectionsStorage';
import ok from '../assets/img/Ok.svg';
import trashcan from '../assets/img/trashCan.svg';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Constante para la longitud máxima del nombre de sección
const MAX_SECTION_NAME_LENGTH = 50;

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
      className={`relative flex items-center justify-between py-3 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {/* Línea divisoria con ancho controlado para que no llegue hasta el final */}
      <div className="absolute bottom-0 left-0 right-3 border-b border-gray-300"></div>

      <div className="flex items-center" style={{ maxWidth: "calc(100% - 40px)", fontFamily: "'Work Sans', sans-serif" }}>
        {/* Puntos para arrastrar */}
        <span className="text-dark-blue-custom mr-2 cursor-grab flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="5" r="1.5" />
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="4" cy="15" r="1.5" />
            <circle cx="10" cy="5" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="15" r="1.5" />
          </svg>
        </span>
        <span
          className="text-dark-blue-custom truncate"
          title={section.name.length > 20 ? section.name : ''}
        >
          {section.name}
        </span>
      </div>

      {/* Checkbox con posición fija */}
      <div
        className={`w-5 h-5 border-2 border-dark-blue-custom rounded-md flex items-center justify-center cursor-pointer flex-shrink-0 mr-3 ${selected ? 'bg-dark-blue-custom' : 'bg-white'
          }`}
        style={{ minWidth: "20px" }}
        onClick={() => onSelect(section.id)}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  onCancel,
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

  // Estado para el hover en los botones
  const [hoverState, setHoverState] = useState({
    delete: false,
    accept: false
  });

  // Determinar si el botón "Aceptar" debería estar habilitado
  const isAcceptButtonEnabled = newSectionName.trim() !== '' || selectedSections.length > 0;

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

  // Importante: Añadido para escuchar cambios en localStorage
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

    // También actualizar las secciones en el componente padre
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
    // Primero verificamos si hay un nuevo nombre de sección y no hay errores
    if (newSectionName.trim() !== '' && !inputError) {
      // Creamos la nueva sección
      const formattedName = validateSectionName(newSectionName);
      const newSection = {
        id: Date.now(),
        name: formattedName
      };

      // Actualizamos el estado local y agregamos la nueva sección
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);

      // Guardamos en localStorage
      addSection(newSection);
      updateSections(updatedSections);

      // IMPORTANTE: Notificar al componente padre inmediatamente con las secciones actualizadas
      // para que pueda mostrar la nueva sección en la interfaz
      onAddSections(updatedSections);

      // Limpiar el campo de entrada
      setNewSectionName('');
      setSearchText('');
      setInputError('');

      // Cerrar el dropdown después de añadir la sección
      onOpenChange(false);
      setSelectedSections([]);
      return;
    }

    // Si no hay una nueva sección para añadir pero hay secciones seleccionadas
    // o se ha hecho algún cambio, actualizamos
    if (isAcceptButtonEnabled) {
      // Sincronizar con localStorage antes de cerrar
      updateSections(sections);

      // Notificar al componente padre con las secciones actualizadas
      onAddSections(sections);
      onOpenChange(false);
      setSelectedSections([]);
    }
  };

  // Cancelar
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

      // También actualizar las secciones en el componente padre
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
      className="absolute z-10 mt-2 bg-white shadow-lg rounded-3xl p-4 w-[515px]"
      style={{
        top: anchorRef.current ? anchorRef.current.offsetTop + anchorRef.current.offsetHeight + 5 : '0px',
        left: anchorRef.current ? anchorRef.current.offsetLeft : '0px',
        fontFamily: "'Work Sans', sans-serif"
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
          className={`w-full border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-2 pr-10 outline-none focus:border-dark-blue-custom transition-colors`}
          placeholder="Escriba el nombre de la nueva sección"
          maxLength={MAX_SECTION_NAME_LENGTH}
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        />
        {inputError && (
          <p className="text-red-500 text-xs mt-1 ml-2">{inputError}</p>
        )}
        <button
          onClick={isNewSection ? handleAddSection : undefined}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isNewSection ? 'text-dark-blue-custom' : 'text-gray-400'}`}
          disabled={!isNewSection}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>


      {/* Lista de secciones con DnD */}
      <DndProvider backend={HTML5Backend}>
        <div className="max-h-48 overflow-y-auto mb-4 overflow-x-hidden scrollbar-image-match">
          {/* Encabezado con título y checkbox "seleccionar todos" */}
          <div className="flex items-center justify-between font-bold text-dark-blue-custom sticky top-0 bg-white py-2 mb-1 z-10">
            {/* Línea divisoria para el encabezado */}
            <div className="absolute bottom-0 left-0 right-3 border-b border-gray-300"></div>
            <span>Nombre de sección</span>
            <div
              className={`w-5 h-5 border-2 border-dark-blue-custom rounded-md flex items-center justify-center cursor-pointer mr-3 ${selectAll && filteredSections.length > 0 ? 'bg-dark-blue-custom' : 'bg-white'
                }`}
              style={{ minWidth: "20px" }} // Asegura ancho mínimo
              onClick={handleSelectAll}
            >
              {selectAll && filteredSections.length > 0 && (
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
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
      <div className="flex justify-center mt-6 gap-16">
        <button
          onClick={handleAccept}
          disabled={!isAcceptButtonEnabled}
          onMouseEnter={() => isAcceptButtonEnabled && setHoverState({ ...hoverState, accept: true })}
          onMouseLeave={() => isAcceptButtonEnabled && setHoverState({ ...hoverState, accept: false })}
          className={`py-1.5 px-5 rounded-full flex items-center text-sm transition-colors ${!isAcceptButtonEnabled
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : hoverState.accept
              ? 'bg-green-700 text-white'
              : 'bg-green-custom text-white'
            }`}
        >
          <span className="mr-2">
            <img src={ok} alt="Aceptar" width="18" height="18" />
          </span> Aceptar
        </button>

        <button
          onClick={handleDeleteSelectedSections}
          disabled={selectedSections.length === 0}
          onMouseEnter={() => setHoverState({ ...hoverState, delete: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, delete: false })}
          className={`py-1.5 px-5 rounded-full flex items-center text-sm transition-colors ${selectedSections.length === 0
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : hoverState.delete
              ? 'bg-orange-700 text-white'
              : 'bg-orange-custom text-white'
            }`}
        >
          <img src={trashcan} alt="Eliminar" width="18" height="18" className="mr-2" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default SectionDropdown;