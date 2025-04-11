<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BackgroundImg from '../assets/img/backgroundsurvey.svg';

const SurveyDetails = () => {
    // Estados básicos del componente
    const [userResponses, setUserResponses] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    // Datos de la encuesta
    const surveyData = {
        title: "Encuesta Integral de Prueba Inicial",
        subtitle: "Lea con atención las preguntas. Esta encuesta está diseñada para recopilar información detallada sobre tu experiencia laboral y académica, con el fin de obtener una visión más completa de tu trayectoria profesional y educativa.",
        sections: [
            { id: 1, title: "Información Personal", descrip_sect: "En esta sección nos interesa conocer tus datos personales básicos.", icon: "tag" },
            { id: 2, title: "Experiencia Laboral", descrip_sect: "En esta sección queremos conocer detalles sobre tu experiencia en el ámbito laboral.", icon: "briefcase" },
            { id: 3, title: "Experiencia Académica", descrip_sect: "En esta sección queremos conocer tu trayectoria educativa y formación académica.", icon: "academic-cap" }
        ],
        survey_questions: [
            { section_id: 1, question: { id: 1, title: "Nombre Completo", descrip: "Ingrese su nombre completo tal como aparece en su documento de identificación.", type: { title: "Abierta" }, conditions: [], cod_padre: 0, options: [] } },
            { section_id: 1, question: { id: 2, title: "Fecha de nacimiento", descrip: "Ingresa tu fecha de nacimiento para ayudarnos a conocer tu edad.", type: { title: "Abierta" }, conditions: [], cod_padre: 0, options: [] } },
            { section_id: 1, question: { id: 3, title: "¿En qué género te identificas?", descrip: "Selecciona el género con el que te identificas.", type: { title: "Opción múltiple" }, conditions: [], cod_padre: 0, options: [{ id: 1, options: "Masculino" }, { id: 2, options: "Femenino" }, { id: 3, options: "Otro" }, { id: 4, options: "Prefiero no decirlo" }] } },
            { section_id: 1, question: { id: 4, title: "¿Cómo prefieres que nos refiramos a ti?", descrip: "Queremos asegurarnos de utilizar el lenguaje con el que te sientas más cómod@.", type: { title: "Abierta" }, conditions: [{ cod_father: 3, operation: "igual que", compare: "Otro" }], cod_padre: 3, options: [] } },
            { section_id: 1, question: { id: 5, title: "¿En cuál de los siguientes países has vivido?", descrip: "Selecciona los países en los que has vivido durante tu vida.", type: { title: "Opción múltiple" }, conditions: [], cod_padre: 0, options: [{ id: 5, options: "Colombia" }, { id: 6, options: "Venezuela" }, { id: 7, options: "Perú" }, { id: 8, options: "Chile" }, { id: 9, options: "Ecuador" }, { id: 10, options: "Argentina" }, { id: 11, options: "Uruguay" }, { id: 12, options: "México" }, { id: 13, options: "Paraguay" }, { id: 14, options: "Panamá" }, { id: 15, options: "Costa Rica" }] } },
            { section_id: 2, question: { id: 6, title: "¿En cuántos trabajos has tenido experiencia laboral hasta ahora?", descrip: "Buscamos conocer cuántos trabajos previos has tenido. Marca la opción que mejor describa tu experiencia en el mercado laboral.", type: { title: "Opción múltiple" }, conditions: [], cod_padre: 0, options: [{ id: 16, options: "Ninguno" }, { id: 17, options: "1 o 2 trabajos" }, { id: 18, options: "3 a 4 trabajos" }, { id: 19, options: "Más de 5 trabajos" }] } },
            { section_id: 2, question: { id: 7, title: "¿Cuál es tu situación laboral actual?", descrip: "Selecciona la opción que refleje tu situación laboral actual.", type: { title: "Opción múltiple" }, conditions: [{ cod_father: 6, operation: "diferente", compare: "Ninguno" }], cod_padre: 6, options: [{ id: 20, options: "Desempleado" }, { id: 21, options: "Independiente" }, { id: 22, options: "Contratista" }, { id: 23, options: "Empleado a tiempo parcial" }, { id: 24, options: "Empleado a tiempo completo" }, { id: 25, options: "Estudiante" }, { id: 26, options: "Jubilado" }, { id: 27, options: "Otro" }] } },
            { section_id: 2, question: { id: 8, title: "¿Cuál ha sido tu principal responsabilidad en tu trabajo más reciente?", descrip: "Cuéntanos en detalle cuál ha sido tu rol o función principal en tu última posición.", type: { title: "Abierta" }, conditions: [{ cod_father: 6, operation: "diferente", compare: "Ninguno" }], cod_padre: 6, options: [] } },
            { section_id: 2, question: { id: 9, title: "¿Has liderado algún equipo de trabajo en tu experiencia laboral?", descrip: "Indica si has tenido la oportunidad de liderar o coordinar equipos durante tu trayectoria profesional.", type: { title: "Falso y verdadero" }, conditions: [{ cod_father: 6, operation: "diferente", compare: "Ninguno" }], cod_padre: 6, options: [] } },
            { section_id: 3, question: { id: 10, title: "¿Qué nivel educativo has alcanzado hasta el momento?", descrip: "Selecciona el nivel académico más alto que hayas completado hasta la fecha.", type: { title: "Opción múltiple" }, conditions: [], cod_padre: 0, options: [{ id: 28, options: "Secundaria" }, { id: 29, options: "Técnico" }, { id: 30, options: "Pregrado" }, { id: 31, options: "Maestría" }, { id: 32, options: "Doctorado" }] } },
            { section_id: 3, question: { id: 11, title: "¿Actualmente estás cursando estudios académicos?", descrip: "Indícanos si actualmente estás en proceso de estudios académicos.", type: { title: "Falso y verdadero" }, conditions: [], cod_padre: 0, options: [] } }
        ],
        expirationDate: "2 de octubre de 2025"
    };

    // Inicialización al montar el componente
    useEffect(() => {
        // Inicializar visibilidad de preguntas
        const initialVisibility = {};
        surveyData.survey_questions.forEach((sq) => {
            const question = sq.question;
            initialVisibility[question.id] = question.conditions.length === 0;
        });
        setVisibleQuestions(initialVisibility);

        // Inicializar respuestas de usuario vacías
        const initialResponses = {};
        surveyData.survey_questions.forEach((sq) => {
            initialResponses[sq.question.id] = "";
        });
        setUserResponses(initialResponses);
    }, []);

    // ----- MANEJADORES DE EVENTOS (SIMPLIFICADOS PARA MÁXIMA COMPATIBILIDAD) -----

    // Manejador para cambios en texto
    const handleTextChange = (e, questionId) => {
        const newValue = e.target.value;
        const newResponses = {...userResponses};
        newResponses[questionId] = newValue;
        setUserResponses(newResponses);
        updateVisibility(newResponses);
    };

    // Manejador para opciones (radio buttons)
    const handleOptionChange = (questionId, value) => {
        const newResponses = {...userResponses};
        newResponses[questionId] = value;
        setUserResponses(newResponses);
        updateVisibility(newResponses);
    };

    // Manejador para checkbox de términos
    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    // Función auxiliar para actualizar visibilidad de preguntas condicionales
    const updateVisibility = (responses) => {
        const newVisibility = {...visibleQuestions};
        
        surveyData.survey_questions.forEach((sq) => {
            const question = sq.question;
            
            // Si no tiene condiciones, siempre es visible
            if (question.conditions.length === 0) {
                newVisibility[question.id] = true;
                return;
            }
            
            // Verificar condiciones
            const condition = question.conditions[0];
            const parentResponse = responses[condition.cod_father];
            
            if (condition.operation === 'igual que') {
                newVisibility[question.id] = parentResponse === condition.compare;
            } else if (condition.operation === 'diferente') {
                newVisibility[question.id] = parentResponse !== condition.compare && parentResponse !== "";
            } else {
                newVisibility[question.id] = false;
            }
        });
        
        setVisibleQuestions(newVisibility);
    };

    // ----- NAVEGACIÓN -----

    // Continuar a la siguiente sección
    const handleContinue = () => {
        if (currentSection === 0) {
            if (!termsAccepted) {
                alert("Por favor acepta los términos y condiciones para continuar.");
                return;
            }
            setCurrentSection(1);
        } else if (currentSection < surveyData.sections.length) {
            setCurrentSection(currentSection + 1);
        } else {
            setShowConfirmModal(true);
        }
        window.scrollTo(0, 0);
    };

    // Volver a la sección anterior
    const handlePrevious = () => {
        if (currentSection > 1) {
            setCurrentSection(currentSection - 1);
        } else if (currentSection === 1) {
            setCurrentSection(0);
        }
        window.scrollTo(0, 0);
    };

    // Confirmar envío
    const handleSubmit = () => {
        // Cerrar modal de confirmación
        setShowConfirmModal(false);
        
        // Marcar como enviado para mostrar pantalla de éxito
        setIsSubmitted(true);
        
        // Redirección después de 3 segundos
        setTimeout(() => {
            navigate('/survey-list');
        }, 3000);
    };

    // Finalizar y redireccionar inmediatamente
    const handleFinish = () => {
        navigate('/survey-list');
    };

    // ----- COMPONENTES UI -----

    // Barra de progreso
    const ProgressBar = () => {
        const adjustedSection = currentSection === 0 ? 0 : currentSection;
        const progressPercentage = (adjustedSection / surveyData.sections.length) * 100;

        return (
            <div className="w-full h-8 overflow-hidden mb-6 relative rounded-full border-4 border-white">
                <div className="flex h-full">
                    <div
                        className="bg-blue-800 h-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                    <div
                        className="bg-yellow-400 h-full"
                        style={{ width: `${100 - progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Modal de confirmación
    const ConfirmModal = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <h2 className="text-2xl font-bold text-center mb-4 text-blue-800">¿Estás listo para enviar?</h2>
                    <p className="text-center mb-6 text-gray-600">
                        Si aún debes corregir alguna de tus respuestas da click en "cancelar", si estás listo da click en "enviar",
                        no podrás corregir tus respuestas después de enviarlas.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <button 
                            className="bg-purple-600 text-white px-8 py-3 rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors" 
                            onClick={() => setShowConfirmModal(false)}
                            type="button"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancelar
                        </button>
                        <button 
                            className="bg-green-500 text-white px-8 py-3 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition-colors" 
                            onClick={handleSubmit}
                            type="button"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Pantalla de éxito
    const SuccessSubmitScreen = () => {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${day} de ${getMonthName(month)} de ${year}`;

        function getMonthName(month) {
            const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
            return monthNames[month - 1];
        }

        return (
            <div className="bg-white shadow-lg rounded-3xl w-full md:w-3/4 lg:w-2/4 xl:w-2/5 px-8 py-12 mx-auto text-center">
                <div className="mb-6">
                    <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-blue-800 mb-6">Encuesta enviada con éxito</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Queremos agradecerte sinceramente por dedicar tu tiempo y compartir tu opinión con nosotros.
                    Tu participación es fundamental para mejorar nuestros servicios y ofrecerte una experiencia más personalizada.
                </p>
                <div className="flex items-center justify-center mb-8 bg-gray-50 py-3 px-4 rounded-lg">
                    <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-700">
                        Respuestas enviadas con éxito el <span className="font-semibold">{formattedDate}</span>
                    </p>
                </div>
                <button 
                    className="bg-green-500 text-white font-bold py-3 px-8 rounded-full inline-flex items-center justify-center shadow-md hover:bg-green-600 transition-colors" 
                    onClick={handleFinish}
                    type="button"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Finalizar
                </button>
            </div>
        );
    };

    // Íconos para secciones
    const getSectionIcon = (iconName) => {
        switch (iconName) {
            case 'tag':
                return (
                    <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                );
            case 'briefcase':
                return (
                    <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                    </svg>
                );
            case 'academic-cap':
                return (
                    <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                );
        }
    };

    // Si la encuesta fue enviada, mostrar pantalla de éxito
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col items-center py-10" style={{ backgroundImage: `url(${BackgroundImg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                <div className="w-full md:w-3/4 lg:w-2/4 xl:w-2/5 px-4 mx-auto">
                    <ProgressBar />
                    <SuccessSubmitScreen />
                </div>
            </div>
        );
    }

    // Obtener los datos para la sección actual
    const currentSectionData = currentSection === 0 ? null : 
        surveyData.sections.find(section => section.id === currentSection) || { title: "", descrip_sect: "", icon: "" };

    // Filtrar preguntas para la sección actual
    const currentQuestions = currentSection === 0 ? [] : 
        surveyData.survey_questions.filter(sq => sq.section_id === currentSection);

    // ----- RENDERIZADO PRINCIPAL -----
    return (
        <div className="min-h-screen flex flex-col items-center py-10" style={{ backgroundImage: `url(${BackgroundImg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            {/* Modal de confirmación (solo visible si showConfirmModal es true) */}
            {showConfirmModal && <ConfirmModal />}

            <div className="w-full md:w-3/4 lg:w-2/4 xl:w-2/5 px-4 mx-auto">
                <ProgressBar />

                <div className="bg-white shadow-lg rounded-3xl px-8 py-6 mb-8">
                    {currentSection === 0 ? (
                        // PANTALLA DE BIENVENIDA
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-blue-800 mb-4">
                                ¡Bienvenido!
                            </h1>
                            <h2 className="text-2xl font-semibold text-blue-800 mb-3">
                                {DOMPurify.sanitize(surveyData.title)}
                            </h2>
                            <p className="text-gray-600 text-base leading-relaxed mb-8">
                                {DOMPurify.sanitize(surveyData.subtitle)}
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">La encuesta constará de tres secciones</h3>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {surveyData.sections.map(section => (
                                        <div key={section.id} className="py-2 px-4 rounded-full flex items-center bg-gray-100 text-blue-800">
                                            <span className="mr-2">{getSectionIcon(section.icon)}</span>
                                            <span>{section.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-center bg-gray-50 py-3 px-4 rounded-lg mb-8">
                                <svg className="w-5 h-5 mr-2 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-gray-600">Esta encuesta estará disponible hasta el <span className="font-semibold">{surveyData.expirationDate}</span></p>
                            </div>

                            <div className="mb-8">
                                <label className="flex items-center cursor-pointer justify-center">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 mr-3 checked:bg-green-500 focus:ring-green-500" 
                                        checked={termsAccepted}
                                        onChange={handleTermsChange}
                                    />
                                    <span className="text-sm text-gray-700">
                                        He leído y acepto los <span className="text-green-600 underline cursor-pointer">términos y condiciones</span>.
                                    </span>
                                </label>
                                {!termsAccepted && (
                                    <p className="text-xs text-red-500 text-center mt-2">
                                        Debes aceptar los términos y condiciones para continuar
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-center">
                                <button 
                                    className={`bg-green-500 text-white font-medium py-3 px-6 rounded-full flex items-center shadow-md hover:bg-green-600 transition-colors ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    onClick={handleContinue}
                                    disabled={!termsAccepted}
                                    type="button"
                                >
                                    Continuar
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        // SECCIONES DE LA ENCUESTA
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 flex items-center text-blue-800">
                                    <span className="mr-2">
                                        {currentSectionData && getSectionIcon(currentSectionData.icon)}
                                    </span>
                                    {currentSectionData && currentSectionData.title}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {currentSectionData && DOMPurify.sanitize(currentSectionData.descrip_sect)}
                                </p>
                            </div>

                            {/* Preguntas de la sección actual */}
                            {currentQuestions.map((sq) => {
                                const question = sq.question;
                                
                                // Solo mostrar preguntas que deben ser visibles
                                if (visibleQuestions[question.id] === false) {
                                    return null;
                                }
                                
                                return (
                                    <div key={question.id} className="mb-8 bg-yellow-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
                                        <p className="text-md font-semibold text-blue-800 mb-2">
                                            {DOMPurify.sanitize(question.title)}
                                        </p>
                                        <div className="text-gray-600 mb-4 text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.descrip) }} />
                                        
                                        {/* TIPO DE PREGUNTA: Falso y verdadero */}
                                        {question.type?.title === 'Falso y verdadero' && (
                                            <div className="flex items-center space-x-6">
                                                <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name={`question-${question.id}`} 
                                                        value="Verdadero" 
                                                        className="mr-2 focus:ring-blue-800 w-5 h-5 text-green-500" 
                                                        checked={userResponses[question.id] === 'Verdadero'} 
                                                        onChange={() => handleOptionChange(question.id, 'Verdadero')} 
                                                    />
                                                    <span className="text-gray-800">Verdadero</span>
                                                </label>
                                                <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name={`question-${question.id}`} 
                                                        value="Falso" 
                                                        className="mr-2 focus:ring-blue-800 w-5 h-5 text-green-500" 
                                                        checked={userResponses[question.id] === 'Falso'} 
                                                        onChange={() => handleOptionChange(question.id, 'Falso')} 
                                                    />
                                                    <span className="text-gray-800">Falso</span>
                                                </label>
                                            </div>
                                        )}
                                        
                                        {/* TIPO DE PREGUNTA: Abierta (campo de texto) */}
                                        {question.type?.title === 'Abierta' && (
                                            <div className="relative">
                                                <input
                                                    type={question.id === 2 ? "date" : "text"}
                                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder={
                                                        question.id === 1 ? "Ej: Luis Perez Gomez" : 
                                                        question.id === 2 ? "DD/MM/AAAA" : 
                                                        "Escribe tu respuesta aquí"
                                                    }
                                                    value={userResponses[question.id] || ''}
                                                    onChange={(e) => handleTextChange(e, question.id)}
                                                    maxLength={100}
                                                />
                                                <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
                                                    {(userResponses[question.id]?.length || 0)}/100
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* TIPO DE PREGUNTA: Opción múltiple */}
                                        {question.type?.title === 'Opción múltiple' && (
                                            <div className="space-y-2">
                                                {question.options.map((option) => (
                                                    <div key={option.id} className="flex items-center mb-2">
                                                        <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 w-full hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value={option.options}
                                                                className="mr-3 focus:ring-blue-800 w-5 h-5 text-green-500"
                                                                checked={userResponses[question.id] === option.options}
                                                                onChange={() => handleOptionChange(question.id, option.options)}
                                                            />
                                                            <span className="text-gray-800">{DOMPurify.sanitize(option.options)}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Botones de navegación */}
                            <div className="mt-6 flex justify-between">
                                <button
                                    className="bg-gray-500 text-white font-medium py-2 px-5 rounded-full flex items-center shadow-md hover:bg-gray-600 transition-colors"
                                    onClick={handlePrevious}
                                    type="button"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Anterior
                                </button>

                                <button
                                    className="bg-green-500 text-white font-medium py-2 px-6 rounded-full flex items-center shadow-md hover:bg-green-600 transition-colors"
                                    onClick={handleContinue}
                                    type="button"
                                >
                                    {currentSection < surveyData.sections.length ? (
                                        <>
                                            Continuar
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Finalizar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';


const SurveyDetails = () => {
    const [userResponses, setUserResponses] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState({});
    const endpoint = import.meta.env.VITE_API_ENDPOINT;
    const navigate = useNavigate();

    const fetchSurvey = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(
                `${endpoint}surveys/${localStorage.getItem('id_survey')}/details`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching survey details:', error);
            throw new Error(`Error fetching survey details: ${error.response?.data?.message || error.message}`);
        }
    };

    const { data: survey, isLoading, error } = useQuery({
        queryKey: ['surveyDetails'],
        queryFn: fetchSurvey,
    });

    useEffect(() => {
        if (survey?.survey_questions) {
            const initialVisibility = {};
            const initialResponses = {};

            survey.survey_questions.forEach((sq) => {
                const question = sq.question;
                const conditions = question.conditions || [];

                initialVisibility[question.id] = conditions.length === 0;

                // Inicializamos respuestas para preguntas tipo "Verdadero o Falso"
                if (question.cod_padre === 0 && question.type?.title === 'Falso y verdadero') {
                    initialResponses[question.id] = null; // Valor predeterminado sin opción seleccionada
                } else if (question.cod_padre === 0) {
                    initialResponses[question.id] = null;
                }
            });

            console.log('Initial Visibility:', initialVisibility);
            console.log('Initial Responses:', initialResponses);

            setVisibleQuestions(initialVisibility);
            setUserResponses(initialResponses);
        }
    }, [survey]);

    const handleResponseChange = (questionId, value) => {
        setUserResponses((prevResponses) => {
            const updatedResponses = { ...prevResponses, [questionId]: value };

            const updatedVisibility = { ...visibleQuestions };

            survey?.survey_questions.forEach((sq) => {
                const question = sq.question;
                const conditions = question.conditions || [];

                if (conditions.length > 0) {
                    const condition = conditions[0];
                    const parentAnswer = updatedResponses[condition.cod_father];

                    console.log(`Evaluating Question ID: ${question.id}`);
                    console.log(`Parent Answer (${condition.cod_father}):`, parentAnswer);
                    console.log(`Condition: ${condition.operation} ${condition.compare}`);

                    if (condition.operation === 'igual que') {
                        updatedVisibility[question.id] = parentAnswer === condition.compare;
                    } else if (condition.operation === 'diferente') {
                        updatedVisibility[question.id] = parentAnswer !== condition.compare;
                    } else {
                        updatedVisibility[question.id] = false;
                    }
                }
            });

            console.log('Updated Visibility:', updatedVisibility);
            setVisibleQuestions(updatedVisibility);

            return updatedResponses;
        });
    };

    if (isLoading) return <div className="text-center mt-8">Cargando preguntas...</div>;
    if (error) return <div className="text-center text-red-500 mt-8">Error al cargar preguntas: {DOMPurify.sanitize(error.message)}</div>;

    const handleFinish = () => {
        navigate('/SurveyList');
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
            <div className="bg-white shadow-md rounded-lg w-full md:w-3/4 lg:w-2/4 xl:w-2/5 px-8 py-6 mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-[#00324D] mb-2">
                        {DOMPurify.sanitize(survey.title) || 'Detalles de la Encuesta'}
                    </h1>
                    <p className="text-gray-600">{DOMPurify.sanitize(survey.subtitle) || 'Por favor, completa la encuesta a continuación'}</p>
                </div>

                {survey.sections?.map((section) => (
                    <div key={section.id} className="mb-8 border-l-4 pl-4 border-[#39A900] bg-gray-100 rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-[#00324D] mb-2">{DOMPurify.sanitize(section.title)}</h2>
                        <p className="text-gray-600 mb-4">{DOMPurify.sanitize(section.descrip_sect)}</p>

                        {survey.survey_questions
                            ?.filter((sq) => sq.section_id === section.id)
                            .map((sq) => {
                                const question = sq.question;

                                return (
                                    visibleQuestions[question.id] && (
                                        <div key={question.id} className="mb-6">
                                            <p className="text-md font-medium text-[#00324D] mb-2">{DOMPurify.sanitize(question.title)}</p>
                                            <div
                                                className="text-gray-700 mb-2"
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.descrip) }}
                                            />

                                            {question.type?.title === 'Falso y verdadero' ? (
                                                <div className="flex items-center space-x-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value="Verdadero"
                                                            className="mr-2 focus:ring-[#00324D]"
                                                            checked={userResponses[question.id] === 'Verdadero'}
                                                            onChange={() =>
                                                                handleResponseChange(question.id, 'Verdadero')
                                                            }
                                                        />
                                                        Verdadero
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value="Falso"
                                                            className="mr-2 focus:ring-[#00324D]"
                                                            checked={userResponses[question.id] === 'Falso'}
                                                            onChange={() =>
                                                                handleResponseChange(question.id, 'Falso')
                                                            }
                                                        />
                                                        Falso
                                                    </label>
                                                </div>
                                            ) : question.type?.title === 'Abierta' ? (
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#00324D]"
                                                    placeholder="Escribe tu respuesta aquí"
                                                    value={userResponses[question.id] || ''}
                                                    onChange={(e) =>
                                                        handleResponseChange(question.id, e.target.value)
                                                    }
                                                />
                                            ) : (
                                                question.options.map((option) => (
                                                    <div key={option.id} className="flex items-center mb-2">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={DOMPurify.sanitize(option.options)}
                                                            className="mr-2 focus:ring-[#00324D]"
                                                            checked={userResponses[question.id] === option.options}
                                                            onChange={() =>
                                                                handleResponseChange(question.id, option.options)
                                                            }
                                                        />
                                                        <label className="text-gray-800">{DOMPurify.sanitize(option.options)}</label>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )
                                );
                            })}
                    </div>
                ))}

                <div className="flex justify-end mt-4">
                    <button
                        className="bg-[#39A900] text-white font-bold py-2 px-4 rounded"
                        onClick={handleFinish}
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

>>>>>>> cristian
export default SurveyDetails;