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
    { 
      id: 1,
      label: 'Datos Generales', 
      completed: activeStep >= 1, 
      route: '/survey-create', 
      icon: datosgenerales
    },
    { 
      id: 2, 
      label: 'Preguntas', 
      completed: activeStep >= 2, 
      route: '/questions-create', 
      icon: preguntas 
    },
    { 
      id: 3, 
      label: 'Previsualizar', 
      completed: activeStep >= 3, 
      route: '/preview-survey', 
      icon: previsualizar 
    },
  ];
  
  const handleStepClick = (route) => {
    navigate(route);
  };
  
  return (
    <div className="flex items-center justify-center w-full -mt-14">
      <div className="flex">
        {steps.map((step, index) => {
          // Determinar si es el primer o último elemento para aplicar bordes redondeados
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className={`flex items-center relative cursor-pointer ${step.completed ? '' : 'opacity-150'}`}
                onClick={() => handleStepClick(step.route)}>
                
                {/* Círculo con el ícono */}
                <div className={`absolute z-50 -left-12 size-16 shadow-md p-3 border-4 border-gray ${
                  (step.completed === true && activeStep > step.id) 
                  ? 'bg-dark-blue-custom'
                  : activeStep === step.id
                  ? 'bg-yellow-custom'
                  : 'bg-gray-custom'} flex items-center justify-center rounded-full w-16 h-16`}> 
                  <img 
                    src={step.icon} 
                    alt={step.label} 
                    className={`size-14 ${
                      (step.completed === true && activeStep > step.id)
                      ? 'filter brightness-0 invert' // Hace el ícono blanco cuando el fondo es azul
                      : ''
                    }`}
                  />
                </div>
                
                {/* Rectángulo con el texto del paso - AHORA CON BORDES REDONDEADOS */}
                <div
                  className={`flex items-center relative ${
                    (step.completed === true && activeStep > step.id)
                      ? 'font-work-sans font-bold bg-dark-blue-custom text-white'
                      : activeStep === step.id
                      ? 'font-work-sans font-bold bg-yellow-custom text-dark-blue-custom'
                      : 'font-work-sans bg-gray-custom'
                  }`}
                  style={{ 
                    width: '270px',
                    borderRadius: isFirst 
                      ? '0 20px 20px 0' // Primer elemento: redondeado a la derecha
                      : isLast 
                      ? '0 20px 20px 0' // Último elemento: redondeado a la derecha
                      : '0' // Elementos intermedios: sin bordes redondeados
                  }}
                >
                  {/* Texto dentro del fondo rectangular, con padding para dejar espacio al círculo */}
                  <div 
                    className="py-1.5 text-xl pl-5 w-full border-4 border-gray"
                    style={{ 
                      borderRadius: isFirst 
                        ? '0 20px 20px 0' // Primer elemento: redondeado a la derecha
                        : isLast 
                        ? '0 20px 20px 0' // Último elemento: redondeado a la derecha
                        : '0' // Elementos intermedios: sin bordes redondeados
                    }}
                  >
                    {step.label}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
export default ProgressBar;