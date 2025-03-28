import React, { useState, useEffect, useContext } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import Addsurvey from '../assets/img/addsurvey.svg';
import DataSender from './DataSender.jsx';
import { SurveyContext } from '../Provider/SurveyContext'; 
import Filtersurvey from '../assets/img/filtersurvey.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import trashcan from '../assets/img/trashCan.svg';
import Modal from './Modal';

const DetailForm = () => {
  const { selectedCategory } = useContext(SurveyContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('error');

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

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg bg-[#F0F0F0]">
      {/* Contenedor principal que corresponde al marco exterior del wireframe */}
      <div className="border border-gray-300 p-4 rounded-lg">
        
        {/* Sección superior con dos elementos (título y categoría) */}
        <div className="flex justify-between mb-4">
          <div className="w-1/3 border border-gray-300 p-2">
            {/* Campo para el título */}
            <h1 className="font-work-sans text-5xl font-bold text-dark-blue-custom">Titulo de Encuesta</h1>
          </div>
          <div className="w-1/3 border border-gray-300 p-2">
            <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
                <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                  <img src={Filtersurvey} alt="Filtrar" className="w-5 h-5" />
                </span>
                <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                  Seleccionar Categoría
                  <img src={Selectsurvey} alt="Filtrar" className="w-5 h-5 ml-3" />
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
              <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-orange-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                  <img src={trashcan} alt="Seccion 01" className="w-5 h-5" />
                </span>
                <span className="bg-gray-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                  Seccion 01
                </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
            <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-orange-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                  <img src={trashcan} alt="Seccion 01" className="w-5 h-5" />
                </span>
                <span className="bg-gray-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                  Seccion 01
                </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
            <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="bg-orange-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                  <img src={trashcan} alt="Seccion 01" className="w-5 h-5" />
                </span>
                <span className="bg-gray-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                  Seccion 01
                </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                    <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                      <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
                    </span>
                    <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                      Nueva Sección
                    </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tercera sección - Rango de tiempo */}
        <div className="border border-gray-300 p-2 mb-4">
          <div className="mb-2 border border-gray-300 p-2">
          <h2 className="font-work-sans text-4xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
          </div>
          <div className="flex space-x-4">
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                    <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                      Fecha de Inicio:
                    </span>
                    <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                      02/10/2025
                    </span>
              </button>
            </div>
            <div className="border border-gray-300 p-2">
              <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                    <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                      Fecha de Finalización:
                    </span>
                    <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                      02/10/2025
                    </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Cuarta sección - Descripción */}
        <div className="border border-gray-300 p-2">
          <div className="mb-2 border border-gray-300 p-2">
            <h2 className="font-work-sans text-4xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
          </div>
          <div className="border border-gray-300 p-2">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
        </div>

        {/* Botón de siguiente o envío */}
        <div className="mt-4 ml-auto">
          {!title.trim() || !description.trim() ? (
            <button
              onClick={handleNextClick}
              className="w-[218px] h-[45px] rounded-[10px] bg-[#39A900] text-white"
            >
              Siguiente
            </button>
          ) : (
            <DataSender
              title={title}
              description={description}
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
            />
          )}
        </div>
      </div>

      {/* Modal para mostrar mensajes de alerta */}
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        message={modalMessage}
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