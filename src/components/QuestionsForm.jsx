import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import InputSlide from './InputSlide.jsx';
import Modal from './Modal';
import SectionSelector from './SectionSelector';
import ChildQuestionForm from './ChildQuestionForm';
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

// Definición de tipos de preguntas para reutilización
const questionTypes = [
  { id: 1, name: 'Respuesta Abierta', icon: openAnswer },
  { id: 2, name: 'Numérica', icon: number },
  { id: 3, name: 'Opción Única', icon: selectCircle },
  { id: 4, name: 'Opción Multiple', icon: multipleOption },
  { id: 5, name: 'Falso / Verdadero', icon: trueFalse },
  { id: 6, name: 'Fecha', icon: calendarIcon }
];

// Función auxiliar para obtener el nombre del tipo de pregunta
const getQuestionTypeName = (typeId) => {
  const type = questionTypes.find(t => t.id === typeId);
  return type ? type.name : 'Desconocido';
};

// Componente para mostrar y editar preguntas guardadas
const SavedQuestionForm = ({ form, onToggleCollapse, onUpdate, onAddChildQuestion, onDeleteForm }) => {
  const [isEditing, setIsEditing] = useState(!form.isCollapsed);
  const [title, setTitle] = useState(form.title || '');
  const [description, setDescription] = useState(form.description || '');
  const [selectedQuestionType, setSelectedQuestionType] = useState(form.questionType);
  const [selectedSection, setSelectedSection] = useState(form.section);
  const [mandatory, setMandatory] = useState(form.mandatory || false);
  const [isParentQuestion, setIsParentQuestion] = useState(form.isParentQuestion || false);
  const [addToBank, setAddToBank] = useState(form.addToBank || false);
  const [showChildForm, setShowChildForm] = useState(false);
  const [childForms, setChildForms] = useState(form.childForms || []);
  const [childFormCompleted, setChildFormCompleted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('default');
  const childFormRefs = useRef({});
  const bankButtonRef = useRef(null);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  // Efecto para sincronizar el estado cuando cambia form
  useEffect(() => {
    setTitle(form.title || '');
    setDescription(form.description || '');
    setSelectedQuestionType(form.questionType);
    setSelectedSection(form.section);
    setMandatory(form.mandatory || false);
    setIsParentQuestion(form.isParentQuestion || false);
    setAddToBank(form.addToBank || false);
    setChildForms(form.childForms || []);
  }, [form]);

  // Efecto para sincronizar isEditing con el estado de colapso
  useEffect(() => {
    setIsEditing(!form.isCollapsed);
  }, [form.isCollapsed]);

  // Efecto para manejar cambios en isParentQuestion
  useEffect(() => {
    // Si isParentQuestion cambia a false, asegurar que se oculte el formulario hijo
    if (!isParentQuestion) {
      setShowChildForm(false);
      setChildForms([]);
      setChildFormCompleted(true);
    }
  }, [isParentQuestion]);

  // Verificar si la descripción tiene contenido visible
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

  // Determina si se pueden activar los switches
  const canActivateSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null &&
    selectedSection !== null &&
    isDescriptionNotEmpty(description);

  // Guardar cambios en el formulario
  const saveChanges = () => {
    const updatedForm = {
      ...form,
      title,
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory,
      isParentQuestion,
      addToBank,
      childForms,
    };

    onUpdate(form.id, updatedForm);
  };

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
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory,
      isParentQuestion
    };

    const result = addQuestionToBank(questionData);

    if (!result.success && result.isDuplicate) {
      setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
      setModalStatus('info');
      setIsModalOpen(true);
      setAddToBank(false); // Desactivar el switch automáticamente
    }
  };

  // Manejar selección de pregunta desde el banco
  const handleBankQuestionSelect = (question) => {
    if (!question) return;

    setTitle(question.title || '');
    setDescription(question.description || '');
    setSelectedQuestionType(question.questionType || null);

    if (question.section) {
      setSelectedSection(question.section);
    }

    setMandatory(question.mandatory || false);
    setIsParentQuestion(question.isParentQuestion || false);
    setAddToBank(false); // Por defecto, NO activamos el switch de añadir al banco

    // Guardar cambios
    saveChanges();
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

    // Crear datos para la pregunta hija
    // Crear datos para la pregunta hija
    let parentId = form.id;
    // Si existe un ID numérico en serverId, usarlo
    if (form.serverId) {
      parentId = Number(form.serverId); // Asegurarse de que sea número
    }
    // Si el ID parece ser un ID del servidor (es numérico), usarlo directamente
    else if (!isNaN(Number(parentId))) {
      parentId = Number(parentId);
    }

    console.log('ID de la pregunta padre que se usará:', parentId);

    const parentQuestionData = {
      id: parentId,
      serverId: form.serverId, // Incluir serverId si existe
      title: title,
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory
    };

    // Crear ID único para el formulario hijo
    const childFormId = `child_${Date.now()}`;

    // Añadir nuevo formulario hijo
    const newChildForm = {
      id: childFormId,
      parentData: parentQuestionData,
      completed: false,
      isCollapsed: false
    };

    setChildForms(prevForms => [...prevForms, newChildForm]);
    setShowChildForm(true);
    setChildFormCompleted(false);

    // Si hay una función externa para manejar esto
    if (onAddChildQuestion) {
      onAddChildQuestion(form.id, newChildForm);
    }
  };

  // Manejar guardado de pregunta hija
  const handleSaveChildQuestion = (childData, formId) => {
    setChildForms(prevForms =>
      prevForms.map(form =>
        form.id === formId ? { ...form, completed: true, data: childData } : form
      )
    );

    setChildFormCompleted(true);
    saveChanges(); // Guardar los cambios en el formulario principal

    // Mostrar mensaje de éxito
    setErrorMessage('Pregunta hija agregada correctamente.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  // Cancelar pregunta hija
  const handleCancelChildQuestion = (formId) => {
    setChildForms(prevForms => prevForms.filter(form => form.id !== formId));

    const remainingForms = childForms.filter(form => form.id !== formId);
    setShowChildForm(remainingForms.length > 0);

    const hasCompletedForms = remainingForms.some(form => form.completed);
    setChildFormCompleted(hasCompletedForms);
  };

  // Toggle para expandir/contraer formulario
  const handleToggleCollapse = () => {
    // Guardar cambios si se está contrayendo
    if (!form.isCollapsed) {
      saveChanges();
    }

    onToggleCollapse(form.id);
  };

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Cambiar estado de pregunta madre
  const handleParentQuestionChange = () => {
    const newValue = !isParentQuestion;
    setIsParentQuestion(newValue);

    if (!newValue) {
      setShowChildForm(false);
      setChildForms([]);
      setChildFormCompleted(false);
    }
  };

  return (
    <div className="mb-6">
      <div className={`flex flex-col gap-4 ${form.isCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={form.isCollapsed ? { minHeight: '70px' } : {}}>
        {/* Cabecera con título */}
        <div className="flex items-center">
          <div className="w-2/3 relative pr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => isEditing && setTitle(e.target.value)}
              placeholder="Titulo de Pregunta"
              maxLength={50}
              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${form.isCollapsed ? 'py-1' : 'pb-1'} ${isEditing ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
              readOnly={!isEditing}
            />
            {!form.isCollapsed && (
              <div className="absolute right-4 bottom-1 text-xs text-gray-500">
                {title.length}/50
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="w-1/3 flex items-center justify-end gap-3">
            {/* Botón para eliminar */}
            <button
              className="focus:outline-none hover:opacity-80"
              onClick={() => onDeleteForm && onDeleteForm(form.id)}
              aria-label="Eliminar pregunta"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF0000" />
              </svg>
            </button>

            {/* Botón Importar / Banco */}
            {!form.isCollapsed && (
              <button
                ref={bankButtonRef}
                className="flex items-center bg-blue-custom rounded-full overflow-hidden transition-all duration-300 hover:shadow-md"
                onClick={() => setIsBankDropdownOpen(true)}
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center">
                  <img
                    src={Down}
                    alt="Importar"
                    className="w-5 h-5"
                  />
                </span>
                <span className="bg-yellow-custom px-4 py-1">
                  <span className="font-work-sans text-sm font-semibold text-blue-custom whitespace-nowrap">
                    Importar desde el Banco
                  </span>
                </span>
              </button>
            )}

            {/* Botón Colapsar/Expandir */}
            <div className="rounded-full flex items-center">
              <button
                onClick={handleToggleCollapse}
                className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
                style={{ transform: form.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                aria-label={form.isCollapsed ? "Expandir formulario" : "Colapsar formulario"}
              >
                <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido expandido editable */}
        {!form.isCollapsed && (
          <>
            {/* Tipo de pregunta */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Tipo de pregunta</h2>
              <p className="font-work-sans text-gray-600 text-sm mb-3">
                Selecciona el tipo de pregunta que estás creando, ten en cuenta la información que esperas recolectar del encuestado.
              </p>
              <div className="flex flex-wrap gap-2">
                {questionTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => isEditing && setSelectedQuestionType(type.id)}
                    className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors duration-200
                      ${selectedQuestionType === type.id
                        ? 'bg-green-custom text-white border-green-500 shadow-sm'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
                    disabled={!isEditing}
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

            {/* Sección */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Seccion</h2>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona la sección a la que pertenece la pregunta
              </p>
              <SectionSelector
                onSectionSelect={isEditing ? (section) => setSelectedSection(section) : null}
                initialSelectedSection={selectedSection}
                key={selectedSection ? `section-${selectedSection.id}` : 'no-section-selected'}
                disabled={!isEditing}
              />
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción de la Pregunta</h2>
              {isEditing ? (
                <RichTextEditor
                  value={description}
                  onChange={(value) => setDescription(value)}
                  readOnly={!isEditing}
                />
              ) : (
                <div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
              )}
            </div>

            {/* Opciones adicionales (Switches) */}
            <div className="text-base md:text-lg flex flex-col md:flex-row justify-between gap-4 py-2 font-work-sans">
              <SwitchOption
                value={isParentQuestion}
                onChange={isEditing ? handleParentQuestionChange : null}
                label="Convertir en pregunta madre"
                disabled={!canActivateSwitches || !isEditing}
              />
              <SwitchOption
                value={mandatory}
                onChange={isEditing ? () => setMandatory(!mandatory) : null}
                label="¿Esta pregunta es obligatoria?"
                disabled={!canActivateSwitches || !isEditing}
              />
              <SwitchOption
                value={addToBank}
                onChange={isEditing ? handleBankSwitchChange : null}
                label="Añadir esta pregunta al banco de preguntas"
                disabled={!canActivateSwitches || !isEditing}
              />
            </div>
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

      {/* Botón: Agregar pregunta hija (si es pregunta madre y está expandida) */}
      {isParentQuestion && !form.isCollapsed && (
        <div className="mt-4 flex justify-end">
          <button
            className={`w-5/6 py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${childFormCompleted || childForms.length === 0
              ? "bg-yellow-custom hover:bg-yellow-400"
              : "bg-gray-200 cursor-not-allowed"
              }`}
            onClick={handleAddChildQuestion}
            disabled={!childFormCompleted && childForms.length > 0}
          >
            <span className={`font-work-sans text-xl font-bold ${childFormCompleted || childForms.length === 0 ? "text-blue-custom" : "text-gray-500"
              }`}>Agregar pregunta hija</span>
            <div className="absolute right-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                className={`${childFormCompleted || childForms.length === 0 ? "text-blue-custom" : "text-gray-400"}`}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Formularios de preguntas hijas */}
      {isParentQuestion && (childForms.length > 0 || showChildForm) && (
        <div className="mt-4 pl-16">
          {childForms.map((childForm) => (
            <div key={childForm.id} className="mb-4">
              {childForm.completed ? (
                // Pregunta hija guardada - versión simple para visualización
                <div className={`flex flex-col gap-4 ${childForm.isCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={childForm.isCollapsed ? { minHeight: '70px' } : {}}>
                  <div className="flex items-center">
                    <div className="w-2/3 relative pr-4">
                      <input
                        type="text"
                        value={childForm.data?.title || "Pregunta hija"}
                        readOnly
                        className="font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent py-1 border-b-2 border-transparent"
                      />
                    </div>
                    <div className="w-1/3 flex items-center justify-end gap-3">
                      <div className="rounded-full flex items-center">
                        <button
                          onClick={() => {
                            setChildForms(prevForms =>
                              prevForms.map(f =>
                                f.id === childForm.id ? { ...f, isCollapsed: !f.isCollapsed } : f
                              )
                            );
                          }}
                          className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
                          style={{ transform: childForm.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          aria-label={childForm.isCollapsed ? "Expandir formulario" : "Colapsar formulario"}
                        >
                          <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mostrar detalles de la pregunta hija cuando está expandida */}
                  {!childForm.isCollapsed && (
                    <>
                      <div className="mb-4">
                        <h2 className="font-work-sans text-xl font-bold text-dark-blue-custom mb-1">Tipo de pregunta</h2>
                        <p className="text-gray-600 text-sm">
                          {getQuestionTypeName(childForm.data?.questionType)}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h2 className="font-work-sans text-xl font-bold text-dark-blue-custom mb-1">Descripción</h2>
                        <div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(childForm.data?.description || '') }} />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Formulario de pregunta hija en edición
                <ChildQuestionForm
                  ref={(el) => { childFormRefs.current[childForm.id] = el; }}
                  formId={childForm.id}
                  parentQuestionData={childForm.parentData}
                  onSave={handleSaveChildQuestion}
                  onCancel={() => handleCancelChildQuestion(childForm.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente SwitchOption
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

// Componente Principal actualizado
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

  // Estado para el dropdown del banco de preguntas
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);

  // Estado para preguntas hijas
  const [showChildForm, setShowChildForm] = useState(false);
  const [childForms, setChildForms] = useState([]);
  const [childFormCompleted, setChildFormCompleted] = useState(false);
  const [parentData, setParentData] = useState(null);

  // Nuevo estado para formularios guardados
  const [savedForms, setSavedForms] = useState([]);
  const [formKey, setFormKey] = useState(`form_${Date.now()}`);

  // Referencias
  const bankButtonRef = useRef(null);
  const childFormRefs = useRef({});

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

    // Listeners para cambios
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

    const handleSectionRemoved = (event) => {
      setAvailableSections(event.detail.updatedSections);
      if (selectedSection && selectedSection.id === event.detail.id) {
        setSelectedSection(null);
        saveSelectedSection(null);
      }
    };
    window.addEventListener('sectionRemoved', handleSectionRemoved);

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

  // Efecto para manejar cambios en isParentQuestion
  useEffect(() => {
    if (!isParentQuestion) {
      setShowChildForm(false);
      setParentData(null);
      setChildForms([]);
      setChildFormCompleted(false);
    }
  }, [isParentQuestion]);

  // --- Funciones Auxiliares ---

  // Verificar contenido de descripción
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

  // Verificar cambios
  const hasChanges =
    selectedQuestionType !== null ||
    selectedSection !== null ||
    title.trim() !== '' ||
    isDescriptionNotEmpty(description);

  // Determinar si se pueden activar switches
  const canActivateSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null &&
    selectedSection !== null &&
    isDescriptionNotEmpty(description);

  // Toggle para expandir/contraer un formulario guardado
  const toggleSavedFormCollapse = (formId) => {
    setSavedForms(prevForms =>
      prevForms.map(form =>
        form.id === formId
          ? { ...form, isCollapsed: !form.isCollapsed }
          : form
      )
    );
  };

  // Actualizar un formulario guardado
  const updateSavedForm = (formId, updatedForm) => {
    setSavedForms(prevForms =>
      prevForms.map(form =>
        form.id === formId ? { ...updatedForm } : form
      )
    );
  };

  // Manejar la adición de preguntas hijas a formularios guardados
  const handleAddChildToSavedForm = (formId, childForm) => {
    setSavedForms(prevForms =>
      prevForms.map(form =>
        form.id === formId
          ? {
            ...form,
            childForms: [...(form.childForms || []), childForm],
            isParentQuestion: true
          }
          : form
      )
    );
  };

  // Eliminar un formulario guardado
  const handleDeleteSavedForm = (formId) => {
    setSavedForms(prevForms => prevForms.filter(form => form.id !== formId));
  };

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
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory,
      isParentQuestion
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
    setShowChildForm(false);
    setChildForms([]);
    setChildFormCompleted(false);
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

    // Generar un ID temporal para esta pregunta (si no está guardada aún)
    const parentId = localStorage.getItem('questions_id') || `temp_${Date.now()}`;

    // Crear un objeto con los datos de la pregunta padre
    const parentQuestionData = {
      id: parentId,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory
    };

    // Crear un nuevo ID único para este formulario hijo
    const childFormId = `child_${Date.now()}`;

    // Añadir un nuevo formulario hijo al array
    setChildForms(prevForms => [
      ...prevForms,
      { id: childFormId, parentData: parentQuestionData, completed: false }
    ]);

    // Mostrar el formulario hijo
    setShowChildForm(true);

    // Desactivar el botón hasta que se complete este formulario
    setChildFormCompleted(false);

    // Guardar los datos del padre para referencia
    setParentData(parentQuestionData);

    // Notificar al componente padre si es necesario
    if (onAddChildQuestion) {
      onAddChildQuestion(parentQuestionData);
    }
  };

  // Manejar cuando se guarda la pregunta hija
  const handleSaveChildQuestion = (childData, formId) => {
    console.log('Pregunta hija guardada:', childData);

    // Marcar este formulario como completado
    setChildForms(prevForms =>
      prevForms.map(form =>
        form.id === formId ? { ...form, completed: true, data: childData } : form
      )
    );

    // Activar el botón para permitir agregar otra pregunta hija
    setChildFormCompleted(true);

    // Mostrar mensaje de éxito
    setErrorMessage('Pregunta hija agregada correctamente.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  // Cancelar la creación de la pregunta hija
  const handleCancelChildQuestion = (formId) => {
    if (formId) {
      // Eliminar solo este formulario específico
      setChildForms(prevForms => prevForms.filter(form => form.id !== formId));

      // Si no quedan formularios, ocultar la sección
      setShowChildForm(prevState => {
        const remainingForms = childForms.filter(form => form.id !== formId);
        return remainingForms.length > 0;
      });
    } else {
      // Comportamiento anterior (eliminar todos)
      setShowChildForm(false);
      setChildForms([]);
    }

    // Verificar si hay algún formulario completado para habilitar el botón
    const hasCompletedForms = childForms.some(form => form.completed && form.id !== formId);
    setChildFormCompleted(hasCompletedForms);
  };

  // Enviar formulario - Modificado para guardar en lugar de resetear
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
      const serverId = responseData.id;
      localStorage.setItem('questions_id', DOMPurify.sanitize(String(serverId)));

      // En lugar de resetear, guardar este formulario como completado
      const currentFormData = {
        id: formKey,
        serverId: Number(serverId), // Guardar el ID devuelto por el servidor como número
        title: sanitizedTitle,
        description: cleanDescription,
        questionType: selectedQuestionType,
        section: selectedSection,
        mandatory: mandatory,
        isParentQuestion: isParentQuestion,
        addToBank: addToBank,
        isCollapsed: true, // Contraer el formulario guardado
        childForms: childForms.map(child => ({
          ...child,
          isCollapsed: true,
          title: child.data?.title || "Pregunta hija"
        }))
      };

      // Guardar la pregunta actual en la lista de formularios guardados
      setSavedForms(prevForms => [...prevForms, currentFormData]);

      // Crear un nuevo formulario (resetear el actual)
      resetForm();

      // Generar una nueva clave para el próximo formulario
      setFormKey(`form_${Date.now()}`);

      // Mostrar mensaje de éxito
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
  return (
    <>
      {/* Renderizar formularios guardados */}
      {savedForms.map(form => (
        <SavedQuestionForm
          key={form.id}
          form={form}
          onToggleCollapse={toggleSavedFormCollapse}
          onUpdate={updateSavedForm}
          onAddChildQuestion={handleAddChildToSavedForm}
          onDeleteForm={handleDeleteSavedForm}
        />
      ))}

      {/* Contenedor Principal del Formulario Actual */}
      <div className={`flex flex-col gap-4 ${isCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out mb-6`} style={isCollapsed ? { minHeight: '70px' } : {}}>

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
                onChange={() => {
                  // Al cambiar el estado de isParentQuestion
                  const newValue = !isParentQuestion;
                  setIsParentQuestion(newValue);

                  // Si se está desactivando, también ocultar el formulario hijo y resetear el estado
                  if (!newValue) {
                    setShowChildForm(false);
                    setParentData(null);
                    setChildForms([]);
                    setChildFormCompleted(false);
                  }
                }}
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

      {/* Botón: Agregar pregunta hija (solo se muestra si es pregunta madre y no está colapsado) */}
      {isParentQuestion && !isCollapsed && (
        <div className="mt-4 flex justify-end mb-6">
          <button
            className={`w-5/6 py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${childFormCompleted || childForms.length === 0
              ? "bg-yellow-custom hover:bg-yellow-400"
              : "bg-gray-200 cursor-not-allowed"
              }`}
            onClick={handleAddChildQuestion}
            disabled={!childFormCompleted && childForms.length > 0}
          >
            <span className={`font-work-sans text-xl font-bold ${childFormCompleted || childForms.length === 0 ? "text-blue-custom" : "text-gray-500"
              }`}>Agregar pregunta hija</span>
            <div className="absolute right-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                className={`${childFormCompleted || childForms.length === 0 ? "text-blue-custom" : "text-gray-400"}`}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Formularios de preguntas hijas */}
      {showChildForm && (
        <div className="mt-4 mb-6">
          {/* Renderizar todos los formularios de preguntas hijas */}
          {childForms.map((formData) => (
            <div key={formData.id} className="animate-fadeIn mb-4">
              <ChildQuestionForm
                ref={(el) => { childFormRefs.current[formData.id] = el; }}
                formId={formData.id}
                parentQuestionData={formData.parentData}
                onSave={handleSaveChildQuestion}
                onCancel={() => handleCancelChildQuestion(formData.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Botón: Agregar pregunta (siempre visible) */}
      <div className="mt-4">
        <button
          className={`w-full py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${canActivateSwitches
            ? "bg-yellow-custom hover:bg-yellow-400"
            : "bg-gray-200 cursor-not-allowed"
            }`}
          onClick={handleSubmit}
          disabled={!canActivateSwitches}
        >
          <span className={`font-work-sans text-xl font-bold ${canActivateSwitches ? "text-blue-custom" : "text-gray-500"
            }`}>Agregar pregunta</span>
          <div className="absolute right-4">
            <img src={AddCategory1} alt="Agregar" className={`w-8 h-8 ${!canActivateSwitches ? "opacity-50" : ""}`} />
          </div>
        </button>
      </div>
    </>
  );
});

export default QuestionsForm;