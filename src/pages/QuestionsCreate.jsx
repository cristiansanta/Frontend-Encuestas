import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import QuestionsForm from '../components/QuestionsForm.jsx';
import InputsContent from '../components/InputsContent.jsx';
import ProgresBar from '../components/ProgresBar.jsx';
import Preview from '../assets/img/Preview.svg';
import NextButton from '../components/NextButton';
import SelectorSections from '../components/SelectorSections.jsx';
import { useNavigate } from 'react-router-dom'; 
import Notificationpush from "../components/Notificationpush";

const QuestionsCreate = () => {
  const navigate = useNavigate();
  const questionsFormRef = useRef(null);
  const inputsContentRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAction, setNotificationAction] = useState("");

  const handleNextClick = () => {
    const seccion =localStorage.getItem('section_id')
    
    if(seccion){
      console.log("id seccion",seccion)
    if (questionsFormRef.current && questionsFormRef.current.submitQuestionForm) {
      questionsFormRef.current.submitQuestionForm();
    }

    if (inputsContentRef.current && inputsContentRef.current.submitInputsContent) {
      inputsContentRef.current.submitInputsContent();
    }
  }else{
    console.log("no tiene",seccion)
    // Configura la notificación push
    setNotificationMessage("Debes seleccionar una sección para guardar la pregunta.");
    setNotificationAction("eliminar"); // O puedes usar otro valor dependiendo del diseño
    setShowNotification(true); // Muestra la notificación
    
  }
  };
  
  const handleNavigate =()=>{
    navigate('/DependencyList'); 
  }

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 flex flex-col items-center mt-7">
        <HeaderBanner />
        <HeaderBar props="Configuración de la encuesta: Creación de Preguntas" />
        <ProgresBar currentView="QuestionsCreate" />

        <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto mt-4 flex justify-end items-center space-x-4">
          <img src={Preview} alt="Preview" className="h-12 w-12 object-contain svg-hover" />
        </div>

        <div className="mt-2 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto mb-10 rounded-xl" style={{ backgroundColor: '#D9D9D969' }}>
          <SelectorSections />
          <QuestionsForm ref={questionsFormRef} />
          <InputsContent ref={inputsContentRef} />

          <div className="mt-2 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto mb-10 rounded-xl">
          {/* Renderiza la notificación push si está activa */}
      {showNotification && (
        <Notificationpush
          message={notificationMessage}
          duration={3000}
          action={notificationAction}
          onClose={() => setShowNotification(false)} // Ocultar notificación
        />
      )}
            <NextButton onClick={handleNextClick} disabled={false} />
          </div>
        </div>

        {/* Este es el contenedor del botón "Siguiente", movido al final */}
        <div className="mt-2 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto mb-10 rounded-xl flex justify-end">
          <button
            className="h-12 w-40 pl-2 rounded-lg bg-[#39A900] hover:bg-green-700 text-white"
            onClick={handleNavigate} // Llama a handleNextClick en el evento onClick
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsCreate;

