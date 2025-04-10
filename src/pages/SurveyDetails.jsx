import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BackgroundImg from '../assets/img/backgroundsurvey.svg';

const defaultSurveyData = {
    title: "Encuesta Integral de Prueba Inicial",
    subtitle: "Esta encuesta está cargando...",
    sections: [],
    survey_questions: [],
    expirationDate: "fecha por determinar"
};

const SurveyDetails = () => {
    const [userResponses, setUserResponses] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!surveyData) return;

        const initialVisibility = {};
        const initialResponses = {};

        surveyData.survey_questions.forEach((sq) => {
            const question = sq.question;
            const conditions = question.conditions || [];

            initialVisibility[question.id] = conditions.length === 0;

            if (question.cod_padre === 0 && question.type?.title === 'Falso y verdadero') {
                initialResponses[question.id] = null;
            } else if (question.cod_padre === 0) {
                initialResponses[question.id] = null;
            }
        });

        setVisibleQuestions(initialVisibility);
        setUserResponses(initialResponses);
    }, [surveyData]);

    const handleResponseChange = (questionId, value) => {
        setUserResponses((prevResponses) => {
            const updatedResponses = { ...prevResponses, [questionId]: value };

            const updatedVisibility = { ...visibleQuestions };

            surveyData.survey_questions.forEach((sq) => {
                const question = sq.question;
                const conditions = question.conditions || [];

                if (conditions.length > 0) {
                    const condition = conditions[0];
                    const parentAnswer = updatedResponses[condition.cod_father];

                    if (condition.operation === 'igual que') {
                        updatedVisibility[question.id] = parentAnswer === condition.compare;
                    } else if (condition.operation === 'diferente') {
                        updatedVisibility[question.id] = parentAnswer !== condition.compare;
                    } else {
                        updatedVisibility[question.id] = false;
                    }
                }
            });

            setVisibleQuestions(updatedVisibility);
            return updatedResponses;
        });
    };

    const handleContinue = () => {
        if (!surveyData || !surveyData.sections) return;

        if (currentSection === 0) {
            setCurrentSection(1);
            window.scrollTo(0, 0);
        } else if (currentSection < surveyData.sections.length) {
            setCurrentSection(currentSection + 1);
            window.scrollTo(0, 0);
        } else {
            setShowConfirmModal(true);
        }
    };

    const handlePrevious = () => {
        if (currentSection > 1) {
            setCurrentSection(currentSection - 1);
            window.scrollTo(0, 0);
        } else if (currentSection === 1) {
            setCurrentSection(0);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            navigate('/SurveyList');
        }, 3000);
    };

    const handleFinish = () => {
        navigate('/SurveyList');
    };

    const ProgressBar = () => {
        if (!surveyData || !surveyData.sections) {
            return (
                <div className="w-full h-8 overflow-hidden mb-6 relative rounded-full border-4 border-white">
                    <div className="bg-yellow-400 h-full w-full"></div>
                </div>
            );
        }

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
                        <button className="bg-purple-600 text-white px-8 py-3 rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors" onClick={() => setShowConfirmModal(false)}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancelar
                        </button>
                        <button className="bg-green-500 text-white px-8 py-3 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition-colors" onClick={handleSubmit}>
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
                <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-full inline-flex items-center justify-center shadow-md hover:bg-green-600 transition-colors" onClick={handleFinish}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Finalizar
                </button>
            </div>
        );
    };

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

    const currentSectionData = (currentSection > 0 && surveyData && surveyData.sections) ?
        surveyData.sections.find(section => section.id === currentSection) :
        { title: "", descrip_sect: "", icon: "" };

    const currentQuestions = (currentSection > 0 && surveyData && surveyData.survey_questions) ?
        surveyData.survey_questions.filter(sq => sq.section_id === currentSection) :
        [];

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

    return (
        <div className="min-h-screen flex flex-col items-center py-10" style={{ backgroundImage: `url(${BackgroundImg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            {showConfirmModal && <ConfimModal />}

            <div className="w-full md:w-3/4 lg:w-2/4 xl:w-2/5 px-4 mx-auto">
                <ProgressBar />

                <div className="bg-white shadow-lg rounded-3xl px-8 py-6 mb-8">
                    {currentSection === 0 ? (
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
                                    {surveyData && surveyData.sections && surveyData.sections.map(section => (
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
                                <p className="text-gray-600">Esta encuesta estará disponible hasta el <span className="font-semibold">{surveyData?.expirationDate || 'fecha de vencimiento'}</span></p>
                            </div>

                            <div className="mb-8">
                                <label className="flex items-center cursor-pointer justify-center">
                                    <input type="checkbox" className="w-5 h-5 mr-3 checked:bg-green-500 focus:ring-green-500" />
                                    <span className="text-sm text-gray-700">
                                        He leído y acepto los <span className="text-green-600 underline">términos y condiciones</span>.
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-center">
                                <button className="bg-green-500 text-white font-medium py-3 px-6 rounded-full flex items-center shadow-md hover:bg-green-600 transition-colors" onClick={handleContinue}>
                                    Continuar
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 flex items-center text-blue-800">
                                    <span className="mr-2">
                                        {getSectionIcon(currentSectionData.icon)}
                                    </span>
                                    {currentSectionData.title}
                                </h2>
                                <p className="text-gray-600 mb-4">{DOMPurify.sanitize(currentSectionData.descrip_sect)}</p>
                            </div>

                            {currentQuestions.map((sq) => {
                                const question = sq.question;

                                return (
                                    visibleQuestions[question.id] && (
                                        <div key={question.id} className="mb-8 bg-yellow-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
                                            <p className="text-md font-semibold text-blue-800 mb-2">{DOMPurify.sanitize(question.title)}</p>
                                            <div className="text-gray-600 mb-4 text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.descrip) }} />

                                            {question.type?.title === 'Falso y verdadero' ? (
                                                <div className="flex items-center space-x-6">
                                                    <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                                        <input type="radio" name={`question-${question.id}`} value="Verdadero" className="mr-2 focus:ring-blue-800 w-5 h-5 text-green-500" checked={userResponses[question.id] === 'Verdadero'} onChange={() => handleResponseChange(question.id, 'Verdadero')} />
                                                        <span className="text-gray-800">Verdadero</span>
                                                    </label>
                                                    <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                                        <input type="radio" name={`question-${question.id}`} value="Falso" className="mr-2 focus:ring-blue-800 w-5 h-5 text-green-500" checked={userResponses[question.id] === 'Falso'} onChange={() => handleResponseChange(question.id, 'Falso')} />
                                                        <span className="text-gray-800">Falso</span>
                                                    </label>
                                                </div>
                                            ) : question.type?.title === 'Abierta' ? (
                                                <div className="relative">
                                                    <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={question.id === 1 ? "Ej: Luis Perez Gomez" : question.id === 2 ? "DD/MM/AAAA" : "Escribe tu respuesta aquí"} value={userResponses[question.id] || ''} onChange={(e) => handleResponseChange(question.id, e.target.value)} maxLength={100} />
                                                    <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
                                                        {userResponses[question.id]?.length || 0}/100
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {question.options.map((option) => (
                                                        <div key={option.id} className="flex items-center mb-2">
                                                            <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 w-full hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                                                <input type="radio" name={`question-${question.id}`} value={DOMPurify.sanitize(option.options)} className="mr-3 focus:ring-blue-800 w-5 h-5 text-green-500" checked={userResponses[question.id] === option.options} onChange={() => handleResponseChange(question.id, option.options)} />
                                                                <span className="text-gray-800">{DOMPurify.sanitize(option.options)}</span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                );
                            })}

                            <div className="mt-6 flex justify-between">
                                <button className="bg-gray-500 text-white font-medium py-2 px-5 rounded-full flex items-center shadow-md hover:bg-gray-600 transition-colors" onClick={handlePrevious}>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Anterior
                                </button>

                                <button className="bg-green-500 text-white font-medium py-2 px-6 rounded-full flex items-center shadow-md hover:bg-green-600 transition-colors" onClick={handleContinue}>
                                    {(surveyData && surveyData.sections && currentSection < surveyData.sections.length) ? (
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

export default SurveyDetails;
