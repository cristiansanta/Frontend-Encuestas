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
  };
  
  const activeStep = viewSteps[currentView] || 1;
  
  const steps = [
    { id: 1,
      label: 'Datos Generales', 
      completed: activeStep >= 1, 
      route: '/SurveyCreate', 
      icon: datosgenerales
    },
    { id: 2, label: 'Preguntas', completed: activeStep >= 2, route: '/QuestionsCreate', icon: preguntas },
    { id: 3, label: 'Previsualizar', completed: activeStep >= 3, route: '/PreviewSurvey', icon: previsualizar },
  ];

  const handleStepClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div 
              className={`flex items-center relative cursor-pointer ${step.completed ? '' : 'opacity-70'}`}
              onClick={() => handleStepClick(step.route)}>
                
                {/*círculo con el ícono*/}
              <div className={`absolute z-50 -left-12 size-14 shadow-md p-3 border border-4 ${activeStep === step.id ? 'bg-yellow-400':'bg-gray-300'} flex items-center justify-center rounded-full w-14 h-14`}> 
                <img src={step.icon} alt={step.label} className="size-14"/>
              </div>

              {/*rectángulo con el texto del paso*/}
              <div
                className={`flex items-center relative ${
                  activeStep === step.id
                    ? 'bg-yellow-400' // Fondo amarillo para paso activo
                    : 'bg-gray-300'   // Fondo gris para pasos inactivos
                }`}
                style={{ width: '200px' }} // Ancho fijo para todos los rectángulos
                >

                {/* Texto dentro del fondo rectangular, con padding para dejar espacio al círculo */}
                <div className="py-1 font-bold pl-2 w-full border border-4">
                  {step.label}
                </div>
                
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;