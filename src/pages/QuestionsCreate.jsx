import React, { useContext, useState, useRef } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import QuestionsForm from '../components/QuestionsForm';
import { SurveyContext } from '../Provider/SurveyContext';
import { getSurveyInfo } from '../services/SurveyInfoStorage';
import { useNavigate } from 'react-router-dom';

const QuestionsCreate = () => {
  const { selectedCategory } = useContext(SurveyContext);
  const navigate = useNavigate();
  const questionsFormRef = useRef(null);

  // Dos estados separados para controlar la validez:
  // 1. Si hay preguntas guardadas
  const [hasValidQuestions, setHasValidQuestions] = useState(false);
  // 2. Si el usuario está configurando una pregunta
  const [isConfiguringQuestion, setIsConfiguringQuestion] = useState(false);

  // Obtener la categoría del servicio en lugar de localStorage directo
  const surveyInfo = getSurveyInfo();
  // Usar el contexto primero, luego caer de respaldo al servicio
  const categoryData = selectedCategory || surveyInfo.selectedCategory;

  // Crear el título del header basado en la categoría
  const headerTitle = `Configuración de la encuesta: Categoría seleccionada: ${categoryData ? `${categoryData[0][1]}` : ''}`;

  // Manejar el clic en el botón Continuar
  const handleContinue = () => {
    // Navegar a la página de previsualización solo si hay preguntas válidas
    // y no se está configurando ninguna pregunta actualmente
    if (hasValidQuestions && !isConfiguringQuestion) {
      navigate('/preview-survey');
    }
  };

  // El botón debe estar habilitado solo cuando:
  // 1. Hay al menos una pregunta guardada (hasValidQuestions es true)
  // 2. No se está configurando ninguna pregunta (isConfiguringQuestion es false)
  const isButtonEnabled = hasValidQuestions && !isConfiguringQuestion;

  return (
    <SurveyLayout
      currentView="QuestionsCreate"
      headerTitle={headerTitle}
      navButtonType="continue"
      onNavButtonClick={handleContinue}
      navButtonDisabled={!isButtonEnabled}
    >
      <QuestionsForm
        ref={questionsFormRef}
        onQuestionsValidChange={setHasValidQuestions}
        onConfiguringChange={setIsConfiguringQuestion}
      />
    </SurveyLayout>
  );
};

export default QuestionsCreate;