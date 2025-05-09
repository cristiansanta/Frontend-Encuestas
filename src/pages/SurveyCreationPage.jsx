import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyContext } from '../Provider/SurveyContext';
import DetailForm from '../components/DetailForm';
import QuestionsForm from '../components/QuestionsForm';
import PreviewSurvey from '../components/PreviewSurvey';

const SurveyCreationPage = () => {
  const { currentStep, goToStep, surveyData } = useContext(SurveyContext);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const navigate = useNavigate();
  
  // Referencias para los componentes de formulario
  const questionsFormRef = useRef(null);
  
  // Si se actualiza la URL manualmente, redirigir según el paso actual del contexto
  useEffect(() => {
    // Esta lógica es opcional si quieres también controlar la navegación con la URL
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    
    if (stepParam && parseInt(stepParam, 10) !== currentStep) {
      goToStep(parseInt(stepParam, 10));
    }
  }, []);
  
  // Actualizar URL cuando cambia el paso (opcional)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('step', currentStep);
    window.history.replaceState(null, '', `?${urlParams.toString()}`);
  }, [currentStep]);
  
  // Manejar cambio en validez del paso 1
  const handleStep1ValidationChange = (isValid) => {
    setIsStep1Valid(isValid);
  };
  
  // Manejar cambio en validez del paso 2
  const handleStep2ValidationChange = (isValid) => {
    setIsStep2Valid(isValid);
  };
  
  // Manejar el paso 1 completado y continuar al paso 2
  const handleSaveStep1AndContinue = (data) => {
    console.log('Paso 1 completado con datos:', data);
    // Los datos ya se sincronizaron con el contexto en DetailForm
  };
  
  // Manejar el paso 2 completado y continuar al paso 3
  const handleSaveStep2AndContinue = () => {
    if (questionsFormRef.current) {
      questionsFormRef.current.submitQuestionForm();
    }
  };
  
  // Renderizar el paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DetailForm 
            onFormValidChange={handleStep1ValidationChange}
            onSaveAndContinue={handleSaveStep1AndContinue}
          />
        );
      case 2:
        return (
          <QuestionsForm 
            ref={questionsFormRef}
            onFormValidChange={handleStep2ValidationChange}
          />
        );
      case 3:
        return <PreviewSurvey />;
      default:
        return <div>Paso no válido</div>;
    }
  };
  
  return (
    <div className="survey-creation-container">
      {/* Mostrar miga de pan o indicador de progreso */}
      <div className="progress-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`} onClick={() => goToStep(1)}>
          Datos Generales
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`} onClick={() => currentStep > 1 && goToStep(2)}>
          Preguntas
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`} onClick={() => currentStep > 2 && goToStep(3)}>
          Previsualizar
        </div>
      </div>
      
      {/* Contenido del paso actual */}
      <div className="step-content">
        {renderCurrentStep()}
      </div>
      
      {/* Botones de navegación entre pasos */}
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button 
            className="btn-previous"
            onClick={() => goToStep(currentStep - 1)}
          >
            Anterior
          </button>
        )}
        
        {currentStep < 3 && (
          <button 
            className="btn-next"
            onClick={() => {
              if (currentStep === 1 && isStep1Valid) {
                handleSaveStep1AndContinue();
              } else if (currentStep === 2) {
                handleSaveStep2AndContinue();
              }
            }}
            disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
          >
            {currentStep === 2 ? "Continuar a Vista Previa" : "Guardar y Continuar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SurveyCreationPage;