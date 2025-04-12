import React, { useState, useRef, useEffect } from 'react';
import { getSections, updateSections, addSection, getSelectedSection, saveSelectedSection } from '../services/SectionsStorage';
import AddCategory from '../assets/img/Add_1.svg';
import Ok from '../assets/img/Ok.svg';
import refresh from '../assets/img/refresh.svg';

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
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  
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

  // Alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchText('');
      setNewSectionName('');
    }
  };

  // Manejar cambios en el input de búsqueda/nueva sección
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setNewSectionName(value);
  };

  // Manejar tecla Enter para agregar nueva sección
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '') {
      addNewSection();
    }
  };

  // Agregar nueva sección
  const addNewSection = () => {
    if (newSectionName.trim() !== '') {
      const newSection = {
        id: Date.now(),
        name: newSectionName.trim()
      };
      
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);
      
      // Guardar en localStorage
      addSection(newSection);
      updateSections(updatedSections);
      
      setNewSectionName('');
      setSearchText('');
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
    if (selectedSection) {
      // Guardar en localStorage antes de cerrar
      saveSelectedSection(selectedSection.id);
      onSectionSelect(selectedSection);
    }
    setIsDropdownOpen(false);
  };

  // Cancelar la selección
  const handleCancel = () => {
    setSelectedSection(initialSelectedSection);
    setIsDropdownOpen(false);
  };

  // Filtrar secciones basado en la búsqueda
  const filteredSections = sections.filter(section => 
    section.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Verificar si el texto de búsqueda podría ser una nueva sección
  const isNewSection = newSectionName.trim() !== '' && 
    !sections.some(section => section.name.toLowerCase() === newSectionName.toLowerCase().trim());

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Mostrar la sección seleccionada (al lado del botón) */}
        {selectedSection && (
          <div className="flex items-center bg-green-100 rounded-full overflow-hidden">
          <span className="bg-green-custom px-3 py-2 flex items-center justify-center">
            <img src={Ok} alt="Check" className="w-6 h-6" />
          </span>
          <span className="px-4 py-2 font-work-sans text-base font-semibold text-dark-blue-custom">
            {selectedSection.name}
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
          className="absolute z-10 left-0 top-full mt-2 bg-white shadow-lg rounded-2xl p-4 w-96"
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
              className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 outline-none text-sm"
            />
            {isNewSection && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1"
                onClick={addNewSection}
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
          <div className="max-h-60 overflow-y-auto mb-4">
            {filteredSections.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay secciones que coincidan con la búsqueda</p>
            ) : (
              filteredSections.map((section) => (
                <div 
                  key={section.id} 
                  className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSectionSelect(section)}
                >
                  <span className="text-dark-blue-custom">
                    {section.name}
                  </span>
                  
                  {/* Radio button */}
                  <div 
                    className={`w-5 h-5 border-2 border-dark-blue-custom rounded-full 
                      ${selectedSection && selectedSection.id === section.id 
                        ? 'flex items-center justify-center' 
                        : ''}`}
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
          <div className="flex justify-between">
            <button 
              onClick={handleCancel}
              className="bg-purple-custom text-white py-1.5 px-8 rounded-full flex items-center text-sm hover:bg-purple-800 transition-colors"
            >
              Cancelar
            </button>
            
            <button 
              onClick={handleAccept}
              disabled={!selectedSection}
              className={`py-1.5 px-8 rounded-full flex items-center text-sm transition-colors ${
                !selectedSection 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-custom text-white hover:bg-green-700'
              }`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionSelector;