import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cancelIcon from '../assets/img/cancel.svg';
import PlusModal from '../assets/img/PlusModal.png';
import { useQuery } from '@tanstack/react-query';

const ModalQuestions = ({ isOpen, toggleModal, selectedItem, titlefather, refresh }) => {
  const [options, setOptions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [operation, setOperation] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  // useQuery para cargar detalles de preguntas
  const { data, isLoading, error } = useQuery({
    queryKey: ['surveyDetails'],
    enabled: isOpen, // Activamos solo cuando el modal está abierto
  });


 // Función que realiza la eliminacion o la actualizacion de la pregunta
 const fetchquestionsfather = async (item) => {
   
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await axios.put(`${endpoint}questions/${item}`,{
    "cod_padre": selectedQuestion.id
}, {
      headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
      },
  });
  
  return response; // Devolvemos todos los datos
};

  if (!isOpen) return null;
  if (isLoading) return <div>Cargando preguntas...</div>;
  if (error) return <div>Error al cargar preguntas</div>;

  const questionTitles = data?.survey_questions
    .filter((q) => q.question.questions_conditions === true)
    .map((q) => ({
      id: q.question.id,
      title: q.question.title,
      options: q.question.options,
      type: q.question.type.title,
      cod_father: q.question.cod_padre,
    })) || [];

  const handleQuestionChange = (event) => {
  
   

    const selectedTitle = event.target.value;
    const selectedQuestionData = questionTitles.find((q) => q.title === selectedTitle);
   
    
    setSelectedQuestion(selectedQuestionData);
    
    if (selectedQuestionData?.type === "Falso y verdadero") {
      setOptions([
        { id: 1, options: "Verdadero" },
        { id: 2, options: "Falso" }
      ]);
    } else {
      setOptions(selectedQuestionData?.options || []);
    }
  };

  const handleSave = async () => {
    if (selectedQuestion && operation && selectedOption) {
      const payload = {
        id_question_child: selectedItem.question.id,
        operation: operation,
        compare: selectedOption,
        cod_father: selectedQuestion.id,
        id_survey: localStorage.getItem('id_survey'),
      };

      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post(`${endpoint}Conditions/store`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });
        console.log('Respuesta del servidor:', response.data);
        fetchquestionsfather(selectedItem.question.id)
        toggleModal(); // Cerrar modal después de guardar y actualizar        
        refresh()
      } catch (error) {
        console.error('Error al enviar datos:', error);
      }
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-full max-w-[600px] shadow-lg relative">
        <div className='flex bg-[#00324D] p-4 rounded-t-lg'>
          <h2 className="text-center flex-grow text-lg font-bold text-white">Añadir dependencia de la pregunta</h2>
          <button onClick={toggleModal} className="text-white">
            <img src={cancelIcon} alt="Cerrar" className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="w-full">
            <label className="block mb-1 text-center text-[#003f63] font-bold">Pregunta Principal</label>
            <select
              className="border border-[#003f63] rounded-lg w-full p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#003f63]"
              value={selectedQuestion?.title ||''}
              onChange={handleQuestionChange}
              disabled={selectedItem.question.conditions.length>0?true:false}
            >
              <option>{selectedItem.question.conditions.length>0 && titlefather.length>0?titlefather:'Seleccionar'}</option>
              {questionTitles.map((q, index) => (
                <option key={index} value={q.title}>{q.title}</option>
              ))}
            </select>
          </div>
    
          <div className="flex justify-between space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-[#003f63] font-bold text-center">Si la respuesta es</label>
              <select
                className="border border-[#003f63] rounded-lg w-full p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#003f63]"
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                disabled={selectedItem.question.conditions.length>0?true:false}
              >
                <option>{selectedItem.question.conditions.length>0?selectedItem.question.conditions[0].operation:'Seleccionar'}</option>
                <option value="igual que">Igual que</option>
                <option value="diferente">Diferente que</option>
                <option value="contiene">Contiene</option>
                <option value="no contiene">No contiene</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-[#003f63] font-bold text-center">Seleccione la respuesta</label>
              <select
                className="border border-[#003f63] rounded-lg w-full p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#003f63]"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={selectedItem.question.conditions.length>0?true:false}
              >
                <option>{selectedItem.question.conditions.length>0?selectedItem.question.conditions[0].compare:'Seleccionar'}</option>
                {options.map((option, index) => (
                  <option key={index} value={option.options}>{option.options}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="rounded-full p-2 w-10 h-10 flex items-center justify-center">
            <img src={PlusModal} alt="Agregar más" className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-6 flex justify-center pb-6">
          <button 
          onClick={handleSave}
          disabled={selectedItem.question.conditions.length>0?true:false}
          className="bg-[#39A900] w-56 text-white font-bold py-2 px-4 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalQuestions;
 

