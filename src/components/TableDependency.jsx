import React, { useState } from 'react';
import DOMPurify from 'dompurify'; // Asegúrate de importar DOMPurify
import ModalQuestions from './ModalQuestions';

const TableDependency = ({ questions, allQuestions, handleEdit, handleDelete, refresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [titlefather, setTitlefather] = useState(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const openModalWithDependency = (item, parentQuestion) => {
        if (item.question?.questions_conditions) {
            alert("Esta es una pregunta padre y no puede tener dependencias.");
            return;
        }
        setSelectedItem(item);
        const title = parentQuestion?.question?.title || 'Sin título';
        setTitlefather(DOMPurify.sanitize(title));
        toggleModal();
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">ID</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Pregunta</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Tipo de pregunta</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Respuestas configuradas</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Es condición:</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Depende de:</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Añadir dependencia</th>
                        <th className="px-4 py-2 bg-[#003f63] text-white text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(questions) && questions.length > 0 ? (
                        questions.map((item, index) => {
                            if (!item || !item.question) {
                                return (
                                    <tr key={index} className="border-t">
                                        <td colSpan="8" className="text-center text-red-500">
                                            Error: Pregunta no válida.
                                        </td>
                                    </tr>
                                );
                            }

                            // Buscar la pregunta padre en `allQuestions`
                            const parentQuestion = Array.isArray(allQuestions)
                                ? allQuestions.find((q) => q.question?.id === item.question?.cod_padre)
                                : undefined;

                            return (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {DOMPurify.sanitize(String(item.question?.id) || 'Sin ID')}
                                    </td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {DOMPurify.sanitize(item.question?.title || 'Sin título')}
                                    </td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {DOMPurify.sanitize(item.question?.type?.title || 'Sin tipo')}
                                    </td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {DOMPurify.sanitize(String(item.question?.options?.length || 0))}
                                    </td>
                                    <td className="px-4 py-2 text-center text-[#00324D]">
                                        {item.question?.questions_conditions ? 'Sí' : 'No'}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-center text-[#00324D]">
                                        {item.question?.cod_padre !== 0 ? (
                                            parentQuestion ? (
                                                <span
                                                    title={DOMPurify.sanitize(`Condición de la pregunta principal: ${parentQuestion.question?.title} es ${item.question?.conditions?.[0]?.operation || ''} ${item.question?.conditions?.[0]?.compare || ''}`)}
                                                >
                                                    {DOMPurify.sanitize(`Id pregunta: ${parentQuestion.question?.id || 'N/A'} si la respuesta es: ${item.question?.conditions?.[0]?.operation || ''} ${item.question?.conditions?.[0]?.compare || ''}`)}
                                                </span>
                                            ) : (
                                                'Pregunta no encontrada'
                                            )
                                        ) : (
                                            'No tiene dependencias'
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() =>
                                                openModalWithDependency(item, parentQuestion)
                                            }
                                            className={`text-green-500 hover:text-green-700 ${
                                                item.question?.questions_conditions ? 'cursor-not-allowed opacity-50' : ''
                                            }`}
                                            disabled={item.question?.questions_conditions}
                                        >
                                            🔗
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() =>
                                                handleEdit(item.question?.id, parentQuestion)
                                            }
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.question?.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                No se encontraron datos.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* El componente del modal */}
            <ModalQuestions
                isOpen={isModalOpen}
                toggleModal={toggleModal}
                selectedItem={selectedItem}
                titlefather={titlefather}
                refresh={refresh}
            />
        </div>
    );
};

export default TableDependency;