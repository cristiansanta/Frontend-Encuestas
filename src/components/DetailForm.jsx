import React, { useState, useEffect, useContext } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import TitleDetail from './TitleDetail.jsx';
import DataSender from './DataSender.jsx';
import { SurveyContext } from '../Provider/SurveyContext'; // Importar el contexto
import Modal from './Modal'; // Importar el modal

const DetailForm = () => {
  const { selectedCategory } = useContext(SurveyContext); // Obtener la categoría seleccionada

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal
  const [modalTitle, setModalTitle] = useState(''); // Estado para el título del modal
  const [modalMessage, setModalMessage] = useState(''); // Estado para el mensaje del modal
  const [modalStatus, setModalStatus] = useState('error'); // Estado para el estilo del modal (éxito o error)

  // Función para cerrar el modal
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
      setIsModalOpen(true); // Mostrar modal con mensaje de error
    }
  }, []);

  const handleNextClick = () => {
    setModalTitle('Alerta');
    setModalMessage('Por favor, complete todos los campos requeridos antes de continuar.'); // Establecemos el mensaje de error
    setModalStatus('error');
    setIsModalOpen(true); // Abrimos el modal para mostrar el mensaje
  };

  const handleSuccess = () => {
    setTitle('');
    setDescription('');
    setModalTitle('Éxito');
    setModalMessage('Datos enviados correctamente.');
    setModalStatus('success');
    setIsModalOpen(true); // Mostrar modal con mensaje de éxito
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg bg-[#F0F0F0]">
      {/* Campo para el título */}
      <div className="flex flex-col">
        <label htmlFor="title" className="font-medium text-gray-700">
          Título de la Encuesta <span className="text-red-500">*</span>
        </label>
        <TitleDetail
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          title_name="Titulo de la Encuesta"
        />
      </div>

      {/* Campo para la descripción */}
      <div className="flex flex-col">
        <label htmlFor="description" className="font-medium text-gray-700">
          Descripción <span className="text-red-500">*</span>
        </label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      {/* Botón de siguiente o envío */}
      <div className="ml-auto">
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
            id_category={selectedCategory[0][0]} // Enviar el ID de la categoría seleccionada
            status={true}
            accessToken={accessToken}
            onSuccess={handleSuccess}
            onError={() => {
              setModalTitle('Error en el envío');
              setModalMessage('Hubo un problema al enviar los datos.');
              setModalStatus('error');
              setIsModalOpen(true); // Mostrar modal de error en caso de fallo
            }}
          />
        )}
      </div>

      {/* Modal para mostrar mensajes de alerta */}
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={closeModal} // Cierra el modal
        onCancel={closeModal} // Cierra el modal
        confirmText="Cerrar"
        cancelText="Cancelar"
        type="informative" // Tipo de modal para mensajes informativos
        status={modalStatus} // Puede ser 'success' o 'error'
      />
    </div>
  );
};

export default DetailForm;
