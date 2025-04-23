import React, { useState, useEffect, useContext, useRef } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import Addsurvey from '../assets/img/addsurvey.svg';
import { SurveyContext } from '../Provider/SurveyContext';
import selectCategory from '../assets/img/selectCategory.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import trashcan from '../assets/img/trashCan.svg';
import calendar2 from '../assets/img/calendar2.svg';
import ok from '../assets/img/Ok.svg';
import Modal from './Modal';
import Calendar from './Calendar';
import CategoryDropdown from './CategoryDropdown';
import { getSections, updateSections, removeSection, addSection } from '../services/SectionsStorage';
import DOMPurify from 'dompurify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Constante para la longitud máxima del nombre de sección
const MAX_SECTION_NAME_LENGTH = 50;

// Componente para el elemento arrastrable de sección
const DraggableSectionItem = ({ id, index, name, moveItem, onRemove }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
      className={`flex items-center mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="flex items-center flex-grow py-2">
          <div className="text-dark-blue-custom mx-3 cursor-grab">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="1.5" />
              <circle cx="3" cy="9" r="1.5" />
              <circle cx="3" cy="15" r="1.5" />
              <circle cx="9" cy="3" r="1.5" />
              <circle cx="9" cy="9" r="1.5" />
              <circle cx="9" cy="15" r="1.5" />
              <circle cx="15" cy="3" r="1.5" />
              <circle cx="15" cy="9" r="1.5" />
              <circle cx="15" cy="15" r="1.5" />
            </svg>
          </div>
          <span className="font-work-sans text-lg font-medium text-dark-blue-custom">{name}</span>
        </div>
        <button
          className="bg-orange-custom text-white p-3 hover:bg-orange-600 transition-colors"
          onClick={() => onRemove(id)}
        >
          <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const DetailForm = ({ onFormValidChange, onSaveAndContinue }) => {
  const { selectedCategory, setSelectedCategory, categories } = useContext(SurveyContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('error');
  const [isFormValid, setIsFormValid] = useState(false);

  // Fecha actual para usar como mínima
  const today = new Date();

  // Estados para las fechas - por defecto, usa la fecha actual
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Estados para mostrar los calendarios
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Estado para el dropdown de categorías
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Referencia al botón "Seleccionar Categoría" para posicionar el dropdown
  const selectCategoryButtonRef = useRef(null);

  // Estado para almacenar las secciones
  const [sections, setSections] = useState([
    { id: 1, name: 'Información personal' },
    { id: 2, name: 'Experiencia Laboral' },
    { id: 3, name: 'Experiencia Académica' }
  ]);

  // Estado para la nueva sección
  const [newSectionName, setNewSectionName] = useState('');
  const [inputError, setInputError] = useState('');

  // Verificar validez del formulario
  useEffect(() => {
    // Determinar si el formulario es válido
    const isTitleValid = title.trim() !== '';
    const isCategoryValid = selectedCategory && selectedCategory.length > 0;
    const isSectionsValid = sections.length > 0;

    const formIsValid = isTitleValid && isCategoryValid && isSectionsValid;
    setIsFormValid(formIsValid);

    // Notificar al componente padre sobre el cambio en la validez
    if (onFormValidChange) {
      onFormValidChange(formIsValid);
    }
  }, [title, selectedCategory, sections]);

  // Cargar token de acceso y secciones al montar el componente
  useEffect(() => {
    // Cargar el token de acceso
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('No se encontró el token de acceso. Inicia sesión nuevamente.');
      setModalTitle('Error de autenticación');
      setModalMessage('No se encontró el token de acceso. Por favor, inicia sesión de nuevo.');
      setModalStatus('error');
      setIsModalOpen(true);
    }

    // Cargar secciones desde localStorage
    const storedSections = getSections();
    if (storedSections.length > 0) {
      setSections(storedSections);
    } else if (sections.length > 0) {
      // Si no hay secciones guardadas pero tenemos secciones por defecto, guardarlas
      updateSections(sections);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Cuando cambia la fecha de inicio, actualizar la fecha mínima de finalización
  useEffect(() => {
    // Si la fecha de finalización es anterior a la fecha de inicio, actualizarla
    if (endDate < startDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  // Cerrar los calendarios cuando se abre el dropdown de categorías
  useEffect(() => {
    if (showCategoryDropdown) {
      setShowStartCalendar(false);
      setShowEndCalendar(false);
    }
  }, [showCategoryDropdown]);

  const showErrorMessage = () => {
    setModalTitle('Alerta');
    setModalMessage('Por favor, complete todos los campos requeridos antes de continuar.');
    setModalStatus('error');
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setTitle('');
    setDescription('');
    setModalTitle('Éxito');
    setModalMessage('Datos enviados correctamente.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  // Handlers para actualizar las fechas
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Función para manejar la selección de categorías
  const handleSelectCategories = (selectedCategoryIds) => {
    if (selectedCategoryIds && selectedCategoryIds.length > 0) {
      // Buscar la información completa de la categoría seleccionada
      const categoryId = selectedCategoryIds[0];
      const category = categories.find(cat => cat[0] === categoryId);

      if (category) {
        // Actualizar el contexto con la categoría seleccionada
        setSelectedCategory([category]);
      }
    }
  };

  // Función para validar y formatear el nombre de sección
  const validateSectionName = (name) => {
    // Eliminar espacios adicionales y limitar longitud
    return name.trim().replace(/\s+/g, ' ').substring(0, MAX_SECTION_NAME_LENGTH);
  };

  // Función para añadir una nueva sección
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
    setInputError('');

    // Guardar en localStorage
    addSection(newSection);
    updateSections(updatedSections);
  };

  // Manejar entrada de texto para nueva sección con validación
  const handleInputChange = (e) => {
    const value = e.target.value;
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

  // Manejar tecla Enter en input de nueva sección
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '' && !inputError) {
      handleAddSection();
    }
  };

  // Función para eliminar una sección específica
  const handleRemoveSection = (id) => {
    // Actualizar el estado local
    const updatedSections = sections.filter(section => section.id !== id);
    setSections(updatedSections);

    // Eliminar la sección y actualizar completamente localStorage
    removeSection(id);
    updateSections(updatedSections);

    // Disparar un evento para que otros componentes se actualicen
    const event = new CustomEvent('sectionRemoved', {
      detail: { id, updatedSections }
    });
    window.dispatchEvent(event);
  };

  // Mover un elemento de una posición a otra
  const moveItem = (fromIndex, toIndex) => {
    const updatedSections = [...sections];
    const movedItem = updatedSections[fromIndex];
    updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);
    setSections(updatedSections);

    // Actualizar también el localStorage
    updateSections(updatedSections);
  };

  // Función para manejar el envío de datos
  const handleSave = () => {
    if (!isFormValid) {
      showErrorMessage();
      return;
    }

    // Pasar datos al componente padre
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

  const truncateText = (text, maxLength = 12) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Manejar el clic en "Seleccionar Categoría"
  const handleCategoryButtonClick = () => {
    // Cerrar calendarios si están abiertos
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    // Alternar el dropdown de categorías
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Sanitizar datos antes de enviarlos
  const sanitizedTitle = title ? DOMPurify.sanitize(title) : '';
  const sanitizedDescription = description ? DOMPurify.sanitize(description) : '';

  // Manejar cambio en el input del título
  const handleTitleChange = (e) => {
    // Limitar a 50 caracteres
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white shadow-2xl w-full">
      {/* Encabezado con título y categoría */}
      <div className="flex justify-between items-center p-6">
        <div className="w-2/3 relative">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Titulo de Encuesta"
            maxLength={50}
            className="font-work-sans text-3xl font-bold text-dark-blue-custom w-full border-b-2 border-gray-300 focus:border-blue-custom focus:outline-none pb-1"
          />
          <div className="absolute right-0 bottom-1 text-xs text-gray-500">
            {title.length}/50
          </div>
        </div>

        {/* Botón de "Seleccionar Categoría" o Categoría seleccionada */}
        <div className="w-1/3 flex justify-end">
          {selectedCategory && selectedCategory.length > 0 ? (
            <div className="flex">
              {/* Botón verde con la categoría seleccionada */}
              <div className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-default mr-2">
                <span className="bg-green-500 text-white px-4 py-1 flex items-center justify-center">
                  <img src={ok} alt="Seleccionado" className="w-5 h-5" />
                </span>
                <span className="bg-green-100 px-5 py-1 flex items-center justify-center">
                  <span
                    className="font-work-sans text-lg font-semibold text-dark-blue-custom"
                    title={selectedCategory[0][1]} // Muestra el nombre completo al pasar el cursor
                  >
                    {truncateText(selectedCategory[0][1], 12)}
                  </span>
                </span>
              </div>

              {/* Botón para cambiar categoría */}
              <button
                ref={selectCategoryButtonRef}
                className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={handleCategoryButtonClick}
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="white" />
                    <path d="M15 8L9 14L15 8ZM9 8L15 14L9 8Z" fill="white" />
                    <path d="M15 8L9 14M9 8L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Cambiar categoría
                  </span>
                </span>
              </button>
            </div>
          ) : (
            <button
              ref={selectCategoryButtonRef}
              className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={handleCategoryButtonClick}
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

          {/* Dropdown de categorías */}
          <CategoryDropdown
            isOpen={showCategoryDropdown}
            onOpenChange={setShowCategoryDropdown}
            onSelectCategories={handleSelectCategories}
            onCancel={() => setShowCategoryDropdown(false)}
            anchorRef={selectCategoryButtonRef}
          />
        </div>
      </div>

      {/* Contenedor principal de dos columnas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna izquierda */}
        <div className="flex-1 flex flex-col gap-4 p-6">
          {/* Rango de tiempo */}
          <div className="mb-4">
            <div className="mb-1 border border-white p-0">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
            </div>
            <div className="flex flex-col space-y-4 w-fit">
              <div className="border border-white relative">
                {/* Calendario de inicio con control de apertura/cierre */}
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
                    // Si abrimos el calendario de inicio, cerramos otros elementos
                    if (isOpen) {
                      setShowEndCalendar(false);
                      setShowCategoryDropdown(false);
                    }
                  }}
                />
              </div>

              <div className="border border-white relative">
                {/* Calendario de finalización con control de apertura/cierre */}
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
                    // Si abrimos el calendario de finalización, cerramos otros elementos
                    if (isOpen) {
                      setShowStartCalendar(false);
                      setShowCategoryDropdown(false);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sección de descripción */}
          <div className="mb-4">
            <div className="mb-2 border border-white">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
            </div>
            <div className="border border-white">
              <RichTextEditor
                value={description}
                onChange={(value) => setDescription(DOMPurify.sanitize(value))} // Sanitizar la descripción
              />
            </div>
          </div>
        </div>

        {/* Columna derecha (Secciones) */}
        <div className="flex-1 flex flex-col gap-4 p-6">
          <div className="mb-2">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
            <p className="font-work-sans text-sm mb-3 text-gray-600">
              Agrega las secciones en las que clasificarás las preguntas y define el orden en el que se presentarán al encuestado.
            </p>
          </div>

          {/* Input para añadir nueva sección */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                value={newSectionName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Escriba el nombre de la nueva sección"
                maxLength={MAX_SECTION_NAME_LENGTH}
                className={`w-full rounded-full border ${inputError ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pr-12 outline-none focus:border-green-500 transition-colors`}
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              />
              <button
                onClick={newSectionName.trim() !== '' && !inputError ? handleAddSection : undefined}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${newSectionName.trim() !== '' && !inputError
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                disabled={newSectionName.trim() === '' || !!inputError}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {inputError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{inputError}</p>
            )}
          </div>

          {/* Lista de secciones con drag and drop */}
          <DndProvider backend={HTML5Backend}>
            <div className="max-h-96 overflow-y-auto">
              {sections.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-4">No hay secciones creadas</p>
              ) : (
                sections.map((section, index) => (
                  <DraggableSectionItem
                    key={section.id}
                    id={section.id}
                    index={index}
                    name={section.name}
                    moveItem={moveItem}
                    onRemove={handleRemoveSection}
                  />
                ))
              )}
            </div>
          </DndProvider>
        </div>

      </div>

      {/* Modal para mensajes */}
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
  );
};

export default DetailForm;