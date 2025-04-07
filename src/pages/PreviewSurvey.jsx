import React, { useState } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import Button from '../components/Button';
import ViewIcon from '../assets/img/viewicon.svg';
import { useNavigate } from 'react-router-dom';
import Seccion from '../assets/img/seccion.svg';
import SeccionWhite from '../assets/img/seccionwhite.svg';
import Calendar from '../assets/img/calendar2.svg';

const PreviewSurvey = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    laboral: true,
    academica: true
  });

  // Recuperar datos de categoría del localStorage
  const categoryData = JSON.parse(localStorage.getItem('selectedCategory'));

  // Crear el título del header
  const headerTitle = `Previsualización de la encuesta: ${categoryData ? `${categoryData[0][0]} ${categoryData[0][1]}` : 'Perfil Personal y Profesional'
    }`;

  // Manejar la publicación de la encuesta
  const handlePublish = () => {
    setIsSaving(true);

    // Simular una llamada a la API para publicar
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  // Manejar el guardado sin publicar
  const handleSaveDraft = () => {
    setIsSaving(true);

    // Simular una llamada a la API para guardar como borrador
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  // Manejar la expansión/colapso de secciones
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Componente para secciones colapsables
  const CollapsibleSection = ({ title, isOpen, onToggle, icon, children }) => (
    <div className="mb-6">
      <div
        className="bg-dark-blue-custom text-white p-4 rounded-lg flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <span className="font-work-sans text-lg font-semibold">{title}</span>
        </div>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="border border-gray-200 rounded-b-lg bg-gray-100 p-4">
          {children}
        </div>
      )}
    </div>
  );

  // Componente para preguntas
  const SurveyQuestion = ({ question, hasIndent = false }) => (
    <div className={`border bg-gray-50 rounded-lg p-4 mb-3 flex justify-between items-center ${hasIndent ? 'ml-8' : ''}`}>
      <span className="text-dark-blue-custom font-medium">{question}</span>
      <span className="text-dark-blue-custom">▼</span>
    </div>
  );

  return (
    <SurveyLayout
      currentView="PreviewSurvey"
      headerTitle={headerTitle}
      showNavButton={false}
    >
      {/* Contenedor superior con instrucciones y botones */}
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

      {/* Componente de previsualización principal */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-dark-blue-custom">
            Encuesta sobre tu Perfil Personal y Profesional
          </h1>
          <button className="flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
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

        {/* Secciones */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Secciones</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-200">
              <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
              <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">Información Personal</span>
            </div>
            <div className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-200">
              <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
              <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">Experiencia Laboral</span>
            </div>
            <div className="bg-gray-100 rounded-full py-2 px-4 flex items-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-200">
              <img src={Seccion} alt="Ver" className="w-5 h-5 mr-2" />
              <span className="transition-colors duration-300 ease-in-out hover:text-blue-500">Experiencia Académica</span>
            </div>
          </div>
        </div>


        {/* Rango de tiempo */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Rango de tiempo</h2>
          <div className="flex gap-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de inicio:</span>
              <span className="border-r border-gray-300 px-4 py-2">{/* Fecha de inicio */}02/10/25</span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <span className="bg-dark-blue-custom text-white px-4 py-2 rounded-l-lg">Fecha de finalización:</span>
              <span className="border-r border-gray-300 px-4 py-2">{/* Fecha de finalización */}02/10/25</span>
              <img src={Calendar} alt="Ver" className="w-5 h-5 mx-2" />
            </div>
          </div>
        </div>



        {/* Descripción de la Encuesta */}
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

        {/* Preguntas de la Encuesta */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">Preguntas de la Encuesta</h2>

          {/* Sección de Información Personal */}
          <CollapsibleSection
            title="Información Personal"
            isOpen={expandedSections.personal}
            onToggle={() => toggleSection('personal')}
            icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
          >
            <SurveyQuestion question="Nombre" />
            <SurveyQuestion question="Fecha de nacimiento" />
            <SurveyQuestion question="¿En qué género te identificas?" />
            <SurveyQuestion question="¿Cómo prefieres que nos refiramos a ti?" hasIndent={true} />
            <SurveyQuestion question="¿En cual de los siguientes países has vivido?" />
          </CollapsibleSection>

          {/* Sección de Experiencia Laboral */}
          <CollapsibleSection
            title="Experiencia Laboral"
            isOpen={expandedSections.laboral}
            onToggle={() => toggleSection('laboral')}
            icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
          >
            <SurveyQuestion question="¿En cuántos trabajos has tenido experiencia laboral hasta ahora?" />
            <SurveyQuestion question="¿Cuál es tu situación laboral actual?" />
          </CollapsibleSection>

          {/* Sección de Experiencia Académica */}
          <CollapsibleSection
            title="Experiencia Académica"
            isOpen={expandedSections.academica}
            onToggle={() => toggleSection('academica')}
            icon={<img src={SeccionWhite} alt="Ver" className="w-5 h-5" />}
          >
            <SurveyQuestion question="¿Qué nivel educativo has alcanzado hasta el momento?" />
            <SurveyQuestion question="¿Actualmente estás cursando estudios académicos?" />
            <SurveyQuestion question="¿Qué tipo de estudio estás cursando actualmente?" hasIndent={true} />
            <SurveyQuestion question="¿En qué área de conocimiento se enmarca tu estudio?" hasIndent={true} />
            <SurveyQuestion question="¿En qué etapa de tu formación te encuentras actualmente?" hasIndent={true} />
          </CollapsibleSection>
        </div>

        {/* Información para volver arriba */}
        <div className="flex justify-between items-center mt-8">
          <div>
            <p className="text-dark-blue-custom">
              Para <span className="font-bold">Publicar</span> y <span className="font-bold">Guardar</span> sin publicar regresa al inicio de esta página: <a href="#" className="text-green-600 underline">click aquí</a>.
            </p>
          </div>
        </div>

        {/* Botón flotante para volver arriba */}
        <div className="fixed bottom-8 right-8">
          <button className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all">
            <span className="text-2xl">↑</span>
          </button>
        </div>
      </div>
    </SurveyLayout>
  );
};

export default PreviewSurvey;