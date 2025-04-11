import React, { useState, useRef, useEffect } from 'react';
import refresh from '../assets/img/refresh.svg'; // Imagen de refrescar para "Cambiar sección"
import Ok from '../assets/img/Ok.svg'; // Imagen de check para la sección seleccionada
import AddCategory from '../assets/img/Add_1.svg'; // Para el caso de "Elegir sección"

const SectionSelector = ({ 
  sections, 
  onSectionSelect, 
  initialSelectedSection = null 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(initialSelectedSection);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
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

  // Seleccionar una sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    onSectionSelect(section);
    setIsDropdownOpen(false);
  };

  // Alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex items-center gap-3 relative">
      {/* Mostrar la sección seleccionada si existe */}
      {selectedSection && (
        <div className="flex items-center bg-green-100 rounded-full overflow-hidden">
          <span className="bg-green-custom px-3 py-2 flex items-center justify-center">
            <img src={Ok} alt="Check" className="w-5 h-5" />
          </span>
          <span className="px-4 py-2 font-work-sans text-base font-semibold text-dark-blue-custom">
            {selectedSection.name}
          </span>
        </div>
      )}

      {/* Botón para elegir/cambiar sección */}
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
            {selectedSection ? "Cambiar sección" : "Elegir sección"}
          </span>
        </span>
      </button>

      {/* Dropdown para seleccionar sección */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 left-0 top-full mt-2 bg-white shadow-lg rounded-2xl p-4 w-72"
        >
          <h3 className="font-bold text-dark-blue-custom mb-2">Seleccionar Sección</h3>
          
          <div className="max-h-60 overflow-y-auto">
            {sections.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay secciones disponibles</p>
            ) : (
              sections.map((section) => (
                <div 
                  key={section.id} 
                  className="flex items-center justify-between py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSectionSelect(section)}
                >
                  <span className="text-dark-blue-custom text-sm">
                    {section.name}
                  </span>
                  
                  {/* Mostrar check si es la sección seleccionada */}
                  {selectedSection && selectedSection.id === section.id && (
                    <img src={Ok} alt="Seleccionado" className="w-5 h-5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionSelector;