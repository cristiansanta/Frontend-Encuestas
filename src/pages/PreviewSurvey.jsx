import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyContext } from '../Provider/SurveyContext';
import SurveyLayout from '../components/SurveyLayout';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

// Importaciones de imágenes
import ViewIcon from '../assets/img/viewicon.svg';
import Seccion from '../assets/img/seccion.svg';
import SeccionWhite from '../assets/img/seccionwhite.svg';
import Calendar from '../assets/img/calendar2.svg';
import Select from '../assets/img/select.svg';
import SelectBlue from '../assets/img/selectblue.svg';

// Íconos para tipos de pregunta
import openAnswer from '../assets/img/OpenAnswer.svg';
import number from '../assets/img/number.svg';
import selectCircle from '../assets/img/selectCircle.svg';
import multipleOption from '../assets/img/multipleOption.svg';
import trueFalse from '../assets/img/trueFalse.svg';

const PreviewSurvey = () => {
  const navigate = useNavigate();
  
  // Obtener contexto de la encuesta
  const { surveyData, getPreviewData } = useContext(SurveyContext);
  
  // Estado local para la vista previa
  const [previewData, setPreviewData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Preparar los datos para la vista previa al montar el componente
  useEffect(() => {
    const preparePreview = () => {
      const preview = getPreviewData();
      setPreviewData(preview);
      
      // Inicializar estados de expansión de secciones
      const initialExpandedSections = {};
      if (preview.sections && preview.sections.length > 0) {
        preview.sections.forEach(section => {
          initialExpandedSections[section.id] = false;
        });
        setExpandedSections(initialExpandedSections);
      }
    };
    
    preparePreview();
  }, [getPreviewData]);

  // Efectos para el scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentProgress = window.scrollY / totalHeight;
      setScrollProgress(currentProgress);

      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Obtener título de la encuesta y categoría
  const categoryData = previewData?.category || JSON.parse(localStorage.getItem('selectedCategory')) || null;
  const headerTitle = `Previsualización de la encuesta: ${
    previewData?.title || 
    (categoryData ? `${categoryData[0][0]} ${categoryData[0][1]}` : 'Perfil Personal y Profesional')
  }`;

  // Funciones para manejar publicación y guardado
  const handlePublish = () => {
    setIsSaving(true);
    
    // Aquí iría la lógica para enviar la encuesta completa al servidor
    // Simulación de guardado para este ejemplo
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      
      // Podríamos limpiar los datos de la encuesta actual al publicar
      // clearSurveyData(); // Descomentar si quieres limpiar los datos al publicar
      
      navigate('/survey-list');
    }, 1500);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    
    // Aquí iría la lógica para guardar el borrador en el servidor
    // Simulación de guardado para este ejemplo
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  const handlePreviewSurvey = () => {
    navigate('/preview-details'); // Redirige a la ruta de SurveyDetails
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Mapear los tipos de preguntas de nuestro sistema a nombres más amigables
  const getQuestionTypeName = (typeId) => {
    const types = {
      1: 'Respuesta Abierta',
      2: 'Numérica',
      3: 'Opción Única',
      4: 'Opción Multiple',
      5: 'Falso / Verdadero',
      6: 'Fecha'
    };
    return types[typeId] || 'Desconocido';
  };
  // Componente auxiliar para las secciones colapsables
  const CollapsibleSection = ({ title, isOpen, onToggle, icon, children }) => {
    const sectionRef = useRef(null);

    const handleToggle = (e) => {
      e.preventDefault();
      const currentScrollY = window.scrollY;
      onToggle();
      setTimeout(() => {
        window.scrollTo(0, currentScrollY);
      }, 0);
    };

    return (
      <div className="mb-6" ref={sectionRef}>
        <motion.div
          className="bg-dark-blue-custom text-white p-4 rounded-xl flex justify-between items-center cursor-pointer border-2 border-gray-700"
          onClick={handleToggle}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="flex items-center">
            {icon}
            <span className="font-work-sans text-lg font-semibold ml-2">{title}</span>
          </div>
          <div
            className="bg-white rounded-full flex items-center justify-center p-1"
            style={{ width: '30px', height: '30px' }}
          >
            <motion.span
              initial={false}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <img src={SelectBlue} alt="Selector" className="w-4 h-4" />
            </motion.span>
          </div>
        </motion.div>
        <div className="overflow-hidden border-2 border-gray-300">
          {isOpen && (
            <div className="border-t border-gray-200 rounded-b-xl bg-gray-100 p-4 shadow-inner">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente para mostrar una pregunta individual
  const SurveyQuestion = ({
    id,
    question,
    description,
    type,
    options = null,
    placeholder = null,
    hasIndent = false
  }) => {
    const isOpen = expandedQuestions[id] || false;
    const questionRef = useRef(null);

    const questionTypeIcons = {
      'Respuesta Abierta': openAnswer,
      'Numérica': number,
      'Opción Única': selectCircle,
      'Opción Multiple': multipleOption,
      'Falso / Verdadero': trueFalse,
      'Fecha': Calendar
    };

    const iconSrc = questionTypeIcons[type] || openAnswer;

    const handleToggle = (e) => {
      e.preventDefault();
      const currentScrollY = window.scrollY;
      toggleQuestion(id);
      setTimeout(() => {
        window.scrollTo(0, currentScrollY);
      }, 0);
    };
    return (
      <div className={`${hasIndent ? 'ml-8' : ''} mb-4`} ref={questionRef}>
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
          <div
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={handleToggle}
          >
            <span className="text-dark-blue-custom font-bold">{question}</span>
            <div
              className="bg-dark-blue-custom rounded-full flex items-center justify-center p-1"
              style={{ width: '30px', height: '30px' }}
            >
              <div className="transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <img src={Select} alt="Expand" className="w-3 h-3" />
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="border-t px-4 py-3 bg-gray-50">
              <div className="mb-4">
                <p className="text-dark-blue-custom font-bold mb-1">Tipo de pregunta</p>
                <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-gray-100 border border-gray-300">
                  <img
                    src={iconSrc}
                    alt={type}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">{type}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-dark-blue-custom font-bold mb-1">Descripción de la pregunta</p>
                <div 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>

              <div className="mb-2">
                <p className="text-dark-blue-custom font-bold mb-1">
                  {options ? 'Opciones de respuesta' : 'Respuesta'}
                </p>
                <p className="text-gray-500 italic mb-3">
                  El encuestado verá {options ? 'las siguientes opciones en pantalla' :
                    type === 'Fecha' ? 'el siguiente campo y al dar click podrá seleccionar la fecha en un calendario' :
                    'un campo como el que se enseña a continuación donde podrá ingresar texto'}.
                </p>

                {/* Renderizado del tipo de pregunta específico */}
                {type === 'Opción Única' && options && (
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`radio-${id}`}
                          id={`radio-${id}-${index}`}
                          className="w-5 h-5"
                        />
                        <label htmlFor={`radio-${id}-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {/* Renderizado para opciones múltiples */}
                {type === 'Opción Multiple' && options && (
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`checkbox-${id}-${index}`}
                          className="w-5 h-5"
                        />
                        <label htmlFor={`checkbox-${id}-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Renderizado para respuesta abierta */}
                {type === 'Respuesta Abierta' && (
                  <div className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        placeholder={placeholder || "Escribe tu respuesta"}
                        maxLength={100}
                        className="w-full border-none focus:outline-none"
                      />
                      <span className="text-gray-400">0/100</span>
                    </div>
                  </div>
                )}

                {/* Renderizado para fecha */}
                {type === 'Fecha' && (
                  <div className="border rounded-lg p-3 bg-white flex justify-between items-center">
                    <span className="text-gray-400">DD/MM/AAAA</span>
                    <img src={Calendar} alt="Calendario" className="w-5 h-5" />
                  </div>
                )}

                {/* Renderizado para verdadero/falso */}
                {type === 'Falso / Verdadero' && (
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`truefalse-${id}`}
                        id={`true-${id}`}
                        className="w-5 h-5"
                      />
                      <label htmlFor={`true-${id}`}>Verdadero</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`truefalse-${id}`}
                        id={`false-${id}`}
                        className="w-5 h-5"
                      />
                      <label htmlFor={`false-${id}`}>Falso</label>
                    </div>
                  </div>
                )}

                {/* Renderizado para respuesta numérica */}
                {type === 'Numérica' && (
                  <div className="border rounded-lg p-3 bg-white">
                    <input
                      type="number"
                      placeholder="Ingresa un número"
                      className="w-full border-none focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  // Si los datos aún no están listos, mostrar un cargador
  if (!previewData) {
    return (
      <SurveyLayout
        currentView="PreviewSurvey"
        headerTitle="Cargando vista previa..."
        showNavButton={false}
      >
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos de la encuesta...</p>
        </div>
      </SurveyLayout>
    );
  }

  return (
    <SurveyLayout
      currentView="PreviewSurvey"
      headerTitle={headerTitle}
      showNavButton={false}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-custom origin-left z-50"
        style={{ scaleX: scrollProgress }}
      />

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <h1 className="text-2xl font-bold text-dark-blue-custom mb-4">
          Vista Previa y Revisión Final de Encuesta
        </h1>

        <p className="mb-1">
          Aquí podrás <strong className="text-blue-custom">previsualizar tu encuesta</strong> tal y como la verán quienes la responderán. Revisa cada detalle: la fecha,
          las secciones y cada pregunta, para asegurarte de que todo esté perfecto <strong className="text-dark-blue-custom">antes de Publicar</strong>.
        </p>
        <p className="mb-4 italic text-gray-600">
          * Recuerda que tambien puedes guardar tu proceso para publicarlo despues.
        </p>

        {showButtons && (
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="save"
              text="Guardar sin publicar"
              onClick={handleSaveDraft}
              disabled={isSaving}
              size="md"
            />

            <Button
              variant="publish"
              text="Publicar"
              onClick={handlePublish}
              disabled={isSaving}
              size="md"
            />
          </div>
        )}

        {isSaving && (
          <div className="text-center mt-4">
            <p className="text-blue-custom">Guardando cambios...</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-dark-blue-custom">
            {previewData.title || "Encuesta sobre tu Perfil Personal y Profesional"}
          </h1>
          <button
            className="flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={handlePreviewSurvey}
          >
            <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
              <img src={ViewIcon} alt="Previsualizar encuesta" className="w-5 h-5" />
            </span>
            <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
              <span className="font-work-sans text-lg font-semibold text-blue-custom">
                Previsualizar encuesta
              </span>
            </span>
          </button>
        </div>
        {/* Mostrar secciones */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Secciones</h2>
          <div className="flex flex-wrap gap-4">
            {previewData.sections && previewData.sections.map((section) => (
              <motion.div
                key={section.id}
                className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:bg-gray-200"
                whileHover={{ scale: 1.05 }}
              >
                <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
                <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">
                  {section.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mostrar rango de fechas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Rango de tiempo</h2>
          <div className="flex gap-6">
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de inicio:</span>
              <span className="border-r border-gray-300 px-4 py-2">
                {new Date(previewData.startDate).toLocaleDateString('es-ES')}
              </span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </motion.div>
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de finalización:</span>
              <span className="border-r border-gray-300 px-4 py-2">
                {new Date(previewData.endDate).toLocaleDateString('es-ES')}
              </span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </motion.div>
          </div>
        </div>

        {/* Descripción de la encuesta */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Descripción de la Encuesta</h2>
          <div className="border p-4 rounded-lg bg-gray-50">
            <div dangerouslySetInnerHTML={{ __html: previewData.description }} />
          </div>
        </div>
        {/* Secciones con preguntas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Secciones de la Encuesta</h2>

          {previewData.sections && previewData.sections.map((section) => {
            // Buscar todas las preguntas que pertenecen a esta sección
            const sectionQuestions = previewData.questions.filter(
              q => q.section && q.section.id === section.id
            );

            return (
              <CollapsibleSection
                key={section.id}
                title={section.name}
                isOpen={expandedSections[section.id] || false}
                onToggle={() => toggleSection(section.id)}
                icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
              >
                {sectionQuestions.length === 0 ? (
                  <p className="text-gray-500 italic">No hay preguntas en esta sección.</p>
                ) : (
                  sectionQuestions.map((question) => (
                    <React.Fragment key={question.id}>
                      <SurveyQuestion
                        id={question.id}
                        question={question.title}
                        description={question.description}
                        type={getQuestionTypeName(question.questionType)}
                        options={question.options}
                      />
                      
                      {/* Renderizar preguntas hijas si existen */}
                      {question.childForms && question.childForms.length > 0 && (
                        <div className="ml-8 mt-2">
                          {question.childForms.map((childForm) => (
                            <SurveyQuestion
                              key={childForm.id}
                              id={childForm.id}
                              question={childForm.data.title}
                              description={childForm.data.description}
                              type={getQuestionTypeName(childForm.data.questionType)}
                              options={childForm.data.options}
                              hasIndent={true}
                            />
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))
                )}
              </CollapsibleSection>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <div>
            <p className="text-dark-blue-custom">
              Para <span className="font-bold">Publicar</span> y <span className="font-bold">Guardar</span> sin publicar regresa al inicio de esta página:
              
                href="#"
                onClick={(e) => {e.preventDefault(); scrollToTop();}}
                className="text-green-600 underline ml-1"
              >
                click aquí
              </a>.
            </p>
          </div>
        </div>

        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: showScrollButton ? 1 : 0,
            scale: showScrollButton ? 1 : 0,
            y: showScrollButton ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.img
              src={Select}
              alt="Volver arriba"
              className="w-5 h-5 rotate-180"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </SurveyLayout>
  );
};

export default PreviewSurvey;