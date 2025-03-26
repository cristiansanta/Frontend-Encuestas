import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importaciones de imágenes
import datosgenerales from '../assets/img/datosgenerales.svg';
import preguntas from '../assets/img/preguntas.svg';
import previsualizar from '../assets/img/previsualizar.svg';

const ProgressBar = ({ currentView }) => {
  const navigate = useNavigate();

  const viewSteps = {
    SurveyCreate: 1,
    QuestionsCreate: 2,
    PreviewSurvey: 3,
    // Puedes agregar más vistas según sea necesario
  };

  const activeStep = viewSteps[currentView] || 1;

  const steps = [
    { id: 1, label: 'Datos Generales', completed: activeStep >= 1, route: '/SurveyCreate', icon: datosgenerales },
    { id: 2, label: 'Preguntas', completed: activeStep >= 2, route: '/QuestionsCreate', icon: preguntas },
    { id: 3, label: 'Previsualizar', completed: activeStep >= 3, route: '/PreviewSurvey', icon: previsualizar },
  ];

  const handleStepClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            className={`flex items-center cursor-pointer ${step.completed ? '' : 'opacity-70'}`}
            onClick={() => handleStepClick(step.route)}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              activeStep === step.id 
                ? 'bg-yellow-400' // Círculo activo (amarillo)
                : 'bg-gray-300'   // Círculo inactivo (gris)
            }`}>
              <img src={step.icon} alt={step.label} className="w-8 h-8" />
            </div>
            <span className={`ml-2 ${activeStep === step.id ? 'font-bold' : 'text-gray-600'}`}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="border-t-2 border-gray-300 w-16 mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;