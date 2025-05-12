import React, { useState, useEffect, useContext, useRef } from 'react';
import Addsurvey from '../assets/img/addsurvey.svg'; // Assuming this is used somewhere or can be removed if not
import selectCategory from '../assets/img/selectCategory.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import trashcan from '../assets/img/trashCan.svg';
import calendar2 from '../assets/img/calendar2.svg';

import { getSections, updateSections, removeSection, addSection } from '../services/SectionsStorage';
import { getSurveyInfo, updateSurveyInfoField, saveSurveyInfo } from '../services/SurveyInfoStorage';
import DOMPurify from 'dompurify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ok from '../assets/img/Ok.svg';

import RichTextEditor from './TextBoxDetail';
import { SurveyContext } from '../Provider/SurveyContext';
import Modal from './Modal';
import Calendar from './Calendar';
import CategoryDropdown from './CategoryDropdown';

// Constante para la longitud máxima del nombre de sección
const MAX_SECTION_NAME_LENGTH = 50;

// Componente para el elemento arrastrable de sección (Sin cambios respecto a tu original)
const DraggableSectionItem = ({ id, index, name, moveItem, onRemove }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION_ITEM',
    item: { id, index }, // index es el índice original
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SECTION_ITEM',
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="flex items-center flex-grow py-2">
          <div className="text-dark-blue-custom mx-3 cursor-grab">
            {/* SVG Drag Handle */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="3" r="1.5" /><circle cx="3" cy="9" r="1.5" /><circle cx="3" cy="15" r="1.5" /><circle cx="9" cy="3" r="1.5" /><circle cx="9" cy="9" r="1.5" /><circle cx="9" cy="15" r="1.5" /><circle cx="15" cy="3" r="1.5" /><circle cx="15" cy="9" r="1.5" /><circle cx="15" cy="15" r="1.5" /></svg>
          </div>
          <span className="font-work-sans text-lg font-medium text-dark-blue-custom">{name}</span>
        </div>
        <button
          className="bg-orange-custom text-white p-3 hover:bg-orange-600 transition-colors relative"
          onClick={() => onRemove(id)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
          {/* Tooltip JSX */}
          {showTooltip && (<div className="tooltip-container absolute z-10 right-full top-1/2 transform -translate-y-1/2 mr-2"> <div className="bg-dark-blue-custom text-white px-3 py-2 rounded-md text-sm whitespace-nowrap" style={{ backgroundColor: '#002C4D', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}> Eliminar sección </div> <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45" style={{ width: '10px', height: '10px', backgroundColor: '#002C4D' }}></div> </div>)}
        </button>
      </div>
    </div>
  );
};

const DetailForm = ({ onFormValidChange, onSaveAndContinue }) => {
  const { selectedCategory, setSelectedCategory, categories } = useContext(SurveyContext);

  // Estados originales
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('error');
  const [isFormValid, setIsFormValid] = useState(false);
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const selectCategoryButtonRef = useRef(null);

  // Estado para TODAS las secciones (fuente de verdad)
  const [sections, setSections] = useState([
    { id: 1, name: 'Información personal' },
    { id: 2, name: 'Experiencia Laboral' },
    { id: 3, name: 'Experiencia Académica' }
  ]);

  // Estado para el input: añadir nueva sección / filtrar
  const [newSectionName, setNewSectionName] = useState('');
  const [inputError, setInputError] = useState('');

  // --- NUEVO ESTADO ---
  // Estado para las secciones filtradas que se mostrarán
  const [filteredSections, setFilteredSections] = useState([]);
  // --- FIN NUEVO ESTADO ---

  // Verificar validez del formulario (basado en 'sections', no 'filteredSections')
  useEffect(() => {
    const isTitleValid = title.trim() !== '';
    const isCategoryValid = selectedCategory && selectedCategory.length > 0;
    const isSectionsValid = sections.length > 0; // Usa la lista original para validar

    const formIsValid = isTitleValid && isCategoryValid && isSectionsValid;
    setIsFormValid(formIsValid);

    if (onFormValidChange) {
      onFormValidChange(formIsValid);
    }
  }, [title, selectedCategory, sections, onFormValidChange]); // Depende de 'sections'

  // Cargar token y secciones iniciales
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('No se encontró el token de acceso. Inicia sesión nuevamente.');
      // Mostrar modal de error (código original)
      setModalTitle('Error de autenticación');
      setModalMessage('No se encontró el token de acceso. Por favor, inicia sesión de nuevo.');
      setModalStatus('error');
      setIsModalOpen(true);
    }

    const storedSections = getSections();
    const initialSections = storedSections.length > 0 ? storedSections : sections;
    setSections(initialSections);
    // Inicializa filteredSections con la lista completa al inicio
    // setFilteredSections(initialSections); // Ahora manejado por el efecto de filtro

    if (storedSections.length === 0 && sections.length > 0) {
      updateSections(sections);
    }

    const surveyInfo = getSurveyInfo();
    if (surveyInfo.title) {
      setTitle(surveyInfo.title);
    }
    if (surveyInfo.description) {
      setDescription(surveyInfo.description);
    }

    const todayDate = new Date(); // La fecha actual

    // Manejar fecha de inicio
    if (surveyInfo.startDate) {
      // Convertir a Date si es un string
      const startDateObj = typeof surveyInfo.startDate === 'string'
        ? new Date(surveyInfo.startDate)
        : surveyInfo.startDate;
      setStartDate(startDateObj);
    } else {
      // No hay fecha guardada, usar y guardar la actual
      setStartDate(todayDate);
      updateSurveyInfoField('startDate', todayDate);
    }

    // Manejar fecha de finalización
    if (surveyInfo.endDate) {
      // Convertir a Date si es un string
      const endDateObj = typeof surveyInfo.endDate === 'string'
        ? new Date(surveyInfo.endDate)
        : surveyInfo.endDate;
      setEndDate(endDateObj);
    } else {
      // No hay fecha guardada, usar y guardar la actual
      setEndDate(todayDate);
      updateSurveyInfoField('endDate', todayDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps


    const handleSurveyInfoUpdated = (event) => {
      const updatedInfo = event.detail;

      if (updatedInfo.title !== undefined) {
        setTitle(updatedInfo.title);
      }

      if (updatedInfo.description !== undefined) {
        setDescription(updatedInfo.description);
      }

      // Actualizar fechas si cambian
      if (updatedInfo.startDate !== undefined) {
        const newStartDate = typeof updatedInfo.startDate === 'string'
          ? new Date(updatedInfo.startDate)
          : updatedInfo.startDate;
        setStartDate(newStartDate);
      }

      if (updatedInfo.endDate !== undefined) {
        const newEndDate = typeof updatedInfo.endDate === 'string'
          ? new Date(updatedInfo.endDate)
          : updatedInfo.endDate;
        setEndDate(newEndDate);
      }
    };

    // Listener para evento de localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'survey_info') {
        try {
          const updatedInfo = JSON.parse(e.newValue);

          if (updatedInfo.title !== undefined) {
            setTitle(updatedInfo.title);
          }

          if (updatedInfo.description !== undefined) {
            setDescription(updatedInfo.description);
          }

          // Actualizar fechas si cambian
          if (updatedInfo.startDate !== undefined) {
            setStartDate(new Date(updatedInfo.startDate));
          }

          if (updatedInfo.endDate !== undefined) {
            setEndDate(new Date(updatedInfo.endDate));
          }
        } catch (error) {
          console.error('Error parsing survey info from storage event:', error);
        }
      }
    };

    // Registrar listeners
    window.addEventListener('surveyInfoUpdated', handleSurveyInfoUpdated);
    window.addEventListener('storage', handleStorageChange);

    // Limpiar listeners al desmontar
    return () => {
      window.removeEventListener('surveyInfoUpdated', handleSurveyInfoUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Ejecutar solo al montar

  // --- NUEVO EFECTO ---
  // Efecto para filtrar las secciones cuando cambia el input o la lista original
  useEffect(() => {
    const searchTerm = newSectionName.trim().toLowerCase();
    if (searchTerm === '') {
      setFilteredSections(sections); // Mostrar todas si no hay filtro
    } else {
      const filtered = sections.filter(section =>
        section.name.toLowerCase().includes(searchTerm)
      );
      setFilteredSections(filtered); // Mostrar filtradas
    }
  }, [newSectionName, sections]); // Depende del término de búsqueda y la lista original
  // --- FIN NUEVO EFECTO ---

  const closeModal = () => setIsModalOpen(false);

  // Sincronizar fecha de fin si la de inicio cambia (código original)
  useEffect(() => {
    if (endDate < startDate) {
      setEndDate(startDate);
      updateSurveyInfoField('endDate', startDate);
    }
  }, [startDate, endDate]); // Añadir endDate a las dependencias si no estaba

  // Cerrar calendarios si se abre el dropdown de categoría (código original)
  useEffect(() => {
    if (showCategoryDropdown) {
      setShowStartCalendar(false);
      setShowEndCalendar(false);
    }
  }, [showCategoryDropdown]);

  // Funciones originales (sin cambios)
  const showErrorMessage = () => {
    setModalTitle('Alerta');
    setModalMessage('Por favor, complete todos los campos requeridos antes de continuar.');
    setModalStatus('error');
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    // Código original para éxito
    setTitle('');
    setDescription('');
    setModalTitle('Éxito');
    setModalMessage('Datos enviados correctamente.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    updateSurveyInfoField('startDate', date);

    // Asegurar que endDate no sea anterior a startDate
    if (endDate < date) {
      setEndDate(date);
      updateSurveyInfoField('endDate', date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    updateSurveyInfoField('endDate', date);
  };

  const handleSelectCategories = (selectedCategoryIds) => {
    // Código original para manejar selección de categoría
    if (selectedCategoryIds && selectedCategoryIds.length > 0) {
      const categoryId = selectedCategoryIds[0];
      const category = categories.find(cat => cat[0] === categoryId);
      if (category) {
        setSelectedCategory([category]);
        updateSurveyInfoField('selectedCategory', [category]);
      }
    }
  };

  // Función para validar nombre de sección (código original)
  const validateSectionName = (name) => {
    return name.trim().replace(/\s+/g, ' ').substring(0, MAX_SECTION_NAME_LENGTH);
  };

  // Función para AÑADIR sección (actualiza 'sections')
  const handleAddSection = () => {
    const trimmedName = newSectionName.trim();
    if (trimmedName === '') {
      setInputError('El nombre no puede estar vacío');
      return;
    }
    if (trimmedName.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`El nombre no debe exceder ${MAX_SECTION_NAME_LENGTH} caracteres`);
      return;
    }
    const normalizedName = trimmedName.toLowerCase();
    // Validar contra la lista original 'sections'
    if (sections.some(s => s.name.toLowerCase() === normalizedName)) {
      setInputError('Ya existe una sección con este nombre');
      return;
    }

    const formattedName = validateSectionName(newSectionName);
    const newSection = { id: Date.now(), name: formattedName };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections); // Actualiza la lista original (dispara el efecto de filtro)
    setNewSectionName(''); // Limpia el input
    setInputError(''); // Limpia el error

    // Guardar en localStorage
    addSection(newSection);
    updateSections(updatedSections); // Guarda la lista completa actualizada
  };

  // Manejar cambio en el input (actualiza filtro y valida para añadir)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSectionName(value); // Actualiza el término de búsqueda/nuevo nombre

    // Lógica de validación (solo para errores al *añadir*)
    const trimmedValue = value.trim();
    if (value.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`Máximo ${MAX_SECTION_NAME_LENGTH} caracteres`);
    } else if (trimmedValue !== '' && sections.some(s => s.name.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputError('Nombre ya existe');
    } else {
      setInputError(''); // Limpiar error si es válido para añadir o si está vacío (para filtrar)
    }
  };

  // Manejar Enter en input (añade si es válido)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '' && !inputError) {
      handleAddSection();
    }
  };

  // Función para ELIMINAR sección (actualiza 'sections')
  const handleRemoveSection = (id) => {
    const updatedSections = sections.filter(section => section.id !== id);
    setSections(updatedSections); // Actualiza la lista original (dispara el efecto de filtro)

    // Actualizar localStorage
    removeSection(id);
    updateSections(updatedSections);

    // Disparar evento (código original)
    const event = new CustomEvent('sectionRemoved', { detail: { id, updatedSections } });
    window.dispatchEvent(event);
  };

  // Mover item en la lista ORIGINAL ('sections')
  const moveItem = (fromIndex, toIndex) => {
    const updatedSections = [...sections]; // Copia de la lista original
    const [movedItem] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);

    setSections(updatedSections); // Actualiza la lista original (dispara el efecto de filtro)
    updateSections(updatedSections); // Guarda el nuevo orden en localStorage
  };

  // Función para guardar (usa la lista 'sections' original)
  const handleSave = () => {
    if (!isFormValid) {
      showErrorMessage();
      return;
    }

    const surveyInfo = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      startDate,
      endDate,
      selectedCategory: selectedCategory && selectedCategory.length > 0 ? selectedCategory[0] : null
    };

    saveSurveyInfo(surveyInfo); // Esta función habría que añadirla al servicio

    if (onSaveAndContinue) {
      onSaveAndContinue({
        title: sanitizedTitle,
        description: sanitizedDescription,
        id_category: selectedCategory[0][0],
        startDate,
        endDate,
        sections,
        accessToken
      });
    }
  };

  // Función original para truncar texto
  const truncateText = (text, maxLength = 12) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Función original para manejar clic en botón de categoría
  const handleCategoryButtonClick = () => {
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setShowCategoryDropdown(!showCategoryDropdown); // Alterna visibilidad del dropdown
  };

  // Sanitizar datos (código original)
  const sanitizedTitle = title ? DOMPurify.sanitize(title) : '';
  const sanitizedDescription = description ? DOMPurify.sanitize(description) : '';

  // Manejar cambio en título (código original)
  const handleTitleChange = (e) => {
    if (e.target.value.length <= 50) {
      const newTitle = e.target.value;
      setTitle(newTitle);
      // Guardar en localStorage mediante el servicio
      updateSurveyInfoField('title', newTitle);
    }
  };

  // Agregar handler para guardar descripción cuando cambia
  const handleDescriptionChange = (value) => {
    setDescription(value);
    updateSurveyInfoField('description', value);
  };

  // --- INICIO JSX ---
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white shadow-2xl w-full">
      {/* Encabezado con título y categoría (ESTRUCTURA ORIGINAL RESTAURADA) */}
      <div className="flex justify-between items-center p-6">
        {/* Input de Título (Original) */}
        <div className="w-2/3 relative">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Titulo de Encuesta"
            maxLength={50}
            className="font-work-sans text-3xl font-bold text-dark-blue-custom w-[89%] border-b-2 border-gray-300 focus:border-blue-custom focus:outline-none pb-1"
          />
          <div className="absolute right-[11%] bottom-1 text-xs text-gray-500">
            {title.length}/50
          </div>
        </div>

        {/* Botón de Categoría y Dropdown (ESTRUCTURA ORIGINAL RESTAURADA) */}
        <div className="w-1/3 flex justify-end">
          {selectedCategory && selectedCategory.length > 0 ? (
            // Vista cuando hay categoría seleccionada
            <div className="flex">
              <div className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-default mr-2">
                <span className="bg-green-500 text-white px-4 py-1 flex items-center justify-center">
                  <img src={ok} alt="Seleccionado" className="w-5 h-5" />
                </span>
                <span className="bg-green-100 px-5 py-1 flex items-center justify-center">
                  <span
                    className="font-work-sans text-lg font-semibold text-dark-blue-custom"
                    title={selectedCategory[0][1]}
                  >
                    {truncateText(selectedCategory[0][1], 12)}
                  </span>
                </span>
              </div>
              {/* Botón para CAMBIAR categoría */}
              <button
                ref={selectCategoryButtonRef} // Ref asignado
                className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={handleCategoryButtonClick} // Handler asignado
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                  {/* Icono Cambiar */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="white" /><path d="M15 8L9 14L15 8ZM9 8L15 14L9 8Z" fill="white" /><path d="M15 8L9 14M9 8L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Cambiar categoría
                  </span>
                </span>
              </button>
            </div>
          ) : (
            // Botón para SELECCIONAR categoría
            <button
              ref={selectCategoryButtonRef} // Ref asignado
              className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={handleCategoryButtonClick} // Handler asignado
            >
              <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                <img src={selectCategory} alt="Filtrar" className="w-5 h-5" />
              </span>
              <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                <span className="font-work-sans text-lg font-semibold text-blue-custom mr-2">
                  Seleccionar Categoría
                </span>
                <img src={Selectsurvey} alt="Filtrar" className="w-5 h-5" />
              </span>
            </button>
          )}

          {/* Dropdown de categorías (Original) */}
          <CategoryDropdown
            isOpen={showCategoryDropdown}
            onOpenChange={setShowCategoryDropdown}
            onSelectCategories={handleSelectCategories}
            onCancel={() => setShowCategoryDropdown(false)}
            anchorRef={selectCategoryButtonRef} // Ref del botón para posicionamiento
          />
        </div>
        {/* --- FIN SECCIÓN CATEGORÍA RESTAURADA --- */}
      </div>

      {/* Contenedor principal de dos columnas (Original) */}
      <div className="flex flex-col lg:flex-row -mt-6">
        {/* Columna izquierda (Fechas, Descripción - Original) */}
        <div className="flex-1 flex flex-col gap-3 p-6">
          {/* Rango de tiempo (Original) */}
          <div className="mb-4">
            <div className="mb-1 border border-white p-0">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
            </div>
            <div className="flex flex-col space-y-4 w-fit">
              {/* Calendario Inicio (Original) */}
              <div className="border border-white relative">
                <Calendar
                  initialDate={startDate}
                  selectedDate={startDate}
                  onDateSelect={handleStartDateChange}
                  buttonLabel="Fecha de Inicio:"
                  calendarIcon={calendar2}
                  isEndDate={false}
                  isOpen={showStartCalendar}
                  onOpenChange={(isOpen) => {
                    setShowStartCalendar(isOpen);
                    if (isOpen) { setShowEndCalendar(false); setShowCategoryDropdown(false); }
                  }}
                />
              </div>
              {/* Calendario Fin (Original) */}
              <div className="border border-white relative">
                <Calendar
                  initialDate={endDate}
                  selectedDate={endDate}
                  onDateSelect={handleEndDateChange}
                  buttonLabel="Fecha de Finalización:"
                  calendarIcon={calendar2}
                  minDate={startDate}
                  isEndDate={true}
                  isOpen={showEndCalendar}
                  onOpenChange={(isOpen) => {
                    setShowEndCalendar(isOpen);
                    if (isOpen) { setShowStartCalendar(false); setShowCategoryDropdown(false); }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sección de descripción (Original) */}
          <div className="mb-4">
            <div className="mb-2 border border-white">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
            </div>
            <div className="border border-white">
              <RichTextEditor
                value={description}
                onChange={(value) => {
                  const sanitizedValue = DOMPurify.sanitize(value);
                  setDescription(sanitizedValue);
                  updateSurveyInfoField('description', sanitizedValue);
                }}
              />
            </div>
          </div>
        </div>

        {/* Columna derecha (Secciones - CON FILTRO INTEGRADO) */}
        <div className="flex-1 flex flex-col gap-4 p-6">
          {/* Título y Descripción Secciones (Original) */}
          <div className="-mb-2">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
            <p className="font-work-sans text-sm mb-3 text-gray-600">
              {/* Texto ligeramente ajustado para reflejar filtro */}
              Agrega las secciones en las que clasificarás las preguntas y define el orden en el que se presentarán al encuestado.
            </p>
          </div>

          {/* Input para añadir / filtrar sección */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                value={newSectionName} // Controlado por el estado
                onChange={handleInputChange} // Actualiza filtro y valida para añadir
                onKeyDown={handleKeyDown} // Añade con Enter si es válido
                placeholder="Escriba para filtrar o añadir sección" // Placeholder actualizado
                maxLength={MAX_SECTION_NAME_LENGTH}
                // Borde rojo solo si hay error al *intentar añadir*
                className={`w-full rounded-full border ${inputError ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pr-12 outline-none focus:border-green-500 transition-colors`}
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              />
              {/* Botón '+' (Añadir) */}
              <button
                onClick={handleAddSection}
                // Habilitado solo si no está vacío Y no hay error de validación *para añadir*
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${newSectionName.trim() !== '' && !inputError
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                disabled={newSectionName.trim() === '' || !!inputError}
              >
                {/* Icono '+' */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            {/* Mensaje de error (solo para errores al añadir) */}
            {inputError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{inputError}</p>
            )}
          </div>

          {/* Lista de secciones con drag and drop (RENDERIZA 'filteredSections') */}
          <DndProvider backend={HTML5Backend}>
            <div className="max-h-96 overflow-y-auto scrollbar-image-match pr-4">
              {/* --- RENDERIZADO MODIFICADO --- */}
              {filteredSections.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  {/* Mensaje dinámico si no hay resultados */}
                  {newSectionName.trim() === '' ? 'No hay secciones creadas' : 'No hay secciones que coincidan'}
                </p>
              ) : (
                // Mapear sobre la lista FILTRADA
                filteredSections.map((section) => {
                  // IMPORTANTE: Encontrar el índice ORIGINAL en la lista 'sections'
                  const originalIndex = sections.findIndex(s => s.id === section.id);

                  // Comprobación de seguridad (no debería ocurrir)
                  if (originalIndex === -1) {
                    console.warn(`Section with id ${section.id} not found in original sections list.`);
                    return null;
                  };

                  return (
                    <DraggableSectionItem
                      key={section.id} // Usar ID estable como key
                      id={section.id}
                      index={originalIndex} // Pasar el ÍNDICE ORIGINAL al componente draggable
                      name={section.name}
                      moveItem={moveItem} // moveItem opera sobre la lista original 'sections'
                      onRemove={handleRemoveSection} // onRemove opera sobre la lista original 'sections'
                    />
                  );
                })
              )}
              {/* --- FIN RENDERIZADO MODIFICADO --- */}
            </div>
          </DndProvider>
        </div>
        {/* --- FIN COLUMNA DERECHA --- */}
      </div>

      {/* Modal para mensajes (Original) */}
      <Modal
        isOpen={isModalOpen}
        title={DOMPurify.sanitize(modalTitle)}
        message={DOMPurify.sanitize(modalMessage)}
        onConfirm={closeModal}
        onCancel={closeModal}
        confirmText="Cerrar"
        cancelText="Cancelar"
        type="informative"
        status={modalStatus}
      />
    </div>
    // --- FIN JSX ---
  );
};

export default DetailForm;