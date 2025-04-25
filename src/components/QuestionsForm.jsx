import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import InputSlide from './InputSlide.jsx';
import Modal from './Modal';
import SectionSelector from './SectionSelector';
import BankQuestionsDropdown from './BankQuestionsDropdown';
import {
  OpenAnswerPreview,
  NumericAnswerPreview,
  SingleChoicePreview,
  MultipleChoicePreview,
  TrueFalsePreview,
  DatePreview
} from './QuestionPreviewComponents';
import { getSections, getSelectedSection, saveSelectedSection } from '../services/SectionsStorage';
import { 
  getBankQuestions, 
  addQuestionToBank, 
  removeSimilarQuestionFromBank, 
  isSimilarQuestionInBank 
} from '../services/BankQuestionsStorage';
import DOMPurify from 'dompurify';

// Importaciones de imágenes
import collapseExpandButton from '../assets/img/collapseExpandButton.svg';
import openAnswer from '../assets/img/OpenAnswer.svg';
import number from '../assets/img/number.svg';
import selectCircle from '../assets/img/selectCircle.svg';
import multipleOption from '../assets/img/multipleOption.svg';
import trueFalse from '../assets/img/trueFalse.svg';
import calendarIcon from '../assets/img/calendar2.svg';
import Down from '../assets/img/down.svg';
import RefreshIcon from '../assets/img/refresh.svg';
import AddCategory1 from '../assets/img/AddCategory1.svg';

// Componente SwitchOption (modificado para añadir soporte de disabled)
const SwitchOption = ({ value, onChange, label, disabled = false }) => (
  <div className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <InputSlide
      value={value}
      onChange={disabled ? undefined : onChange}
      disabled={disabled}
    />
    <span className={`font-semibold text-dark-blue-custom ${disabled ? 'text-gray-400' : ''}`}>
      {label}
    </span>
  </div>
);

// Componente Principal
const QuestionsForm = forwardRef(({ onAddChildQuestion, ...props }, ref) => {
  // --- Estados ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mandatory, setMandatory] = useState(false);
  const [addToBank, setAddToBank] = useState(false);
  const [isParentQuestion, setIsParentQuestion] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('default');
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Nuevo estado para el dropdown del banco de preguntas
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  
  // Referencia para el botón de importar desde banco
  const bankButtonRef = useRef(null);

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';

  // --- Efectos ---

  // Carga secciones al inicio
  useEffect(() => {
    const loadInitialData = () => {
      const storedSections = getSections();
      if (storedSections.length > 0) {
        setAvailableSections(storedSections);
      } else {
        const mockSections = [
          { id: 1, name: 'Información Personal' },
          { id: 2, name: 'Experiencia Laboral' },
          { id: 3, name: 'Experiencia Académica' }
        ];
        setAvailableSections(mockSections);
      }

      const savedSection = getSelectedSection();
      if (savedSection) {
        const fullSavedSection = storedSections.find(s => s.id === savedSection.id);
        if (fullSavedSection) {
          setSelectedSection(fullSavedSection);
        }
      }
      
      // Cargar preguntas del banco
      const storedBankQuestions = getBankQuestions();
      setBankQuestions(storedBankQuestions);
    };

    loadInitialData();

    // Listener para cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'survey_sections') {
        setAvailableSections(getSections());
      }
      if (e.key === 'selected_survey_section_id') {
         const savedSection = getSelectedSection();
         const currentSections = getSections();
         const fullSavedSection = currentSections.find(s => s.id === savedSection?.id);
         setSelectedSection(fullSavedSection || null);
      }
      if (e.key === 'bank_questions') {
        const storedBankQuestions = getBankQuestions();
        setBankQuestions(storedBankQuestions);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listener para eventos personalizados
    const handleSectionRemoved = (event) => {
      setAvailableSections(event.detail.updatedSections);
      if (selectedSection && selectedSection.id === event.detail.id) {
        setSelectedSection(null);
        saveSelectedSection(null);
      }
    };
    window.addEventListener('sectionRemoved', handleSectionRemoved);
    
    // Listener para actualización de banco de preguntas
    const handleBankQuestionsUpdated = (event) => {
      setBankQuestions(event.detail);
    };
    window.addEventListener('bankQuestionsUpdated', handleBankQuestionsUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sectionRemoved', handleSectionRemoved);
      window.removeEventListener('bankQuestionsUpdated', handleBankQuestionsUpdated);
    };
  }, []);

  // --- Funciones Auxiliares ---

  // Verifica si la descripción tiene contenido visible real
  const isDescriptionNotEmpty = (htmlString) => {
    if (!htmlString) return false;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const textContent = (tempDiv.textContent || tempDiv.innerText || "").trim();
    if (textContent === '' && htmlString.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '').trim() === '') {
        return false;
    }
    return textContent.length > 0;
  };

  // Determina si hay cambios que justifiquen "Volver a empezar"
  const hasChanges =
    selectedQuestionType !== null ||
    selectedSection !== null ||
    title.trim() !== '' ||
    isDescriptionNotEmpty(description);

  // Determina si se pueden activar los switches
  const canActivateSwitches = 
    title.trim() !== '' && 
    selectedQuestionType !== null && 
    selectedSection !== null && 
    isDescriptionNotEmpty(description);

  // Maneja la activación/desactivación del switch para el banco
  const handleBankSwitchChange = () => {
    if (!canActivateSwitches) return;
    
    if (!addToBank) {
      // Verificar si ya existe una pregunta similar antes de activar
      const questionData = {
        title: title.trim(),
        questionType: selectedQuestionType
      };
      
      const isDuplicate = isSimilarQuestionInBank(questionData);
      
      if (isDuplicate) {
        // Mostrar mensaje de advertencia
        setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
        setModalStatus('info');
        setIsModalOpen(true);
        return; // No activar el switch
      }
      
      // Si no es duplicado, activar y guardar
      setAddToBank(true);
      saveCurrentQuestionToBank();
    } else {
      // Desactivar y eliminar del banco
      setAddToBank(false);
      
      const questionData = {
        title: title.trim(),
        questionType: selectedQuestionType
      };
      
      removeSimilarQuestionFromBank(questionData);
    }
  };

  // Guardar la pregunta actual en el banco
  const saveCurrentQuestionToBank = () => {
    if (!canActivateSwitches) return;
    
    const questionId = Date.now(); // Genera un ID único
    const questionData = {
      id: questionId,
      title: title.trim(),
      description: description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory: mandatory,
      isParentQuestion: isParentQuestion
    };
    
    const result = addQuestionToBank(questionData);
    
    if (!result.success && result.isDuplicate) {
      setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
      setModalStatus('info');
      setIsModalOpen(true);
      setAddToBank(false); // Desactivar el switch automáticamente
    }
  };

  // Actualizar pregunta en el banco cuando cambian los datos pero sigue activado el switch
  useEffect(() => {
    if (addToBank && canActivateSwitches) {
      // Importante: No actualizar al cambiar addToBank para evitar ciclos
      const questionData = {
        title: title.trim(),
        questionType: selectedQuestionType
      };
      
      // Solo actualizar si no es un duplicado
      if (!isSimilarQuestionInBank(questionData)) {
        saveCurrentQuestionToBank();
      }
    }
  }, [title, selectedQuestionType, selectedSection, description]);

  // Resetear el formulario
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedQuestionType(null);
    setSelectedSection(null);
    setMandatory(false);
    setAddToBank(false);
    setIsParentQuestion(false);
    localStorage.removeItem("selectedOptionId");
    saveSelectedSection(null);
  };

  // Importar pregunta desde el banco
  const importQuestionFromBank = (question) => {
    if (!question) return;
    
    setTitle(question.title || '');
    setDescription(question.description || '');
    setSelectedQuestionType(question.questionType || null);
    
    if (question.section) {
      setSelectedSection(question.section);
      saveSelectedSection(question.section.id);
    }
    
    setMandatory(question.mandatory || false);
    setIsParentQuestion(question.isParentQuestion || false);
    setAddToBank(false); // Por defecto, NO activamos el switch de añadir al banco
  };

  // Función para alternar colapso
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // --- Handlers ---

  // Seleccionar tipo de pregunta
  const handleQuestionTypeSelect = (typeId) => {
    setSelectedQuestionType(typeId);
    localStorage.setItem("selectedOptionId", typeId);
  };

  // Seleccionar sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    saveSelectedSection(section ? section.id : null);
  };

  // Cambiar título
  const handleTitleChange = (e) => {
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);
    }
  };

  // Cambiar descripción
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  // Manejar el botón de importar/resetear
  const handleImportOrReset = () => {
    if (hasChanges) {
      resetForm();
    } else {
      setIsBankDropdownOpen(true);
    }
  };

  // Manejar selección de pregunta desde el banco
  const handleBankQuestionSelect = (question) => {
    importQuestionFromBank(question);
  };

  // Agregar pregunta hija
  const handleAddChildQuestion = () => {
    if (!selectedQuestionType) {
      setErrorMessage('Debe seleccionar un tipo de respuesta antes de agregar una pregunta hija.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }
    if (!title.trim()) {
      setErrorMessage('Debe ingresar un título para la pregunta antes de agregar una pregunta hija.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }
    if (!selectedSection) {
      setErrorMessage('Debe seleccionar una sección para la pregunta antes de agregar una pregunta hija.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }
    if (onAddChildQuestion) {
      onAddChildQuestion({ /* ... datos ... */ });
    }
  };

  // Enviar formulario
  const handleSubmit = async () => {
    // Validación de datos
    if (!title.trim() || !isDescriptionNotEmpty(description)) {
      setErrorMessage('El título y la descripción son requeridos.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }
    if (!selectedQuestionType) {
      setErrorMessage('Debe seleccionar un tipo de respuesta.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }
    if (!selectedSection) {
      setErrorMessage('Debe seleccionar una sección para la pregunta.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }

    // Sanitización
    const sanitizedTitle = DOMPurify.sanitize(title.trim());
    const cleanDescription = isDescriptionNotEmpty(description) ? DOMPurify.sanitize(description) : '';
    if (!cleanDescription) {
      setErrorMessage('La descripción no puede estar vacía.');
      setModalStatus('error'); setIsModalOpen(true); return;
    }

    // Si está marcado para añadir al banco, guardar en el banco
    if (addToBank) {
      saveCurrentQuestionToBank();
    }

    // Preparar datos para enviar
    const formData = {
      title: sanitizedTitle,
      descrip: cleanDescription,
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: 0,
      bank: addToBank,
      type_questions_id: selectedQuestionType,
      section_id: selectedSection.id,
      questions_conditions: isParentQuestion,
      creator_id: 1,
    };

    // Lógica de envío
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      localStorage.setItem('questions_id', DOMPurify.sanitize(String(responseData.id)));

      resetForm();

      setErrorMessage('Pregunta agregada correctamente.');
      setModalStatus('success');
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setErrorMessage(`Error al guardar la pregunta: ${error.message}. Intente nuevamente.`);
      setModalStatus('error');
      setIsModalOpen(true);
    }
  };

  // Exponer funciones al padre
  useImperativeHandle(ref, () => ({
    submitQuestionForm: handleSubmit,
    addQuestion: handleSubmit
  }));

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Renderizar vista previa
  const renderQuestionPreview = () => {
    if (!selectedQuestionType) return null;
    switch (selectedQuestionType) {
      case 1: return <OpenAnswerPreview />;
      case 2: return <NumericAnswerPreview />;
      case 3: return <SingleChoicePreview />;
      case 4: return <MultipleChoicePreview />;
      case 5: return <TrueFalsePreview />;
      case 6: return <DatePreview />;
      default: return null;
    }
  };

  // --- Renderizado JSX ---
  const questionTypes = [
    { id: 1, name: 'Respuesta Abierta', icon: openAnswer },
    { id: 2, name: 'Numérica', icon: number },
    { id: 3, name: 'Opción Única', icon: selectCircle },
    { id: 4, name: 'Opción Multiple', icon: multipleOption },
    { id: 5, name: 'Falso / Verdadero', icon: trueFalse },
    { id: 6, name: 'Fecha', icon: calendarIcon }
  ];

  return (
    <>
      {/* Contenedor Principal del Formulario */}
      <div className={`flex flex-col gap-4 ${isCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={isCollapsed ? { minHeight: '70px' } : {}}>

        {/* Cabecera: Título, Botón Importar/Reset, Botón Colapsar */}
        <div className={`flex items-center ${isCollapsed ? 'mb-0' : 'mb-4'}`}>
          {/* Input Título */}
          <div className="w-2/3 relative pr-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Titulo de Pregunta"
              maxLength={50}
              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${isCollapsed ? 'py-1' : 'pb-1'} ${(!isCollapsed || (isCollapsed && title.trim() === '')) ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
            />
            {!isCollapsed && (
              <div className="absolute right-4 bottom-1 text-xs text-gray-500">
                {title.length}/50
              </div>
            )}
          </div>

          {/* Botones de la derecha */}
          <div className="w-1/3 flex items-center justify-end gap-3">
            {/* Botón Importar / Volver a empezar */}
            {!isCollapsed && (
              <button
                ref={bankButtonRef}
                className="flex items-center bg-blue-custom rounded-full overflow-hidden transition-all duration-300 hover:shadow-md"
                onClick={handleImportOrReset}
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center">
                  <img
                    src={hasChanges ? RefreshIcon : Down}
                    alt={hasChanges ? "Resetear" : "Importar"}
                    className="w-5 h-5"
                  />
                </span>
                <span className="bg-yellow-custom px-4 py-1">
                  <span className="font-work-sans text-sm font-semibold text-blue-custom whitespace-nowrap">
                    {hasChanges
                      ? "Volver a empezar"
                      : "Importar desde el Banco"
                    }
                  </span>
                </span>
              </button>
            )}

            {/* Botón Colapsar/Expandir */}
            <div className="rounded-full flex items-center">
              <button
                onClick={toggleCollapse}
                className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                aria-label={isCollapsed ? "Expandir formulario" : "Colapsar formulario"}
              >
                <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido Colapsable */}
        {!isCollapsed && (
          <>
            {/* Sección: Tipo de pregunta */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Tipo de pregunta</h2>
              <p className="font-work-sans text-gray-600 text-sm mb-3">
                Selecciona el tipo de pregunta que estás creando, ten en cuenta la información que esperas recolectar del encuestado.
              </p>
              <div className="flex flex-wrap gap-2">
                {questionTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleQuestionTypeSelect(type.id)}
                    className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors duration-200
                      ${selectedQuestionType === type.id
                        ? 'bg-green-custom text-white border-green-500 shadow-sm'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
                  >
                    <img
                      src={type.icon}
                      alt={type.name}
                      className="w-5 h-5"
                      style={selectedQuestionType === type.id ? { filter: 'brightness(0) invert(1)' } : {}}
                    />
                    <span className="font-semibold">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sección: Selector de Sección */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Seccion</h2>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona la sección a la que pertenece la pregunta
              </p>
              <SectionSelector
                onSectionSelect={handleSectionSelect}
                initialSelectedSection={selectedSection}
                key={selectedSection ? `section-${selectedSection.id}` : 'no-section-selected'}
              />
            </div>

            {/* Sección: Descripción de la Pregunta */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción de la Pregunta</h2>
              <RichTextEditor value={description} onChange={handleDescriptionChange} />
            </div>

            {/* Sección: Opciones adicionales (Switches) */}
            <div className="text-base md:text-lg flex flex-col md:flex-row justify-between gap-4 py-2 font-work-sans">
              <SwitchOption 
                value={isParentQuestion}
                onChange={() => setIsParentQuestion(!isParentQuestion)}
                label="Convertir en pregunta madre"
                disabled={!canActivateSwitches}
              />
              <SwitchOption 
                value={mandatory}
                onChange={() => setMandatory(!mandatory)}
                label="¿Esta pregunta es obligatoria?"
                disabled={!canActivateSwitches}
              />
              <SwitchOption 
                value={addToBank}
                onChange={handleBankSwitchChange}
                label="Añadir esta pregunta al banco de preguntas"
                disabled={!canActivateSwitches}
              />
            </div>

            {/* Sección: Vista Previa */}
            {renderQuestionPreview()}
          </>
        )}

        {/* Modal para mensajes */}
        <Modal
          isOpen={isModalOpen}
          title={modalStatus === 'error' ? "Error" : modalStatus === 'info' ? "Información" : "Éxito"}
          message={DOMPurify.sanitize(errorMessage)}
          onConfirm={closeModal}
          onCancel={closeModal}
          type="informative"
          status={modalStatus}
          confirmText="Cerrar"
        />
        
        {/* Dropdown del Banco de Preguntas */}
        <BankQuestionsDropdown
          isOpen={isBankDropdownOpen}
          onOpenChange={setIsBankDropdownOpen}
          onQuestionSelect={handleBankQuestionSelect}
          onCancel={() => setIsBankDropdownOpen(false)}
          anchorRef={bankButtonRef}
        />
      </div>

      {/* Botón: Agregar pregunta hija */}
      {isParentQuestion && !isCollapsed && (
        <div className="mt-4 flex justify-end">
          <button
            className="w-5/6 py-3 bg-yellow-custom rounded-xl flex items-center justify-start pl-6 gap-2 hover:bg-yellow-400 transition-colors relative shadow-sm hover:shadow-md"
            onClick={handleAddChildQuestion}
          >
            <span className="font-work-sans text-xl font-bold text-blue-custom">Agregar pregunta hija</span>
            <div className="absolute right-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-custom">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Botón: Agregar pregunta */}
      {!isCollapsed && (
        <div className="mt-4">
          <button
            className="w-full py-3 bg-yellow-custom rounded-xl flex items-center justify-start pl-6 gap-2 hover:bg-yellow-400 transition-colors relative shadow-sm hover:shadow-md"
            onClick={handleSubmit}
          >
            <span className="font-work-sans text-xl font-bold text-blue-custom">Agregar pregunta</span>
            <div className="absolute right-4">
              <img src={AddCategory1} alt="Agregar" className="w-8 h-8" />
            </div>
          </button>
        </div>
      )}
    </>
  );
});

export default QuestionsForm;