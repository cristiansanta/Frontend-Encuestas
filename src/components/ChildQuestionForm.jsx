import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import InputSlide from './InputSlide.jsx';
import Modal from './Modal';
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

// Componente Principal para Pregunta Hija
const ChildQuestionForm = forwardRef(({ parentQuestionData, formId, onSave, onCancel, isSaved = false, ...props }, ref) => {
  // --- Estados ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mandatory, setMandatory] = useState(false);
  const [addToBank, setAddToBank] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('default');
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [saved, setSaved] = useState(false);

  // El componente de pregunta hija hereda la sección del padre
  const [selectedSection, setSelectedSection] = useState(
    parentQuestionData?.section || null
  );

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';

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

  // Determina si se pueden activar los switches - MOVIDO ANTES DE LOS EFECTOS
  const canActivateSwitches =
    title.trim() !== '' &&
    selectedQuestionType !== null &&
    selectedSection !== null &&
    isDescriptionNotEmpty(description);

  // --- Efectos ---

  // Cargar datos iniciales si vienen del padre
  useEffect(() => {
    if (parentQuestionData?.section) {
      setSelectedSection(parentQuestionData.section);
    }
  }, [parentQuestionData]);

  useEffect(() => {
    console.log('ChildQuestionForm recibió parentQuestionData:', parentQuestionData);
  }, [parentQuestionData]);

  // Efecto para verificar si el formulario está completo - AHORA canActivateSwitches YA EXISTE
  useEffect(() => {
    setIsFormCompleted(canActivateSwitches);
  }, [title, description, selectedQuestionType, canActivateSwitches]);

  // Efecto para notificar al padre cuando cambia la validez del formulario
  useEffect(() => {
    if (props.onValidityChange) {
      props.onValidityChange(canActivateSwitches);
    }
  }, [canActivateSwitches, props]);

  // Actualizar pregunta en el banco cuando cambian los datos pero sigue activado el switch
  useEffect(() => {
    if (addToBank && canActivateSwitches && !isSaved) {
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
  }, [title, selectedQuestionType, description, addToBank, canActivateSwitches, isSaved]);

  // Maneja la activación/desactivación del switch para el banco
  const handleBankSwitchChange = () => {
    if (!canActivateSwitches || isSaved) return;

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
      isChildQuestion: true, // Marcada como pregunta hija
      parentId: parentQuestionData?.id
    };

    const result = addQuestionToBank(questionData);

    if (!result.success && result.isDuplicate) {
      setErrorMessage('Ya existe una pregunta similar en el banco de preguntas.');
      setModalStatus('info');
      setIsModalOpen(true);
      setAddToBank(false); // Desactivar el switch automáticamente
    }
  };

  // Limpiar el formulario
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedQuestionType(null);
    setMandatory(false);
    setAddToBank(false);
    localStorage.removeItem("selectedOptionId");
  };

  // Función para alternar colapso
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // --- Handlers ---

  // Seleccionar tipo de pregunta
  const handleQuestionTypeSelect = (typeId) => {
    if (isSaved) return;
    setSelectedQuestionType(typeId);
    localStorage.setItem("selectedOptionId", typeId);
  };

  // Cambiar título
  const handleTitleChange = (e) => {
    if (isSaved) return;
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);
    }
  };

  // Cambiar descripción
  const handleDescriptionChange = (value) => {
    if (isSaved) return;
    setDescription(value);
  };

  // Guardar la pregunta hija
  const handleSubmit = async () => {
    if (isSaved) return;

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

    // Verificar que existe un ID del padre (pero ser más flexible con el formato)
    if (!parentQuestionData?.id) {
      setErrorMessage('No se puede crear la pregunta hija porque la pregunta padre no tiene un ID.');
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

    // Preparar datos para enviar - sin intentar convertir el ID a número
    let parentId;
    if (typeof parentQuestionData.id === 'string' && !isNaN(Number(parentQuestionData.id))) {
      parentId = Number(parentQuestionData.id);
    } else if (typeof parentQuestionData.id === 'number') {
      parentId = parentQuestionData.id;
    } else {
      // Último intento: usar un ID del localStorage o 0 como fallback
      const storedId = localStorage.getItem('questions_id');
      parentId = storedId ? Number(storedId) : 0;
    }

    // Para debugging
    console.log('Tipo de parentQuestionData.id:', typeof parentQuestionData.id);
    console.log('Valor de parentQuestionData.id:', parentQuestionData.id);
    console.log('Valor convertido de parentId:', parentId);

    const formData = {
      title: sanitizedTitle,
      descrip: cleanDescription,
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: parentId, // Usar el ID convertido a número explícitamente
      bank: addToBank,
      type_questions_id: selectedQuestionType,
      section_id: selectedSection.id,
      questions_conditions: false,
      creator_id: 1,
    };

    console.log('Enviando pregunta hija con datos:', formData);

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

      // Capturar y mostrar más detalles si hay un error
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error detallado:', errorText);
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
      }

      const responseData = await response.json();

      // Marcar como guardado
      setSaved(true);

      // Notificar al componente padre que la pregunta hija se guardó correctamente
      if (onSave) {
        onSave({
          id: responseData.id,
          title: sanitizedTitle,
          description: cleanDescription,
          questionType: selectedQuestionType,
          section: selectedSection,
          mandatory: mandatory
        }, formId); // Pasar el ID del formulario
      }

      setErrorMessage('Pregunta hija agregada correctamente.');
      setModalStatus('success');
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setErrorMessage(`Error al guardar la pregunta hija: ${error.message}. Intente nuevamente.`);
      setModalStatus('error');
      setIsModalOpen(true);
    }
  };

  // Cerrar modal
  const closeModal = () => setIsModalOpen(false);

  // Cancelar creación de pregunta hija
  const handleCancel = () => {
    if (onCancel) {
      onCancel(formId);
    }
  };

  // Exponer funciones al padre
  useImperativeHandle(ref, () => ({
    submitChildQuestion: handleSubmit,
    resetChildForm: resetForm,
    isFormValid: () => canActivateSwitches,
    isFormCompleted: () => isFormCompleted,
    isSaved: () => saved || isSaved
  }));

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

  // Estado compuesto para determinar si el formulario está realmente deshabilitado
  const isFormDisabled = isSaved || saved;

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
    <div className="w-5/6 ml-auto"> {/* Contenedor que define el ancho */}
      {/* Contenedor Principal del Formulario */}
      <div className={`flex flex-col gap-4 ${isCollapsed ? 'py-2 px-6 h-16 overflow-hidden' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full transition-all duration-300 ease-in-out`} style={isCollapsed ? { minHeight: '70px' } : {}}>

        {/* Cabecera: Título y Botones */}
        <div className={`flex items-center ${isCollapsed ? 'mb-0' : 'mb-4'}`}>
          {/* Input Título */}
          <div className="w-2/3 relative pr-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Titulo de Pregunta Hija"
              maxLength={50}
              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none bg-transparent ${isCollapsed ? 'py-1' : 'pb-1'} ${(!isCollapsed || (isCollapsed && title.trim() === '')) ? 'border-b-2 border-gray-300 focus:border-blue-custom' : 'border-b-2 border-transparent'}`}
              disabled={isFormDisabled}
            />
            {!isCollapsed && (
              <div className="absolute right-4 bottom-1 text-xs text-gray-500">
                {title.length}/50
              </div>
            )}
          </div>

          {/* Botones de cabecera */}
          <div className="w-1/3 flex items-center justify-end gap-3">
            {/* Botón "Cancelar" - solo visible si no está guardado */}
            {!isCollapsed && !isFormDisabled && (
              <button
                className="bg-red-500 rounded-full text-white px-4 py-2 hover:bg-red-600 transition-colors shadow-md"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}

            {/* Indicador de guardado - solo visible si está guardado */}
            {!isCollapsed && isFormDisabled && (
              <div className="bg-green-500 rounded-full text-white px-4 py-2">
                Guardado
              </div>
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
                    onClick={() => !isFormDisabled && handleQuestionTypeSelect(type.id)}
                    className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors duration-200
                      ${selectedQuestionType === type.id
                        ? 'bg-green-custom text-white border-green-500 shadow-sm'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
                    disabled={isFormDisabled}
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

            {/* Sección: Descripción de la Pregunta */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción de la Pregunta</h2>
              <RichTextEditor
                value={description}
                onChange={!isFormDisabled ? handleDescriptionChange : null}
                readOnly={isFormDisabled}
              />
            </div>

            {/* Sección: Opciones adicionales (Switches) - Sin el switch de pregunta madre */}
            <div className="text-base md:text-lg flex flex-col md:flex-row justify-between gap-4 py-2 font-work-sans">
              <SwitchOption
                value={mandatory}
                onChange={() => !isFormDisabled && setMandatory(!mandatory)}
                label="¿Esta pregunta es obligatoria?"
                disabled={!canActivateSwitches || isFormDisabled}
              />
              <SwitchOption
                value={addToBank}
                onChange={!isFormDisabled ? handleBankSwitchChange : null}
                label="Añadir esta pregunta al banco de preguntas"
                disabled={!canActivateSwitches || isFormDisabled}
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
      </div>
    </div>
  );
});

export default ChildQuestionForm;