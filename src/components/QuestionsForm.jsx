import React, { useState, forwardRef, useImperativeHandle } from 'react';
import RichTextEditor from './TextBoxDetail.jsx';
import TitleDetail from './TitleDetail.jsx';
import InputSlide from './InputSlide.jsx';
import Modal from './Modal'; // Asegúrate de importar el modal
import Notificationpush from "../components/Notificationpush";
import DOMPurify from 'dompurify'; // Importamos DOMPurify

const QuestionsForm = forwardRef((props, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mandatory, setMandatory] = useState(false); 
  const [addToBank, setAddToBank] = useState(false); 
  const [conditionForOther, setConditionForOther] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const [modalStatus, setModalStatus] = useState('default'); // Estado para el tipo de modal
  

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questions/store';

  const handleSubmit = async () => { 
  
    const selectedOptionId = localStorage.getItem("selectedOptionId");

    // Función para eliminar las etiquetas HTML solo al inicio y al final de la cadena
    function stripEdgeHtmlTags(str) {
      if (str === null || str === "") return "";
    
      // Elimina etiquetas al inicio y al final
      return str.replace(/^<\/?[^>]+>/, '').replace(/<\/?[^>]+>$/, '');
    }

    // En tu condicional dentro del componente
    if (!title.trim() || stripEdgeHtmlTags(description).trim() === '<br>') {
      setErrorMessage('Faltan datos por diligenciar.'); // Establecemos el mensaje de error
      setIsModalOpen(true); // Abrimos el modal de error
      return;
    }
   
    if (!selectedOptionId) {
      setErrorMessage('Debe seleccionar un tipo de respuesta e ingresar los datos.');
      setModalStatus('error'); // Indica que el modal es de error
      setIsModalOpen(true); // Abrir el modal
      return;
    }
    
    // Sanitizamos los datos antes de enviarlos al servidor
    const sanitizedTitle = DOMPurify.sanitize(title.trim());
    const sanitizedDescription = DOMPurify.sanitize(stripEdgeHtmlTags(description).trim());
    
    const formData = {
      title: sanitizedTitle,
      descrip: sanitizedDescription,
      validate: mandatory ? 'Requerido' : 'Opcional',
      cod_padre: 0,
      bank: addToBank,
      type_questions_id: selectedOptionId,
      questions_conditions: conditionForOther,
      creator_id: 1,
    };
   
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      
      const responseData = await response.json();
     
      localStorage.setItem('questions_id', DOMPurify.sanitize(String(responseData.id)));
      setTitle('');
      setDescription('');
      setMandatory(false);
      setAddToBank(false);
      setConditionForOther(false);

     // localStorage.removeItem("selectedOptionId");
      
      
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      
      setIsModalOpen(true); // Abrimos el modal de error
    

    }
  };

  // Expone la función handleSubmit al componente padre
  useImperativeHandle(ref, () => ({
    submitQuestionForm: handleSubmit,
  }));

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg border border-gray-200 shadow-lg bg-white w-11/12 mx-auto mt-2">
        <TitleDetail 
        value={title} 
        onChange={(e) => setTitle(DOMPurify.sanitize(e.target.value))} // Sanitizar el título
        title_name="Titulo de la Pregunta" 
      />
      <RichTextEditor value={description} onChange={setDescription} />

      <div className="flex items-center mt-4">
        <span className="text-lg font-semibold text-[#00324D]">Obligatorio</span>
        <InputSlide value={mandatory} onChange={() => setMandatory(!mandatory)} />
      </div>

      <div className="flex items-center mt-4">
        <span className="text-lg font-semibold text-[#00324D]">Añadir esta pregunta al banco de preguntas</span>
        <InputSlide value={addToBank} onChange={() => setAddToBank(!addToBank)} />
      </div>

      <div className="flex items-center mt-4">
        {/* <span className="text-lg font-semibold text-[#00324D]">¿Esta pregunta es condición para otra pregunta?</span> */}
        <span className="text-lg font-semibold text-[#00324D]">¿Esta pregunta va a contener preguntas hijas?</span>
        <InputSlide value={conditionForOther} onChange={() => setConditionForOther(!conditionForOther)} />
      </div>

      {/* Modal para mostrar mensajes de error */}
      <Modal
        isOpen={isModalOpen}
        title="Error"
        message={DOMPurify.sanitize(errorMessage)} // Sanitizamos el mensaje de error
        onCancel={closeModal} // Función para cerrar el modal
        type="informative" // Modal informativo, solo un botón de "Cerrar"
        status={modalStatus}
      />
    </div>
  );
});

export default QuestionsForm;