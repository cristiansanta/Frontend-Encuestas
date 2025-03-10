import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProgresBarUser = ({ currentView, handleStepChange }) => {
  const steps = [
    { id: 1, label: 'Crear Usuario', value: 'CrearUsuario' },
    { id: 2, label: 'Crear Roles', value: 'CrearRoles' },
    { id: 3, label: 'Asignación', value: 'Asignacion' },
  ];

  const activeStep = steps.find(step => step.value === currentView)?.id || 1;

  return (
    <div className="flex w-full h-14 items-center justify-center p-2 bg-[#00324D]">
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className="flex items-center cursor-pointer" 
          onClick={() => handleStepChange(step.value)} // Llama a handleStepChange para cambiar el paso
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
              activeStep === step.id ? 'bg-[#FFC400]' : 'bg-[#39A900]'
            }`}
          >
            {step.id}
          </div>
          <div className={`ml-2 ${activeStep === step.id ? 'text-white font-bold underline' : 'text-gray-200 font-bold'}`}>
            {step.label}
          </div>
          {index < steps.length - 1 && <div className="w-8 border-t-2 border-gray-300 mx-2"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgresBarUser;
