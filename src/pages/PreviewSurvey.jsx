import React, { useState, useEffect, useRef } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import Button from '../components/Button';
import ViewIcon from '../assets/img/viewicon.svg';
import { useNavigate } from 'react-router-dom';
import Seccion from '../assets/img/seccion.svg';
import SeccionWhite from '../assets/img/seccionwhite.svg';
import Calendar from '../assets/img/calendar2.svg';
import { motion, AnimatePresence } from 'framer-motion';
import Select from '../assets/img/select.svg';
import SelectBlue from '../assets/img/selectblue.svg';

// Importar servicios para obtener datos guardados
import { getSections } from '../services/SectionsStorage';
import { getQuestions } from '../services/QuestionsStorage';

// Íconos para tipos de pregunta
import openAnswer from '../assets/img/OpenAnswer.svg';
import number from '../assets/img/number.svg';
import selectCircle from '../assets/img/selectCircle.svg';
import multipleOption from '../assets/img/multipleOption.svg';
import trueFalse from '../assets/img/trueFalse.svg';

const PreviewSurvey = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Estados para gestionar secciones y preguntas cargadas
  const [sections, setSections] = useState([]);
  const [sectionQuestions, setSectionQuestions] = useState({});
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Función auxiliar para obtener el nombre del tipo de pregunta
  const getQuestionTypeName = (typeId) => {
    const questionTypes = {
      1: 'Respuesta Abierta',
      2: 'Numérica',
      3: 'Opción Única',
      4: 'Opción Multiple',
      5: 'Falso / Verdadero',
      6: 'Fecha'
    };
    
    return questionTypes[typeId] || 'Desconocido';
  };

  // Gestor de scroll y progreso
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

  // Cargar datos al iniciar el componente
  useEffect(() => {
    // Cargar secciones
    const storedSections = getSections();
    setSections(storedSections);
    
    // Inicializar estado expandido para las secciones
    const initialExpandedSections = {};
    storedSections.forEach(section => {
      initialExpandedSections[section.id] = false; // Todas cerradas por defecto
    });
    setExpandedSections(initialExpandedSections);
    
    // Cargar preguntas
    const storedQuestions = getQuestions();
    
    // Agrupar preguntas por sección
    const questionsBySection = storedQuestions.reduce((acc, question) => {
      const sectionId = question.section?.id;
      if (sectionId) {
        if (!acc[sectionId]) {
          acc[sectionId] = [];
        }
        
        // Añadir pregunta principal
        acc[sectionId].push(question);
        
        // Si tiene preguntas hijas, añadirlas también
        if (question.childForms && question.childForms.length > 0) {
          question.childForms.forEach(childForm => {
            if (childForm.completed && childForm.data) {
              // Marcar como pregunta hija
              acc[sectionId].push({
                ...childForm.data,
                isChildQuestion: true,
                parentId: question.id,
                id: childForm.id // Asegurar que la pregunta hija tenga un ID
              });
            }
          });
        }
      }
      return acc;
    }, {});
    
    setSectionQuestions(questionsBySection);
    
    // Detectar si hay secciones con preguntas y expandirlas automáticamente
    const sectionsWithQuestions = {};
    storedSections.forEach(section => {
      sectionsWithQuestions[section.id] = 
        questionsBySection[section.id] && 
        questionsBySection[section.id].length > 0;
    });
    setExpandedSections(sectionsWithQuestions);
    
    // Cargar información general de la encuesta desde localStorage
    const surveyInfo = localStorage.getItem('survey_info');
    if (surveyInfo) {
      try {
        const parsedInfo = JSON.parse(surveyInfo);
        setSurveyTitle(parsedInfo.title || 'Encuesta sobre tu Perfil Personal y Profesional');
        setSurveyDescription(parsedInfo.description || '');
        setStartDate(parsedInfo.startDate || '');
        setEndDate(parsedInfo.endDate || '');
      } catch (error) {
        console.error('Error al procesar información de la encuesta:', error);
      }
    }
    
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const categoryData = JSON.parse(localStorage.getItem('selectedCategory'));
  const headerTitle = `Previsualización de la encuesta: ${categoryData ? `${categoryData[0][1]}` : 'Perfil Personal y Profesional'}`;

  const handlePublish = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  const handlePreviewSurvey = () => {
    navigate('/preview-details'); // Redirige a la ruta de SurveyDetails
  };
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Componente para secciones plegables/desplegables
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

  // Componente para renderizar una pregunta individual
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

    // Mapeo de tipos de pregunta a íconos
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
                <p className="text-gray-700">{description}</p>
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
                {type === 'Opción Única' && (
                  <div className="space-y-2">
                    {options ? 
                      options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`radio-${id}`}
                            id={`radio-${id}-${index}`}
                            className="w-5 h-5"
                          />
                          <label htmlFor={`radio-${id}-${index}`}>{option}</label>
                        </div>
                      )) : 
                      // Opciones de ejemplo si no hay opciones definidas
                      ['Opción 1', 'Opción 2', 'Opción 3'].map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`radio-${id}`}
                            id={`radio-${id}-${index}`}
                            className="w-5 h-5"
                          />
                          <label htmlFor={`radio-${id}-${index}`}>{option}</label>
                        </div>
                      ))
                    }
                  </div>
                )}

                {type === 'Opción Multiple' && (
                  <div className="space-y-2">
                    {options ? 
                      options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`checkbox-${id}-${index}`}
                            className="w-5 h-5"
                          />
                          <label htmlFor={`checkbox-${id}-${index}`}>{option}</label>
                        </div>
                      )) : 
                      // Opciones de ejemplo si no hay opciones definidas
                      ['Opción 1', 'Opción 2', 'Opción 3'].map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`checkbox-${id}-${index}`}
                            className="w-5 h-5"
                          />
                          <label htmlFor={`checkbox-${id}-${index}`}>{option}</label>
                        </div>
                      ))
                    }
                  </div>
                )}

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

                {type === 'Fecha' && (
                  <div className="border rounded-lg p-3 bg-white flex justify-between items-center">
                    <span className="text-gray-400">DD/MM/AAAA</span>
                    <img src={Calendar} alt="Calendario" className="w-5 h-5" />
                  </div>
                )}

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

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "DD/MM/YY";
    
    try {
      // Si es un string de fecha ISO
      if (typeof dateString === 'string') {
        const date = new Date(dateString);
        // Formatear como DD/MM/YY
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        });
      }
      
      // Si es un objeto Date
      if (dateString instanceof Date) {
        return dateString.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        });
      }
      
      return "DD/MM/YY";
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "DD/MM/YY";
    }
  };
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
            {surveyTitle || "Encuesta sobre tu Perfil Personal y Profesional"}
          </h1>
          <button
            className="flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={handlePreviewSurvey} // Llama a la función para redirigir
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Secciones</h2>
          <div className="flex flex-wrap gap-4">
            {sections.map(section => (
              <motion.div
                key={section.id}
                className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:bg-gray-200"
                whileHover={{ scale: 1.05 }}
              >
                <img src={Seccion} alt="Sección" className="w-5 h-5 mr-2" />
                <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">
                  {section.name}
                </span>
              </motion.div>
            ))}
            {sections.length === 0 && (
              <p className="text-gray-500 italic">No hay secciones creadas para esta encuesta.</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Rango de tiempo</h2>
          <div className="flex gap-6 flex-wrap">
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de inicio:</span>
              <span className="border-r border-gray-300 px-4 py-2">
                {formatDate(startDate) || "DD/MM/YY"}
              </span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </motion.div>
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de finalización:</span>
              <span className="border-r border-gray-300 px-4 py-2">
                {formatDate(endDate) || "DD/MM/YY"}
              </span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </motion.div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Descripción de la Encuesta</h2>
          <div className="border p-4 rounded-lg bg-gray-50">
            {surveyDescription ? (
              <div dangerouslySetInnerHTML={{ __html: surveyDescription }} />
            ) : (
              <p>
                Esta encuesta tiene como objetivo recopilar información sobre tus datos generales, tu experiencia laboral y tu trayectoria
                académica. Las preguntas están organizadas en tres secciones: la primera se enfoca en tus datos personales básicos, la segunda
                en tu experiencia profesional, y la tercera en tu formación académica. El propósito de esta encuesta es obtener una visión
                completa de tu perfil para diversos fines, como análisis de tendencias laborales y académicas. Tu participación es valiosa y te
                agradecemos por dedicar tiempo a completarla.
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Preguntas de la Encuesta</h2>

          {sections.length === 0 ? (
            <p className="text-center text-gray-500 italic py-6">
              No hay secciones creadas para esta encuesta. Regresa al paso 1 para crear secciones.
            </p>
          ) : (
            sections.map(section => {
              const sectionHasQuestions = 
                sectionQuestions[section.id] && 
                sectionQuestions[section.id].length > 0;
                
              return (
                <CollapsibleSection
                  key={section.id}
                  title={section.name}
                  isOpen={expandedSections[section.id] || false}
                  onToggle={() => toggleSection(section.id)}
                  icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
                >
                  {sectionHasQuestions ? (
                    sectionQuestions[section.id].map(question => (
                      <SurveyQuestion
                        key={question.id}
                        id={question.id}
                        question={question.title}
                        description={question.description}
                        type={getQuestionTypeName(question.questionType)}
                        options={question.options || null}
                        hasIndent={question.isChildQuestion}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 italic py-4">
                      No hay preguntas en esta sección. Regresa al paso 2 para crear preguntas.
                    </p>
                  )}
                </CollapsibleSection>
              );
            })
          )}
        </div>

        <div className="flex justify-center mt-8">
          <div>
            <p className="text-dark-blue-custom">
              Para <span className="font-bold">Publicar</span> y <span className="font-bold">Guardar</span> sin publicar regresa al inicio de esta página:
              <a
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