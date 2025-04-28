import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import HeaderBanner from '../components/HeaderBanner';
import HeaderBar from '../components/HeaderBar';
import TableDependency from '../components/TableDependency.jsx';
import ProgresBar from '../components/ProgresBar.jsx';
import Notificationpush from '../components/Notificationpush.jsx'; // Importar el componente de notificación
import Modal from '../components/Modal'; // Importar el componente Modal
import { useNavigate } from 'react-router-dom';
import apiRequest from '../Provider/apiHelper.jsx';
import DOMPurify from 'dompurify'; // Importamos DOMPurify

const DependencyList = () => {
    const navigate = useNavigate();
    const endpoint = import.meta.env.VITE_API_ENDPOINT;

    // Estados para manejar el botón y notificaciones
    const [isNextDisabled, setIsNextDisabled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationAction, setNotificationAction] = useState('guardar');

    // Estados para manejar el modal de edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Función para obtener datos de la encuesta
    const fetchPreviewDetails = async () => {
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
        queryKey: ['PreviewDetails'],
        queryFn: fetchSPreviewDetails,
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
    if (error) return <div>Error al cargar preguntas: {DOMPurify.sanitize(error.message)}</div>;

    const handleEdit = (item) => {
        setEditItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (itemId) => {
        try {
            const url = `questions/destroy/${itemId}`;
            const method = 'PUT';
            const response = await apiRequest(method, url);

            setNotificationMessage(`Pregunta eliminada con éxito ID ${DOMPurify.sanitize(String(itemId))}`);
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
        navigate('/PreviewDetails');
    };

    const handleEditSubmit = async (updatedItem) => {
        try {
            const url = `questions/update/${updatedItem.id}`;
            const method = 'PUT';
            const response = await apiRequest(method, url, updatedItem);

            setNotificationMessage('Pregunta actualizada con éxito');
            setNotificationAction('editar'); // Configura la acción para "editar"
            setShowNotification(true);

            console.log(response); // Mensaje de éxito
            refetch();
            setIsEditModalOpen(false); // Cierra el modal de edición
        } catch (error) {
            console.error('Error al actualizar:', error);
            setNotificationMessage('Hubo un error al actualizar la pregunta');
            setNotificationAction('editar'); // Configura la acción para "editar"
            setShowNotification(true);
        }
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
                                    <h2 className="text-xl font-bold mb-4">⚠️ {DOMPurify.sanitize(section.title)}</h2>
                                    <p className="mb-2 text-gray-600">
                                        Esta sección no tiene preguntas, para continuar debe incluir al menos una pregunta por sección.
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div key={section.id} className="mb-8">
                                <h2 className="text-xl font-bold mb-4">✅ {DOMPurify.sanitize(section.title)}</h2>
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

            {/* Modal de edición */}
            {isEditModalOpen && (
                <Modal
                    isOpen={isEditModalOpen}
                    title="Editar Pregunta"
                    message={
                        <EditForm
                            item={editItem}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setIsEditModalOpen(false)}
                        />
                    }
                    onConfirm={() => {}}
                    onCancel={() => setIsEditModalOpen(false)}
                    confirmText="Guardar"
                    cancelText="Cancelar"
                    type="informative"
                    status="default"
                />
            )}
        </div>
    );
};

const EditForm = ({ item, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Título
                </label>
                <input
                    type="text"
                    name="title"
                    value={DOMPurify.sanitize(formData.title)}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Descripción
                </label>
                <textarea
                    name="description"
                    value={DOMPurify.sanitize(formData.description)}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Guardar
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default DependencyList;