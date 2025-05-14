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
// Importar el nuevo servicio de almacenamiento de preguntas
import {
  saveQuestions,
  getQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion
} from '../services/QuestionsStorage';
import DOMPurify from 'dompurify';

// Importaciones de imágenes
import collapseExpandButton from '../assets/img/collapseExpandButton.svg';
import trashcan_1 from '../assets/img/trashCan_1.svg';
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
  onRemoveChildFromSavedForm,
  onEditingChange // Nueva prop para informar cuando se está editando
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
  const [isChildFormEditing, setIsChildFormEditing] = useState(false);

  // Nuevo estado para monitorear la validez de los formularios hijos
  const [childFormValidities, setChildFormValidities] = useState({});

  // Efecto para notificar cuando cambia el estado de edición
  useEffect(() => {
    if (onEditingChange) {
      // Consideramos que está en edición si está expandido y en modo edición O si alguna pregunta hija está en edición
      const isCurrentlyEditing = (isEditing && !form.isCollapsed) || isChildFormEditing;
      onEditingChange(isCurrentlyEditing);
    }
  }, [isEditing, form.isCollapsed, isChildFormEditing, onEditingChange]);
  const handleChildEditingChange = (isEditing) => {
    console.log("SavedQuestionForm: Pregunta hija está siendo editada:", isEditing);
    setIsChildFormEditing(isEditing);

    // Notificar al padre sobre el cambio de estado de edición (combinando tanto edición del padre como de hijos)
    if (onEditingChange) {
      const isCurrentlyEditing = isEditing || (isEditing && !form.isCollapsed);
      onEditingChange(isCurrentlyEditing);
    }
  };

  const canBecomeParentQuestion = (questionTypeId) => {
    return questionTypeId === 3 || questionTypeId === 4 || questionTypeId === 5;
  };

  const handleQuestionTypeSelect = (typeId) => {
    if (!isEditing) return;

    // Si cambia de un tipo que permite hijos a uno que no, y tiene hijos, mostrar advertencia
    if (form.childForms && form.childForms.length > 0 &&
      canBecomeParentQuestion(selectedQuestionType) &&
      !canBecomeParentQuestion(typeId)) {
      setErrorMessage('Este tipo de pregunta no permite tener preguntas hijas. Si continúa, las preguntas hijas asociadas podrían perderse.');
      setModalStatus('warning');
      setIsModalOpen(true);
      // Podríamos implementar una confirmación aquí
    }

    setSelectedQuestionType(typeId);
  };

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

  useEffect(() => {
    if (selectedQuestionType !== null && !canBecomeParentQuestion(selectedQuestionType)) {
      // Si ya era una pregunta madre con hijos, mostrar alerta
      if (isParentQuestionState && form.childForms && form.childForms.length > 0) {
        setErrorMessage('El tipo de pregunta seleccionado no permite tener preguntas hijas. Si guarda los cambios, las preguntas hijas asociadas podrían perderse.');
        setModalStatus('warning');
        setIsModalOpen(true);
      }
      setIsParentQuestionState(false);
    }
  }, [selectedQuestionType]);

  // Efecto para sincronizar isEditing con el estado de colapso
  useEffect(() => {
    setIsEditing(!form.isCollapsed);
  }, [form.isCollapsed]);

  // Determina si se pueden activar los switches
  const canActivateSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null;

  const canActivateParentQuestionSwitch =
    canActivateSwitches && canBecomeParentQuestion(selectedQuestionType);

  // Guardar cambios en el formulario
  const saveParentChanges = () => {
    // Usar una sección por defecto o nula si no hay seleccionada
    const effectiveSection = selectedSection || null;
    const updatedParentData = {
      ...form,
      title: title.trim(),
      description,
      questionType: selectedQuestionType,
      section: effectiveSection,
      mandatory,
      isParentQuestion: isParentQuestionState,
      addToBank,
    };

    onUpdate(form.id, updatedParentData);
    // También guardar en localStorage mediante el servicio
    updateQuestion(form.id, updatedParentData);

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
  const handleChildFormValidityChange = (childId, isValid) => {
    console.log(`QuestionsForm: Recibiendo validez para hijo ${childId}: ${isValid}`);

    // Asegurarse de que childId existe
    if (!childId) {
      console.error('handleChildFormValidityChange: No se recibió childId válido');
      return;
    }

    setChildFormValidities(prev => {
      const updated = {
        ...prev,
        [childId]: isValid
      };
      console.log('Nuevo estado completo de childFormValidities:', updated);
      return updated;
    });
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

    // Si estamos colapsando y hay preguntas hijas en edición, notificar al padre
    if (!form.isCollapsed && isChildFormEditing) {
      setIsChildFormEditing(false);
      if (onEditingChange) {
        onEditingChange(false);
      }
    }

    onToggleCollapse(form.id);
  };

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Cambiar estado de pregunta madre
  const handleParentQuestionChange = () => {
    if (!isEditing || !canActivateSwitches) return;

    // Solo permitir activar si es un tipo compatible
    if (!isParentQuestionState && !canBecomeParentQuestion(selectedQuestionType)) {
      setErrorMessage('Este tipo de pregunta no permite tener preguntas hijas. Seleccione otro tipo de pregunta para activar esta opción.');
      setModalStatus('info');
      setIsModalOpen(true);
      return;
    }

    setIsParentQuestionState(!isParentQuestionState);

    // Si acaba de activar la pregunta como madre, guardamos los cambios
    if (!isParentQuestionState) {
      const updatedForm = {
        ...form,
        isParentQuestion: true, // Asegurarse que el form principal también tiene el flag actualizado
      };
      onUpdate(form.id, updatedForm);
      // También actualizar en localStorage
      updateQuestion(form.id, updatedForm);
    }
  };

  const childFormsFromProps = form.childForms || [];

  return (
    <div className="mb-6">
      {/* Contenedor principal del formulario guardado */}
      <div className={`flex flex-col gap-4 ${form.isCollapsed ? 'py-2 px-6 h-15 overflow-hidden' : 'p-6'} rounded-xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={form.isCollapsed ? { minHeight: '50px' } : {}}>
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
              <img src={trashcan_1} alt="trashCan" className="w-7 h-7" />
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
                disabled={!canActivateParentQuestionSwitch || !isEditing}
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
        <div className="mt-1 transition-all duration-300 ease-in-out">
          {/* Renderizado de los hijos existentes */}
          {childFormsFromProps.length > 0 && (
            <div className="space-y-2 mt-2">
              {childFormsFromProps.map((childForm) => (
                <div key={childForm.id} className="transition-all duration-300 ease-in-out">
                  {childForm.completed ? (
                    // For completed forms, render a collapsible version with the red background
                    <div className="w-5/6 ml-auto">
                      <div className={`flex flex-col gap-4 ${childForm.isCollapsed ? 'py-2 px-6 h-15 overflow-hidden' : 'p-6'} rounded-xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={childForm.isCollapsed ? { minHeight: '50px' } : {}}>
                        {/* Cabecera con título */}
                        <div className="flex items-center">
                          <div className="w-2/3 relative pr-4">
                            <input
                              type="text"
                              value={childForm.data?.title || ''}
                              onChange={(e) => {
                                if (childForm.isCollapsed) return;
                                const updatedChild = {
                                  ...childForm,
                                  data: {
                                    ...childForm.data,
                                    title: e.target.value
                                  }
                                };
                                onUpdateChildInSavedForm(form.id, childForm.id, updatedChild.data);
                              }}
                              placeholder="Titulo de Pregunta Hija"
                              maxLength={50}
                              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${childForm.isCollapsed ? 'py-1' : 'pb-1'} ${!childForm.isCollapsed ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
                              readOnly={childForm.isCollapsed}
                            />
                            {!childForm.isCollapsed && (
                              <div className="absolute right-4 bottom-1 text-xs text-gray-500">
                                {(childForm.data?.title || '').length}/50
                              </div>
                            )}
                          </div>
                          {/* Botones de acción */}
                          <div className="w-1/3 flex items-center justify-end gap-3">
                            {/* Botón para eliminar */}
                            <button
                              className="focus:outline-none hover:opacity-80"
                              onClick={() => onRemoveChildFromSavedForm(form.id, childForm.id)}
                              aria-label="Eliminar pregunta hija"
                            >
                              <img src={trashcan_1} alt="trashCan" className="w-7 h-7" />
                            </button>

                            {/* Botón Colapsar/Expandir */}
                            <div className="rounded-full flex items-center">
                              <button
                                onClick={() => {
                                  // Toggle collapse state for this specific child
                                  const updatedChild = {
                                    ...childForm,
                                    isCollapsed: !childForm.isCollapsed
                                  };
                                  // Update this specific child
                                  const updatedChildForms = form.childForms.map(cf =>
                                    cf.id === childForm.id ? updatedChild : cf
                                  );
                                  // Update the parent with the new children array
                                  onUpdate(form.id, { ...form, childForms: updatedChildForms });
                                  // También actualizar en localStorage
                                  updateQuestion(form.id, { ...form, childForms: updatedChildForms });
                                }}
                                className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
                                style={{ transform: childForm.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                aria-label={childForm.isCollapsed ? "Expandir formulario hijo" : "Colapsar formulario hijo"}
                              >
                                <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Contenido expandido editable */}
                        {!childForm.isCollapsed && (
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
                                    onClick={() => {
                                      const updatedChild = {
                                        ...childForm,
                                        data: {
                                          ...childForm.data,
                                          questionType: type.id
                                        }
                                      };
                                      onUpdateChildInSavedForm(form.id, childForm.id, updatedChild.data);
                                    }}
                                    className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors duration-200
                  ${childForm.data?.questionType === type.id
                                        ? 'bg-green-custom text-white border-green-500 shadow-sm'
                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
                                  >
                                    <img
                                      src={type.icon}
                                      alt={type.name}
                                      className="w-5 h-5"
                                      style={childForm.data?.questionType === type.id ? { filter: 'brightness(0) invert(1)' } : {}}
                                    />
                                    <span className="font-semibold">{type.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Descripción */}
                            <div className="mb-4">
                              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción de la Pregunta</h2>
                              <RichTextEditor
                                value={childForm.data?.description || ''}
                                onChange={(value) => {
                                  const updatedChild = {
                                    ...childForm,
                                    data: {
                                      ...childForm.data,
                                      description: value
                                    }
                                  };
                                  onUpdateChildInSavedForm(form.id, childForm.id, updatedChild.data);
                                }}
                              />
                            </div>

                            {/* Opciones adicionales (Switches) */}
                            <div className="text-base md:text-lg flex flex-row justify-between gap-4 py-2 font-work-sans">
                              <SwitchOption
                                value={childForm.data?.mandatory || false}
                                onChange={() => {
                                  const updatedChild = {
                                    ...childForm,
                                    data: {
                                      ...childForm.data,
                                      mandatory: !(childForm.data?.mandatory || false)
                                    }
                                  };
                                  onUpdateChildInSavedForm(form.id, childForm.id, updatedChild.data);
                                }}
                                label="¿Esta pregunta es obligatoria?"
                              />
                              <SwitchOption
                                value={childForm.data?.addToBank || false}
                                onChange={() => {
                                  const updatedChild = {
                                    ...childForm,
                                    data: {
                                      ...childForm.data,
                                      addToBank: !(childForm.data?.addToBank || false)
                                    }
                                  };
                                  onUpdateChildInSavedForm(form.id, childForm.id, updatedChild.data);
                                }}
                                label="Añadir esta pregunta al banco de preguntas"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    // For incomplete forms, render ChildQuestionForm DIRECTLY without additional container
                    <ChildQuestionForm
                      ref={(el) => { childFormRefs.current[childForm.id] = el; }}
                      formId={childForm.id}
                      parentQuestionData={childForm.parentData}
                      onSave={(childData) => handleSaveChildData(childForm.id, childData)}
                      onCancel={() => handleCancelChildCreation(childForm.id)}
                      onValidityChange={(isValid) => handleChildFormValidityChange(childForm.id, isValid)}
                      onEditingChange={handleChildEditingChange} // Añadir esta prop
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Botón: Agregar pregunta hija PREGUNTA PREVIAMENTE GUARDADA */}
          <div className="mt-3 flex justify-end">
            {(() => {
              // Variable para verificar si hay hijos válidos para guardar
              const hasValidChildToSave = childFormsFromProps.some(cf =>
                !cf.completed && childFormValidities[cf.id]
              );

              // Comprobación más segura: verificar que la pregunta principal tenga datos válidos
              // incluso cuando está contraída
              const parentFormIsValid =
                form.title?.trim() !== '' &&
                form.questionType !== null;

              // Nueva condición combinada que es segura tanto para formularios contraídos como expandidos
              const canEnableButton = (
                (parentFormIsValid && childFormsFromProps.every(cf => cf.completed)) ||
                hasValidChildToSave
              );

              return (
                <button
                  className={`w-5/6 py-2.5 md:py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${canEnableButton ? "bg-yellow-custom hover:bg-gray-400" : "bg-gray-200 cursor-not-allowed"
                    }`}
                  onClick={() => {
                    // Verificar si hay una pregunta hija incompleta
                    const incompleteChildForm = childFormsFromProps.find(cf => !cf.completed);

                    if (incompleteChildForm) {
                      // Si hay una pregunta hija incompleta, intentar guardarla
                      const childFormRef = childFormRefs.current[incompleteChildForm.id];
                      if (childFormRef && typeof childFormRef.submitChildQuestion === 'function') {
                        childFormRef.submitChildQuestion();
                      }
                    } else if (parentFormIsValid) {
                      // Sólo permitir crear una nueva si la principal es válida
                      handleAddChildQuestionClick();
                    } else {
                      // Si la principal no es válida, mostrar un error
                      setErrorMessage('Debe completar título y tipo de pregunta para la pregunta principal antes de agregar una hija.');
                      setModalStatus('error');
                      setIsModalOpen(true);
                    }
                  }}
                  disabled={!canEnableButton}
                  aria-disabled={!canEnableButton}
                >
                  <span className={`font-work-sans text-2xl font-bold ${canEnableButton ? "text-blue-custom" : "text-gray-500"
                    }`}>
                    {childFormsFromProps.some(cf => !cf.completed && childFormValidities[cf.id])
                      ? "Guardar pregunta hija"
                      : "Agregar pregunta hija"}
                  </span>
                  <div className="absolute right-6">
                    {/* Icono AddCategory1 */}
                    <img
                      src={AddCategory1}
                      alt="Agregar"
                      className={`w-8 h-8 ${!canEnableButton ? "opacity-50" : ""}`}
                    />
                  </div>
                </button>
              );
            })()}
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

// Componente Principal actualizado con funcionalidad para validación del botón Continuar
const QuestionsForm = forwardRef(({
  onAddChildQuestion,
  onQuestionsValidChange, // Nueva prop para informar validez
  onConfiguringChange,    // Nueva prop para informar configuración
  ...props
}, ref) => {
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

  // Nuevo estado para monitorear la validez de los formularios hijos
  const [childFormValidities, setChildFormValidities] = useState({});

  // Nuevo estado para formularios guardados
  const [savedForms, setSavedForms] = useState([]);
  const [formKey, setFormKey] = useState(`form_${Date.now()}`);

  // Nuevos estados para controlar la validación del botón Continuar
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [editingSavedForms, setEditingSavedForms] = useState({});
  const [hasValidQuestions, setHasValidQuestions] = useState(false);
  // Referencias
  const bankButtonRef = useRef(null);
  const childFormRefs = useRef({});

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';
  const canBecomeParentQuestion = (questionTypeId) => {
    // Solo tipos 3 (Opción Única), 4 (Opción Multiple) y 5 (Falso / Verdadero) pueden ser madres
    return questionTypeId === 3 || questionTypeId === 4 || questionTypeId === 5;
  }

  // --- Efectos ---

  // Verificar cambios en el nuevo formulario
  const hasNewFormChanges =
    selectedQuestionType !== null ||
    selectedSection !== null ||
    title.trim() !== '';

  // Efecto para determinar si se está configurando una pregunta
  useEffect(() => {
    // Se está configurando si:
    // 1. Hay cambios en el formulario nuevo, o
    // 2. Se está editando alguna pregunta guardada
    const isAnyFormEditing = Object.values(editingSavedForms).some(editing => editing);
    const isCurrentlyConfiguring = hasNewFormChanges || isAnyFormEditing;

    setIsConfiguring(isCurrentlyConfiguring);

    // Notificar al componente padre
    if (onConfiguringChange) {
      onConfiguringChange(isCurrentlyConfiguring);
    }
  }, [hasNewFormChanges, editingSavedForms, onConfiguringChange]);

  // Efecto para notificar sobre la validez del formulario cuando cambian las preguntas guardadas
  useEffect(() => {
    const hasSavedQuestions = savedForms.length > 0;
    setHasValidQuestions(hasSavedQuestions);

    if (onQuestionsValidChange) {
      onQuestionsValidChange(hasSavedQuestions);
    }
  }, [savedForms, onQuestionsValidChange]);

  useEffect(() => {
    // Si el tipo de pregunta cambia a uno que no puede ser madre, desactivar isParentQuestion
    if (selectedQuestionType !== null && !canBecomeParentQuestion(selectedQuestionType)) {
      setIsParentQuestion(false);

      // Si había hijos temporales, puede ser bueno mostrar una alerta
      if (newChildForms.length > 0) {
        setErrorMessage('El tipo de pregunta seleccionado no permite tener preguntas hijas. Se han eliminado las preguntas hijas temporales.');
        setModalStatus('info');
        setIsModalOpen(true);
        setNewChildForms([]);
        setNewChildFormCompleted(true);
      }
    }
  }, [selectedQuestionType]);

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

      // NUEVO: Cargar preguntas guardadas de localStorage
      const storedQuestions = getQuestions();
      if (storedQuestions.length > 0) {
        setSavedForms(storedQuestions);
        setHasValidQuestions(true);
        if (onQuestionsValidChange) {
          onQuestionsValidChange(true);
        }
      }
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
      // NUEVO: Escuchar cambios en las preguntas guardadas
      if (e.key === 'survey_questions') {
        const storedQuestions = getQuestions();
        setSavedForms(storedQuestions);
        setHasValidQuestions(storedQuestions.length > 0);
        if (onQuestionsValidChange) {
          onQuestionsValidChange(storedQuestions.length > 0);
        }
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

    // NUEVO: Listener para cambios en preguntas
    const handleQuestionsUpdated = (event) => {
      setSavedForms(event.detail);
      setHasValidQuestions(event.detail.length > 0);
      if (onQuestionsValidChange) {
        onQuestionsValidChange(event.detail.length > 0);
      }
    };
    window.addEventListener('questionsUpdated', handleQuestionsUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sectionRemoved', handleSectionRemoved);
      window.removeEventListener('bankQuestionsUpdated', handleBankQuestionsUpdated);
      window.removeEventListener('questionsUpdated', handleQuestionsUpdated);
    };
  }, [onQuestionsValidChange]);

  // Efecto para manejar cambios en isParentQuestion
  useEffect(() => {
    if (!isParentQuestion) {
      setNewChildForms([]);
      setNewChildFormCompleted(true);
    }
  }, [isParentQuestion]);
  // Función para manejar cuando una pregunta guardada está siendo editada
  const handleSavedFormEditing = (formId, isEditing) => {
    setEditingSavedForms(prev => {
      const updated = { ...prev, [formId]: isEditing };

      // Verificar si alguna pregunta guardada está siendo editada
      const isSomeSavedFormEditing = Object.values(updated).some(value => value);

      // Actualizar estado general de configuración
      const isCurrentlyConfiguring = hasNewFormChanges || isSomeSavedFormEditing;
      setIsConfiguring(isCurrentlyConfiguring);

      // Notificar al padre
      if (onConfiguringChange) {
        onConfiguringChange(isCurrentlyConfiguring);
      }

      return updated;
    });
  };

  // Toggle para expandir/contraer un formulario guardado
  const toggleSavedFormCollapse = (formId) => {
    setSavedForms(prevForms => {
      const updatedForms = prevForms.map(form =>
        form.id === formId
          ? { ...form, isCollapsed: !form.isCollapsed }
          : form
      );
      // NUEVO: Guardar en localStorage
      saveQuestions(updatedForms);
      return updatedForms;
    });
  };

  // Actualizar un formulario guardado
  const updateSavedForm = (formId, updatedFormData) => {
    console.log("QuestionsForm: Recibida actualización para form ID:", formId);
    setSavedForms(prevForms => {
      const updatedForms = prevForms.map(form =>
        form.id === formId ? { ...form, ...updatedFormData } : form
      );
      // NUEVO: Guardar en localStorage
      saveQuestions(updatedForms);
      return updatedForms;
    });
  };

  // Eliminar un formulario guardado
  const handleDeleteSavedForm = (formId) => {
    setSavedForms(prevForms => {
      const updatedForms = prevForms.filter(form => form.id !== formId);
      // NUEVO: Guardar en localStorage
      saveQuestions(updatedForms);

      // Notificar si ya no hay preguntas válidas
      const hasRemainingForms = updatedForms.length > 0;
      setHasValidQuestions(hasRemainingForms);
      if (onQuestionsValidChange) {
        onQuestionsValidChange(hasRemainingForms);
      }

      return updatedForms;
    });

    // NUEVO: También eliminar usando el servicio
    removeQuestion(formId);

    setErrorMessage('Pregunta eliminada.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  // NUEVAS FUNCIONES para manejar preguntas hijas en formularios guardados
  const handleAddNewChildToSavedForm = (parentId) => {
    console.log("QuestionsForm: Añadiendo estructura de hijo para padre ID:", parentId);
    setSavedForms(prevForms => {
      const updatedForms = prevForms.map(form => {
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
            isCollapsed: false, // Start expanded for editing
            data: null
          };
          console.log("QuestionsForm: Nueva estructura de hijo creada:", newChildForm);
          const updatedForm = {
            ...form,
            childForms: [...(form.childForms || []), newChildForm],
            isParentQuestion: true,
          };

          // Notificar que estamos configurando
          setIsConfiguring(true);
          if (onConfiguringChange) {
            onConfiguringChange(true);
          }

          // NUEVO: También actualizar en localStorage 
          updateQuestion(form.id, updatedForm);

          return updatedForm;
        }
        return form;
      });

      // NUEVO: Guardar toda la lista actualizada
      saveQuestions(updatedForms);

      return updatedForms;
    });
  };

  const handleUpdateChildInSavedForm = (parentId, childId, childData) => {
    console.log("QuestionsForm: Actualizando hijo ID:", childId, "en padre ID:", parentId);
    setSavedForms(prevForms => {
      const updatedForms = prevForms.map(form => {
        if (form.id === parentId) {
          const updatedChildForms = (form.childForms || []).map(child => {
            if (child.id === childId) {
              // Add isCollapsed property if it's a newly completed form
              return {
                ...child,
                completed: true,
                data: childData,
                isCollapsed: child.isCollapsed !== undefined ? child.isCollapsed : true // Set initial state as collapsed if not already set
              };
            }
            return child;
          });

          const updatedForm = {
            ...form,
            childForms: updatedChildForms,
          };

          // NUEVO: También actualizar en localStorage
          updateQuestion(form.id, updatedForm);

          return updatedForm;
        }
        return form;
      });

      // NUEVO: Guardar toda la lista actualizada
      saveQuestions(updatedForms);

      return updatedForms;
    });
  };
  const handleRemoveChildFromSavedForm = (parentId, childId) => {
    console.log("QuestionsForm: Eliminando hijo ID:", childId, "de padre ID:", parentId);
    setSavedForms(prevForms => {
      const updatedForms = prevForms.map(form => {
        if (form.id === parentId) {
          const updatedChildForms = (form.childForms || []).filter(child => child.id !== childId);
          console.log("QuestionsForm: Hijos restantes:", updatedChildForms);

          const updatedForm = {
            ...form,
            childForms: updatedChildForms
          };

          // NUEVO: También actualizar en localStorage
          updateQuestion(form.id, updatedForm);

          return updatedForm;
        }
        return form;
      });

      // NUEVO: Guardar toda la lista actualizada
      saveQuestions(updatedForms);

      return updatedForms;
    });

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

    // Notificar que ya no estamos configurando
    if (hasNewFormChanges) {
      setIsConfiguring(false);
      if (onConfiguringChange) {
        onConfiguringChange(false);
      }
    }

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

    // Notificar que estamos configurando
    setIsConfiguring(true);
    if (onConfiguringChange) {
      onConfiguringChange(true);
    }
  };

  // --- Handlers para el NUEVO formulario ---

  // Seleccionar tipo de pregunta
  const handleQuestionTypeSelect = (typeId) => {
    setSelectedQuestionType(typeId);
    localStorage.setItem("selectedOptionId", typeId);

    // Notificar que estamos configurando
    setIsConfiguring(true);
    if (onConfiguringChange) {
      onConfiguringChange(true);
    }
  };

  // Seleccionar sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    saveSelectedSection(section ? section.id : null);

    // Notificar que estamos configurando
    setIsConfiguring(true);
    if (onConfiguringChange) {
      onConfiguringChange(true);
    }
  };

  // Cambiar título
  const handleTitleChange = (e) => {
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);

      // Notificar que estamos configurando
      setIsConfiguring(true);
      if (onConfiguringChange) {
        onConfiguringChange(true);
      }
    }
  };

  // Cambiar descripción
  const handleDescriptionChange = (value) => {
    setDescription(value);

    // Notificar que estamos configurando
    setIsConfiguring(true);
    if (onConfiguringChange) {
      onConfiguringChange(true);
    }
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

    // Notificar que estamos configurando
    setIsConfiguring(true);
    if (onConfiguringChange) {
      onConfiguringChange(true);
    }
  };

  // Manejar cuando se guarda la pregunta hija en el NUEVO formulario
  const handleSaveNewChildQuestion = (childId, childData) => {
    console.log("QuestionsForm: Guardando hijo nuevo temporal ID:", childId, "con datos:", childData);

    if (!childId || !childData) {
      console.error('handleSaveNewChildQuestion: Datos insuficientes', { childId, childData });
      return;
    }

    setNewChildForms(prevForms =>
      prevForms.map(form =>
        form.id === childId ? {
          ...form,
          completed: true,
          data: childData,
          isCollapsed: true
        } : form
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

  // Determina si se pueden activar los switches
  const canActivateNewFormSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null;

  const canActivateParentQuestionSwitch =
    canActivateNewFormSwitches && canBecomeParentQuestion(selectedQuestionType);

  // Enviar formulario - Manejar guardado del NUEVO formulario
  const handleSubmitNewQuestion = async () => {
    // Validación de datos - ahora solo título y tipo son requeridos
    if (!title.trim()) {
      setErrorMessage('El título de la pregunta es requerido.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    if (!selectedQuestionType) {
      setErrorMessage('Debe seleccionar un tipo de pregunta.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    const sanitizedTitle = DOMPurify.sanitize(title.trim());

    // FIX: Ensure description is never null - use empty string as fallback
    const cleanDescription = DOMPurify.sanitize(description || '');
    // If the description is completely empty, provide a default value
    const finalDescription = isDescriptionNotEmpty(cleanDescription)
      ? cleanDescription
      : 'Sin descripción';

    // Usar una sección por defecto si no hay seleccionada
    const effectiveSection = selectedSection || {
      id: 'default_section',
      name: 'Sin sección'
    };

    const parentFormData = {
      title: sanitizedTitle,
      descrip: finalDescription, // Use the non-null description
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: 0,
      bank: addToBank,
      type_questions_id: selectedQuestionType,
      section_id: effectiveSection.id,
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

      // Crear una sección por defecto si no se seleccionó ninguna
      const effectiveSection = selectedSection || {
        id: 'default_section',
        name: 'Sin sección'
      };

      const savedFormEntry = {
        id: formKey,
        serverId: Number(serverId),
        title: sanitizedTitle,
        description: finalDescription,
        questionType: selectedQuestionType,
        section: effectiveSection,
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
      // MODIFICADO: Actualizar el estado y guardar en localStorage
      setSavedForms(prevForms => {
        const updatedForms = [...prevForms, savedFormEntry];
        // Guardar en localStorage
        saveQuestions(updatedForms);

        // Notificar que ahora hay preguntas válidas
        setHasValidQuestions(true);
        if (onQuestionsValidChange) {
          onQuestionsValidChange(true);
        }

        return updatedForms;
      });

      // NUEVO: También añadir usando el servicio
      addQuestion(savedFormEntry);

      // Resetear form nuevo
      resetNewForm(true);

      // Notificar que ya no estamos configurando
      setIsConfiguring(false);
      if (onConfiguringChange) {
        onConfiguringChange(false);
      }

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

  // Añadir esta función para manejar el cambio de validez
  const handleChildFormValidityChange = (childId, isValid) => {
    console.log(`QuestionsForm: Recibiendo validez para hijo ${childId}: ${isValid}`);

    // Asegurarse de que childId existe
    if (!childId) {
      console.error('handleChildFormValidityChange: No se recibió childId válido');
      return;
    }

    setChildFormValidities(prev => {
      const updated = {
        ...prev,
        [childId]: isValid
      };
      console.log('Nuevo estado completo de childFormValidities:', updated);
      return updated;
    });
  };

  const hasValidChildToSave = newChildForms.some(child =>
    !child.completed && childFormValidities[child.id]
  );

  // Exponer funciones al padre
  useImperativeHandle(ref, () => ({
    submitQuestionForm: handleSubmitNewQuestion,
    addQuestion: handleSubmitNewQuestion,
    hasValidQuestions: () => hasValidQuestions,
    isConfiguring: () => isConfiguring
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
          onEditingChange={(isEditing) => handleSavedFormEditing(form.id, isEditing)}
        />
      ))}

      {/* Contenedor Principal del Formulario NUEVO */}
      <div key={formKey} className="mb-6">
        <div className={`bg-green-800 flex flex-col gap-4 ${isNewFormCollapsed ? 'py-2 px-6 h-15 overflow-hidden' : 'p-6'} rounded-xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={isNewFormCollapsed ? { minHeight: '50px' } : {}}>

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
                  onChange={() => {
                    setIsParentQuestion(!isParentQuestion);
                    // Notificar que estamos configurando
                    setIsConfiguring(true);
                    if (onConfiguringChange) {
                      onConfiguringChange(true);
                    }
                  }}
                  label="Convertir en pregunta madre"
                  disabled={!canActivateParentQuestionSwitch}
                />
                <SwitchOption
                  value={mandatory}
                  onChange={() => {
                    setMandatory(!mandatory);
                    // Notificar que estamos configurando
                    setIsConfiguring(true);
                    if (onConfiguringChange) {
                      onConfiguringChange(true);
                    }
                  }}
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
          <div className="mt-1 pr-0 transition-all duration-300 ease-in-out">
            {/* Renderizado de hijos temporales */}
            {newChildForms.length > 0 && (
              <div className="space-y-2 mt-2">
                {newChildForms.map((childFormData) => (
                  <div key={childFormData.id} className="transition-all duration-300 ease-in-out">
                    {childFormData.completed ? (
                      // For completed forms, render an editable/collapsible version
                      <div className="w-5/6 ml-auto">
                        <div className={`flex flex-col gap-4 ${childFormData.isCollapsed ? 'py-2 px-6 h-15 overflow-hidden' : 'p-6'} rounded-xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={childFormData.isCollapsed ? { minHeight: '50px' } : {}}>
                          {/* Cabecera con título */}
                          <div className="flex items-center">
                            <div className="w-2/3 relative pr-4">
                              <input
                                type="text"
                                value={childFormData.data?.title || ''}
                                onChange={(e) => {
                                  if (childFormData.isCollapsed) return;
                                  setNewChildForms(prev => prev.map(child =>
                                    child.id === childFormData.id
                                      ? { ...child, data: { ...child.data, title: e.target.value } }
                                      : child
                                  ));

                                  // Notificar que estamos configurando
                                  setIsConfiguring(true);
                                  if (onConfiguringChange) {
                                    onConfiguringChange(true);
                                  }
                                }}
                                placeholder="Titulo de Pregunta Hija"
                                maxLength={50}
                                className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${childFormData.isCollapsed ? 'py-1' : 'pb-1'} ${!childFormData.isCollapsed ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
                                readOnly={childFormData.isCollapsed}
                              />
                              {!childFormData.isCollapsed && (
                                <div className="absolute right-4 bottom-1 text-xs text-gray-500">
                                  {(childFormData.data?.title || '').length}/50
                                </div>
                              )}
                            </div>
                            {/* Botones de acción */}
                            <div className="w-1/3 flex items-center justify-end gap-3">
                              {/* Botón para eliminar */}
                              <button
                                className="focus:outline-none hover:opacity-80"
                                onClick={() => handleCancelNewChildQuestion(childFormData.id)}
                                aria-label="Eliminar pregunta hija"
                              >
                                <img src={trashcan_1} alt="trashCan" className="w-7 h-7" />
                              </button>

                              {/* Botón Colapsar/Expandir */}
                              <div className="rounded-full flex items-center">
                                <button
                                  onClick={() => {
                                    // Toggle collapse state for this specific child
                                    setNewChildForms(prev => prev.map(child =>
                                      child.id === childFormData.id
                                        ? { ...child, isCollapsed: !child.isCollapsed }
                                        : child
                                    ));
                                  }}
                                  className="focus:outline-none transform transition-transform duration-300 hover:opacity-80"
                                  style={{ transform: childFormData.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                  aria-label={childFormData.isCollapsed ? "Expandir formulario hijo" : "Colapsar formulario hijo"}
                                >
                                  <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Contenido expandido editable */}
                          {!childFormData.isCollapsed && (
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
                                      onClick={() => {
                                        setNewChildForms(prev => prev.map(child =>
                                          child.id === childFormData.id
                                            ? { ...child, data: { ...child.data, questionType: type.id } }
                                            : child
                                        ));

                                        // Notificar que estamos configurando
                                        setIsConfiguring(true);
                                        if (onConfiguringChange) {
                                          onConfiguringChange(true);
                                        }
                                      }}
                                      className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors duration-200
                          ${childFormData.data?.questionType === type.id
                                          ? 'bg-green-custom text-white border-green-500 shadow-sm'
                                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
                                    >
                                      <img
                                        src={type.icon}
                                        alt={type.name}
                                        className="w-5 h-5"
                                        style={childFormData.data?.questionType === type.id ? { filter: 'brightness(0) invert(1)' } : {}}
                                      />
                                      <span className="font-semibold">{type.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Descripción */}
                              <div className="mb-4">
                                <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción de la Pregunta</h2>
                                <RichTextEditor
                                  value={childFormData.data?.description || ''}
                                  onChange={(value) => {
                                    setNewChildForms(prev => prev.map(child =>
                                      child.id === childFormData.id
                                        ? { ...child, data: { ...child.data, description: value } }
                                        : child
                                    ));

                                    // Notificar que estamos configurando
                                    setIsConfiguring(true);
                                    if (onConfiguringChange) {
                                      onConfiguringChange(true);
                                    }
                                  }}
                                />
                              </div>

                              {/* Opciones adicionales (Switches) */}
                              <div className="text-base md:text-lg flex flex-row justify-between gap-4 py-2 font-work-sans">
                                <SwitchOption
                                  value={childFormData.data?.mandatory || false}
                                  onChange={() => {
                                    setNewChildForms(prev => prev.map(child =>
                                      child.id === childFormData.id
                                        ? { ...child, data: { ...child.data, mandatory: !(child.data?.mandatory || false) } }
                                        : child
                                    ));

                                    // Notificar que estamos configurando
                                    setIsConfiguring(true);
                                    if (onConfiguringChange) {
                                      onConfiguringChange(true);
                                    }
                                  }}
                                  label="¿Esta pregunta es obligatoria?"
                                />
                                <SwitchOption
                                  value={childFormData.data?.addToBank || false}
                                  onChange={() => {
                                    setNewChildForms(prev => prev.map(child =>
                                      child.id === childFormData.id
                                        ? { ...child, data: { ...child.data, addToBank: !(child.data?.addToBank || false) } }
                                        : child
                                    ));

                                    // Notificar que estamos configurando
                                    setIsConfiguring(true);
                                    if (onConfiguringChange) {
                                      onConfiguringChange(true);
                                    }
                                  }}
                                  label="Añadir esta pregunta al banco de preguntas"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      // For incomplete forms, render ChildQuestionForm DIRECTLY without additional container
                      <ChildQuestionForm
                        ref={(el) => { childFormRefs.current[childFormData.id] = el; }}
                        formId={childFormData.id}
                        parentQuestionData={childFormData.parentData}
                        onSave={(childData) => handleSaveNewChildQuestion(childFormData.id, childData)}
                        onCancel={() => handleCancelNewChildQuestion(childFormData.id)}
                        onValidityChange={(isValid) => handleChildFormValidityChange(childFormData.id, isValid)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Botón Agregar pregunta hija PREGUNTAS HIJAS GUARDADAS PRIMERO COMO TEMPORALES */}
            <div className="mt-3 flex justify-end">
              {(() => {
                // Variable para verificar si hay hijos válidos para guardar
                const hasValidChildToSave = newChildForms.some(child =>
                  !child.completed && childFormValidities[child.id]
                );

                // Comprobación más segura: verificar que la pregunta principal tenga datos válidos
                // incluso cuando está contraída
                const parentFormIsValid =
                  title.trim() !== '' &&
                  selectedQuestionType !== null;

                // Nueva condición combinada que es segura tanto para formularios contraídos como expandidos
                const canEnableButton = (
                  (parentFormIsValid && newChildFormCompleted) ||
                  hasValidChildToSave
                );

                return (
                  <button
                    className={`w-5/6 py-2.5 md:py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${canEnableButton ? "bg-yellow-custom hover:bg-gray-400" : "bg-gray-200 cursor-not-allowed"
                      }`}
                    onClick={() => {
                      // Verificar si hay una pregunta hija incompleta
                      const incompleteChild = newChildForms.find(child => !child.completed);

                      if (incompleteChild) {
                        // Si hay una pregunta hija incompleta, intentar guardarla
                        const childFormRef = childFormRefs.current[incompleteChild.id];
                        if (childFormRef && typeof childFormRef.submitChildQuestion === 'function') {
                          childFormRef.submitChildQuestion();
                        }
                      } else if (parentFormIsValid) {
                        // Sólo permitir crear una nueva si la principal es válida
                        handleAddNewChildQuestion();
                      } else {
                        // Si la principal no es válida, mostrar un error
                        setErrorMessage('Debe completar título y tipo de pregunta para la pregunta principal antes de agregar una hija.');
                        setModalStatus('error');
                        setIsModalOpen(true);
                      }
                    }}
                    disabled={!canEnableButton}
                    aria-disabled={!canEnableButton}
                  >
                    <span className={`font-work-sans text-2xl font-bold ${canEnableButton ? "text-blue-custom" : "text-gray-500"
                      }`}>
                      {newChildForms.some(child => !child.completed && childFormValidities[child.id])
                        ? "Guardar pregunta hija"
                        : "Agregar pregunta hija"}
                    </span>
                    <div className="absolute right-6">
                      <img
                        src={AddCategory1}
                        alt="Agregar"
                        className={`w-8 h-8 ${!canEnableButton ? "opacity-50" : ""}`}
                      />
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Botón: Agregar pregunta (NUEVO Form) */}
      <div className="mt-4">
        <button
          className={`w-full py-3 rounded-xl flex items-center justify-start pl-6 gap-2 transition-colors relative shadow-sm hover:shadow-md ${canActivateNewFormSwitches
            ? "bg-yellow-custom hover:bg-yellow-400"
            : "bg-gray-200 cursor-not-allowed"
            }`}
          onClick={handleSubmitNewQuestion}
          disabled={!canActivateNewFormSwitches}
        >
          <span className={`font-work-sans text-2xl font-bold ${canActivateNewFormSwitches ? "text-blue-custom" : "text-gray-500"
            }`}>Agregar pregunta</span>
          <div className="absolute right-6">
            <img src={AddCategory1} alt="Agregar" className={`w-8 h-8 ${!canActivateNewFormSwitches ? "opacity-50" : ""}`} />
          </div>
        </button>
      </div>
    </>
  );
});

export default QuestionsForm;