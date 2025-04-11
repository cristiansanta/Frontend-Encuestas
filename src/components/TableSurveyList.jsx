import React, { useState } from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../Provider/apiHelper';
import { useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify'; // Importamos DOMPurify

const TableSurveyList = ({ surveys }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentDraftPage, setCurrentDraftPage] = useState(1);
    const [showDrafts, setShowDrafts] = useState(false);
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

    const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);

    const draftSurveys = [
        { id: 101, title: 'Encuesta Borrador 1', status: false, user_create: 'Usuario 1', category: { title: 'Categoría 1' }, created_at: '2025-03-01', assignments_count: 0 },
        { id: 102, title: 'Encuesta Borrador 2', status: false, user_create: 'Usuario 2', category: { title: 'Categoría 2' }, created_at: '2025-03-02', assignments_count: 0 },
        
        // Añade más borradores si es necesario
    ];

    const draftIndexOfLastItem = currentDraftPage * itemsPerPage;
    const draftIndexOfFirstItem = draftIndexOfLastItem - itemsPerPage;
    const currentDraftItems = draftSurveys.slice(draftIndexOfFirstItem, draftIndexOfLastItem);

    const totalDraftPages = Math.ceil(draftSurveys.length / itemsPerPage);

    const handleEdit = (item) => {
        localStorage.setItem('id_survey', item.id);
        navigate('/DependencyList');
    };

    const handleDelete = async (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;

        try {
            if (userPermissions.permissions.includes('delete-users')) {
                await apiRequest('PUT', `surveys/${selectedItem.id}`);
                alert(`Encuesta eliminada con éxito: ${DOMPurify.sanitize(selectedItem.title)}`);
            } else {
                await apiRequest('PUT', `surveys/update/${selectedItem.id}`, { status: false });
                alert(`Encuesta marcada como eliminada: ${DOMPurify.sanitize(selectedItem.title)}`);
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            alert('Ocurrió un error al intentar procesar la solicitud. Intente nuevamente.');
        } finally {
            setIsModalOpen(false);
            setSelectedItem(null);
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDraftPageChange = (pageNumber) => {
        setCurrentDraftPage(pageNumber);
    };

    const renderPagination = (current, total, handleChange) => {
        if (total <= 3) {
            return [...Array(total)].map((_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handleChange(index + 1)}
                    className={`px-2 py-1 border ${current === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                    {index + 1}
                </button>
            ));
        }

        const startPage = Math.max(1, current - 1);
        const endPage = Math.min(total, current + 1);

        const pages = [];
        if (current > 2) pages.push(1);
        if (current > 3) pages.push('...');
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        if (current < total - 2) pages.push('...');
        if (current < total - 1) pages.push(total);

        return pages.map((page, index) =>
            page === '...' ? (
                <span key={index} className="px-2 py-1">
                    ...
                </span>
            ) : (
                <button
                    key={page}
                    onClick={() => handleChange(page)}
                    className={`px-2 py-1 border ${current === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                    {page}
                </button>
            )
        );
    };

    const handleAsignation = (item) => {
        localStorage.setItem('selectedSurveyId', item.id);
        localStorage.setItem('selectedSurveyTitle', DOMPurify.sanitize(item.title));
        navigate('/AsignationMigrate');
    };

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
                                    <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(String(item.id))}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(item.title || 'Título no disponible')}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{item.status ? 'Activo' : 'Inactivo'}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(item.user_create || 'Usuario')}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(item.category?.title || 'Sin categoría')}</td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {item.created_at ? DOMPurify.sanitize(new Date(item.created_at).toISOString().split('T')[0]) : 'Fecha no disponible'}
                                    </td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(String(item.assignments_count || 0))}</td>
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

            <div className="flex justify-center items-center space-x-1 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                    &lt;
                </button>
                {renderPagination(currentPage, totalPages, handlePageChange)}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                    &gt;
                </button>
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setShowDrafts(!showDrafts)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {showDrafts ? 'Ocultar Borradores' : 'Mostrar Borradores'}
                </button>
            </div>

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
                            {currentDraftItems.length > 0 ? (
                                currentDraftItems.map((item) =>
                                    item && item.id ? (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(String(item.id))}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(item.title || 'Título no disponible')}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{item.status ? 'Activo' : 'Inactivo'}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(item.user_create || 'Usuario')}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(item.category?.title || 'Sin categoría')}</td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">
                                                {item.created_at ? DOMPurify.sanitize(new Date(item.created_at).toISOString().split('T')[0]) : 'Fecha no disponible'}
                                            </td>
                                            <td className="px-4 py-2 text-center text-[#00324D]">{DOMPurify.sanitize(String(item.assignments_count || 0))}</td>
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

                    <div className="flex justify-center items-center space-x-1 mt-4">
                        <button
                            onClick={() => handleDraftPageChange(currentDraftPage - 1)}
                            disabled={currentDraftPage === 1}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            &lt;
                        </button>
                        {renderPagination(currentDraftPage, totalDraftPages, handleDraftPageChange)}
                        <button
                            onClick={() => handleDraftPageChange(currentDraftPage + 1)}
                            disabled={currentDraftPage === totalDraftPages}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    title="Eliminar Registro de encuesta"
                    message={`¿Está seguro de que desea eliminar la encuesta "${DOMPurify.sanitize(selectedItem?.title)}"?`}
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