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
      {/* Contenedor con el fondo rectangular que se extiende detrás del círculo */}
      <div className={`flex items-center relative ${
        activeStep === step.id 
          ? 'bg-yellow-400' // Fondo amarillo para paso activo
          : 'bg-gray-300'   // Fondo gris para pasos inactivos
      }`}>
        {/* Círculo exterior (naranja) con position absolute para que quede por encima del fondo */}
        <div className={`absolute left-0 p-1 rounded-full z-10 transform -translate-x-1/2 ${
          activeStep === step.id 
            ? 'bg-orange-500' // Círculo exterior naranja para el paso activo
            : 'bg-gray-400'   // Círculo exterior gris oscuro para pasos inactivos
        }`}>
          {/* Círculo interior (amarillo o gris) */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            activeStep === step.id 
              ? 'bg-yellow-400' // Círculo activo (amarillo)
              : 'bg-gray-300'   // Círculo inactivo (gris)
          }`}>
            <img src={step.icon} alt={step.label} className="w-8 h-8" />
          </div>
        </div>
        
        {/* Texto dentro del fondo rectangular, con padding para dejar espacio al círculo */}
        <div className="pl-12 pr-4 py-2 font-bold">
          {step.label}
        </div>
      </div>
    </div>
    
    {index < steps.length - 1 && (
      <div className="border-t-12 border-gray-300 w-16 mx-2"></div>
    )}
  </React.Fragment>
))}
    </div>
  );
};

export default ProgressBar;