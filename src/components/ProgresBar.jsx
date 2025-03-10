import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const ProgressBar = ({ currentView }) => {
  const navigate = useNavigate(); // Hook para acceder a la función de navegación

  const viewSteps = {
    SurveyCreate: 2,
    CategoryList: 1,
    QuestionsCreate: 3,
    SectionsCreate: 3,
    DependencyList: 4,
    // Puedes agregar más vistas aquí según sea necesario
  };

  const activeStep = viewSteps[currentView] || 1; // Elige 1 como predeterminado si no hay vista coincidente.

  const steps = [
    { id: 1, label: 'Categoría', completed: true, route: '/CategoryList' },
    { id: 2, label: 'Datos Generales', completed: false, route: '/SurveyCreate' },
    { id: 3, label: 'Secciones y preguntas', completed: false, route: '/SectionsCreate' },
    { id: 4, label: 'Despedida', completed: false, route: '/DependencyList' },
  ];

  const handleStepClick = (route) => {
    navigate(route); // Redirige a la ruta correspondiente
  };

  return (
    <div className="flex w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-14 items-center justify-center p-2 bg-[#00324D]"> {/* Diseño responsivo */}
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className="flex items-center cursor-pointer" // Añadida la clase cursor-pointer
          onClick={() => handleStepClick(step.route)} // Navegar al hacer clic
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
              activeStep === step.id 
                ? step.completed 
                  ? 'bg-[#FFC400]' // Amarillo si está completado
                  : 'bg-[#FFC400]'  // Verde si no está completado
                : 'bg-[#39A900]' // Gris si no es el paso activo
            }`}
          >
            {step.id}
          </div>
          <div className={`ml-2 ${activeStep === step.id ? 'text-white font-bold underline' : 'text-gray-200'}`}>
            {step.label}
          </div>
          {index < steps.length - 1 && <div className="w-8 border-t-2 border-gray-300 mx-2"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
