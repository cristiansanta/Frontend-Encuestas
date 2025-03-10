import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const DataSender = ({ 
  title,
  description,  // Esto incluye el texto enriquecido con imágenes en base64
  id_category,
  status,
  accessToken,
  onSuccess,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('success');
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sendData = async () => {
    const endpoint = import.meta.env.VITE_API_ENDPOINT + 'surveys/store';
    if (!accessToken) {
      setModalTitle('Error de autenticación');
      setModalMessage('No se encontró un token de acceso. Inicia sesión nuevamente.');
      setModalStatus('error');
      setIsModalOpen(true);
      console.error('Token de acceso no proporcionado.');
      return;
    }
    
    try {
      setLoading(true);
      const name_user=localStorage.getItem('userName')
      console.log(name_user)
      const response = await axios.post(
        endpoint,
        {
          title,
          descrip: description,  // Aquí estamos enviando el texto enriquecido (que puede incluir imágenes en base64)
          id_category,
          status,
          user_create:name_user,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 200) {
        setModalTitle('Éxito');
        setModalMessage('Datos enviados con éxito.');
        setModalStatus('success');
        setIsModalOpen(true);
        navigate('/SectionsCreate');
        localStorage.setItem('id_survey', response.data.survey.id);
        if (onSuccess) onSuccess();
      } else {
        setModalTitle('Error');
        setModalMessage('Hubo un problema al enviar los datos.');
        setModalStatus('error');
        setIsModalOpen(true);
        if (onError) onError();
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error.response?.data || error.message);
      setModalTitle('Error al enviar los datos');
      setModalMessage(error.response?.data?.message || 'Revise los campos ingresados.');
      setModalStatus('error');
      setIsModalOpen(true);
      if (onError) onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={sendData}
        disabled={loading}
        className="w-[218px] h-[45px] rounded-[10px] bg-[#39A900] text-white"
      >
        {loading ? 'Enviando...' : 'Siguiente'}
      </button>

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
    </>
  );
};

export default DataSender;
