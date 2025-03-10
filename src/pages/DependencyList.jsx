import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import HeaderBanner from '../components/HeaderBanner';
import HeaderBar from '../components/HeaderBar';
import TableDependency from '../components/TableDependency.jsx';
import ProgresBar from '../components/ProgresBar.jsx';
import Notificationpush from '../components/Notificationpush.jsx'; // Importar el componente de notificación
import { useNavigate } from 'react-router-dom';
import apiRequest from '../Provider/apiHelper.jsx';

const DependencyList = () => {
    const navigate = useNavigate();
    const endpoint = import.meta.env.VITE_API_ENDPOINT;

    // Estados para manejar el botón y notificaciones
    const [isNextDisabled, setIsNextDisabled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationAction, setNotificationAction] = useState('guardar');

    // Función para obtener datos de la encuesta
    const fetchSurveyDetails = async () => {
        try {
            const url = `surveys/${localStorage.getItem('id_survey')}/details`;
            const method = 'GET';
            const response = await apiRequest(method, url);
            return response;
        } catch (error) {
            console.error('Error al traer los datos:', error);
        }
    };

    // useQuery para manejar la consulta de datos
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['surveyDetails'],
        queryFn: fetchSurveyDetails,
    });

    // Manejo de estados iniciales de datos
    const sections = data?.sections || [];
    const questions = data?.survey_questions || [];
  
    // Agrupar preguntas por sección
    const questionsBySection = sections.map((section) => {
        const sectionQuestions = questions.filter(
            (q) => q.section_id === section.id
        );
        return {
            ...section,
            questions: sectionQuestions.map((q) => {
                if (q && q.question && q.question.id) {
                    return {
                        ...q,
                        question: {
                            ...q.question,
                            type: q.question.type || { title: 'Sin tipo' },
                            options: q.question.options || [],
                            conditions: q.question.conditions || [],
                        },
                    };
                }
                return null; // Filtrar preguntas inválidas
            }).filter(Boolean), // Asegurarse de eliminar elementos nulos o indefinidos
        };
    });

    // Actualizar el estado del botón "Siguiente" basado en las secciones vacías
    useEffect(() => {
        if (!sections.length) {
            setIsNextDisabled(true); // Si no hay secciones, desactiva el botón
            return;
        }

        const hasEmptySections = questionsBySection.some(
            (section) => !section.questions || section.questions.length === 0
        );
        setIsNextDisabled(hasEmptySections);
    }, [sections, questionsBySection]);

    if (isLoading) return <div>Cargando preguntas...</div>;
    if (error) return <div>Error al cargar preguntas</div>;

    const handleEdit = (item) => {
        console.log(item);
        alert('Editando: ');
    };

    const handleDelete = async (itemId) => {
        
        try {
            const url = `questions/destroy/${itemId}`;
            const method = 'PUT';
            const response = await apiRequest(method, url);

            setNotificationMessage('Pregunta eliminada con éxito ID',itemId);
            setNotificationAction('eliminar'); // Configura la acción para "eliminar"
            setShowNotification(true);

            console.log(response); // Mensaje de éxito
            refetch();
        } catch (error) {
            console.error('Error al eliminar:', error);
            setNotificationMessage('Hubo un error al eliminar la pregunta');
            setNotificationAction('eliminar'); // Configura la acción para "eliminar"
            setShowNotification(true);
        }
    };

    const handleFinish = () => {
        navigate('/surveyDetails');
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col items-center mt-7">
                <HeaderBanner />
                <HeaderBar props="Configuración de la encuesta: Listado de Preguntas" />
                <ProgresBar currentView="DependencyList" />
                <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto">
                    {/* Mostrar la notificación si es necesario */}
                    {showNotification && (
                        <Notificationpush
                            message={notificationMessage}
                            duration={3000}
                            action={notificationAction} // Propiedad para definir el color
                            onClose={() => setShowNotification(false)}
                        />
                    )}
                    {/* Renderizar una tabla para cada sección */}
                    {questionsBySection.map((section) => {
                        if (!section.questions || section.questions.length === 0) {
                            // Manejar secciones sin preguntas
                            return (
                                <div key={section.id} className="mb-8">
                                    <h2 className="text-xl font-bold mb-4">⚠️ {section.title}</h2>
                                    <p className="mb-2 text-gray-600">
                                        Esta sección no tiene preguntas, para continuar debe incluir al menos una pregunta por sección.
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div key={section.id} className="mb-8">
                                <h2 className="text-xl font-bold mb-4">✅ {section.title}</h2>
                                <TableDependency
                                    questions={section.questions}
                                    allQuestions={questions} // Todas las preguntas de todas las secciones
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    refresh={refetch}
                                />

                            </div>
                        );
                    })}
                    <div className="flex justify-end mt-4">
                        <button
                            className={`font-bold py-2 px-4 rounded ${
                                isNextDisabled
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                            onClick={handleFinish}
                            disabled={isNextDisabled}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DependencyList;
