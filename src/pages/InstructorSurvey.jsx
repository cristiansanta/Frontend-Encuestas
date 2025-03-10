import React from 'react';
import banner from '../assets/img/SurveyInstructorBanner.png';
import TechnicalFormation from '../assets/img/Formación_técnica.svg';

const InstructorSurvey = () => {
  return (
    <div className="flex justify-center bg-[#F3F4F6]">
      <div className="w-full md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-1/2 mt-24">

        {/* Banner Container */}
        <div className="flex justify-center">
          <img 
            src={banner} 
            alt="Instructor Survey Banner" 
            className="mx-auto h-auto object-contain" 
          />
        </div>

        {/* Segundo contenedor - Título de la encuesta */}
        <div className="bg-[#00324D] h-14 flex items-center justify-center">
          <h2 className="text-2xl text-white font-bold text-center">Encuesta de satisfacción de Instructores</h2>
        </div>

        {/* Tercer contenedor - Descripción */}
        <div className="p-10 bg-white">
          {/* Primer cuadro - tamaño mediano */}
          <div className="bg-[#D9D9D9] p-6 h-48 rounded-lg flex items-center mb-6">
            <img src={TechnicalFormation} alt="Technical Formation Icon" className="w-20 h-20 mr-4" />
            <div>
              <h3 className="text-xl font-bold text-[#00324D]">Completa la encuesta a continuación</h3>
              <p className="text-[#00324D] text-2xl">
                Esta encuesta tiene como objetivo el poder contar con los datos personales del instructor que se encuentra activo en el centro de formación tecnológica dosquebradas, con el fin de tener nuestra base de datos actualizada.
              </p>
            </div>
          </div>

          {/* Segundo cuadro - Pregunta 1 - tamaño mediano */}
          <div className="bg-[#D9D9D9] p-6 h-60 rounded-lg mt-10">
            
          </div>

          {/* Tercer cuadro - Pregunta 2 - tamaño grande */}
          <div className="bg-[#D9D9D9] p-6 h-96 rounded-lg mt-10">
            
          </div>
        </div>
      </div>
    </div>
  );
};

// export default InstructorSurvey;
