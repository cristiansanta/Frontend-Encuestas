import React, { useState, useRef, useEffect } from 'react';
import { 
  getSections, 
  updateSections, 
  addSection, 
  getSelectedSection, 
  saveSelectedSection 
} from '../services/SectionsStorage';
import cancel from '../assets/img/cancel.svg';
import ok from '../assets/img/Ok.svg';
import refresh from '../assets/img/refresh.svg';
import AddCategory from '../assets/img/Add_1.svg';

// Constante para la longitud máxima del nombre de sección
const MAX_SECTION_NAME_LENGTH = 50;

const SectionSelector = ({ 
  onSectionSelect, 
  initialSelectedSection = null,
  buttonLabel = "Elegir sección"
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(initialSelectedSection);
  const [sections, setSections] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [inputError, setInputError] = useState('');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  
  // Determinar si el botón "Aceptar" debería estar habilitado
  const isAcceptButtonEnabled = selectedSection !== null;
  
  // Cargar secciones y la sección seleccionada al inicio
  useEffect(() => {
    const storedSections = getSections();
    
    // Cargar secciones
    if (storedSections.length > 0) {
      setSections(storedSections);
    } else {
      // Datos de ejemplo si no hay secciones
      const defaultSections = [
        { id: 1, name: 'Información personal' },
        { id: 2, name: 'Experiencia Laboral' },
        { id: 3, name: 'Experiencia Académica' }
      ];
      setSections(defaultSections);
      updateSections(defaultSections);
    }
    
    // Intentar recuperar la sección seleccionada
    if (!selectedSection) {
      const savedSection = getSelectedSection();
      if (savedSection) {
        setSelectedSection(savedSection);
        // Notificar al componente padre si hay una sección seleccionada guardada
        if (onSectionSelect) {
          onSectionSelect(savedSection);
        }
      } else if (initialSelectedSection) {
        setSelectedSection(initialSelectedSection);
      }
    }
  }, []);

  // Escuchar cambios en localStorage para mantener sincronizado
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

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enfocar el input cuando se abre el dropdown
  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isDropdownOpen]);

  // Validar y formatear el nombre de sección
  const validateSectionName = (name) => {
    return name.trim().replace(/\s+/g, ' ').substring(0, MAX_SECTION_NAME_LENGTH);
  };

  // Alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchText('');
      setNewSectionName('');
      setInputError('');
    }
  };

  // Manejar cambios en el input de búsqueda/nueva sección
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setNewSectionName(value);
    
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

  // Añadir nueva sección
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
    
    // Seleccionar la nueva sección automaticamente
    setSelectedSection(newSection);
  };

  // Manejar tecla Enter para agregar nueva sección
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '' && !inputError) {
      handleAddSection();
    }
  };

  // Seleccionar una sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    // Guardar la selección en localStorage
    saveSelectedSection(section.id);
  };

  // Confirmar la selección
  const handleAccept = () => {
    // Si hay un nuevo nombre de sección válido, añadirlo primero
    if (newSectionName.trim() !== '' && !inputError) {
      handleAddSection();
      // Como handleAddSection ya establece la sección recién creada como seleccionada,
      // podemos proceder directamente a notificar al componente padre y cerrar
      if (selectedSection) {
        saveSelectedSection(selectedSection.id);
        onSectionSelect(selectedSection);
      }
      setIsDropdownOpen(false);
      return;
    }
    
    // Comportamiento original cuando hay una sección seleccionada
    if (selectedSection) {
      saveSelectedSection(selectedSection.id);
      onSectionSelect(selectedSection);
    }
    setIsDropdownOpen(false);
  };

  // Cancelar la selección
  const handleCancel = () => {
    setSelectedSection(initialSelectedSection);
    setIsDropdownOpen(false);
    setInputError('');
  };
  
  // Verificar si el texto de búsqueda podría ser una nueva sección
  const isNewSection = newSectionName.trim() !== '' && 
    !sections.some(section => section.name.toLowerCase() === newSectionName.toLowerCase().trim()) &&
    !inputError;

  // Filtrar secciones basado en la búsqueda
  const filteredSections = sections.filter(section => 
    section.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Mostrar la sección seleccionada (al lado del botón) */}
        {selectedSection && (
          <div className="flex items-center bg-green-100 rounded-full overflow-hidden">
            <span className="bg-green-custom px-3 py-2 flex items-center justify-center">
              <img src={ok} alt="Check" className="w-6 h-6" />
            </span>
            <span className="px-4 py-2 font-work-sans text-base font-semibold text-dark-blue-custom max-w-[200px]">
              <span 
                className="truncate block"
                title={selectedSection.name.length > 20 ? selectedSection.name : ''}
              >
                {selectedSection.name}
              </span>
            </span>
          </div>
        )}
      
        {/* Botón principal */}
        <button
          ref={buttonRef}
          className="flex items-center bg-blue-custom rounded-full overflow-hidden"
          onClick={toggleDropdown}
        >
          <span className="bg-blue-custom text-white px-4 py-2 flex items-center">
            <img 
              src={selectedSection ? refresh : AddCategory} 
              alt={selectedSection ? "Cambiar" : "Elegir"} 
              className="w-5 h-5 mr-2" 
            />
          </span>
          <span className="bg-yellow-custom px-4 py-2">
            <span className="font-work-sans text-sm font-semibold text-blue-custom">
              {selectedSection ? "Cambiar sección" : buttonLabel}
            </span>
          </span>
        </button>
      </div>

      {/* Dropdown para seleccionar sección */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 left-0 top-full mt-2 bg-white shadow-lg rounded-2xl p-4 w-[450px]"
        >
          <h2 className="text-xl font-bold text-center text-dark-blue-custom mb-2">
            Elegir Sección de la Pregunta
          </h2>
          
          <p className="text-center text-sm text-gray-600 mb-4">
            Elige entre las secciones existentes o crea una nueva.
          </p>
          
          {/* Input para buscar o agregar sección */}
          <div className="relative mb-4">
            <input 
              ref={inputRef}
              type="text" 
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Buscar sección o agregar una nueva"
              className={`w-full border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-2 pr-10 outline-none text-sm`}
              maxLength={MAX_SECTION_NAME_LENGTH}
            />
            {inputError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{inputError}</p>
            )}
            {isNewSection && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1"
                onClick={handleAddSection}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#0A3761" strokeWidth="2"/>
                  <path d="M12 8V16" stroke="#0A3761" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 12H16" stroke="#0A3761" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
          
          {/* Título para lista de secciones */}
          <div className="font-bold text-dark-blue-custom mb-2">
            Nombre de sección
          </div>
          
          {/* Lista de secciones con radio buttons */}
          <div className="max-h-60 overflow-y-auto mb-4 overflow-x-hidden">
            {filteredSections.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay secciones que coincidan con la búsqueda</p>
            ) : (
              filteredSections.map((section) => (
                <div 
                  key={section.id} 
                  className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSectionSelect(section)}
                >
                  <span className="text-dark-blue-custom truncate" style={{ maxWidth: "calc(100% - 30px)" }}
                        title={section.name.length > 20 ? section.name : ''}>
                    {section.name}
                  </span>
                  
                  {/* Radio button - con ancho fijo para mantener alineación */}
                  <div 
                    className={`w-5 h-5 border-2 border-dark-blue-custom rounded-full flex-shrink-0
                      ${selectedSection && selectedSection.id === section.id 
                        ? 'flex items-center justify-center' 
                        : ''}`}
                    style={{ minWidth: "20px" }}
                  >
                    {selectedSection && selectedSection.id === section.id && (
                      <div className="w-3 h-3 bg-dark-blue-custom rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-center gap-16 mt-6">
            <button 
              onClick={handleCancel}
              className="bg-purple-custom text-white py-1.5 px-5 rounded-full flex items-center text-sm hover:bg-purple-800 transition-colors"
            >
              <img src={cancel} alt="cancelar" width="18" height="18" className="mr-2"/>
              Cancelar
            </button>
            
            <button 
              onClick={handleAccept}
              disabled={!isAcceptButtonEnabled}
              className={`py-1.5 px-5 rounded-full flex items-center text-sm transition-colors ${
                !isAcceptButtonEnabled 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-custom text-white hover:bg-green-700'
              }`}
            >
              <img src={ok} alt="Aceptar" width="18" height="18" className="mr-2"/>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionSelector;