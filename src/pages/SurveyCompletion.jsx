import React from 'react';
import Icon from '../assets/img/Feedback.png'; // Esta es una imagen
import { useLocation } from 'react-router-dom';

const SurveyCompletion = () => {
    const location = useLocation();
    const { surveyName } = location.state || {};
 
    const handleReturnToMain = () => {
        // Redirige a la landing page
        window.location.href = "https://zajuna.sena.edu.co/";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-[#EBEBEB] shadow-md rounded-xl p-8 space-y-6">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-4">
                        <img src={Icon} alt="Feedback Icon" className="h-16 w-16" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#00324D]">
                        ¡Gracias por completar la encuesta!
                    </h2>
                    <p className="text-center text-gray-600 text-lg font-semibold">
                    {surveyName ? surveyName : "Nombre de la encuesta no disponible"}
                    </p>
                    <p className="text-center text-[#00324D] mt-4 text-lg">
                        Su respuesta ha sido registrada con éxito.
                    </p>
                </div>
                
                <div className="flex justify-center pt-6">
                    <button 
                        onClick={handleReturnToMain} 
                        className="w-full py-3 bg-[#00324D] text-white rounded-md font-bold text-lg"
                    >
                        Volver a la página principal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyCompletion;



