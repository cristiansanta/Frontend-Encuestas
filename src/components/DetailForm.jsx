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
import SectionDropdown from './SectionDropdown';
import CategoryDropdown from './CategoryDropdown';
import { getSections, updateSections, removeSection } from '../services/SectionsStorage';
import DOMPurify from 'dompurify';

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

  // Estado para el dropdown de secciones
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

  // Estado para el dropdown de categorías
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Referencia al botón "Nueva Sección" para posicionar el dropdown
  const newSectionButtonRef = useRef(null);

  // Referencia al botón "Seleccionar Categoría" para posicionar el dropdown
  const selectCategoryButtonRef = useRef(null);

  // Estado para almacenar las secciones
  const [sections, setSections] = useState([
    { id: 1, name: 'Información personal' },
    { id: 2, name: 'Experiencia Laboral' },
    { id: 3, name: 'Experiencia Académica' }
  ]);

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

  // Cerrar los dropdowns cuando se abre algún calendario
  useEffect(() => {
    if (showStartCalendar || showEndCalendar) {
      setShowSectionDropdown(false);
      setShowCategoryDropdown(false);
    }
  }, [showStartCalendar, showEndCalendar]);

  // Cerrar otros dropdowns cuando se abre uno nuevo
  useEffect(() => {
    if (showSectionDropdown) {
      setShowCategoryDropdown(false);
      setShowStartCalendar(false);
      setShowEndCalendar(false);
    }
  }, [showSectionDropdown]);

  useEffect(() => {
    if (showCategoryDropdown) {
      setShowSectionDropdown(false);
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

  // Función para manejar la adición/actualización de secciones
  const handleUpdateSections = (updatedSections) => {
    setSections(updatedSections);
    // Sincronizar con localStorage
    updateSections(updatedSections);
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

  // Función para eliminar una sección específica
  const handleRemoveSection = (id, e) => {
    if (e) e.stopPropagation();

    // Actualizar el estado local
    const updatedSections = sections.filter(section => section.id !== id);
    setSections(updatedSections);

    // CRUCIAL: Eliminar la sección y actualizar completamente localStorage
    removeSection(id);
    updateSections(updatedSections);

    // Disparar un evento para que otros componentes se actualicen
    const event = new CustomEvent('sectionRemoved', {
      detail: { id, updatedSections }
    });
    window.dispatchEvent(event);
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
    // Cerrar calendarios y otros dropdowns si están abiertos
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setShowSectionDropdown(false);
    // Alternar el dropdown de categorías
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Función auxiliar para navegar (define navigate si no está disponible)
  const navigate = (path) => {
    console.log(`Navegación a: ${path}`);
    // Implementa la navegación real según tu enrutador
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

  // Manejar el clic en "Nueva Sección"
  const handleSectionButtonClick = () => {
    // Cerrar calendarios y otros dropdowns si están abiertos
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setShowCategoryDropdown(false);
    // Alternar el dropdown de secciones
    setShowSectionDropdown(!showSectionDropdown);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white shadow-2xl w-full">

        {/* Sección superior con dos elementos (título y categoría) */}
        <div className="flex justify-between items-center mb-2">
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

        {/* Segunda sección - Secciones de la encuesta */}
        <div className="mb-4">
          <div className="mb-1 border border-white">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
          </div>
          <p className="font-work-sans text-sm mb-3 text-gray-600">
            Agrega las secciones en las que clasificarás las preguntas.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {sections.map(section => (
              <div
                key={section.id}
                className="border border-white relative"
              >
                <div className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                  <span
                    className="bg-orange-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                    onClick={(e) => handleRemoveSection(section.id, e)}
                  >
                    <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                  </span>
                  <span className="bg-gray-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                    <span className="font-work-sans text-lg font-semibold text-blue-custom">
                      {section.name}
                    </span>
                  </span>
                </div>
              </div>
            ))}

            <div className="border border-white relative">
              <button
                ref={newSectionButtonRef}
                className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={handleSectionButtonClick}
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <img src={Addsurvey} alt="Nueva sección" className="w-5 h-5" />
                </span>
                <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Nueva Sección
                  </span>
                </span>
              </button>

              {/* Dropdown de secciones (aparece bajo el botón) */}
              <SectionDropdown
                isOpen={showSectionDropdown}
                onOpenChange={setShowSectionDropdown}
                onAddSections={handleUpdateSections}
                onCancel={() => setShowSectionDropdown(false)}
                existingSections={sections}
                anchorRef={newSectionButtonRef}
              />
            </div>
          </div>
        </div>

        {/* Rango de tiempo */}
        <div className="mb-4">
          <div className="mb-1 border border-white p-0">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
          </div>
          <div className="flex space-x-4">
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
                    setShowSectionDropdown(false);
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
                    setShowSectionDropdown(false);
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
    </>
  );
};

export default DetailForm;