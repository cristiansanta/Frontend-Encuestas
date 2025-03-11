import React, { useState, useEffect } from 'react';
import ModalQuestions from './ModalQuestions';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../Provider/apiHelper';
import { useQueryClient } from '@tanstack/react-query';
import Modal from './Modal';

const TableSurveyList = ({ surveys }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de confirmación
    const [selectedItem, setSelectedItem] = useState(null); // Encuesta seleccionada para eliminar
    const [currentPage, setCurrentPage] = useState(1);
    const [showDrafts, setShowDrafts] = useState(false); // Estado para mostrar/ocultar la tabla de borradores
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const userPermissions = queryClient.getQueryData(['UserPermissions']) || {};
    const userRoles = userPermissions.roles || [];
    const isAdmin = userRoles.includes('Admin');

    const filteredSurveys = isAdmin
        ? Array.isArray(surveys) ? surveys : Object.values(surveys)
        : Array.isArray(surveys)
        ? surveys.filter((survey) => survey.status)
        : Object.values(surveys).filter((survey) => survey.status);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSurveys.slice(indexOfFirstItem, indexOfLastItem);

    const handleEdit = (item) => {
        localStorage.setItem('id_survey', item.id);
        navigate('/DependencyList');
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDelete = async (item) => {
        setSelectedItem(item); // Guarda el item seleccionado para confirmar la eliminación
        setIsModalOpen(true); // Muestra el modal de confirmación
    };

    const confirmDelete = async () => {
        if (!selectedItem) return; // Verifica si hay un elemento seleccionado

        try {
            if (userPermissions.permissions.includes('delete-users')) {
                await apiRequest('PUT', `surveys/${selectedItem.id}`);
                alert(`Encuesta eliminada con éxito: ${selectedItem.title}`);
            } else {
                await apiRequest('PUT', `surveys/update/${selectedItem.id}`, { status: false });
                alert(`Encuesta marcada como eliminada: ${selectedItem.title}`);
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            alert('Ocurrió un error al intentar procesar la solicitud. Intente nuevamente.');
        } finally {
            setIsModalOpen(false); // Cierra el modal
            setSelectedItem(null); // Limpia el elemento seleccionado
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false); // Cierra el modal sin realizar acciones
        setSelectedItem(null); // Limpia el elemento seleccionado
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);

    const handleAsignation = (item) => {
        localStorage.setItem('selectedSurveyId', item.id);
        localStorage.setItem('selectedSurveyTitle', item.title);
        navigate('/AsignationMigrate');
    };

    // Datos de ejemplo para encuestas en borrador
    const draftSurveys = [
        { id: 101, title: 'Encuesta Borrador 1', status: false, user_create: 'Usuario 1', category: { title: 'Categoría 1' }, created_at: '2025-03-01', assignments_count: 0 },
        { id: 102, title: 'Encuesta Borrador 2', status: false, user_create: 'Usuario 2', category: { title: 'Categoría 2' }, created_at: '2025-03-02', assignments_count: 0 },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">ID</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Título de la encuesta</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Estado</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Creador</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Categoría</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Fecha de creación</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">N° de asignaciones</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Ver asignaciones</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Asignar / Reasignar</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((item) =>
                            item && item.id ? (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.id}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.title || 'Título no disponible'}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.status ? 'Activo' : 'Inactivo'}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.user_create || 'Usuario'}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.category?.title || 'Sin categoría'}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : 'Fecha no disponible'}
                                    </td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.assignments_count || 0}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">Ver</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="text-green-500 hover:text-green-700"
                                            onClick={() => handleAsignation(item)}
                                        >
                                            🔗
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : null
                        )
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center py-4">No se encontraron datos</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-center space-x-2 mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-[rgba(57,169,0,1)] text-white' : 'bg-white text-[rgba(57,169,0,1)]'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Botón para mostrar/ocultar la tabla de borradores */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setShowDrafts(!showDrafts)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {showDrafts ? 'Ocultar Borradores' : 'Mostrar Borradores'}
                </button>
            </div>

            {/* Tabla de borradores */}
            {showDrafts && (
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">ID</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Título de la encuesta</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Estado</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Creador</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Categoría</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Fecha de creación</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">N° de asignaciones</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Ver asignaciones</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Asignar / Reasignar</th>
                                <th className="px-4 py-2 bg-[#003f63] text-white text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {draftSurveys.length > 0 ? (
                                draftSurveys.map((item) =>
                                    item && item.id ? (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.id}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.title || 'Título no disponible'}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.status ? 'Activo' : 'Inactivo'}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.user_create || 'Usuario'}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.category?.title || 'Sin categoría'}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">
                                                {item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : 'Fecha no disponible'}
                                            </td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.assignments_count || 0}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">Ver</td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={() => handleAsignation(item)}
                                                >
                                                    🔗
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : null
                                )
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">No se encontraron datos</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para confirmar eliminación */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    title="Eliminar Registro de encuesta"
                    message={`¿Está seguro de que desea eliminar la encuesta "${selectedItem?.title}"?`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    type="default"
                    status="error"
                />
            )}
        </div>
    );
};

export default TableSurveyList;