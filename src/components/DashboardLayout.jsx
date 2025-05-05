import React, { useState, useRef, useEffect } from 'react';
import MainLayout from './MainLayout';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Importar imágenes SVG
import zoomIcon from '../assets/img/zoom.svg';
import voiceIcon from '../assets/img/voice.svg';
import Addsurvey from '../assets/img/addsurvey.svg';
import Filtersurvey from '../assets/img/filtersurvey.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import Tablesurvey from '../assets/img/tablesurvey.svg';
import Filter from '../assets/img/filtersurvey.svg';

/**
 * Componente de Layout específico para el Dashboard
 * Extiende el MainLayout agregando barra de filtros, búsqueda y controles específicos del dashboard
 * Incluye funcionalidad de reconocimiento de voz para la búsqueda
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido específico de la página
 * @param {string} props.headerTitle - Título para mostrar en el HeaderBar (opcional)
 * @param {function} props.onSearchChange - Función para manejar cambios en la búsqueda
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {function} props.onFilterChange - Función para manejar cambios en el filtro
 * @param {string} props.selectedFilter - Filtro seleccionado actualmente
 * @param {function} props.onViewModeChange - Función para manejar cambios en el modo de vista
 * @param {string} props.viewMode - Modo de vista actual ('cards' o 'table')
 * @param {function} props.onCreateSurvey - Función para manejar la creación de una nueva encuesta
 * @returns {JSX.Element} Layout específico para el dashboard
 */
const DashboardLayout = ({
  children,
  headerTitle = "",
  onSearchChange,
  searchTerm = '',
  onFilterChange,
  selectedFilter = 'all',
  onViewModeChange,
  viewMode = 'cards',
  onCreateSurvey
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Referencias separadas para las versiones desktop y móvil
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // Configuración de reconocimiento de voz
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Efecto para actualizar el término de búsqueda cuando cambia el transcript
  useEffect(() => {
    if (transcript && onSearchChange && listening) {
      onSearchChange(transcript);
    }
  }, [transcript, onSearchChange, listening]);

  // Efecto para actualizar el estado de escucha
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Función para manejar el inicio/fin del reconocimiento de voz
  const handleVoiceSearch = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'es-ES' });
      // No borrar el texto actual al iniciar la escucha
      // Esto permite que el usuario pueda continuar dictando a partir del texto actual
    }
  };

  // Definimos los filtros con clases de Tailwind personalizadas
  const filters = [
    { id: 'active', label: 'Encuestas activas', bgClass: 'bg-green-custom', textClass: 'text-green-custom', borderClass: 'border-green-custom' },
    { id: 'ending', label: 'Próximas a finalizar', bgClass: 'bg-orange-custom', textClass: 'text-orange-custom', borderClass: 'border-orange-custom' },
    { id: 'unpublished', label: 'Encuentas sin publicar', bgClass: 'bg-celeste-custom', textClass: 'text-celeste-custom', borderClass: 'border-celeste-custom' },
    { id: 'finished', label: 'Encuestas finalizadas', bgClass: 'bg-purple-custom', textClass: 'text-purple-custom', borderClass: 'border-purple-custom' },
    { id: 'all', label: 'Todas las encuestas', bgClass: 'bg-blue-custom', textClass: 'text-blue-custom', borderClass: 'border-blue-custom' },
  ];

  // Efecto para cerrar el desplegable cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      // Verificar si el clic fue fuera de ambos contenedores
      const desktopClicked = desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target);
      const mobileClicked = mobileDropdownRef.current && mobileDropdownRef.current.contains(event.target);

      if (!desktopClicked && !mobileClicked) {
        setIsFilterOpen(false);
      }
    }

    // Agregar evento cuando el desplegable está abierto
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Obtener el filtro seleccionado
  const getCurrentFilter = () => {
    return filters.find(f => f.id === selectedFilter) || filters[filters.length - 1]; // Default al último (all)
  };

  const toggleFilterDropdown = (e) => {
    // Evitar que el evento se propague al documento
    e.stopPropagation();
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
    setIsFilterOpen(false); // Cierra el dropdown después de seleccionar
  };

  // Función para cambiar entre vistas de tarjetas y tabla
  const toggleViewMode = () => {
    if (onViewModeChange) {
      onViewModeChange(viewMode === 'cards' ? 'table' : 'cards');
    }
  };

  // Obtener el filtro actual
  const currentFilter = getCurrentFilter();

  // Verificar si el navegador soporta reconocimiento de voz
  if (!browserSupportsSpeechRecognition) {
    // Si no hay soporte, no mostramos error pero deshabilitamos el botón de voz
    console.warn("El navegador no soporta el reconocimiento de voz.");
  }

  return (
    <MainLayout headerTitle={headerTitle} showHeaderBanner={true}>
      <div className="flex flex-col w-full">
        {/* Botones de acciones */}
        <div className="w-full flex flex-wrap justify-between items-center px-4 sm:px-8 md:px-12 py-4 gap-2">
          {/* Lado izquierdo: Nueva Encuesta y Filtrar por Estado */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Botón Nueva Encuesta */}
            <button
              onClick={onCreateSurvey}
              className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <span className="bg-blue-custom text-white px-3 py-2 flex items-center h-full hover:bg-opacity-80">
                <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
              </span>
              <span className="bg-yellow-custom text-blue-custom px-4 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                Nueva Encuesta
              </span>
            </button>

            {/* Versión móvil - Solo icono */}
            <button
              onClick={onCreateSurvey}
              className="md:hidden bg-blue-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
            </button>

            {/* Botón y dropdown Filtrar por Estado */}
            <div className="hidden md:block relative" ref={desktopDropdownRef}>
              {/* Botón de filtro con estado seleccionado */}
              <div className="flex rounded-full overflow-hidden">
                {/* Parte principal del botón */}
                <button
                  className="flex items-center cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={toggleFilterDropdown}
                >
                  <span className="bg-blue-custom text-white px-3 py-2 flex items-center h-full hover:bg-opacity-80">
                    <img src={Filtersurvey} alt="Filtrar" className="w-5 h-5" />
                  </span>
                  <span className="bg-yellow-custom text-blue-custom px-4 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                    Filtro por estado
                    {selectedFilter === 'all' ? (
                      <img
                        src={Selectsurvey}
                        alt="Seleccionar"
                        className="w-5 h-5 ml-2"
                      />
                    ) : (
                      <img
                        src={Selectsurvey}
                        alt="Seleccionar"
                        className="w-5 h-5 ml-2 transform -rotate-90"
                      />
                    )}
                  </span>
                </button>

                {/* Mostrar el filtro seleccionado si no es "all" */}
                {selectedFilter !== 'all' && (
                  <span
                    className={`py-2 px-4 font-semibold text-white text-sm flex items-center ${currentFilter.bgClass}`}
                  >
                    {currentFilter.label}
                  </span>
                )}
              </div>

              {/* Dropdown de filtros */}
              {isFilterOpen && (
                <div
                  className="absolute z-50 mt-2 -right-12 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
                  onClick={(e) => e.stopPropagation()} // Prevenir cierre accidental
                >
                  <div className="flex flex-col">
                    <div className="py-2">
                      {filters.map((filter) => (
                        <div
                          key={filter.id}
                          className="hover:bg-gray-50 py-3 px-4 cursor-pointer border-b border-gray-200 transition-colors last:border-b-0"
                          onClick={(e) => {
                            e.stopPropagation(); // Detener propagación
                            handleFilterSelect(filter.id);
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 ${filter.borderClass} flex items-center justify-center mr-3`}
                            >
                              {selectedFilter === filter.id && (
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${filter.bgClass}`}
                                ></div>
                              )}
                            </div>
                            <span
                              className={`font-medium text-sm ${filter.textClass}`}
                            >
                              {filter.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Versión móvil del filtro - Solo icono */}
            <button
              className="md:hidden bg-blue-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
              onClick={toggleFilterDropdown}
            >
              <img src={Filter} alt="Filtrar" className="w-5 h-5" />
            </button>
          </div>

          {/* Lado derecho: Vista de Lista y Barra de Búsqueda */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Botón para alternar entre vistas */}
            <button
              className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={toggleViewMode}
            >
              <span className="bg-yellow-custom text-white px-3 py-2 flex items-center h-full hover:bg-opacity-80">
                <img src={Tablesurvey} alt="Vista de lista" className="w-5 h-5" />
              </span>
              <span className="bg-blue-custom text-white px-4 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                <img src={Filter} alt="Filtrar" className="w-5 h-5 mr-2" />
                <span className="hidden lg:inline">
                  {viewMode === 'cards' ? 'Cambiar a vista de Tablero' : 'Cambiar a vista de Lista'}
                </span>
                <span className="lg:hidden">Vista</span>
              </span>
            </button>

            {/* Versión móvil - Solo icono */}
            <button
              className="md:hidden bg-yellow-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
              onClick={toggleViewMode}
            >
              <img src={Tablesurvey} alt="Vista de lista" className="w-5 h-5" />
            </button>

            {/* Barra de Búsqueda con reconocimiento de voz - VERSIÓN OPTIMIZADA PARA MÓVIL */}
            <div className="relative flex items-center w-auto sm:w-48 md:w-64">
              {/* Ícono de búsqueda */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <img src={zoomIcon} alt="Zoom" className="h-4 sm:h-5" />
              </span>

              {/* Input - Versión optimizada para móvil */}
              <input
                type="text"
                placeholder={window.innerWidth < 640 ? "" : "Buscar encuesta"}
                className="border border-gray-300 rounded-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-8 sm:pr-10 w-32 sm:w-full focus:outline-none focus:ring-2 focus:ring-blue-custom focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => {
                  if (onSearchChange) {
                    onSearchChange(e.target.value);
                  }
                }}
              />

              {/* Ícono de voz con estado de escucha */}
              <button
                onClick={handleVoiceSearch}
                disabled={!browserSupportsSpeechRecognition}
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${isListening ? 'animate-pulse' : ''}`}
              >
                <span className={`flex items-center justify-center ${isListening ? 'text-red-500' : ''}`}>
                  <img 
                    src={voiceIcon} 
                    alt="Voice" 
                    className={`h-4 sm:h-5 ${isListening ? 'filter hue-rotate-90' : ''}`} 
                  />
                  {isListening && (
                    <span className="absolute h-2 w-2 rounded-full bg-red-500 top-0 right-0"></span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown móvil (aparece cuando se hace clic en el icono) */}
        {isFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="bg-white rounded-3xl shadow-lg border border-gray-200 w-72 overflow-hidden transition-all duration-300"
              ref={mobileDropdownRef}
            >
              <div className="flex flex-col">
                <div className="bg-yellow-custom py-3 px-4 text-blue-custom font-bold flex items-center">
                  <span className="ml-2">Filtrar por estado</span>
                  <span
                    className="ml-auto cursor-pointer pr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilterOpen(false);
                    }}
                  >
                    ✕
                  </span>
                </div>
                <div className="py-2">
                  {filters.map((filter) => (
                    <div
                      key={filter.id}
                      className="hover:bg-gray-50 py-3 px-4 cursor-pointer border-b border-gray-200 transition-colors last:border-b-0"
                      onClick={(e) => {
                        e.stopPropagation(); // Detener propagación
                        handleFilterSelect(filter.id);
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${filter.borderClass} flex items-center justify-center mr-3`}
                        >
                          {selectedFilter === filter.id && (
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${filter.bgClass}`}
                            ></div>
                          )}
                        </div>
                        <span
                          className={`font-medium text-sm ${filter.textClass}`}
                        >
                          {filter.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Indicador visual del filtro seleccionado solo para dispositivos móviles */}
        {selectedFilter !== 'all' && (
          <div className="md:hidden w-full px-4 sm:px-8 mb-2">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2 text-sm">Filtrando por:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${currentFilter.bgClass}`}
              >
                {currentFilter.label}
              </span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleFilterSelect('all')}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Indicador visual de reconocimiento de voz activo */}
        {isListening && (
          <div className="w-full mb-2 px-4 sm:px-8 md:px-12">
            <div className="flex items-center justify-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Escuchando... "{transcript}"
              </span>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="w-full px-4 sm:px-8 md:px-12">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;