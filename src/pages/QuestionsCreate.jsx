import React, { useContext, useState } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import QuestionsForm from '../components/QuestionsForm';
import { SurveyContext } from '../Provider/SurveyContext';
import { useNavigate } from 'react-router-dom';

const QuestionsCreate = () => {
  const { selectedCategory } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [questionsValid, setQuestionsValid] = useState(false);
  
  // Recuperar datos de categoría del localStorage si no están en el contexto
  const categoryData = selectedCategory || JSON.parse(localStorage.getItem('selectedCategory'));
  
  // Crear el título del header basado en la categoría
  const headerTitle = `Configuración de la encuesta: Categoría seleccionada: ${
    categoryData ? `${categoryData[0][0]} ${categoryData[0][1]}` : ''
  }`;

  // Manejar el clic en el botón Continuar
  const handleContinue = () => {
    // Aquí podrías tener lógica de validación si es necesario
    // Por ejemplo, verificar que haya al menos una pregunta creada
    
    // Navegar a la página de previsualización
    navigate('/preview-survey');
  };

  // Recibir el estado de validez desde el formulario de preguntas
  const handleQuestionsValidChange = (isValid) => {
    setQuestionsValid(isValid);
  };

  return (
    <SurveyLayout 
      currentView="QuestionsCreate"
      headerTitle={headerTitle}
      navButtonType="continue"  // Usamos "continue" para este botón
      onNavButtonClick={handleContinue}
      navButtonDisabled={!questionsValid}  // Deshabilitamos si no hay preguntas válidas
    >
      <QuestionsForm 
        onValidChange={handleQuestionsValidChange}
      />
    </SurveyLayout>
  );
};

export default QuestionsCreate;