import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import InputSlide from './InputSlide.jsx';
import Modal from './Modal';
import SectionSelector from './SectionSelector';
import { getSections, getSelectedSection, saveSelectedSection } from '../services/SectionsStorage';
import DOMPurify from 'dompurify';
import collapseExpandButton from '../assets/img/collapseExpandButton.svg';
import openAnswer from '../assets/img/OpenAnswer.svg';
import number from '../assets/img/number.svg';
import selectCircle from '../assets/img/selectCircle.svg';
import multipleOption from '../assets/img/multipleOption.svg';
import trueFalse from '../assets/img/trueFalse.svg';
import calendar from '../assets/img/calendar2.svg';
import Down from '../assets/img/down.svg';
import AddCategory from '../assets/img/Add_1.svg';
import AddCategory1 from '../assets/img/AddCategory1.svg';

const SwitchOption = ({ value, onChange, label }) => (
  <div className="flex items-center gap-2">
    <InputSlide
      value={value}
      onChange={onChange}
    />
    <span className="font-semibold text-dark-blue-custom">
      {label}
    </span>
  </div>
);

const QuestionsForm = forwardRef(({ onAddChildQuestion, ...props }, ref) => {
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
  // Estado para las secciones disponibles - Cargamos desde localStorage
  const [availableSections, setAvailableSections] = useState([]);
  // Añadir el estado para controlar el colapso
  const [isCollapsed, setIsCollapsed] = useState(false);

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';

  // Cargamos las secciones al inicio desde localStorage
  useEffect(() => {
    const loadSections = () => {
      // Obtener secciones guardadas
      const storedSections = getSections();

      if (storedSections.length > 0) {
        setAvailableSections(storedSections);

        // Intentar cargar la sección seleccionada previamente
        const savedSection = getSelectedSection();
        if (savedSection) {
          setSelectedSection(savedSection);
        }
      } else {
        // Si no hay secciones guardadas, usamos datos de ejemplo
        const mockSections = [
          { id: 1, name: 'Información Personal' },
          { id: 2, name: 'Experiencia Laboral' },
          { id: 3, name: 'Experiencia Académica' }
        ];
        setAvailableSections(mockSections);
      }
    };

    loadSections();

    // También configuramos un listener para detectar cambios en localStorage
    // realizados por otras ventanas/pestañas
    const handleStorageChange = (e) => {
      if (e.key === 'survey_sections') {
        loadSections();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para alternar el estado de colapso
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Tipos de preguntas disponibles
  const questionTypes = [
    { id: 1, name: 'Respuesta Abierta', icon: openAnswer },
    { id: 2, name: 'Numérica', icon: number },
    { id: 3, name: 'Opción Única', icon: selectCircle },
    { id: 4, name: 'Opción Multiple', icon: multipleOption },
    { id: 5, name: 'Falso / Verdadero', icon: trueFalse },
    { id: 6, name: 'Fecha', icon: calendar }
  ];

  const handleQuestionTypeSelect = (typeId) => {
    setSelectedQuestionType(typeId);
    localStorage.setItem("selectedOptionId", typeId);
  };

  // Manejar la selección de sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    saveSelectedSection(section.id); // Guardar en localStorage
  };

  // Manejar cambio en el input del título
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Función para manejar clic en "Agregar pregunta hija"
  const handleAddChildQuestion = () => {
    // Verificar que se haya seleccionado un tipo de pregunta
    if (!selectedQuestionType) {
      setErrorMessage('Debe seleccionar un tipo de respuesta antes de agregar una pregunta hija.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    // Verificar que se haya ingresado título
    if (!title.trim()) {
      setErrorMessage('Debe ingresar un título para la pregunta antes de agregar una pregunta hija.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    // Verificar que se haya seleccionado una sección
    if (!selectedSection) {
      setErrorMessage('Debe seleccionar una sección para la pregunta antes de agregar una pregunta hija.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    // Si todo está bien, llamar a la función para añadir pregunta hija
    if (onAddChildQuestion) {
      onAddChildQuestion({
        parentTitle: title,
        parentType: selectedQuestionType,
        parentSection: selectedSection
      });
    }
  };

  const handleSubmit = async () => {
    const selectedOptionId = localStorage.getItem("selectedOptionId");

    // Función para eliminar las etiquetas HTML solo al inicio y al final de la cadena
    function stripEdgeHtmlTags(str) {
      if (str === null || str === "") return "";
      // Elimina etiquetas al inicio y al final
      return str.replace(/^<\/?[^>]+>/, '').replace(/<\/?[^>]+>$/, '');
    }

    // Validación de datos
    if (!title.trim() || stripEdgeHtmlTags(description).trim() === '<br>') {
      setErrorMessage('Faltan datos por diligenciar.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    if (!selectedOptionId) {
      setErrorMessage('Debe seleccionar un tipo de respuesta e ingresar los datos.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    if (!selectedSection) {
      setErrorMessage('Debe seleccionar una sección para la pregunta.');
      setModalStatus('error');
      setIsModalOpen(true);
      return;
    }

    // Sanitizamos los datos antes de enviarlos al servidor
    const sanitizedTitle = DOMPurify.sanitize(title.trim());
    const sanitizedDescription = DOMPurify.sanitize(stripEdgeHtmlTags(description).trim());

    const formData = {
      title: sanitizedTitle,
      descrip: sanitizedDescription,
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: 0,
      bank: addToBank,
      type_questions_id: selectedOptionId,
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
        throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const responseData = await response.json();

      localStorage.setItem('questions_id', DOMPurify.sanitize(String(responseData.id)));
      setTitle('');
      setDescription('');
      setMandatory(false);
      setAddToBank(false);
      setIsParentQuestion(false);
      setSelectedQuestionType(null);
      // No reseteamos selectedSection para mantener la sección al agregar múltiples preguntas

      // Mostrar mensaje de éxito
      setErrorMessage('Pregunta agregada correctamente.');
      setModalStatus('success');
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setErrorMessage('Error al guardar la pregunta. Intente nuevamente.');
      setModalStatus('error');
      setIsModalOpen(true);
    }
  };

  // Expone la función handleSubmit al componente padre
  useImperativeHandle(ref, () => ({
    submitQuestionForm: handleSubmit,
    addQuestion: handleSubmit // Alias para mayor claridad
  }));

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`flex flex-col gap-4 ${isCollapsed ? 'py-2 px-6 h-16' : 'p-6'} rounded-3xl bg-white shadow-2xl w-full`} style={isCollapsed ? { minHeight: '70px' } : {}}>
        {/* Título de la pregunta - Convertido a input */}
        <div className={`flex items-center ${isCollapsed ? 'mb-0' : 'mb-4'}`}>
          <div className="w-2/3">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Titulo de Pregunta"
              className={`font-work-sans text-3xl font-bold text-dark-blue-custom w-full focus:outline-none ${isCollapsed ? 'py-1' : 'pb-1'} ${
                // Nueva lógica condicional para el borde:
                // Mostrar borde cuando: 
                // 1. NO está colapsado (estado expandido)
                // 2. O cuando está colapsado PERO el título está vacío
                (!isCollapsed || (isCollapsed && title.trim() === '')) ? 'border-b-2 border-gray-300 focus:border-blue-custom' : ''
                }`}
            />
          </div>
          <div className="w-1/3 flex items-center justify-end gap-3">
            {!isCollapsed && (
              <button
                className="flex items-center bg-blue-custom rounded-full overflow-hidden"
                onClick={() => console.log("Importar desde banco")}
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center">
                  <img src={Down} alt="Importar" className="w-5 h-5 mr-2" />
                </span>
                <span className="bg-yellow-custom px-4 py-1">
                  <span className="font-work-sans text-sm font-semibold text-blue-custom">
                    Importar desde el Banco de Preguntas
                  </span>
                </span>
              </button>
            )}

            <div className="rounded-full flex items-center">
              <button
                onClick={toggleCollapse}
                className="focus:outline-none transform transition-transform duration-300"
                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <img src={collapseExpandButton} alt="Colapsar/Expandir" className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido que puede colapsarse */}
        {!isCollapsed && (
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
                    onClick={() => handleQuestionTypeSelect(type.id)}
                    className={`flex items-center space-x-2 px-4 py-1 rounded-full border 
      ${selectedQuestionType === type.id
                        ? 'bg-green-custom text-white border-green-500' // Cambiado a verde cuando está seleccionado
                        : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                  >
                    <img
                      src={type.icon}
                      alt={type.name}
                      className="w-5 h-5"
                      // Si está seleccionado, aplicamos el filtro para que se vea blanco
                      style={selectedQuestionType === type.id ? { filter: 'brightness(0) invert(1)' } : {}}
                    />
                    {/* Aplicamos semibold a todos los textos */}
                    <span className="font-semibold">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sección con el nuevo selector */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Seccion</h2>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona la sección a la que pertene la pregunta
              </p>
              <SectionSelector
                sections={availableSections}
                onSectionSelect={handleSectionSelect}
                initialSelectedSection={selectedSection}
              />
            </div>

            {/* Descripción de la Pregunta */}
            <div className="mb-4">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-2">Descripción de la Pregunta</h2>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>

            {/* Opciones adicionales con switches */}
            <div className="text-base md:text-lg flex flex-col md:flex-row justify-between gap-4 py-2 font-work-sans">
              <SwitchOption
                value={isParentQuestion}
                onChange={() => setIsParentQuestion(!isParentQuestion)}
                label="Convertir en pregunta madre"
              />

              <SwitchOption
                value={mandatory}
                onChange={() => setMandatory(!mandatory)}
                label="¿Es ta pregunta es obligatoria?"
              />

              <SwitchOption
                value={addToBank}
                onChange={() => setAddToBank(!addToBank)}
                label="Añadir esta pregunta al banco de preguntas"
              />
            </div>
          </>
        )}

        {/* Modal para mostrar mensajes */}
        <Modal
          isOpen={isModalOpen}
          title={modalStatus === 'error' ? "Error" : "Éxito"}
          message={DOMPurify.sanitize(errorMessage)}
          onConfirm={closeModal}
          onCancel={closeModal}
          type="informative"
          status={modalStatus}
        />
      </div>

      {/* Botón para agregar pregunta hija (condicional) - MODIFICADO para que tenga ancho reducido pero alineado a la izquierda */}
      {isParentQuestion && (
        <div className="mt-4 flex justify-end">
          <button
            className="w-5/6 py-3 bg-yellow-custom rounded-xl flex items-center justify-start pl-6 gap-2 hover:bg-yellow-400 transition-colors relative"
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

      {/* Botón para agregar pregunta */}
      <div className="mt-4">
        <button
          className="w-full py-3 bg-yellow-custom rounded-xl flex items-center justify-start pl-6 gap-2 hover:bg-yellow-400 transition-colors relative"
          onClick={handleSubmit}
        >
          <span className="font-work-sans text-xl font-bold text-blue-custom">Agregar pregunta</span>
          <div className="absolute right-4">
            <img src={AddCategory1} alt="Agregar" className="w-8 h-8" />
          </div>
        </button>
      </div>
    </>
  );
});

export default QuestionsForm;