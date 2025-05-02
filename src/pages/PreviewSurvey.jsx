import React, { useState, useEffect, useContext, useRef } from 'react';
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
  const [expandedSections, setExpandedSections] = useState({
    personal: false,
    laboral: false,
    academica: false
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const categoryData = JSON.parse(localStorage.getItem('selectedCategory'));
  const headerTitle = `Previsualización de la encuesta: ${categoryData ? `${categoryData[0][0]} ${categoryData[0][1]}` : 'Perfil Personal y Profesional'}`;

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
            Encuesta sobre tu Perfil Personal y Profesional
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
            <motion.div
              className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
            >
              <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
              <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">Información Personal</span>
            </motion.div>
            <motion.div
              className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
            >
              <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
              <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">Experiencia Laboral</span>
            </motion.div>
            <motion.div
              className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
            >
              <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
              <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">Experiencia Académica</span>
            </motion.div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Rango de tiempo</h2>
          <div className="flex gap-6">
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de inicio:</span>
              <span className="border-r border-gray-300 px-4 py-2">02/10/25</span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </motion.div>
            <motion.div
              className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de finalización:</span>
              <span className="border-r border-gray-300 px-4 py-2">02/10/25</span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </motion.div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Descripción de la Encuesta</h2>
          <div className="border p-4 rounded-lg bg-gray-50">
            <p>
              Esta encuesta tiene como objetivo recopilar información sobre tus datos generales, tu experiencia laboral y tu trayectoria
              académica. Las preguntas están organizadas en tres secciones: la primera se enfoca en tus datos personales básicos, la segunda
              en tu experiencia profesional, y la tercera en tu formación académica. El propósito de esta encuesta es obtener una visión
              completa de tu perfil para diversos fines, como análisis de tendencias laborales y académicas. Tu participación es valiosa y te
              agradecemos por dedicar tiempo a completarla.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Secciones de la Encuesta</h2>

          <CollapsibleSection
            title="Información Personal"
            isOpen={expandedSections.personal}
            onToggle={() => toggleSection('personal')}
            icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
          >
            <SurveyQuestion
              id="nombre"
              question="Nombre"
              description="Ingrese su nombre completo tal como aparece en su documento de identificación."
              type="Respuesta Abierta"
              placeholder="Ej: Luis Perez Gomez"
            />

            <SurveyQuestion
              id="fecha_nacimiento"
              question="Fecha de nacimiento"
              description="Ingresa tu fecha de nacimiento para ayudarnos a conocer tu edad."
              type="Fecha"
            />

            <SurveyQuestion
              id="genero"
              question="¿En qué género te identificas?"
              description="Selecciona el género con el que te identificas."
              type="Opción Única"
              options={["Masculino", "Femenino", "Otro", "Prefiero no decirlo"]}
            />

            <SurveyQuestion
              id="referencia"
              question="¿Cómo prefieres que nos refiramos a ti?"
              description="Queremos asegurarnos de utilizar el lenguaje con el que te sientas más cómod@. Si tienes una preferencia específica en términos de género o pronombres, puedes compartirla con nosotros."
              type="Respuesta Abierta"
              hasIndent={true}
            />

            <SurveyQuestion
              id="paises"
              question="¿En cual de los siguientes países has vivido?"
              description="Selecciona los países en los que has vivido durante tu vida."
              type="Opción Multiple"
              options={["Colombia", "Venezuela", "Peru", "Chile", "Ecuador", "Argentina", "Uruguay", "Mexico", "Paraguay", "Panama", "Costa Rica"]}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Experiencia Laboral"
            isOpen={expandedSections.laboral}
            onToggle={() => toggleSection('laboral')}
            icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
          >
            <SurveyQuestion
              id="num_trabajos"
              question="¿En cuántos trabajos has tenido experiencia laboral hasta ahora?"
              description="Indica el número de empleos formales en los que has trabajado."
              type="Numérica"
            />

            <SurveyQuestion
              id="situacion_laboral"
              question="¿Cuál es tu situación laboral actual?"
              description="Selecciona la opción que mejor describe tu situación laboral en este momento."
              type="Opción Única"
              options={["Empleado a tiempo completo", "Empleado a tiempo parcial", "Trabajador independiente", "Estudiante", "Desempleado", "Jubilado"]}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Experiencia Académica"
            isOpen={expandedSections.academica}
            onToggle={() => toggleSection('academica')}
            icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
          >
            <SurveyQuestion
              id="nivel_educativo"
              question="¿Qué nivel educativo has alcanzado hasta el momento?"
              description="Selecciona el nivel educativo más alto que has completado."
              type="Opción Única"
              options={["Primaria", "Secundaria", "Técnico/Tecnológico", "Pregrado Universitario", "Especialización", "Maestría", "Doctorado"]}
            />

            <SurveyQuestion
              id="cursando_estudios"
              question="¿Actualmente estás cursando estudios académicos?"
              description="Indícanos si actualmente estás estudiando de manera formal."
              type="Falso / Verdadero"
            />

            <SurveyQuestion
              id="tipo_estudio"
              question="¿Qué tipo de estudio estás cursando actualmente?"
              description="Selecciona el tipo de estudio que estás realizando en este momento."
              type="Opción Única"
              options={["Pregrado Universitario", "Postgrado", "Curso de formación", "Certificación"]}
              hasIndent={true}
            />

            <SurveyQuestion
              id="area_conocimiento"
              question="¿En qué área de conocimiento se enmarca tu estudio?"
              description="Selecciona el área principal de tu formación actual."
              type="Opción Única"
              options={["Ciencias Sociales", "Ciencias Naturales", "Ingeniería", "Ciencias de la Salud", "Artes y Humanidades", "Ciencias Económicas", "Otra"]}
              hasIndent={true}
            />

            <SurveyQuestion
              id="etapa_formacion"
              question="¿En qué etapa de tu formación te encuentras actualmente?"
              description="Indícanos en qué fase de tus estudios actuales te encuentras."
              type="Opción Única"
              options={["Inicio", "Intermedio", "Final", "Tesis/Proyecto final"]}
              hasIndent={true}
            />
          </CollapsibleSection>
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
