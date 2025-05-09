import React, { useState, useEffect, useContext, useRef } from 'react';
import Addsurvey from '../assets/img/addsurvey.svg';
import selectCategory from '../assets/img/selectCategory.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import trashcan from '../assets/img/trashCan.svg';
import calendar2 from '../assets/img/calendar2.svg';
import { getSections, updateSections, removeSection, addSection } from '../services/SurveyFormStorage.js';
import {
  getFormData,
  saveFormData,
  updateFormField,
  updateMultipleFields,
  clearFormData
} from '../services/SurveyFormStorage.js';
import DOMPurify from 'dompurify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ok from '../assets/img/Ok.svg';
import RichTextEditor from './TextBoxDetail';
import { SurveyContext } from '../Provider/SurveyContext';
import Modal from './Modal';
import Calendar from './Calendar';
import CategoryDropdown from './CategoryDropdown';

const MAX_SECTION_NAME_LENGTH = 50;

const DraggableSectionItem = ({ id, index, name, moveItem, onRemove }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION_ITEM',
    item: { id, index },
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
          className="bg-orange-custom text-white p-3 hover:bg-orange-600 transition-colors relative"
          onClick={() => onRemove(id)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
          {showTooltip && (
            <div className="tooltip-container absolute z-10 right-full top-1/2 transform -translate-y-1/2 mr-2">
              <div className="bg-dark-blue-custom text-white px-3 py-2 rounded-md text-sm whitespace-nowrap" style={{ backgroundColor: '#002C4D', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                Eliminar sección
              </div>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45" style={{ width: '10px', height: '10px', backgroundColor: '#002C4D' }}></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

const DetailForm = ({ onFormValidChange, onSaveAndContinue }) => {
  const { selectedCategory, setSelectedCategory, categories } = useContext(SurveyContext);

  const loadInitialFormData = () => {
    const formData = getFormData();
    setTitle(formData.title || '');
    setDescription(formData.description || '');
    if (formData.selectedCategory) {
      setSelectedCategory(formData.selectedCategory);
    }
    setStartDate(formData.startDate || new Date());
    setEndDate(formData.endDate || new Date());

    const formSections = formData.sections || [];
    const storedSections = getSections();

    const initialSections = formSections.length > 0 ? formSections : (
      storedSections.length > 0 ? storedSections : [
        { id: 1, name: 'Información personal' },
        { id: 2, name: 'Experiencia Laboral' },
        { id: 3, name: 'Experiencia Académica' }
      ]
    );

    setSections(initialSections);

    if (formSections.length > 0) {
      updateSections(formSections);
    } else if (storedSections.length === 0 && initialSections.length > 0) {
      updateSections(initialSections);
    }
  };

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
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [inputError, setInputError] = useState('');
  const [filteredSections, setFilteredSections] = useState([]);

  const saveFormChanges = (fieldName, value) => {
    updateFormField(fieldName, value);
  };

  useEffect(() => {
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

    loadInitialFormData();

    const handleStorageChange = (event) => {
      if (event.key === 'survey_sections') {
        const updatedSections = getSections();
        setSections(updatedSections);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const searchTerm = newSectionName.trim().toLowerCase();
    if (searchTerm === '') {
      setFilteredSections(sections);
    } else {
      const filtered = sections.filter(section =>
        section.name.toLowerCase().includes(searchTerm)
      );
      setFilteredSections(filtered);
    }
  }, [newSectionName, sections]);

  useEffect(() => {
    const isTitleValid = title.trim() !== '';
    const isCategoryValid = selectedCategory && selectedCategory.length > 0;
    const isSectionsValid = sections.length > 0;

    const formIsValid = isTitleValid && isCategoryValid && isSectionsValid;
    setIsFormValid(formIsValid);

    if (onFormValidChange) {
      onFormValidChange(formIsValid);
    }

    const formData = {
      title,
      description,
      selectedCategory,
      startDate: startDate instanceof Date && !isNaN(startDate) ? startDate : new Date(),
      endDate: endDate instanceof Date && !isNaN(endDate) ? endDate : new Date(),
      sections
    };
    saveFormData(formData);
  }, [title, description, selectedCategory, startDate, endDate, sections, onFormValidChange]);

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (endDate < startDate) {
      setEndDate(startDate);
      saveFormChanges('endDate', startDate);
    }
  }, [startDate, endDate]);

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
    clearFormData();
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    saveFormChanges('startDate', date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    saveFormChanges('endDate', date);
  };

  const handleSelectCategories = (selectedCategoryIds) => {
    if (selectedCategoryIds && selectedCategoryIds.length > 0) {
      const categoryId = selectedCategoryIds[0];
      const category = categories.find(cat => cat[0] === categoryId);
      if (category) {
        const newSelectedCategory = [category];
        setSelectedCategory(newSelectedCategory);
        saveFormChanges('selectedCategory', newSelectedCategory);
      }
    }
  };

  const validateSectionName = (name) => {
    return name.trim().replace(/\s+/g, ' ').substring(0, MAX_SECTION_NAME_LENGTH);
  };

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
    if (sections.some(s => s.name.toLowerCase() === normalizedName)) {
      setInputError('Ya existe una sección con este nombre');
      return;
    }

    const formattedName = validateSectionName(newSectionName);
    const newSection = { id: Date.now(), name: formattedName };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    saveFormChanges('sections', updatedSections);
    setNewSectionName('');
    setInputError('');

    addSection(newSection);
    updateSections(updatedSections);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSectionName(value);

    const trimmedValue = value.trim();
    if (value.length > MAX_SECTION_NAME_LENGTH) {
      setInputError(`Máximo ${MAX_SECTION_NAME_LENGTH} caracteres`);
    } else if (trimmedValue !== '' && sections.some(s => s.name.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputError('Nombre ya existe');
    } else {
      setInputError('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newSectionName.trim() !== '' && !inputError) {
      handleAddSection();
    }
  };

  const handleRemoveSection = (id) => {
    const updatedSections = sections.filter(section => section.id !== id);
    setSections(updatedSections);
    saveFormChanges('sections', updatedSections);

    removeSection(id);
    updateSections(updatedSections);

    const event = new CustomEvent('sectionRemoved', { detail: { id, updatedSections } });
    window.dispatchEvent(event);
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedSections = [...sections];
    const [movedItem] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);

    setSections(updatedSections);
    saveFormChanges('sections', updatedSections);
    updateSections(updatedSections);
  };

  const handleSave = () => {
    if (!isFormValid) {
      showErrorMessage();
      return;
    }
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

  const handleCategoryButtonClick = () => {
    setShowStartCalendar(false);
    setShowEndCalendar(false);
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const sanitizedTitle = title ? DOMPurify.sanitize(title) : '';
  const sanitizedDescription = description ? DOMPurify.sanitize(description) : '';

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= 50) {
      setTitle(newTitle);
      saveFormChanges('title', newTitle);
    }
  };

  const handleDescriptionChange = (value) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    setDescription(sanitizedValue);
    saveFormChanges('description', sanitizedValue);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white shadow-2xl w-full">
      <div className="flex justify-between items-center p-6">
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

        <div className="w-1/3 flex justify-end">
          {selectedCategory && selectedCategory.length > 0 ? (
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

          <CategoryDropdown
            isOpen={showCategoryDropdown}
            onOpenChange={setShowCategoryDropdown}
            onSelectCategories={handleSelectCategories}
            onCancel={() => setShowCategoryDropdown(false)}
            anchorRef={selectCategoryButtonRef}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row -mt-6">
        <div className="flex-1 flex flex-col gap-3 p-6">
          <div className="mb-4">
            <div className="mb-1 border border-white p-0">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
            </div>
            <div className="flex flex-col space-y-4 w-fit">
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

          <div className="mb-4">
            <div className="mb-2 border border-white">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
            </div>
            <div className="border border-white">
              <RichTextEditor
                value={description}
                onChange={(value) => setDescription(DOMPurify.sanitize(value))}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 p-6">
          <div className="-mb-2">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
            <p className="font-work-sans text-sm mb-3 text-gray-600">
              Agrega las secciones en las que clasificarás las preguntas y define el orden en el que se presentarán al encuestado.
            </p>
          </div>

          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                value={newSectionName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Escriba para filtrar o añadir sección"
                maxLength={MAX_SECTION_NAME_LENGTH}
                className={`w-full rounded-full border ${inputError ? 'border-red-500' : 'border-gray-300'} px-4 py-3 pr-12 outline-none focus:border-green-500 transition-colors`}
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              />
              <button
                onClick={handleAddSection}
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

          <DndProvider backend={HTML5Backend}>
            <div className="max-h-96 overflow-y-auto scrollbar-image-match pr-4">
              {filteredSections.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  {newSectionName.trim() === '' ? 'No hay secciones creadas' : 'No hay secciones que coincidan'}
                </p>
              ) : (
                filteredSections.map((section) => {
                  const originalIndex = sections.findIndex(s => s.id === section.id);

                  if (originalIndex === -1) {
                    console.warn(`Section with id ${section.id} not found in original sections list.`);
                    return null;
                  }

                  return (
                    <DraggableSectionItem
                      key={section.id}
                      id={section.id}
                      index={originalIndex}
                      name={section.name}
                      moveItem={moveItem}
                      onRemove={handleRemoveSection}
                    />
                  );
                })
              )}
            </div>
          </DndProvider>
        </div>
      </div>

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
