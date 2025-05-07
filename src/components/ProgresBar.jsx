import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importaciones de imágenes (asegúrate que las rutas sean correctas)
import datosgenerales from '../assets/img/datosgenerales.svg';
import preguntas from '../assets/img/preguntas.svg';
import previsualizar from '../assets/img/previsualizar.svg';

// Hook simple para detectar el tamaño de la pantalla (puedes mejorarlo o usar una librería)
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const ProgressBar = ({ currentView }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile(); // Detecta si es vista móvil

  const viewSteps = {
    SurveyCreate: 1,
    QuestionsCreate: 2,
    PreviewSurvey: 3,
  };

  const activeStep = viewSteps[currentView] || 1;

  const allSteps = [
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
    // En móvil, no permitimos navegar haciendo clic en la barra,
    // ya que solo se muestra el paso actual.
    // La navegación debería ocurrir por otros medios (botones "Siguiente", "Anterior").
    if (!isMobile) {
      navigate(route);
    }
  };

  // Filtra los pasos para mostrar solo el activo en móvil
  const stepsToDisplay = isMobile
    ? allSteps.filter(step => step.id === activeStep)
    : allSteps;

  return (
    <div className={`flex items-center justify-center w-full ${isMobile ? '-mt-8' : '-mt-14'}`}> {/* Ajusta el margen superior en móvil si es necesario */}
      <div className="flex">
        {stepsToDisplay.map((step, index) => {
          // En móvil, el único paso que se muestra es siempre "el primero y el último" visualmente.
          const isFirst = isMobile ? true : index === 0;
          const isLast = isMobile ? true : index === stepsToDisplay.length - 1;

          // En móvil, queremos que el único paso mostrado tenga bordes redondeados a ambos lados
          // o que siga el estilo de la imagen (redondeado completo).
          // Asumiré que para móvil, el contenedor principal debe ser redondeado completo
          // y el círculo del ícono se posiciona de manera similar.

          const mobileItemContainerStyle = isMobile ? { borderRadius: '9999px' } : {}; // Contenedor completamente redondeado
          const mobileTextContainerStyle = isMobile ? { borderRadius: '0 20px 20px 0' } : { // Texto con redondeo a la derecha
             borderRadius: isFirst
              ? '0 20px 20px 0'
              : isLast
              ? '0 20px 20px 0'
              : '0'
          };
          // En móvil, el ancho del rectángulo de texto puede ser diferente
          const textContainerWidth = isMobile ? 'auto' : '270px'; // 'auto' para que se ajuste al contenido o un ancho fijo
          const textPaddingLeft = isMobile ? 'pl-16' : 'pl-5'; // Mayor padding para el ícono en móvil

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center relative ${!isMobile && 'cursor-pointer'} ${step.completed ? '' : 'opacity-150'}`}
                onClick={() => handleStepClick(step.route)}>

                {/* Círculo con el ícono */}
                <div className={`absolute z-50 ${isMobile ? '-left-2' : '-left-12'} size-16 shadow-md p-3 border-4 border-gray ${ // Ajuste de posición para móvil
                  (step.completed === true && activeStep > step.id && !isMobile) // En móvil, solo el activo se muestra con su estilo
                  ? 'bg-dark-blue-custom'
                  : activeStep === step.id
                  ? 'bg-yellow-custom'
                  : isMobile // Si es móvil y no es el activo (no debería pasar con el filtro, pero por si acaso)
                  ? 'bg-yellow-custom' // Asumimos que el único mostrado siempre es "activo"
                  : 'bg-gray-custom'} flex items-center justify-center rounded-full w-16 h-16`}>
                  <img
                    src={step.icon}
                    alt={step.label}
                    className={`size-14 ${
                      (step.completed === true && activeStep > step.id && !isMobile)
                      ? 'filter brightness-0 invert'
                      : ''
                    }`}
                  />
                </div>

                {/* Rectángulo con el texto del paso */}
                <div
                  className={`flex items-center relative ${
                    (step.completed === true && activeStep > step.id && !isMobile)
                      ? 'font-work-sans bg-dark-blue-custom text-white'
                      : activeStep === step.id
                      ? 'font-work-sans font-bold bg-yellow-custom text-dark-blue-custom'
                      : isMobile
                      ? 'font-work-sans font-bold bg-yellow-custom text-dark-blue-custom' // Estilo activo para el único mostrado en móvil
                      : 'font-work-sans bg-gray-custom'
                  }`}
                  style={{
                    width: textContainerWidth,
                    ...(isMobile ? mobileItemContainerStyle : {}), // Aplica bordes de contenedor redondeado en móvil
                    ...(!isMobile ? { // Aplica bordes de texto solo en escritorio con la lógica original
                        borderRadius: isFirst
                        ? '0 20px 20px 0'
                        : isLast
                        ? '0 20px 20px 0'
                        : '0'
                    } : {})
                  }}
                >
                  {/* Texto dentro del fondo rectangular */}
                  <div
                    className={`py-1.5 text-xl ${textPaddingLeft} w-full border-4 border-gray`}
                    style={isMobile ? { borderRadius: '0 20px 20px 0', paddingLeft: '3.5rem' } : mobileTextContainerStyle} // Ajusta padding-left para ícono
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