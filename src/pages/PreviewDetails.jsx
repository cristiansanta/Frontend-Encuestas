import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BackgroundImg from '../assets/img/backgroundsurvey.svg';

const PreviewDetails = () => {
    // Estados básicos del componente
    const [surveyInfo, setSurveyInfo] = useState(null);
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState({});
    const [sections, setSections] = useState([]);
    const [userResponses, setUserResponses] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    // Cargar datos del localStorage
    useEffect(() => {
        try {
            const storedSurveyInfo = JSON.parse(localStorage.getItem('survey_info'));
            const storedSurveyQuestions = JSON.parse(localStorage.getItem('survey_questions'));

            if (storedSurveyInfo && storedSurveyQuestions) {
                setSurveyInfo(storedSurveyInfo);
                setSurveyQuestions(storedSurveyQuestions);

                // Agrupar preguntas por sección
                const grouped = storedSurveyQuestions.reduce((acc, question) => {
                    const sectionId = question.section.id;
                    if (!acc[sectionId]) {
                        acc[sectionId] = {
                            id: sectionId,
                            name: question.section.name,
                            questions: [],
                        };
                    }
                    acc[sectionId].questions.push(question);
                    return acc;
                }, {});

                setGroupedQuestions(grouped);

                // Crear array de secciones para navegación
                const sectionsArray = Object.values(grouped).map(section => ({
                    id: section.id,
                    title: section.name,
                    descrip_sect: `Preguntas relacionadas con ${section.name}`,
                    icon: getSectionIconByName(section.name)
                }));

                setSections(sectionsArray);

                // Inicializar respuestas del usuario
                const initialResponses = {};
                storedSurveyQuestions.forEach(question => {
                    initialResponses[question.id] = "";
                });
                setUserResponses(initialResponses);

                // Inicializar visibilidad de preguntas (todas visibles por defecto)
                const initialVisibility = {};
                storedSurveyQuestions.forEach(question => {
                    initialVisibility[question.id] = true;
                });
                setVisibleQuestions(initialVisibility);
            }
        } catch (error) {
            console.error("Error al cargar datos del localStorage:", error);
        }
    }, []);

    // Función auxiliar para obtener icono según el nombre de la sección
    const getSectionIconByName = (sectionName) => {
        const normalizedName = sectionName.toLowerCase();

        if (normalizedName.includes('personal') || normalizedName.includes('demografía')) {
            return 'tag';
        } else if (normalizedName.includes('laboral') || normalizedName.includes('trabajo') || normalizedName.includes('profesional')) {
            return 'briefcase';
        } else if (normalizedName.includes('académica') || normalizedName.includes('educación') || normalizedName.includes('formación')) {
            return 'academic-cap';
        } else if (normalizedName.includes('producto') || normalizedName.includes('servicio') || normalizedName.includes('evaluación')) {
            return 'star';
        } else {
            return 'clipboard';
        }
    };

    // ----- MANEJADORES DE EVENTOS -----

    // Manejador para cambios en texto
    const handleTextChange = (e, questionId) => {
        const newValue = e.target.value;
        setUserResponses(prev => ({
            ...prev,
            [questionId]: newValue
        }));
    };

    // Manejador para opciones (radio buttons)
    const handleOptionChange = (questionId, value) => {
        setUserResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    // Manejador para checkbox de términos
    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
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
        } else if (currentSection < sections.length) {
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

        // Simular envío de datos (aquí podrías hacer una llamada a API)
        console.log("Datos enviados:", userResponses);

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
        const progressPercentage = sections.length ? (adjustedSection / sections.length) * 100 : 0;

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
            case 'star':
                return (
                    <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                );
            case 'clipboard':
            default:
                return (
                    <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                    </svg>
                );
        }
    };

    // Renderizar pregunta según su tipo
    const renderQuestionByType = (question) => {
        switch (question.questionType) {
            // Tipo 1: Respuesta abierta
            case 1:
                return (
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Escribe tu respuesta aquí"
                            value={userResponses[question.id] || ''}
                            onChange={(e) => handleTextChange(e, question.id)}
                            maxLength={100}
                        />
                        <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
                            {(userResponses[question.id]?.length || 0)}/100
                        </div>
                    </div>
                );

            // Tipo 2: Numérica
            case 2:
                return (
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ingresa un número"
                            value={userResponses[question.id] || ''}
                            onChange={(e) => handleTextChange(e, question.id)}
                        />
                    </div>
                );

            // Tipo 3: Opción única
            case 3:
                return (
                    <div className="space-y-2">
                        {/* En un caso real, estas opciones vendrían con la pregunta */}
                        {['Opción 1', 'Opción 2', 'Opción 3'].map((option, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 w-full hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option}
                                        className="mr-3 focus:ring-blue-800 w-5 h-5 text-green-500"
                                        checked={userResponses[question.id] === option}
                                        onChange={() => handleOptionChange(question.id, option)}
                                    />
                                    <span className="text-gray-800">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                );

            // Tipo 4: Opción múltiple (checkbox)
            case 4:
                return (
                    <div className="space-y-2">
                        {/* En un caso real, estas opciones vendrían con la pregunta */}
                        {['Opción 1', 'Opción 2', 'Opción 3'].map((option, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <label className="flex items-center bg-white p-2 px-3 rounded-lg border border-gray-200 w-full hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={`question-${question.id}`}
                                        value={option}
                                        className="mr-3 focus:ring-blue-800 w-5 h-5 text-green-500"
                                        checked={(userResponses[question.id] || []).includes(option)}
                                        onChange={(e) => {
                                            const current = userResponses[question.id] || [];
                                            if (e.target.checked) {
                                                handleOptionChange(question.id, [...current, option]);
                                            } else {
                                                handleOptionChange(question.id, current.filter(item => item !== option));
                                            }
                                        }}
                                    />
                                    <span className="text-gray-800">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                );

            // Tipo 5: Falso / Verdadero
            case 5:
                return (
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
                );

            // Tipo 6: Fecha
            case 6:
                return (
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={userResponses[question.id] || ''}
                            onChange={(e) => handleTextChange(e, question.id)}
                        />
                    </div>
                );

            // Tipo desconocido o no implementado
            default:
                return (
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                        Tipo de pregunta no implementado
                    </div>
                );
        }
    };

    // Si no hay datos cargados, mostrar mensaje de carga
    if (!surveyInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
                <p className="mt-4 text-blue-800">Cargando encuesta...</p>
            </div>
        );
    }

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
        sections.find(section => section.id === parseInt(Object.keys(groupedQuestions)[currentSection - 1])) || { title: "", descrip_sect: "", icon: "clipboard" };

    // Obtener preguntas para la sección actual
    const currentQuestions = currentSection === 0 ? [] :
        groupedQuestions[Object.keys(groupedQuestions)[currentSection - 1]]?.questions || [];

    // Formatear fechas para mostrar
    // Asumiendo que surveyInfo puede tener una fecha de expiración
    const expirationDate = surveyInfo.endDate
        ? new Date(surveyInfo.endDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        : "No especificada";

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
                                {DOMPurify.sanitize(surveyInfo.title)}
                            </h2>
                            <div className="text-gray-600 text-base leading-relaxed mb-8"
                                 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(surveyInfo.description) }}>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">La encuesta constará de {sections.length} secciones</h3>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {sections.map(section => (
                                        <div key={section.id} className="py-2 px-4 rounded-full flex items-center bg-gray-100 text-gray-700">
                                            {getSectionIcon(section.icon)}
                                            <span className="ml-2">{section.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">Información adicional</h3>
                                <ul className="text-gray-600 text-sm space-y-1">
                                    <li><strong>Fecha de expiración:</strong> {expirationDate}</li>
                                    <li><strong>Tiempo estimado:</strong> {surveyInfo.estimatedTime || "No especificado"}</li>
                                </ul>
                            </div>

                            <div className="flex items-start mb-6">
                                <input
                                    id="terms-checkbox"
                                    type="checkbox"
                                    className="w-5 h-5 text-green-500 rounded focus:ring-blue-800 mt-1"
                                    checked={termsAccepted}
                                    onChange={handleTermsChange}
                                />
                                <label htmlFor="terms-checkbox" className="ml-2 text-gray-700 text-sm">
                                    Acepto los <a href="#" className="text-blue-800 underline">términos y condiciones</a> y autorizo el tratamiento de mis datos de acuerdo a la <a href="#" className="text-blue-800 underline">política de privacidad</a>.
                                </label>
                            </div>

                            <button
                                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition-colors"
                                onClick={handleContinue}
                                type="button"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                                Comenzar encuesta
                            </button>
                        </div>
                    ) : (
                        // PANTALLA DE PREGUNTAS
                        <div>
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    {getSectionIcon(currentSectionData.icon)}
                                    <h2 className="text-2xl font-semibold text-blue-800 ml-2">
                                        {currentSectionData.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600">{currentSectionData.descrip_sect}</p>
                            </div>

                            <div className="space-y-6">
                                {currentQuestions.map(question => (
                                    <div key={question.id} className={`p-4 rounded-xl border border-gray-200 ${visibleQuestions[question.id] ? '' : 'hidden'}`}>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                            {question.text}
                                            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                                        </h3>
                                        {question.description && (
                                            <p className="text-sm text-gray-500 mb-3">{question.description}</p>
                                        )}
                                        {renderQuestionByType(question)}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full flex items-center hover:bg-gray-300 transition-colors"
                                    onClick={handlePrevious}
                                    type="button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                                    </svg>
                                    Anterior
                                </button>
                                <button
                                    className="bg-blue-800 text-white px-6 py-2 rounded-full flex items-center hover:bg-blue-900 transition-colors"
                                    onClick={handleContinue}
                                    type="button"
                                >
                                    {currentSection < sections.length ? (
                                        <>
                                            <span>Continuar</span>
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <span>Finalizar encuesta</span>
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
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

export default PreviewDetails;
