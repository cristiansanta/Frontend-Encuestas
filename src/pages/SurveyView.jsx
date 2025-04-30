import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

// Auxiliar: Procesa el HTML de descripciones, ajusta imágenes
const processDescriptionWithImages = (htmlContent, baseUrl) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    Array.from(div.getElementsByTagName("img")).forEach((img) => {
        const relativePath = img.src.includes("/storage/")
            ? img.src.split("/storage/")[1]
            : img.src;
        img.src = `${baseUrl}/storage/${relativePath}`;
        Object.assign(img.style, { maxWidth: "100%", height: "auto", display: "block" });
        img.alt = "Imagen no disponible";
    });
    return div.innerHTML;
};

// Auxiliar: Decodifica datos en Base64
const decodeData = (encodedData) => {
    try {
        return JSON.parse(atob(encodedData));
    } catch (error) {
        console.error("Error decoding data:", error);
        return null;
    }
};

const SurveyView = () => {
    const [userResponses, setUserResponses] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Variables de entorno y parámetros decodificados
    const endpoint = import.meta.env.VITE_API_ENDPOINT;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const searchParams = new URLSearchParams(location.search);
    const decodedData = decodeData(searchParams.get("data") || "");
    const surveyId = decodedData?.surveyId;
    const correo = decodedData?.correo;
    const accessToken = surveyId
        ? "140|asMgmroSCxjcyP648xRmGw3wnF6PgmWxANn6y4iL875f14d7"
        : localStorage.getItem("accessToken");

    if (!surveyId) {
        return <div className="text-center text-red-500 mt-8">Error: ID de encuesta no disponible.</div>;
    }

    // Validar si la encuesta fue contestada o vencida
    const validateSurvey = async () => {
        try {
            const { data } = await axios.get(`${endpoint}Notification/all`, {
                params: { id_survey: surveyId, email: correo },
                headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
            });
            const surveyData = data[0];
   
            if (surveyData?.state_results) {
                navigate("/SurveyReplied");
            } else if (new Date() > new Date(surveyData?.expired_date)) {
                navigate("/SurveyExpired");
            }
        } catch (error) {
            console.error("Error validando encuesta:", error);
            setErrorMessage("No se pudo validar el estado de la encuesta.");
        }
    };

    useEffect(() => {
        validateSurvey();
    }, []);

    // Obtener detalles de las secciones de la encuesta
    const fetchSections = async () => {
        try {
            const { data } = await axios.get(`${endpoint}surveys/${surveyId}/details`, {
                headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
            });
            return data;
        } catch (error) {
            console.error("Error obteniendo detalles:", error);
            throw new Error(error.response?.data?.message || "Error al cargar detalles de la encuesta");
        }
    };

    const { data: survey, isLoading, error } = useQuery({
        queryKey: ["PreviewDetails", surveyId],
        queryFn: fetchSections,
        enabled: !errorMessage,
    });

    // Mostrar mensajes de estado
    if (isLoading) return <div className="text-center mt-8">Cargando preguntas...</div>;
    if (errorMessage) return <div className="text-center text-red-500 mt-8">{errorMessage}</div>;
    if (error) return <div className="text-center text-red-500 mt-8">Error al cargar preguntas: {error.message}</div>;

    // Función para cambiar las respuestas del usuario
    const handleResponseChange = (questionId, value) => {
        console.log("Respuesta cambiada", questionId, value);
        setUserResponses((prev) => {
            const updatedResponses = { ...prev, [questionId]: value };
            console.log("Respuestas del usuario actualizadas:", updatedResponses);
    
            // Evaluar si hay alguna pregunta hija que se debe mostrar
            evaluateChildQuestions(questionId, updatedResponses);
    
            return updatedResponses;
        });
    };

    const evaluateChildQuestions = (questionId, updatedResponses) => {
        // Buscar preguntas que dependan de la pregunta respondida
        const affectedQuestions = survey.survey_questions.filter((q) => q.question.cod_padre === questionId);
        affectedQuestions.forEach(({ question: child }) => {
            // Si la respuesta cumple con la condición, mostrar la pregunta hija
            const conditionMet = child.conditions.some((condition) => checkCondition(condition, updatedResponses));
            if (conditionMet) {
                console.log(`Pregunta hija ${child.id} mostrada debido a la respuesta a la pregunta padre ${questionId}`);
            }
        });
    };

    // Función para verificar si una condición se cumple
    const checkCondition = (condition, userResponses) => {
        const parentResponse = userResponses[condition.cod_father]; // Respuesta de la pregunta padre
        console.log("Evaluando condición:", parentResponse, "vs", condition.compare);
    
        // Si la respuesta del padre no está definida, no podemos evaluar la condición
        if (parentResponse === undefined) {
            console.log("No hay respuesta para la pregunta padre:", condition.cod_father);
            return false;
        }
    
        // Comparar las respuestas de la pregunta padre con la condición
        return parentResponse === condition.compare;
    };
    
    
    
    
    const filterQuestions = (questionsInSection) => {
        return questionsInSection.reduce((ordered, { question }) => {
            // Solo agregar preguntas que no tienen un padre (cod_padre === 0) o no tienen condiciones
            if (question.cod_padre === 0) {
                ordered.push(question);  // Pregunta no condicional siempre se muestra
            } else {
                // Filtramos las preguntas hijas basándonos en la respuesta del usuario
                if (userResponses[question.cod_padre]) {
                    const conditionMet = question.conditions.some((condition) => checkCondition(condition, userResponses));
                    if (conditionMet) {
                        ordered.push(question);  // Solo agregar si la condición se cumple
                    }
                }
            }
            return ordered;
        }, []);
    };
    
    
    
    
    // Procesar secciones
    const groupedSections = survey.sections?.map((section) => ({
        ...section,
        questions: filterQuestions(survey.survey_questions?.filter((q) => q.section_id === section.id) || []),
    }));
    
    const handleFinish = async () => {
        let missingFields = [];

        // Verificar si todos los campos obligatorios están diligenciados
        survey.survey_questions.forEach((question) => {
            if (
                question?.question?.validate === "Requerido" && 
                question?.question?.cod_padre === 0 && 
                !userResponses[question.question.id]
            ) {
                missingFields.push(question.question.title);
            }
        });

        // Verificar si faltan campos obligatorios y mostrar mensaje de error
        if (missingFields.length > 0) {
            alert('Faltan campos por diligenciar: ' + missingFields.join(', '));
            return;
        }

        // Si todo está bien, proceder con el envío de las respuestas
        const surveyWithResponses = {
            survey_question_id: surveyId,
            answer: survey.survey_questions.reduce(
                (acc, q) => ({
                    ...acc,
                    [q.question_id]: {
                        ...q,
                        options: undefined,
                        user_response: userResponses[q.question_id] || "",
                    },
                }),
                {}
            ),
            user_id: 1,
            status: true,
        };

        try {
            const { status } = await axios.post(`${endpoint}Answers/store`, surveyWithResponses, {
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            });

            if (status === 200 || status === 201) {
                if (!correo) {
                    console.error("El correo no está definido. No se puede actualizar el estado.");
                    return;
                }
                await axios.put(
                    `${endpoint}Notification/update`,
                    { id_survey: surveyId, email: correo, state_results: true },
                    { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
                );

                // Redirigir solo si no hay campos faltantes
                navigate('/SurveyCompletion', { state: { surveyName: survey.title } });
            }
        } catch (error) {
            console.error("Error enviando respuestas:", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
            <div className="bg-white shadow-md rounded-lg w-full md:w-3/4 lg:w-2/4 xl:w-2/5 px-8 py-6 mx-auto">
                <h1 className="text-2xl font-semibold text-[#00324D] mb-4 text-center">
                    {survey.title || "Detalles de la Encuesta"}
                </h1>
                <div
                    className="text-[#00324D] mb-8"
                    dangerouslySetInnerHTML={{ __html: processDescriptionWithImages(survey.descrip, baseUrl) }}
                />
                {groupedSections?.map((section) => (
                    <div key={section.id} className="mb-8 border-l-4 pl-4 border-[#39A900] bg-gray-100 rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-[#00324D] mb-2">{section.title}</h2>
                        {section.questions?.map((question) => (
                            <div key={question.id} className="mb-6">
                                <p className="text-md font-medium text-[#00324D] mb-2">
                                    {question.title}{" "}
                                    {question.validate?.includes("Requerido") && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </p>
                                <div
                                    className="text-gray-700 mb-2"
                                    dangerouslySetInnerHTML={{
                                        __html: processDescriptionWithImages(question.descrip, baseUrl),
                                    }}
                                />
                                {/* Renderizado dinámico según tipo */}
                                {question.type?.title === "Abierta" ? (
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Escribe tu respuesta aquí"
                                        value={userResponses[question.id] || ""}
                                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                    />
                                ) : question.type?.title === "Falso y verdadero" ? (
                                    <div>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value="Verdadero"
                                                    className="mr-2"
                                                    checked={userResponses[question.id] === "Verdadero"}
                                                    onChange={() => handleResponseChange(question.id, "Verdadero")}
                                                />
                                                Verdadero
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value="Falso"
                                                    className="mr-2"
                                                    checked={userResponses[question.id] === "Falso"}
                                                    onChange={() => handleResponseChange(question.id, "Falso")}
                                                />
                                                Falso
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    question.options.map((option) => (
                                        <div key={option.id} className="flex items-center mb-2">
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={option.options}
                                                className="mr-2"
                                                checked={userResponses[question.id] === option.options}
                                                onChange={() => handleResponseChange(question.id, option.options)}
                                            />
                                            <label>{option.options}</label>
                                        </div>
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                ))}
                <button
                    className="bg-[rgba(57,169,0,1)] text-white font-bold py-2 px-4 rounded"
                    onClick={handleFinish}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default SurveyView;
