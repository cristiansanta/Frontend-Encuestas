import React, { useState, useRef, useEffect } from 'react';
import ok from '../assets/img/Ok.svg';
import cancel from '../assets/img/cancel.svg';
import { useContext } from 'react';
import { SurveyContext } from '../Provider/SurveyContext';

// Constante para la longitud máxima del texto de búsqueda
const MAX_SEARCH_LENGTH = 50;

const CategoryDropdown = ({
  isOpen,
  onOpenChange,
  onSelectCategories,
  onCancel,
  anchorRef
}) => {
  const { categories, selectedCategory, setSelectedCategory } = useContext(SurveyContext);
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [inputError, setInputError] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Estado para el hover en los botones
  const [hoverState, setHoverState] = useState({
    cancel: false,
    accept: false
  });

  // Determinar si el botón "Aceptar" debería estar habilitado
  const isAcceptButtonEnabled = selectedCategoryId !== null;

  // Inicializar selectedCategoryId con el valor del contexto si existe
  useEffect(() => {
    if (selectedCategory && selectedCategory.length > 0) {
      setSelectedCategoryId(selectedCategory[0][0]);
    }
  }, [selectedCategory]);

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

  // Manejar entrada de texto para búsqueda
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Validar longitud en tiempo real
    if (value.length <= MAX_SEARCH_LENGTH) {
      setSearchText(value);
      setInputError('');
    } else {
      setInputError(`El texto de búsqueda no debe exceder ${MAX_SEARCH_LENGTH} caracteres`);
    }
  };

  // Manejar tecla Enter en input para búsqueda
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar envío de formulario
    }
  };

  // Manejar selección de categoría
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Confirmar la acción
  const handleAccept = () => {
    if (selectedCategoryId) {
      // Buscar la categoría seleccionada para obtener su información completa
      const selectedCategoryInfo = categories.find(cat => cat[0] === selectedCategoryId);
      
      // Actualizar el contexto con la categoría seleccionada
      if (selectedCategoryInfo) {
        setSelectedCategory([selectedCategoryInfo]);
      }
      
      // Notificar al componente padre con la categoría seleccionada
      if (onSelectCategories) {
        onSelectCategories([selectedCategoryId]);
      }
      onOpenChange(false);
    }
  };

  // Cancelar
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
    
    // Si había una categoría seleccionada anteriormente, mantenerla
    if (selectedCategory && selectedCategory.length > 0) {
      setSelectedCategoryId(selectedCategory[0][0]);
    } else {
      setSelectedCategoryId(null);
    }
  };

  // Filtrar categorías basado en la búsqueda
  const filteredCategories = categories.filter(category =>
    category[1].toLowerCase().includes(searchText.toLowerCase())
  );

  // Si no está abierto, no mostrar
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-10 mt-2 bg-white shadow-lg rounded-3xl p-4 w-[515px]"
      style={{
        top: anchorRef.current ? anchorRef.current.offsetTop + anchorRef.current.offsetHeight + 5 : '0px',
        left: anchorRef.current ? anchorRef.current.offsetLeft - 300 : '0px', // Ajustado para posicionar mejor
        fontFamily: "'Work Sans', sans-serif"
      }}
    >
      {/* Encabezado */}
      <h2 className="text-xl font-bold text-center text-dark-blue-custom mb-2">Elegir Categoría</h2>

      {/* Descripción */}
      <p className="text-center text-sm text-gray-600 mb-4">
        Elige entre las categorías existentes
      </p>

      {/* Input para buscar categoría */}
      <div className="relative mb-4">
        <div className="relative flex items-center">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-2 pl-10 outline-none focus:border-dark-blue-custom transition-colors`}
            placeholder="Buscar categoría"
            maxLength={MAX_SEARCH_LENGTH}
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          />
        </div>
        {inputError && (
          <p className="text-red-500 text-xs mt-1 ml-2">{inputError}</p>
        )}
      </div>

      {/* Lista de categorías */}
      <div className="max-h-60 overflow-y-auto mb-4 overflow-x-hidden scrollbar-image-match">
        {/* Encabezado de la tabla */}
        <div className="flex items-center py-2 border-b border-gray-300 font-semibold text-dark-blue-custom">
          <span className="flex-1">Nombre de categoría</span>
        </div>
        
        {filteredCategories.length === 0 ? (
          <p className="text-sm text-gray-500 italic py-3">No se encontraron categorías</p>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category[0]}
              className="flex items-center justify-between py-3 cursor-pointer border-b border-gray-300"
              onClick={() => handleCategorySelect(category[0])}
            >
              <span
                className="flex-1 text-dark-blue-custom"
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              >
                {category[1]}
              </span>

              {/* Radio button */}
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3 
                  ${selectedCategoryId === category[0] ? 'border-blue-custom' : 'border-gray-400'}`}
                style={{ minWidth: "20px" }}
              >
                {selectedCategoryId === category[0] && (
                  <div className="w-3 h-3 bg-blue-custom rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center mt-6 gap-6">
        <button
          onClick={handleCancel}
          onMouseEnter={() => setHoverState({ ...hoverState, cancel: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, cancel: false })}
          className="py-2 px-6 rounded-full flex items-center text-sm transition-colors bg-purple-700 text-white hover:bg-purple-800"
        >
          <img src={cancel} alt="Cancelar" width="18" height="18" className="mr-2" />
          Cancelar
        </button>
        
        <button
          onClick={handleAccept}
          disabled={!isAcceptButtonEnabled}
          onMouseEnter={() => isAcceptButtonEnabled && setHoverState({ ...hoverState, accept: true })}
          onMouseLeave={() => isAcceptButtonEnabled && setHoverState({ ...hoverState, accept: false })}
          className={`py-2 px-6 rounded-full flex items-center text-sm transition-colors ${
            !isAcceptButtonEnabled
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <img src={ok} alt="Aceptar" width="18" height="18" className="mr-2" />
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default CategoryDropdown;