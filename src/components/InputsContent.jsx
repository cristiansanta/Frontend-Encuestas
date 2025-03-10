import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al dashboard
import OpenAnswerImg from '../assets/img/OpenAnswer.png';
import MultipleChoiceImg from '../assets/img/MultipleChoice.png';
import UniqueOptionImg from '../assets/img/UniqueOption.png';
import TrueOrFalseImg from '../assets/img/TrueOrFalse.png';
import MultipleChoice from './DynamicList/MultipleChoice.jsx';
import UniqueOption from './DynamicList/UniqueOption.jsx';
import { Surveyquestions } from './surveyquestions.jsx';

import Modal from './Modal'; // Asegúrate de importar el modal

const InputsContent = forwardRef((props, ref) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 
  const [userInputData, setUserInputData] = useState('');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [uniqueOptionData, setUniqueOptionData] = useState([]);
  const [trueFalseOption, setTrueFalseOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const [modalStatus, setModalStatus] = useState('success'); // Estado para el tipo de mensaje ('success' o 'error')

  const navigate = useNavigate(); // Hook para redirigir al dashboard

  const options = [
    { id: 1, value: 'respuesta_abierta', label: 'Respuesta Abierta', img: OpenAnswerImg },
    { id: 2, value: 'opcion_multiple', label: 'Opción Múltiple', img: MultipleChoiceImg },
    { id: 3, value: 'opcion_unica', label: 'Opción Única', img: UniqueOptionImg },
    { id: 4, value: 'verdadero_falso', label: 'Verdadero o Falso', img: TrueOrFalseImg }
  ];

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'questionoptions/store';

  const waitForQuestionsId = () => {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const questionsId = localStorage.getItem('questions_id');
        if (questionsId) {
          clearInterval(checkInterval);
          resolve(questionsId);
        }
      }, 100); // Verifica cada 100 ms si 'questions_id' está disponible
    });
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setErrorMessage('Debe seleccionar un tipo de respuesta e ingresar los datos.');
      setModalStatus('error'); // Indica que el modal es de error
      setIsModalOpen(true); // Abrir el modal
      localStorage.removeItem("selectedOptionId");
      return;
    }

    let optionsData;

    const questionsId = await waitForQuestionsId();

    switch (selectedOption.value) {
      case 'verdadero_falso':
        optionsData = {
          questions_id: questionsId,
          options: "Verdadero o Falso",
          creator_id: 1,
          status: '1',
        };
        break;
      case 'opcion_multiple':
        optionsData = {
          questions_id: questionsId,
          options: multipleChoiceOptions.map(option => ({
            option: option.label,
            selected: option.selected || false,
          })),
          creator_id: 1,
          status: '1',
        };
        break;
      case 'opcion_unica':
        optionsData = {
          questions_id: questionsId,
          options: uniqueOptionData,
          creator_id: 1,
          status: '1',
        };
        break;
      case 'respuesta_abierta':
        optionsData = {
          questions_id: questionsId,
          options: "Respuesta abierta",
          creator_id: 1,
          status: '1',
        };
        break;
      default:
        optionsData = {
          questions_id: questionsId,
          options: userInputData,
          creator_id: 1,
          status: '1',
        };
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(optionsData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar las opciones');
      }

      setIsModalOpen(true); // Abrimos el modal de éxito
      setModalStatus('success'); // Indica que es un modal de éxito
      
      // Restablecer el estado de los formularios
      setSelectedOption(null);
      setUserInputData('');
      setMultipleChoiceOptions([]);
      setUniqueOptionData([]);
      setTrueFalseOption(null);
      setIsOpen(false);
      Surveyquestions();
      
    } catch (error) {
      console.error('Error al enviar las opciones:', error);
      setIsModalOpen(true); // Abrir el modal de error
    }
  };

  // Expone la función handleSubmit al componente padre
  useImperativeHandle(ref, () => ({
    submitInputsContent: handleSubmit,
  }));

  // Cerrar el modal y desplazarse a la parte superior de la página
  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.removeItem("section_id");
    window.scrollTo(0, 0); // Volver a la parte superior de la vista
  };

  // Redirigir al dashboard
  const goToDashboard = () => {
    localStorage.removeItem("selectedOptionId");
    localStorage.removeItem("questions_id");
    localStorage.removeItem("id_survey");
    localStorage.removeItem("section_id");
    navigate('/dashboard'); 
  };

  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg border border-gray-200 shadow-lg bg-white w-11/12 mx-auto mt-2">
      <h2 className="text-2xl font-bold text-[#00324D]">Tipo de respuesta</h2>
      
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-200 text-left p-4 rounded-lg shadow flex items-center justify-between"
        >
          {selectedOption ? (
            <div className="flex items-center">
              <img src={selectedOption.img} alt={selectedOption.label} className="w-6 h-6 mr-2" />
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            'Seleccione una opción'
          )}
          <span className="ml-2">&#9662;</span>
        </button>

        {isOpen && (
          <ul className="absolute w-full bg-white shadow-lg mt-2 rounded-lg z-10">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                  localStorage.setItem('selectedOptionId', option.id); // Guarda el id de la opción seleccionada en el localStorage
                }}
                className="flex items-center cursor-pointer p-4 hover:bg-gray-100"
              >
                <img src={option.img} alt={option.label} className="w-6 h-6 mr-2" />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {selectedOption?.value === 'opcion_multiple' && <MultipleChoice onOptionsChange={setMultipleChoiceOptions} />}
      {selectedOption?.value === 'opcion_unica' && <UniqueOption onInputChange={setUniqueOptionData} />}
      
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={modalStatus === 'success' ? "La pregunta se guardó con éxito" : "Error al guardar la pregunta"} // Título dinámico basado en el estado
        message={modalStatus === 'success' ? "" : errorMessage}  // Mensaje de error si hay un error, vacío si es éxito
        onCancel={closeModal}  // Cierra el modal y vuelve a la parte superior al hacer clic en "OK"
        type="informative"  // Modal informativo (un solo botón)
        confirmText="OK"  // El botón dirá "OK"
        onConfirm={closeModal}  // Cierra el modal y vuelve a la parte superior al hacer clic en "OK"
/>

    </div>
  );
});

export default InputsContent;
