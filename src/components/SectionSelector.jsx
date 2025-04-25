import React, { useState, useRef, useEffect } from 'react';
import {
  getSections,
  updateSections,
  addSection,
  getSelectedSection, // Puede que no lo necesites aquí si el padre maneja el estado inicial
  saveSelectedSection // Asegúrate que esta función pueda manejar 'null'
} from '../services/SectionsStorage';

// Importaciones de imágenes (Asegúrate que las rutas sean correctas)
import cancel from '../assets/img/cancel.svg';
import ok from '../assets/img/Ok.svg';
import refresh from '../assets/img/refresh.svg'; // Icono para cambiar sección
import AddCategory from '../assets/img/Add_1.svg'; // Icono para elegir/añadir

const MAX_SECTION_NAME_LENGTH = 50; // Límite de caracteres para nombre de sección

const SectionSelector = ({
  onSectionSelect, // Función callback para notificar al padre la selección CONFIRMADA
  initialSelectedSection = null, // La sección seleccionada actualmente en el padre
  buttonLabel = "Elegir sección" // Texto por defecto del botón si no hay selección
}) => {
  // --- Estados Internos ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Estado para la selección DENTRO del dropdown (antes de confirmar)
  const [currentSelectionInDropdown, setCurrentSelectionInDropdown] = useState(initialSelectedSection);
  // Estado para la sección CONFIRMADA (la que se muestra fuera y se notifica al padre)
  const [confirmedSection, setConfirmedSection] = useState(initialSelectedSection);

  const [sections, setSections] = useState([]); // Lista de secciones disponibles
  const [searchText, setSearchText] = useState(''); // Texto para buscar/añadir
  const [inputError, setInputError] = useState(''); // Mensaje de error para el input
  const [isInputFocused, setIsInputFocused] = useState(false); // Para estilo del input

  // Referencias a elementos DOM
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null); // Para enfocar el input al abrir

  // --- Efectos ---

  // Sincronizar estados internos cuando initialSelectedSection cambie desde el padre
  // Esto es crucial para cuando el formulario se resetea externamente
  useEffect(() => {
    setCurrentSelectionInDropdown(initialSelectedSection);
    setConfirmedSection(initialSelectedSection);
  }, [initialSelectedSection]);

  // Cargar secciones disponibles al montar
  useEffect(() => {
    const storedSections = getSections();
    if (storedSections.length > 0) {
      setSections(storedSections);
    } else {
      // Opcional: Cargar datos de ejemplo si no hay secciones
       const defaultSections = [
           { id: 1, name: 'Información personal' },
           { id: 2, name: 'Experiencia Laboral' },
           { id: 3, name: 'Experiencia Académica' }
       ];
       setSections(defaultSections);
       // updateSections(defaultSections); // Guardar defaults si se desea
    }
    // No es necesario cargar la sección seleccionada aquí, initialSelectedSection lo maneja
  }, []);

  // Listener para cambios en localStorage (mantener sincronizado con otras pestañas/componentes)
  useEffect(() => {
    const handleSectionChange = () => setSections(getSections());
    const handleSectionRemoved = (event) => {
        setSections(event.detail.updatedSections);
        // Si la sección eliminada era la confirmada o la seleccionada en el dropdown, limpiarlas
        if (confirmedSection?.id === event.detail.id) setConfirmedSection(null);
        if (currentSelectionInDropdown?.id === event.detail.id) setCurrentSelectionInDropdown(null);
    };

    window.addEventListener('storage', (e) => { if (e.key === 'survey_sections') handleSectionChange(); });
    window.addEventListener('sectionRemoved', handleSectionRemoved);

    return () => {
      window.removeEventListener('storage', handleSectionChange);
      window.removeEventListener('sectionRemoved', handleSectionRemoved);
    };
  }, [confirmedSection, currentSelectionInDropdown]); // Depender de estos estados para deseleccionar si se borra

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        // Al cerrar sin confirmar, resetear el input y error si aplica
        setSearchText('');
        setNewSectionName(''); // Asegurar que newSectionName también se limpie
        setInputError('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Ejecutar solo al montar/desmontar

  // Enfocar input al abrir dropdown
  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100); // Pequeño delay
    }
  }, [isDropdownOpen]);

  // --- Funciones Auxiliares ---

  // Validar y formatear nombre de sección (sin cambios)
  const validateSectionName = (name) => {
    return name.trim().replace(/\s+/g, ' ').substring(0, MAX_SECTION_NAME_LENGTH);
  };

  // --- Handlers ---

  // Abrir/cerrar dropdown
  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    if (newState) {
      // Al abrir, asegurarse que la selección interna refleje la confirmada
      setCurrentSelectionInDropdown(confirmedSection);
      // Limpiar búsqueda anterior y errores
      setSearchText('');
      setInputError('');
    } else {
      // Al cerrar (si no fue por Aceptar/Cancelar), limpiar input/error
      setSearchText('');
      setInputError('');
    }
  };

  // Manejar cambio en el input de buscar/añadir
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value); // Actualiza tanto la búsqueda como el posible nuevo nombre

    // Validaciones para añadir (mientras se escribe)
    const trimmedValue = value.trim();
    if (value.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`Máximo ${MAX_SECTION_NAME_LENGTH} caracteres`);
    } else if (trimmedValue !== '' && sections.some(s => s.name.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputError('Nombre de sección ya existe');
    } else {
      setInputError(''); // Limpiar error si es válido o vacío
    }
  };

  // Añadir nueva sección (desde el botón '+' o Enter)
  const handleAddSection = () => {
    const nameToAdd = searchText.trim(); // Usar searchText como base
    if (nameToAdd === '') {
      setInputError('El nombre no puede estar vacío'); return;
    }
    if (nameToAdd.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`Máximo ${MAX_SECTION_NAME_LENGTH} caracteres`); return; // Redundante pero seguro
    }
    const normalizedName = nameToAdd.toLowerCase();
    if (sections.some(s => s.name.toLowerCase() === normalizedName)) {
      setInputError('Nombre de sección ya existe'); return; // Redundante pero seguro
    }
    if (inputError) return; // No añadir si hay otro error

    const formattedName = validateSectionName(nameToAdd);
    const newSection = { id: Date.now(), name: formattedName };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections); // Actualizar lista local
    addSection(newSection);       // Guardar la nueva sección
    updateSections(updatedSections); // Guardar la lista actualizada (orden)

    setCurrentSelectionInDropdown(newSection); // Seleccionar la nueva sección en el dropdown
    setSearchText(''); // Limpiar input
    setInputError('');
  };

  // Manejar Enter en el input (intenta añadir)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '' && !inputError && isNewSection) {
        e.preventDefault(); // Prevenir submit de formulario si existe
        handleAddSection();
    }
  };

  // Seleccionar una sección de la lista DENTRO del dropdown
  const handleSectionSelectInDropdown = (section) => {
    setCurrentSelectionInDropdown(section);
    // Limpiar el input si se selecciona de la lista existente
    setSearchText('');
    setInputError('');
  };

  // Confirmar la selección (botón Aceptar)
  const handleAccept = () => {
    // Si el input tiene texto válido para una *nueva* sección, añadirla primero
    if (isNewSection) {
        handleAddSection(); // Esto ya selecciona la nueva en currentSelectionInDropdown
        // Necesitamos esperar a que el estado se actualice antes de proceder
        // Una forma es usar un efecto o simplemente confiar en que handleAddSection lo hizo
        // Vamos a asumir que handleAddSection ya puso la sección correcta en currentSelectionInDropdown
        // PERO, necesitamos asegurar que la notificación al padre ocurra *después* de añadirla.

        // Opción más segura: Re-evaluar la sección a confirmar después de añadir
        const nameToAdd = searchText.trim();
        const addedSection = sections.find(s => s.name === validateSectionName(nameToAdd)); // Buscar la recién añadida

        if (addedSection) {
            setConfirmedSection(addedSection);
            if (onSectionSelect) onSectionSelect(addedSection);
             saveSelectedSection(addedSection.id); // Guardar en localStorage
        }
        setIsDropdownOpen(false); // Cerrar dropdown
    } else {
        // Si no se está creando una nueva, confirmar la selección actual del dropdown
        setConfirmedSection(currentSelectionInDropdown);
        if (onSectionSelect) {
          onSectionSelect(currentSelectionInDropdown);
        }
        saveSelectedSection(currentSelectionInDropdown ? currentSelectionInDropdown.id : null); // Guardar ID o null
        setIsDropdownOpen(false); // Cerrar dropdown
    }
    // Limpiar input/error al cerrar
    setSearchText('');
    setInputError('');
  };

  // Cancelar (botón Cancelar)
  const handleCancel = () => {
    setIsDropdownOpen(false);
    // No revertir selección, solo cerrar y limpiar input/error
    setSearchText('');
    setInputError('');
  };

  // --- Lógica de Renderizado ---

  // Determinar si el texto actual podría ser una nueva sección
  const trimmedSearch = searchText.trim();
  const isNewSection = trimmedSearch !== '' &&
    !sections.some(section => section.name.toLowerCase() === trimmedSearch.toLowerCase()) &&
    !inputError; // Solo es nueva si no existe Y no hay error

  // Filtrar secciones existentes
  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Habilitar botón Aceptar si hay una sección seleccionada en el dropdown O si es una nueva válida
  const isAcceptButtonEnabled = currentSelectionInDropdown !== null || isNewSection;

  return (
    <div className="relative">
      {/* Botón principal y muestra de sección seleccionada */}
      <div className="flex items-center gap-2">
        {/* Mostrar la sección CONFIRMADA */}
        {confirmedSection && (
          <div className="flex items-center bg-green-100 rounded-full overflow-hidden shadow-sm">
            <span className="bg-green-custom px-3 py-2 flex items-center justify-center">
              <img src={ok} alt="Seleccionado" className="w-6 h-6" />
            </span>
            <span className="px-4 py-2 font-work-sans text-base font-semibold text-dark-blue-custom max-w-[200px] lg:max-w-[300px]"> {/* Ancho máximo */}
              <span className="truncate block" title={confirmedSection.name}> {/* Tooltip con nombre completo */}
                {confirmedSection.name}
              </span>
            </span>
          </div>
        )}

        {/* Botón para abrir/cerrar dropdown */}
        <button
          ref={buttonRef}
          className="flex items-center bg-blue-custom rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <span className="bg-blue-custom text-white px-4 py-2 flex items-center">
            <img
              // Icono cambia si hay una sección confirmada
              src={confirmedSection ? refresh : AddCategory}
              alt={confirmedSection ? "Cambiar sección" : "Elegir sección"}
              className="w-5 h-5 mr-2" // Espacio entre icono y texto
            />
          </span>
          <span className="bg-yellow-custom px-4 py-2">
            <span className="font-work-sans text-sm font-semibold text-blue-custom whitespace-nowrap">
              {/* Texto cambia si hay una sección confirmada */}
              {confirmedSection ? "Cambiar sección" : buttonLabel}
            </span>
          </span>
        </button>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 top-full mt-2 bg-white shadow-lg rounded-2xl p-4 w-full max-w-[515px]" // Ancho máximo
          style={{ zIndex: 50 }} // Asegurar que esté sobre otros elementos
        >
          <h2 className="text-xl font-bold text-center text-dark-blue-custom mb-2">
            Elegir Sección
          </h2>
          <p className="text-center text-sm text-gray-600 mb-4">
            Elige entre las secciones existentes o crea una nueva.
          </p>

          {/* Input para buscar o agregar */}
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Para añadir con Enter
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Buscar o agregar sección..."
              className={`w-full border ${inputError ? 'border-red-500' : isInputFocused ? 'border-dark-blue-custom ring-1 ring-dark-blue-custom' : 'border-gray-300'} rounded-full px-4 py-2 pr-10 outline-none text-sm transition-all duration-200`}
              maxLength={MAX_SECTION_NAME_LENGTH + 5} // Permitir un poco más para mensaje de error visual
              aria-invalid={!!inputError}
              aria-describedby={inputError ? "section-input-error" : undefined}
            />
             {/* Botón para añadir DENTRO del input */}
            <button
              type="button" // Evitar submit si está en un form
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1 transition-colors ${isNewSection ? 'text-dark-blue-custom hover:bg-gray-200' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={isNewSection ? handleAddSection : undefined} // Llama a añadir si es nueva sección
              disabled={!isNewSection}
              title={isNewSection ? "Agregar esta nueva sección" : "Escribe un nombre de sección nuevo y único"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            {/* Mensaje de error */}
            {inputError && (
              <p id="section-input-error" className="text-red-500 text-xs mt-1 ml-3">{inputError}</p>
            )}
          </div>

          {/* Lista de secciones */}
          <div className="font-bold text-dark-blue-custom mb-2">
            Secciones existentes
          </div>
          <div className="max-h-60 overflow-y-auto mb-4 border rounded-md border-gray-200 overflow-x-hidden scrollbar-image-match"> {/* Scroll y borde */}
            {filteredSections.length === 0 && !isNewSection ? (
              <p className="text-sm text-gray-500 italic text-center p-4">No hay secciones que coincidan.</p>
            ) : (
              filteredSections.map((section) => (
                <div
                  key={section.id}
                  role="radio" // Semántica de radio button
                  aria-checked={currentSelectionInDropdown?.id === section.id}
                  tabIndex={0} // Hacerlo enfocable
                  className="relative flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => handleSectionSelectInDropdown(section)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSectionSelectInDropdown(section); }} // Seleccionar con Enter/Space
                >
                  {/* Nombre de la sección */}
                  <span className="text-dark-blue-custom truncate pr-2" title={section.name}>
                    {section.name}
                  </span>
                  {/* Indicador visual tipo Radio button */}
                  <div className={`w-5 h-5 border-2 ${currentSelectionInDropdown?.id === section.id ? 'border-green-custom bg-green-custom' : 'border-dark-blue-custom'} rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200`} style={{ minWidth: "20px" }}>
                    {currentSelectionInDropdown?.id === section.id && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
             {/* Opción visual para añadir la nueva sección (si aplica) */}
             {isNewSection && (
                 <div className="relative flex items-center justify-between py-3 px-3 cursor-pointer bg-blue-50 hover:bg-blue-100 border-t border-blue-200 mt-1" onClick={handleAddSection}>
                      <span className="text-dark-blue-custom italic">Añadir nueva: "{trimmedSearch}"</span>
                       {/* Podrías poner un icono '+' aquí */}
                 </div>
             )}
          </div>

          {/* Botones de Acción (Aceptar/Cancelar) */}
          <div className="flex justify-center gap-10 md:gap-16 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-purple-custom text-white py-2 px-6 rounded-full flex items-center text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md"
            >
              <img src={cancel} alt="Cancelar" width="16" height="16" className="mr-2" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={!isAcceptButtonEnabled} // Deshabilitar si no hay selección válida
              className={`py-2 px-6 rounded-full flex items-center text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${!isAcceptButtonEnabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-custom text-white hover:bg-green-600'
                }`}
            >
              <img src={ok} alt="Aceptar" width="16" height="16" className="mr-2" />
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionSelector;