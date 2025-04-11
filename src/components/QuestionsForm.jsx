import React, { useState, forwardRef, useImperativeHandle, useContext, useEffect } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import InputSlide from './InputSlide.jsx';
import Modal from './Modal';
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
import { SurveyContext } from '../Provider/SurveyContext';

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

const QuestionsForm = forwardRef((props, ref) => {
  const { sections = [] } = useContext(SurveyContext);
  
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
  // Estado para controlar el dropdown de secciones
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  // Añadir el estado para controlar el colapso
  const [isCollapsed, setIsCollapsed] = useState(false);

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';

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

  const handleSelectSection = (section) => {
    setSelectedSection(section);
    setShowSectionDropdown(false);
  };

  // Manejar cambio en el input del título
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
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
      questions_conditions: isParentQuestion,
      creator_id: 1,
      section: selectedSection
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
      
      // Limpiar formulario después de enviar exitosamente
      setTitle('');
      setDescription('');
      setMandatory(false);
      setAddToBank(false);
      setIsParentQuestion(false);
      setSelectedQuestionType(null);
      // No limpiamos la sección para mantener la continuidad si se agregan múltiples preguntas a la misma sección

      // Mostrar mensaje de éxito
      setModalStatus('success');
      setErrorMessage('Pregunta agregada exitosamente.');
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setModalStatus('error');
      setErrorMessage('Error al guardar la pregunta. Intente nuevamente.');
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
      <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white shadow-2xl w-full">
        {/* Título de la pregunta - Convertido a input */}
        <div className="flex items-center mb-4">
          <div className="w-2/3">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Titulo de pregunta"
              className="font-work-sans text-3xl font-bold text-dark-blue-custom w-full border-b-2 border-gray-300 focus:border-blue-custom focus:outline-none pb-1"
            />
          </div>
          <div className="w-1/3 flex items-center justify-end gap-3">
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

            {/* Sección */}
            <div className="mb-4 relative">
              <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom mb-1">Seccion</h2>
              <p className="text-gray-600 text-sm mb-3">
                Selecciona la sección a la que pertene la pregunta
              </p>
              
              {/* Selector de sección */}
              {!selectedSection ? (
                <button
                  onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                  className="flex items-center bg-blue-custom rounded-full overflow-hidden"
                >
                  <span className="bg-blue-custom text-white px-4 py-1 flex items-center">
                    <img src={AddCategory} alt="Seleccionar" className="w-5 h-5 mr-2" />
                  </span>
                  <span className="bg-yellow-custom px-4 py-1">
                    <span className="font-work-sans text-sm font-semibold text-blue-custom">
                      Elegir sección
                    </span>
                  </span>
                </button>
              ) : (
                <div className="flex items-center">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{selectedSection}</span>
                  </div>
                  <button
                    onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                    className="ml-2 bg-blue-custom text-white rounded-full p-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sr-only">Cambiar sección</span>
                  </button>
                </div>
              )}
              
              {/* Dropdown de secciones */}
              {showSectionDropdown && (
                <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-2">
                    <div className="font-semibold text-gray-700 p-2">Seleccionar sección</div>
                    <div className="max-h-60 overflow-y-auto">
                      {sections.length > 0 ? (
                        <ul className="py-1">
                          {sections.map((section, index) => (
                            <li key={index}>
                              <button
                                onClick={() => handleSelectSection(section)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                              >
                                <span className="text-blue-custom">{section}</span>
                                {selectedSection === section && (
                                  <svg className="w-5 h-5 ml-auto text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500 text-center py-2">
                          No hay secciones disponibles
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
          onCancel={closeModal}
          onConfirm={closeModal}
          confirmText="Cerrar"
          type="informative"
          status={modalStatus}
        />
      </div>
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