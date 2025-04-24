import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

// Importar componente de Layout
import MainLayoutDetailsSurvey from '../components/MainLayoutDetailsSurvey';

// Importar imágenes
import calendar2 from '../assets/img/calendar.svg';
import Addsurvey from '../assets/img/addsurvey.svg';
import trashcan from '../assets/img/addsurvey.svg';
import homeIcon from '../assets/img/addsurvey.svg';

// Importar componentes
import NavigationBackButton from '../components/NavigationBackButton';
import Calendar from '../components/Calendar';
import RichTextEditor from '../components/TextBoxDetail';
import ListRespondents from '../components/DynamicList/ListRespondents';
import SectionDropdown from '../components/SectionDropdown';

/**
 * Componente DetailsSurvey - Muestra los detalles de una encuesta
 * según su estado (Activa, Finalizada, Próxima a Finalizar, Sin publicar)
 */
const DetailsSurvey = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener datos de la encuesta pasados por el estado de navegación
  const surveyData = location.state?.surveyData || {};
  const fromView = location.state?.fromView || 'card';
  
  // Validar si hay datos de encuesta
  useEffect(() => {
    if (!location.state || !location.state.surveyData) {
      // Redireccionar al dashboard si no hay datos de encuesta
      navigate('/dashboard');
    }
  }, [location.state, navigate]);
  
  // Estados del componente
  const [survey, setSurvey] = useState(surveyData);
  const [currentView, setCurrentView] = useState('details');
  const [showBackButton, setShowBackButton] = useState(true);
  const [startDate, setStartDate] = useState(new Date(survey.fechaInicio || Date.now()));
  const [endDate, setEndDate] = useState(new Date(survey.fechaFinal || Date.now()));
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [description, setDescription] = useState(survey.description || '');
  const [sections, setSections] = useState(survey.sections || []);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  
  // Referencias
  const newSectionButtonRef = useRef(null);
    
  // Determinar el título para el header según el estado
  const getHeaderTitle = () => {
    if (!survey.title) return 'Detalles de encuesta';
    
    switch (survey.estado) {
      case 'Activa':
        return `Encuesta activa: ${survey.title}`;
      case 'Finalizada':
        return `Encuesta finalizada: ${survey.title}`;
      case 'Próxima a Finalizar':
        return `Encuesta por finalizar: ${survey.title}`;
      case 'Sin publicar':
        return `Configuración de encuesta: ${survey.title}`;
      default:
        return survey.title;
    }
  };
  
  // Manejadores de eventos
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  
  const handleSectionButtonClick = () => {
    setShowSectionDropdown(!showSectionDropdown);
    // Cerrar calendarios si estaban abiertos
    setShowStartCalendar(false);
    setShowEndCalendar(false);
  };
  
  const handleUpdateSections = (newSections) => {
    setSections([...sections, ...newSections]);
    setShowSectionDropdown(false);
  };
  
  const handleRemoveSection = (sectionId, e) => {
    e.stopPropagation();
    setSections(sections.filter(section => section.id !== sectionId));
  };
  
  // Función para guardar cambios y regresar al dashboard
  const handleSaveChanges = () => {
    const updatedSurvey = {
      ...survey,
      fechaInicio: startDate.toISOString(),
      fechaFinal: endDate.toISOString(),
      description: description,
      sections: sections
    };
    
    // Aquí podrías integrar con SurveyContext para guardar los cambios
    console.log('Guardando cambios en la encuesta:', updatedSurvey);
    
    // Navegar de vuelta al dashboard después de guardar
    navigate('/dashboard');
  };
  
  // Función para manejar el regreso al dashboard
  const handleBackToHome = () => {
    navigate('/dashboard');
  };
  
  // Renderizado condicional según el estado de la encuesta
  const renderSurveyContent = () => {
    switch (survey.estado) {
      case 'Activa':
        return renderActiveState();
      case 'Finalizada':
        return renderFinishedState();
      case 'Próxima a Finalizar':
        return renderComingToEndState();
      case 'Sin publicar':
        return renderNotPublishedState();
      default:
        return renderNotPublishedState();
    }
  };
  
  // Renderizado para estado "Activa"
  const renderActiveState = () => {
    return (
      <>
        <div className="mb-4">
          <h1 className="font-work-sans text-3xl font-bold text-blue-900">{survey.title || 'Encuesta sin título'}</h1>
        </div>
        
        {renderTimeRange()}
        {renderDescription()}
        {renderSections()}
        {renderRespondentsTable()}
      </>
    );
  };
  
  // Renderizado para estado "Finalizada"
  const renderFinishedState = () => {
    return (
      <>
        <div className="mb-4">
          <h1 className="font-work-sans text-3xl font-bold text-purple-900">{survey.title || 'Encuesta sin título'}</h1>
        </div>
        
        {renderTimeRange()}
        {renderDescription()}
        {renderSections()}
        {/* Lista de encuestados en formato lista, no tabla */}
        <div className="mb-4">
          <div className="mb-1">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Lista de encuestados</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <ListRespondents listView={true} />
          </div>
        </div>
      </>
    );
  };
  
  // Renderizado para estado "Próxima a Finalizar"
  const renderComingToEndState = () => {
    return (
      <>
        <div className="mb-4">
          <h1 className="font-work-sans text-3xl font-bold text-orange-600">{survey.title || 'Encuesta sin título'}</h1>
        </div>
        
        {renderTimeRange()}
        {renderDescription()}
        
        {/* Selector de secciones */}
        <div className="mb-4">
          <div className="mb-1">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full">
              <option value="">Seleccionar sección...</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>{section.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {renderRespondentsTable()}
      </>
    );
  };
  
  // Renderizado para estado "Sin publicar"
  const renderNotPublishedState = () => {
    return (
      <>
        {/* Miga de pan (breadcrumb) */}
        <div className="flex items-center mb-4 bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center text-blue-900">
            <span className="mr-2">Configuración</span>
            <span className="mx-2">&gt;</span>
            <span className="font-semibold">Detalles de la encuesta</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h1 className="font-work-sans text-3xl font-bold text-blue-900">{survey.title || 'Nueva Encuesta'}</h1>
        </div>
        
        {/* Sección con el título de la encuesta */}
        <div className="mb-4">
          <div className="mb-1">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Título de la Encuesta</h2>
          </div>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={survey.title || ''}
            onChange={(e) => setSurvey({...survey, title: e.target.value})}
            placeholder="Ingrese el título de la encuesta"
          />
        </div>
        
        {renderTimeRange()}
        {renderDescription()}
        {renderSections()}
        
        {/* Botón para "Guardar y continuar" */}
        <div className="flex justify-end mt-6">
          <button 
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            onClick={handleSaveChanges}
          >
            Guardar y continuar
          </button>
        </div>
      </>
    );
  };
  
  // Componentes comunes reutilizables
  const renderTimeRange = () => {
    return (
      <div className="mb-4">
        <div className="mb-1">
          <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Calendar
              initialDate={startDate}
              selectedDate={startDate}
              onDateSelect={handleStartDateChange}
              buttonLabel="Fecha de Inicio:"
              calendarIcon={calendar2}
              isEndDate={false}
              isOpen={showStartCalendar}
              onOpenChange={(isOpen) => {
                setShowStartCalendar(isOpen);
                if (isOpen) {
                  setShowEndCalendar(false);
                  setShowSectionDropdown(false);
                }
              }}
            />
          </div>
          <div className="relative">
            <Calendar
              initialDate={endDate}
              selectedDate={endDate}
              onDateSelect={handleEndDateChange}
              buttonLabel="Fecha de finalización:"
              calendarIcon={calendar2}
              isEndDate={true}
              isOpen={showEndCalendar}
              onOpenChange={(isOpen) => {
                setShowEndCalendar(isOpen);
                if (isOpen) {
                  setShowStartCalendar(false);
                  setShowSectionDropdown(false);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderDescription = () => {
    return (
      <div className="mb-4">
        <div className="mb-1">
          <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <RichTextEditor
            value={description}
            onChange={(value) => setDescription(DOMPurify.sanitize(value))}
          />
        </div>
      </div>
    );
  };
  
  const renderSections = () => {
    return (
      <div className="mb-4">
        <div className="mb-1">
          <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
        </div>
        <p className="font-work-sans text-sm mb-3 text-gray-600">
          Agrega las secciones en las que clasificarás las preguntas.
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {sections.map(section => (
            <div
              key={section.id}
              className="relative"
            >
              <div className="flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span
                  className="bg-orange-500 text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                  onClick={(e) => handleRemoveSection(section.id, e)}
                >
                  <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                </span>
                <span className="bg-gray-100 px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-900">
                    {section.name}
                  </span>
                </span>
              </div>
            </div>
          ))}

          <div className="relative">
            <button
              ref={newSectionButtonRef}
              className="flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={handleSectionButtonClick}
            >
              <span className="bg-blue-900 text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                <img src={Addsurvey} alt="Nueva sección" className="w-5 h-5" />
              </span>
              <span className="bg-yellow-400 px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                <span className="font-work-sans text-lg font-semibold text-blue-900">
                  Nueva Sección
                </span>
              </span>
            </button>

            {/* Dropdown de secciones (aparece bajo el botón) */}
            <SectionDropdown
              isOpen={showSectionDropdown}
              onOpenChange={setShowSectionDropdown}
              onAddSections={handleUpdateSections}
              onCancel={() => setShowSectionDropdown(false)}
              existingSections={sections}
              anchorRef={newSectionButtonRef}
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderRespondentsTable = () => {
    return (
      <div className="mb-4">
        <div className="mb-1">
          <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Lista de encuestados</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <ListRespondents />
        </div>
      </div>
    );
  };

  // Calcular el título para el header
  const headerTitle = getHeaderTitle();

  return (
    <MainLayoutDetailsSurvey 
      headerTitle={headerTitle}
      showTopBanner={true}
      showHeaderBanner={true}
      surveyState={survey.estado || 'Sin publicar'}
    >
      <div className="w-full mr-auto ml-0 md:ml-12">
        {/* Botón para regresar al dashboard */}
        {showBackButton && (
          <div className="mb-4">
            <NavigationBackButton 
              currentView={currentView} 
              onClick={handleBackToHome}
            >
              <div className="flex items-center">
                <img src={homeIcon} alt="Home" className="w-5 h-5 mr-2" />
                <span>Regresar al dashboard</span>
              </div>
            </NavigationBackButton>
          </div>
        )}
        
        {/* Contenido dinámico según el estado */}
        {renderSurveyContent()}
      </div>
    </MainLayoutDetailsSurvey>
  );
};

export default DetailsSurvey;