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

export default SurveyDetails;