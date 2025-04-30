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

// Función mejorada para verificar si la descripción tiene contenido visible
const isDescriptionNotEmpty = (htmlString) => {
  if (!htmlString) return false;
  if (/<img[^>]+>|<iframe[^>]+>/.test(htmlString)) return true;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const textContent = (tempDiv.textContent || tempDiv.innerText || "").trim();
  const cleanHtml = htmlString.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '').trim();
  if (textContent === '' && cleanHtml === '') return false;
  if (textContent === '' && cleanHtml !== '' && !/<(?!br|p|\s|\/)[^>]+>/i.test(cleanHtml)) return true;
  return textContent.length > 0 || cleanHtml.length > 0;
};

// Componente para mostrar y editar preguntas guardadas
const SavedQuestionForm = ({ 
  form, 
  onToggleCollapse, 
  onUpdate, 
  onAddChildQuestion, 
  onDeleteForm,
  onUpdateChildInSavedForm,
  onRemoveChildFromSavedForm
}) => {
  const [isEditing, setIsEditing] = useState(!form.isCollapsed);
  const [title, setTitle] = useState(form.title || '');
  const [description, setDescription] = useState(form.description || '');
  const [selectedQuestionType, setSelectedQuestionType] = useState(form.questionType);
  const [selectedSection, setSelectedSection] = useState(form.section);
  const [mandatory, setMandatory] = useState(form.mandatory || false);
  const [isParentQuestionState, setIsParentQuestionState] = useState(form.isParentQuestion || false);
  const [addToBank, setAddToBank] = useState(form.addToBank || false);
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
    setIsParentQuestionState(form.isParentQuestion || false);
    setAddToBank(form.addToBank || false);
  }, [form]);

  // Efecto para sincronizar isEditing con el estado de colapso
  useEffect(() => {
    setIsEditing(!form.isCollapsed);
  }, [form.isCollapsed]);

  // Determina si se pueden activar los switches
  const canActivateSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null &&
    selectedSection !== null &&
    isDescriptionNotEmpty(description);

  // Guardar cambios en el formulario
  const saveParentChanges = () => {
    const updatedParentData = {
      ...form,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory,
      isParentQuestion: isParentQuestionState,
      addToBank,
    };
    
    onUpdate(form.id, updatedParentData);
    console.log("SavedQuestionForm: Notificando actualización de datos del padre:", updatedParentData);
  };

  // Maneja la activación/desactivación del switch para el banco
  const handleBankSwitchChange = () => {
    if (!canActivateSwitches || !isEditing) return;
    
    const newAddToBank = !addToBank;
    setAddToBank(newAddToBank);
    
    const questionDataForBank = { 
      title: title.trim(), 
      questionType: selectedQuestionType 
    };
    
    if (newAddToBank) {
      if (isSimilarQuestionInBank(questionDataForBank)) {
        setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
        setModalStatus('info'); 
        setIsModalOpen(true); 
        setAddToBank(false); 
        return;
      }
      saveCurrentQuestionToBank();
    } else {
      removeSimilarQuestionFromBank(questionDataForBank);
    }
  };

  // Guardar la pregunta actual en el banco
  const saveCurrentQuestionToBank = () => {
    if (!canActivateSwitches) return;

    const questionId = form.serverId || form.id || Date.now();
    const questionData = {
      id: questionId,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory,
      isParentQuestion: isParentQuestionState
    };

    const result = addQuestionToBank(questionData);

    if (!result.success && result.isDuplicate) {
      setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
      setModalStatus('info');
      setIsModalOpen(true);
      setAddToBank(false);
    }
  };

  // Manejar selección de pregunta desde el banco
  const handleBankQuestionSelect = (question) => {
    if (!question || !isEditing) return;

    setTitle(question.title || '');
    setDescription(question.description || '');
    setSelectedQuestionType(question.questionType || null);
    setSelectedSection(question.section || null);
    setMandatory(question.mandatory || false);
    setIsParentQuestionState(question.isParentQuestion || false);
    setAddToBank(false);
    setIsBankDropdownOpen(false);
  };

  // Agregar pregunta hija
  const handleAddChildQuestionClick = () => {
    // Validaciones básicas
    if (!selectedQuestionType) {
      setErrorMessage('Debe seleccionar un tipo de respuesta para la pregunta madre.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Debe ingresar un título para la pregunta madre.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }
    if (!selectedSection) {
      setErrorMessage('Debe seleccionar una sección para la pregunta madre.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    // Si está expandido, guardar cambios pendientes del padre antes de añadir hijo
    if (!form.isCollapsed && isEditing) {
      saveParentChanges();
    }
    
    console.log("SavedQuestionForm: Solicitando añadir hijo al padre con ID:", form.id);
    onAddChildQuestion(form.id);
  };

  const handleSaveChildData = (childId, childData) => {
    console.log("SavedQuestionForm: Recibido guardado del hijo ID:", childId);
    onUpdateChildInSavedForm(form.id, childId, childData);
  };

  const handleCancelChildCreation = (childId) => {
    console.log("SavedQuestionForm: Recibida cancelación del hijo ID:", childId);
    onRemoveChildFromSavedForm(form.id, childId);
  };

  // Toggle para expandir/contraer formulario
  const handleToggleCollapse = () => {
    if (!form.isCollapsed && isEditing) {
      saveParentChanges();
    }
    onToggleCollapse(form.id);
  };

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Cambiar estado de pregunta madre
  const handleParentQuestionChange = () => {
    if (!isEditing || !canActivateSwitches) return;
    setIsParentQuestionState(!isParentQuestionState);
    
    // Si acaba de activar la pregunta como madre, guardamos los cambios
    if (!isParentQuestionState) {
      const updatedForm = {
        ...form,
        isParentQuestion: true, // Asegurarse que el form principal también tiene el flag actualizado
      };
      onUpdate(form.id, updatedForm);
    }
  };

  const childFormsFromProps = form.childForms || [];

  return (
    <div className="mb-6">
      {/* Contenedor principal del formulario guardado */}
      <div className={`flex flex-col gap-4 ${form.isCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={form.isCollapsed ? { minHeight: '70px' } : {}}>
        {/* Cabecera con título */}
        <div className="flex items-center">
          <div className="w-2/3 relative pr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => isEditing && !form.isCollapsed && setTitle(e.target.value)}
              placeholder="Titulo de Pregunta"
              maxLength={50}
              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${form.isCollapsed ? 'py-1' : 'pb-1'} ${isEditing && !form.isCollapsed ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
              readOnly={!isEditing || form.isCollapsed}
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
                className={`flex items-center bg-blue-custom rounded-full overflow-hidden transition-all duration-300 hover:shadow-md ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => isEditing && setIsBankDropdownOpen(true)}
                disabled={!isEditing}
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
                key={selectedSection ? `section-${selectedSection.id}-${form.id}` : `no-section-selected-${form.id}`}
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
                value={isParentQuestionState}
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

      {/* Sección para preguntas hijas y botón agregar */}
      {isParentQuestionState && (
        <div className="mt-1 pl-6 pr-4 md:pl-12 md:pr-6 transition-all duration-300 ease-in-out">
          {/* Renderizado de los hijos existentes */}
          {childFormsFromProps.length > 0 && (
            <div className="space-y-2 mt-2">
              {childFormsFromProps.map((childForm) => (
                <div key={childForm.id} className={`transition-all duration-300 ease-in-out rounded-xl overflow-hidden ${form.isCollapsed ? 'bg-white shadow border border-gray-200' : ''}`}>
                  {form.isCollapsed ? (
                    // Vista compacta (padre colapsado)
                    <div className="flex items-center justify-between p-3">
                      <span className="font-work-sans text-sm md:text-base font-semibold text-dark-blue-custom truncate pr-2">
                        {childForm.data?.title || `Pregunta hija #${childForm.id.slice(-4)}`}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Botón Eliminar Hijo (en vista compacta) */}
                        <button
                          className="p-1 text-red-500 hover:text-red-700 focus:outline-none hover:bg-red-100 rounded-full"
                          onClick={() => onRemoveChildFromSavedForm(form.id, childForm.id)}
                          aria-label="Eliminar pregunta hija"
                          title="Eliminar pregunta hija"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF0000" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Vista expandida (padre expandido)
                    <>
                      {childForm.completed ? (
                        // Vista Read-Only Detallada Hijo
                        <div className={`flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm w-full`}>
                          <div className="flex items-center justify-between">
                            <span className="font-work-sans text-lg md:text-xl font-bold text-dark-blue-custom truncate pr-4" title={childForm.data?.title || "Pregunta hija sin título"}>
                              {childForm.data?.title || "Pregunta hija"}
                            </span>
                            {/* Botón Eliminar Hijo Completado */}
                            <button
                              className="p-1 text-red-500 hover:text-red-700 focus:outline-none hover:bg-red-100 rounded-full"
                              onClick={() => onRemoveChildFromSavedForm(form.id, childForm.id)}
                              aria-label="Eliminar pregunta hija completada"
                              title="Eliminar pregunta hija"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF0000" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            Tipo: {getQuestionTypeName(childForm.data?.questionType)}
                          </p>
                          {isDescriptionNotEmpty(childForm.data?.description) && (
                            <div>
                              <p className="text-xs md:text-sm font-semibold text-dark-blue-custom mb-1">Descripción:</p>
                              <div className="text-xs md:text-sm text-gray-700 border p-2 rounded bg-white max-h-24 overflow-y-auto" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(childForm.data?.description || '') }} />
                            </div>
                          )}
                        </div>
                      ) : (
                        // Formulario de edición hijo
                        <ChildQuestionForm
                          ref={(el) => { childFormRefs.current[childForm.id] = el; }}
                          formId={childForm.id}
                          parentQuestionData={childForm.parentData}
                          onSave={(childData) => handleSaveChildData(childForm.id, childData)}
                          onCancel={() => handleCancelChildCreation(childForm.id)}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Botón: Agregar pregunta hija */}
          <div className="mt-3">
            <button
              className={`w-full py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 transition-colors relative shadow-sm hover:shadow-md ${
                ((!form.isCollapsed && childFormsFromProps.every(cf => cf.completed)) || form.isCollapsed)
                  ? "bg-yellow-custom hover:bg-yellow-400"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
              onClick={handleAddChildQuestionClick}
              disabled={!((!form.isCollapsed && childFormsFromProps.every(cf => cf.completed)) || form.isCollapsed)}
              aria-disabled={!((!form.isCollapsed && childFormsFromProps.every(cf => cf.completed)) || form.isCollapsed)}
            >
              <span className={`font-work-sans text-xl font-bold ${((!form.isCollapsed && childFormsFromProps.every(cf => cf.completed)) || form.isCollapsed) ? "text-blue-custom" : "text-gray-500"}`}>
                Agregar pregunta hija
              </span>
              <div className="absolute right-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={`${((!form.isCollapsed && childFormsFromProps.every(cf => cf.completed)) || form.isCollapsed) ? "text-blue-custom" : "text-gray-400"}`}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </button>
          </div>
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
  const [isNewFormCollapsed, setIsNewFormCollapsed] = useState(false);

  // Estado para el dropdown del banco de preguntas
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);

  // Estado para preguntas hijas del nuevo formulario
  const [newChildForms, setNewChildForms] = useState([]);
  const [newChildFormCompleted, setNewChildFormCompleted] = useState(true);

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
      setNewChildForms([]);
      setNewChildFormCompleted(true);
    }
  }, [isParentQuestion]);

  // --- Funciones Auxiliares ---

  // Verificar cambios
  const hasNewFormChanges =
    selectedQuestionType !== null ||
    selectedSection !== null ||
    title.trim() !== '' ||
    isDescriptionNotEmpty(description);

  // Determinar si se pueden activar switches
  const canActivateNewFormSwitches =
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
  const updateSavedForm = (formId, updatedFormData) => {
    console.log("QuestionsForm: Recibida actualización para form ID:", formId);
    setSavedForms(prevForms =>
      prevForms.map(form =>
        form.id === formId ? { ...form, ...updatedFormData } : form
      )
    );
  };

  // Eliminar un formulario guardado
  const handleDeleteSavedForm = (formId) => {
    setSavedForms(prevForms => prevForms.filter(form => form.id !== formId));
    setErrorMessage('Pregunta eliminada.');
    setModalStatus('success');
    setIsModalOpen(true);
  };
  
  // NUEVAS FUNCIONES para manejar preguntas hijas en formularios guardados
  const handleAddNewChildToSavedForm = (parentId) => {
    console.log("QuestionsForm: Añadiendo estructura de hijo para padre ID:", parentId);
    setSavedForms(prevForms =>
      prevForms.map(form => {
        if (form.id === parentId) {
          const childFormId = `child_${Date.now()}`;
          let effectiveParentId = form.serverId && !isNaN(Number(form.serverId)) ? Number(form.serverId) : form.id;
          const parentQuestionData = {
            id: effectiveParentId, 
            serverId: form.serverId, 
            title: form.title, 
            description: form.description,
            questionType: form.questionType, 
            section: form.section, 
            mandatory: form.mandatory
          };
          const newChildForm = {
            id: childFormId, 
            parentData: parentQuestionData, 
            completed: false,
            isCollapsed: false, 
            data: null
          };
          console.log("QuestionsForm: Nueva estructura de hijo creada:", newChildForm);
          return {
            ...form,
            childForms: [...(form.childForms || []), newChildForm],
            isParentQuestion: true,
            isCollapsed: false // Expandir padre para ver el nuevo hijo en edición
          };
        }
        return form;
      })
    );
  };
  
  const handleUpdateChildInSavedForm = (parentId, childId, childData) => {
    console.log("QuestionsForm: Actualizando hijo ID:", childId, "en padre ID:", parentId);
    setSavedForms(prevForms =>
      prevForms.map(form => {
        if (form.id === parentId) {
          const updatedChildForms = (form.childForms || []).map(child => {
            if (child.id === childId) {
              return { ...child, completed: true, data: childData };
            }
            return child;
          });
          return {
            ...form,
            childForms: updatedChildForms,
          };
        }
        return form;
      })
    );
    setErrorMessage('Pregunta hija agregada/actualizada.');
    setModalStatus('success'); 
    setIsModalOpen(true);
  };
  
  const handleRemoveChildFromSavedForm = (parentId, childId) => {
    console.log("QuestionsForm: Eliminando hijo ID:", childId, "de padre ID:", parentId);
    setSavedForms(prevForms =>
      prevForms.map(form => {
        if (form.id === parentId) {
          const updatedChildForms = (form.childForms || []).filter(child => child.id !== childId);
          console.log("QuestionsForm: Hijos restantes:", updatedChildForms);
          return { ...form, childForms: updatedChildForms };
        }
        return form;
      })
    );
    setErrorMessage('Pregunta hija eliminada.');
    setModalStatus('info'); 
    setIsModalOpen(true);
  };

  // Guardar la pregunta actual en el banco (nuevo form)
  const saveCurrentQuestionToBank = () => {
    if (!canActivateNewFormSwitches) return;

    const questionId = Date.now();
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
      setAddToBank(false);
    }
  };

  // Maneja la activación/desactivación del switch para el banco (nuevo form)
  const handleNewFormBankSwitchChange = () => {
    if (!canActivateNewFormSwitches) return;

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

  // Resetear el NUEVO formulario
  const resetNewForm = (generateNewKey = true) => {
    setTitle('');
    setDescription('');
    setSelectedQuestionType(null);
    setSelectedSection(null);
    setMandatory(false);
    setAddToBank(false);
    setIsParentQuestion(false);
    setNewChildForms([]);
    setNewChildFormCompleted(true);
    setIsNewFormCollapsed(false);
    localStorage.removeItem("selectedOptionId");
    // saveSelectedSection(null); // Opcional: limpiar sección global
    if (generateNewKey) setFormKey(`form_${Date.now()}`);
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
    setIsBankDropdownOpen(false);
  };

  // --- Handlers para el NUEVO formulario ---

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
  
  // Función para alternar colapso del nuevo formulario
  const toggleNewFormCollapse = () => setIsNewFormCollapsed(!isNewFormCollapsed);

  // Manejar el botón de importar/resetear
  const handleImportOrReset = () => {
    if (hasNewFormChanges) {
      resetNewForm();
    } else {
      setIsBankDropdownOpen(true);
    }
  };

  // Manejar selección de pregunta desde el banco
  const handleBankQuestionSelect = (question) => {
    importQuestionFromBank(question);
  };

  // Agregar pregunta hija al NUEVO formulario
  const handleAddNewChildQuestion = () => {
    if (!selectedQuestionType) {
      setErrorMessage('Seleccione tipo de pregunta madre.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Ingrese título para pregunta madre.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }
    if (!selectedSection) {
      setErrorMessage('Seleccione sección para pregunta madre.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    const parentId = formKey; // ID temporal del padre
    const parentQuestionData = {
      id: parentId,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: selectedSection,
      mandatory
    };
    
    const childFormId = `new_child_${Date.now()}`;
    const newChild = {
      id: childFormId,
      parentData: parentQuestionData,
      completed: false,
      data: null
    };

    setNewChildForms(prev => [...prev, newChild]);
    setNewChildFormCompleted(false); // Deshabilitar añadir otro
    setIsNewFormCollapsed(false); // Expandir para ver el hijo en edición
  };

  // Manejar cuando se guarda la pregunta hija en el NUEVO formulario
  const handleSaveNewChildQuestion = (childId, childData) => {
    console.log("QuestionsForm: Guardando hijo nuevo temporal ID:", childId);
    setNewChildForms(prevForms =>
      prevForms.map(form =>
        form.id === childId ? { ...form, completed: true, data: childData } : form
      )
    );
    setNewChildFormCompleted(true); // Habilitar añadir otro
    setErrorMessage('Pregunta hija temporal agregada.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  // Cancelar la creación de la pregunta hija en el NUEVO formulario
  const handleCancelNewChildQuestion = (childId) => {
    setNewChildForms(prevForms => prevForms.filter(form => form.id !== childId));
    const remainingForms = newChildForms.filter(form => form.id !== childId);
    setNewChildFormCompleted(remainingForms.every(f => f.completed)); // Habilitar si no quedan pendientes
  };

  // Enviar formulario - Manejar guardado del NUEVO formulario
  const handleSubmitNewQuestion = async () => {
    // Validación de datos
    if (!title.trim() || !isDescriptionNotEmpty(description) || !selectedQuestionType || !selectedSection) {
      setErrorMessage('Título, Descripción, Tipo de Pregunta y Sección son requeridos.');
      setModalStatus('error'); 
      setIsModalOpen(true); 
      return;
    }

    const sanitizedTitle = DOMPurify.sanitize(title.trim());
    const cleanDescription = DOMPurify.sanitize(description);
    const parentFormData = {
      title: sanitizedTitle, 
      descrip: cleanDescription, 
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: 0, 
      bank: addToBank, 
      type_questions_id: selectedQuestionType, 
      section_id: selectedSection.id,
      questions_conditions: isParentQuestion, 
      creator_id: 1, // O obtener del usuario logueado
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify(parentFormData),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);

      const responseData = await response.json();
      const serverId = responseData.id;
      console.log("QuestionsForm: Pregunta padre guardada en servidor con ID:", serverId);
      localStorage.setItem('questions_id', DOMPurify.sanitize(String(serverId)));

      const savedFormEntry = {
        id: formKey, 
        serverId: Number(serverId), 
        title: sanitizedTitle, 
        description: cleanDescription,
        questionType: selectedQuestionType, 
        section: selectedSection, 
        mandatory: mandatory,
        isParentQuestion: isParentQuestion, 
        addToBank: addToBank, 
        isCollapsed: true, // Colapsar al guardar
        childForms: newChildForms
          .filter(child => child.completed && child.data)
          .map(child => ({
            id: child.id,
            parentData: { 
              ...child.parentData, 
              id: Number(serverId), 
              serverId: Number(serverId) 
            },
            completed: true, 
            isCollapsed: true, 
            data: child.data
          }))
      };

      if (addToBank) {
        const bankData = { ...savedFormEntry, id: Number(serverId) };
        delete bankData.childForms; 
        delete bankData.serverId; 
        delete bankData.isCollapsed;
        addQuestionToBank(bankData);
      }

      setSavedForms(prevForms => [...prevForms, savedFormEntry]);
      resetNewForm(true); // Resetear form nuevo
      setErrorMessage('Pregunta agregada correctamente.');
      setModalStatus('success'); 
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error al guardar la pregunta:', error);
      setErrorMessage(`Error al guardar: ${error.message}.`);
      setModalStatus('error'); 
      setIsModalOpen(true);
    }
  };

  // Exponer funciones al padre
  useImperativeHandle(ref, () => ({
    submitQuestionForm: handleSubmitNewQuestion,
    addQuestion: handleSubmitNewQuestion
  }));

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Renderizar vista previa para el nuevo formulario
  const renderNewQuestionPreview = () => {
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
          key={form.id} // ID local único
          form={form}   // Datos completos
          onToggleCollapse={toggleSavedFormCollapse}
          onUpdate={updateSavedForm}
          onAddChildQuestion={handleAddNewChildToSavedForm}
          onUpdateChildInSavedForm={handleUpdateChildInSavedForm}
          onRemoveChildFromSavedForm={handleRemoveChildFromSavedForm}
          onDeleteForm={handleDeleteSavedForm}
        />
      ))}

      {/* Contenedor Principal del Formulario NUEVO */}
      <div key={formKey} className="mb-6">
        <div className={`flex flex-col gap-4 ${isNewFormCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={isNewFormCollapsed ? { minHeight: '70px' } : {}}>

          {/* Cabecera: Título, Botón Importar/Reset, Botón Colapsar */}
          <div className={`flex items-center ${isNewFormCollapsed ? 'mb-0' : 'mb-4'}`}>
            {/* Input Título */}
            <div className="w-2/3 relative pr-4">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Titulo de Pregunta"
                maxLength={50}
                className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${isNewFormCollapsed ? 'py-1' : 'pb-1'} ${(!isNewFormCollapsed || (isNewFormCollapsed && title.trim() === '')) ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
                readOnly={isNewFormCollapsed}
              />
              {!isNewFormCollapsed && (
                <div className="absolute right-4 bottom-1 text-xs text-gray-500">
                  {title.length}/50
                </div>
              )}
            </div>

            {/* Botones de la derecha */}
            <div className="w-1/3 flex items-center justify-end gap-3">
              {/* Botón Importar / Volver a empezar */}
              {!isNewFormCollapsed && (
                <button
                  ref={bankButtonRef}
                  className="flex items-center bg-blue-custom rounded-full overflow-hidden transition-all duration-300 hover:shadow-md"
                  onClick={handleImportOrReset}
                >
                  <span className="bg-blue-custom text-white px-4 py-1 flex items-center">
                    <img
                      src={hasNewFormChanges ? RefreshIcon : Down}
                      alt={hasNewFormChanges ? "Resetear" : "Importar"}
                      className="w-5 h-5"
                    />
                  </span>
                  <span className="bg-yellow-custom px-4 py-1">
                    <span className="font-work-sans text-sm font-semibold text-blue-custom whitespace-nowrap">
                      {hasNewFormChanges
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
                  onClick={toggleNewFormCollapse}
                  className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
                  style={{ transform: isNewFormCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-label={isNewFormCollapsed ? "Expandir formulario" : "Colapsar formulario"}
                >
                  <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido Colapsable del NUEVO Formulario */}
          {!isNewFormCollapsed && (
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
                  disabled={!canActivateNewFormSwitches}
                />
                <SwitchOption
                  value={mandatory}
                  onChange={() => setMandatory(!mandatory)}
                  label="¿Esta pregunta es obligatoria?"
                  disabled={!canActivateNewFormSwitches}
                />
                <SwitchOption
                  value={addToBank}
                  onChange={handleNewFormBankSwitchChange}
                  label="Añadir esta pregunta al banco de preguntas"
                  disabled={!canActivateNewFormSwitches}
                />
              </div>

              {/* Sección: Vista Previa */}
              {renderNewQuestionPreview()}
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

        {/* Sección para hijos del NUEVO formulario y botón agregar */}
        {isParentQuestion && (
          <div className="mt-1 pl-6 pr-4 md:pl-12 md:pr-6 transition-all duration-300 ease-in-out">
            {/* Renderizado de hijos temporales */}
            {newChildForms.length > 0 && (
              <div className="space-y-2 mt-2">
                {newChildForms.map((childFormData) => (
                  <div key={childFormData.id} className={`transition-all duration-300 ease-in-out rounded-xl overflow-hidden ${isNewFormCollapsed ? 'bg-white shadow border border-gray-200' : ''}`}>
                    {isNewFormCollapsed ? (
                      // Vista compacta hijo (nuevo form colapsado)
                      <div className="flex items-center justify-between p-3">
                        <span className="font-work-sans text-sm md:text-base font-semibold text-dark-blue-custom truncate pr-2">
                          {childFormData.data?.title || "Pregunta hija pendiente..."}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            className="p-1 text-red-500 hover:text-red-700 focus:outline-none hover:bg-red-100 rounded-full"
                            onClick={() => handleCancelNewChildQuestion(childFormData.id)}
                            aria-label="Eliminar pregunta hija pendiente"
                            title="Eliminar"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF0000" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Vista expandida hijo (nuevo form expandido)
                      <>
                        {childFormData.completed ? (
                          // Vista read-only hijo temporal completado
                          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-dark-blue-custom">{childFormData.data?.title || "Pregunta hija"}</p>
                                <p className="text-sm text-gray-600">Tipo: {getQuestionTypeName(childFormData.data?.questionType)}</p>
                              </div>
                              <button
                                className="p-1 text-red-500 hover:text-red-700 focus:outline-none hover:bg-red-100 rounded-full ml-2"
                                onClick={() => handleCancelNewChildQuestion(childFormData.id)}
                                aria-label="Eliminar pregunta hija temporal"
                                title="Eliminar"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF0000" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Formulario de edición hijo temporal
                          <ChildQuestionForm
                            ref={(el) => { childFormRefs.current[childFormData.id] = el; }}
                            formId={childFormData.id}
                            parentQuestionData={childFormData.parentData}
                            onSave={(childData) => handleSaveNewChildQuestion(childFormData.id, childData)}
                            onCancel={() => handleCancelNewChildQuestion(childFormData.id)}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Botón Agregar pregunta hija (NUEVO Form) */}
            <div className="mt-3">
              <button
                className={`w-full py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 transition-colors relative shadow-sm hover:shadow-md ${
                  ((!isNewFormCollapsed && newChildFormCompleted) || isNewFormCollapsed)
                    ? "bg-yellow-custom hover:bg-yellow-400"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
                onClick={handleAddNewChildQuestion}
                disabled={!((!isNewFormCollapsed && newChildFormCompleted) || isNewFormCollapsed)}
                aria-disabled={!((!isNewFormCollapsed && newChildFormCompleted) || isNewFormCollapsed)}
              >
                <span className={`font-work-sans text-xl font-bold ${((!isNewFormCollapsed && newChildFormCompleted) || isNewFormCollapsed) ? "text-blue-custom" : "text-gray-500"}`}>
                  Agregar pregunta hija
                </span>
                <div className="absolute right-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className={`${((!isNewFormCollapsed && newChildFormCompleted) || isNewFormCollapsed) ? "text-blue-custom" : "text-gray-400"}`}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botón: Agregar pregunta (NUEVO Form) */}
      <div className="mt-4">
        <button
          className={`w-full py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${
            canActivateNewFormSwitches
              ? "bg-yellow-custom hover:bg-yellow-400"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          onClick={handleSubmitNewQuestion}
          disabled={!canActivateNewFormSwitches}
        >
          <span className={`font-work-sans text-xl font-bold ${canActivateNewFormSwitches ? "text-blue-custom" : "text-gray-500"
            }`}>Agregar pregunta</span>
          <div className="absolute right-4">
            <img src={AddCategory1} alt="Agregar" className={`w-8 h-8 ${!canActivateNewFormSwitches ? "opacity-50" : ""}`} />
          </div>
        </button>
      </div>
    </>
  );
});

export default QuestionsForm;