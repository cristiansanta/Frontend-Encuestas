import React, { useState, useEffect, useContext } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import Addsurvey from '../assets/img/addsurvey.svg';
import { SurveyContext } from '../Provider/SurveyContext';
import selectCategory from '../assets/img/selectCategory.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import trashcan from '../assets/img/trashCan.svg';
import calendar2 from '../assets/img/calendar2.svg';
import Modal from './Modal';
import Calendar from './Calendar'; 
import DOMPurify from 'dompurify';
import SectionModal from './SectionModal';

const DetailForm = ({ onFormValidChange, onSaveAndContinue }) => {
  const { 
    selectedCategory, 
    sections, 
    setSections 
  } = useContext(SurveyContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('error');
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Estado para el modal de secciones
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  // Fecha actual para usar como mínima
  const today = new Date();

  // Estados para las fechas - por defecto, usa la fecha actual
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Estados para mostrar los calendarios
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Verificar validez del formulario
  useEffect(() => {
    const valid = title.trim() !== '' && description.trim() !== '';
    setIsFormValid(valid);
    
    // Comunicar el cambio de validez al componente padre
    if (onFormValidChange) {
      onFormValidChange(valid);
    }
  }, [title, description, onFormValidChange]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('No se encontró el token de acceso. Inicia sesión nuevamente.');
      setModalTitle('Error de autenticación');
      setModalMessage('No se encontró el token de acceso. Por favor, inicia sesión de nuevo.');
      setModalStatus('error');
      setIsModalOpen(true);
    }
  }, []);

  // Cuando cambia la fecha de inicio, actualizar la fecha mínima de finalización
  useEffect(() => {
    // Si la fecha de finalización es anterior a la fecha de inicio, actualizarla
    if (endDate < startDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  const showErrorMessage = () => {
    setModalTitle('Alerta');
    setModalMessage('Por favor, complete todos los campos requeridos antes de continuar.');
    setModalStatus('error');
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setTitle('');
    setDescription('');
    setModalTitle('Éxito');
    setModalMessage('Datos enviados correctamente.');
    setModalStatus('success');
    setIsModalOpen(true);
  };

  // Handlers para actualizar las fechas
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Función para manejar el envío de datos
  const handleSave = () => {
    if (!isFormValid) {
      showErrorMessage();
      return;
    }

    // Pasar datos al componente padre
    if (onSaveAndContinue) {
      onSaveAndContinue({
        title: sanitizedTitle,
        description: sanitizedDescription,
        id_category: selectedCategory ? selectedCategory[0][0] : null,
        startDate,
        endDate,
        accessToken
      });
    }
  };

  // Función para abrir el modal de secciones
  const openSectionModal = () => {
    setIsSectionModalOpen(true);
  };

  // Función para guardar las secciones
  const handleSaveSections = (newSections) => {
    setSections(newSections);
  };

  // Función auxiliar para navegar (define navigate si no está disponible)
  const navigate = (path) => {
    console.log(`Navegación a: ${path}`);
    // Implementa la navegación real según tu enrutador
  };

  // Sanitizar datos antes de enviarlos
  const sanitizedTitle = title ? DOMPurify.sanitize(title) : '';
  const sanitizedDescription = description ? DOMPurify.sanitize(description) : '';

  // Manejar cambio en el input del título
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Función para mostrar tooltip al hover en botones de eliminar
  const showDeleteTooltip = (event) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'bg-gray-800 text-white text-sm rounded px-2 py-1 absolute z-10';
    tooltip.textContent = 'Eliminar sección';
    tooltip.style.top = `${event.clientY - 30}px`;
    tooltip.style.left = `${event.clientX}px`;
    tooltip.id = 'delete-tooltip';
    document.body.appendChild(tooltip);
  };

  const hideDeleteTooltip = () => {
    const tooltip = document.getElementById('delete-tooltip');
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white shadow-2xl w-full">

        {/* Sección superior con dos elementos (título y categoría) */}
        <div className="flex justify-between items-center mb-2">
          <div className="w-2/3">
            {/* Campo para el título - Convertido de h1 a input */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Titulo de Encuesta"
              className="font-work-sans text-3xl font-bold text-dark-blue-custom w-full border-b-2 border-gray-300 focus:border-blue-custom focus:outline-none pb-1"
            />
          </div>
          <div className="w-1/3 flex justify-end">
            <button className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
              <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                <img src={selectCategory} alt="Filtrar" className="w-5 h-5" />
              </span>
              <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                <span className="font-work-sans text-lg font-semibold text-blue-custom mr-2">
                  Seleccionar Categoría
                </span>
                <img src={Selectsurvey} alt="Filtrar" className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>

        {/* Segunda sección - Secciones de la encuesta */}
        <div className="mb-4">
          <div className="mb-1 border border-white">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
          </div>
          <p className="font-work-sans text-sm mb-3 text-gray-600">
            Agrega las secciones en las que clasificarás las preguntas.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* Mostrar solo las primeras 3 secciones */}
            {sections.slice(0, 3).map((section, index) => (
              <div key={index} className="border border-white">
                <button 
                  className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                  onMouseEnter={showDeleteTooltip}
                  onMouseLeave={hideDeleteTooltip}
                >
                  <span className="bg-orange-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                    <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                  </span>
                  <span className="bg-gray-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                    <span className="font-work-sans text-lg font-semibold text-blue-custom">
                      {section}
                    </span>
                  </span>
                </button>
              </div>
            ))}
            
            {/* Botón para mostrar el modal de secciones */}
            <div className="border border-white">
              <button 
                onClick={openSectionModal}
                className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <img src={Addsurvey} alt="Nueva sección" className="w-5 h-5" />
                </span>
                <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Nueva Sección
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Rango de tiempo */}
        <div className="mb-4">
          <div className="mb-1 border border-white p-0">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
          </div>
          <div className="flex space-x-4">
            <div className="border border-white relative">
              {/* Calendario de inicio con control de apertura/cierre */}
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
                  // Si abrimos el calendario de inicio, cerramos el de finalización
                  if (isOpen) setShowEndCalendar(false);
                }}
              />
            </div>

            <div className="border border-white relative">
              {/* Calendario de finalización con control de apertura/cierre */}
              <Calendar
                initialDate={endDate}
                selectedDate={endDate}
                onDateSelect={handleEndDateChange}
                buttonLabel="Fecha de Finalización:"
                calendarIcon={calendar2}
                minDate={startDate}
                isEndDate={true}
                isOpen={showEndCalendar}
                onOpenChange={(isOpen) => {
                  setShowEndCalendar(isOpen);
                  // Si abrimos el calendario de finalización, cerramos el de inicio
                  if (isOpen) setShowStartCalendar(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Sección de descripción */}
        <div className="mb-4">
          <div className="mb-2 border border-white">
            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
          </div>
          <div className="border border-white">
            <RichTextEditor
              value={description}
              onChange={(value) => setDescription(DOMPurify.sanitize(value))} // Sanitizar la descripción
            />
          </div>
        </div>

        {/* Modal para mensajes */}
        <Modal
          isOpen={isModalOpen}
          title={DOMPurify.sanitize(modalTitle)}
          message={DOMPurify.sanitize(modalMessage)}
          onConfirm={closeModal}
          onCancel={closeModal}
          confirmText="Cerrar"
          cancelText="Cancelar"
          type="informative"
          status={modalStatus}
        />

        {/* Modal para gestionar secciones */}
        <SectionModal
          isOpen={isSectionModalOpen}
          onClose={() => setIsSectionModalOpen(false)}
          onSave={handleSaveSections}
          existingSections={sections}
        />
      </div>
    </>
  );
};

export default DetailForm;