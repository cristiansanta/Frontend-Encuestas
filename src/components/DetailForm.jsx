import React, { useState, useEffect, useContext } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import Addsurvey from '../assets/img/addsurvey.svg';
import DataSender from './DataSender.jsx';
import { SurveyContext } from '../Provider/SurveyContext'; 
import Filtersurvey from '../assets/img/filtersurvey.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import trashcan from '../assets/img/trashCan.svg';
import calendar2 from '../assets/img/calendar2.svg';
import continues from '../assets/img/continue.svg';
import Modal from './Modal';
import Calendar from './Calendar'; // Importamos el calendario actualizado
import DOMPurify from 'dompurify'; // Importamos DOMPurify

const DetailForm = () => {
  const { selectedCategory } = useContext(SurveyContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('error');
  
  // Fecha actual para usar como mínima
  const today = new Date();
  
  // Estados para las fechas - por defecto, usa la fecha actual
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  
  // Estados para mostrar los calendarios
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

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

  const handleNextClick = () => {
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

  // Función auxiliar para navegar (define navigate si no está disponible)
  const navigate = (path) => {
    console.log(`Navegación a: ${path}`);
    // Implementa la navegación real según tu enrutador
  };

  // Sanitizar datos antes de enviarlos
  const sanitizedTitle = title ? DOMPurify.sanitize(title) : '';
  const sanitizedDescription = description ? DOMPurify.sanitize(description) : '';

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg bg-[#F0F0F0]">
      {/* Contenedor principal */}
      <div className="border border-gray-300 p-4 rounded-lg">
        
        {/* Sección superior con dos elementos (título y categoría) */}
        <div className="flex justify-between mb-4">
          <div className="w-1/3 border border-gray-300 p-2">
            {/* Campo para el título */}
            <h1 className="font-work-sans text-5xl font-bold text-dark-blue-custom">Titulo de Encuesta</h1>
          </div>
          <div className="w-1/3 border border-gray-300 p-2">
            <button className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
                <span className="bg-blue-custom text-white px-4 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <img src={Filtersurvey} alt="Filtrar" className="w-5 h-5" />
                </span>
                <span className="bg-yellow-custom px-5 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom mr-2">
                    Seleccionar Categoría
                  </span>
                  <img src={Selectsurvey} alt="Filtrar" className="w-5 h-5" />
                </span>
            </button>
          </div>
        </div>
        
        {/* Segunda sección - Secciones de la encuesta */}
        <div className="border border-gray-300 p-2 mb-4">
          <div className="mb-2 border border-gray-300 p-2">
            <h2 className="font-work-sans text-4xl font-bold text-dark-blue-custom">Secciones</h2>
          </div>
          <p className="font-work-sans text-lg italic text-gray-600">
            Agrega las secciones en las que clasificaras las preguntas.
          </p>
          <div className="flex space-x-2">
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-orange-custom text-white px-4 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                </span>
                <span className="bg-gray-custom px-5 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Seccion 01
                  </span>
                </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-orange-custom text-white px-4 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                </span>
                <span className="bg-gray-custom px-5 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Seccion 01
                  </span>
                </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-orange-custom text-white px-4 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                </span>
                <span className="bg-gray-custom px-5 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Seccion 01
                  </span>
                </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-blue-custom text-white px-4 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <img src={Addsurvey} alt="Nueva sección" className="w-5 h-5" />
                </span>
                <span className="bg-yellow-custom px-5 py-2 flex items-center justify-center hover:bg-opacity-80">
                  <span className="font-work-sans text-lg font-semibold text-blue-custom">
                    Nueva Sección
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Rango de tiempo */}
        <div className="border border-gray-300 p-2 mb-4">
          <div className="mb-2 border border-gray-300 p-2">
            <h2 className="font-work-sans text-4xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
          </div>
          <div className="flex space-x-4">
            <div className="border border-gray-300 p-2 relative">
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
            
            <div className="border border-gray-300 p-2 relative">
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
        <div className="border border-gray-300 p-2">
          <div className="mb-2 border border-gray-300 p-2">
            <h2 className="font-work-sans text-4xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
          </div>
          <div className="border border-gray-300 p-2">
          <RichTextEditor 
            value={description} 
            onChange={(value) => setDescription(DOMPurify.sanitize(value))} // Sanitizar la descripción
          />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
  {!sanitizedTitle.trim() || !sanitizedDescription.trim() ? (
    <button
      onClick={handleNextClick}
      className="flex items-center px-4 py-2 bg-green-600 text-white font-work-sans text-lg rounded-full hover:bg-green-700 transition-colors"
    >
      <img src={continues} alt="Continuar" className="mr-3 w-5 h-5" />
      <span>Guardar y continuar</span>
    </button>
  ) : (
    <DataSender
      title={sanitizedTitle}
      description={sanitizedDescription}
      id_category={selectedCategory[0][0]}
      status={true}
      accessToken={accessToken}
      onSuccess={handleSuccess}
      onError={() => {
        setModalTitle('Error en el envío');
        setModalMessage('Hubo un problema al enviar los datos.');
        setModalStatus('error');
        setIsModalOpen(true);
      }}
      buttonContent={
        <div className="flex items-center">
          <img src={continues} alt="Continuar" className="mr-3 w-5 h-5" />
          <span>Guardar y continuar</span>
        </div>
      }
      buttonClassName="flex items-center px-4 py-2 bg-green-600 text-white font-work-sans text-lg rounded-full hover:bg-green-700 transition-colors"
    />
  )}
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
    </div>
  );
};

export default DetailForm;