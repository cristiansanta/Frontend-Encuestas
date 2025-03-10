import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../assets/img/Feedback.png'; // Esta es una imagen

const SurveyReplied = () => {
    const location = useLocation();
  
    const handleReturnToMain = () => {
        // Redirige a la landing page
        window.location.href = "https://zajuna.sena.edu.co/";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-[#EBEBEB] shadow-md rounded-xl p-8">
                <div className="text-center p-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full  mb-4">
                        <img src={Icon} alt="Feedback Icon" className="h-16 w-16" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#00324D]">¡Esta encuesta ya ha sido completada!</h2>
                    {/* Ajuste para alinear a la izquierda */}
                    <p className="text-left text-[#00324D] mt-2"> 
                           
                    </p>
                    <p className="text-center text-gray-600">
                    ¡Gracias por participar!
                    </p>
                </div>
            
                <div className="flex justify-center p-6 border-t border-gray-200">
                    <button 
                        onClick={handleReturnToMain} 
                        className="w-full py-2 bg-[#00324D] text-white rounded-md font-bold"
                    >
                        Volver a la página principal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyReplied;