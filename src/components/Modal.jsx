import React from 'react';

const Modal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  type = 'default', // El tipo del modal: 'default' (con botones) o 'informative'
  status = 'success' // Nuevo: 'success' o 'error' para cambiar el color del modal
}) => {
  if (!isOpen) return null; // No renderiza si el modal no está abierto

  const modalStyle = status === 'error' ? 'bg--600' : 'bg-green-600'; // Ajuste según el estado

  return (
    <div className="fixed inset-0 flex items-center justify-center border bor bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full mx-auto text-center">
        <h2 className="text-center text-2xl font-bold text-[#00324D] mb-4">{title}</h2>
        <p className="text-center text-xl mb-4">{message}</p>

        {/* Renderizamos botones solo si es el modal estándar */}
        {type === 'default' && (
          <div className="flex justify-between space-x-4">
            <button
              onClick={onCancel}
              className={`${modalStyle} hover:${modalStyle} text-white font-bold py-2 px-4 rounded focus:outline-none w-full`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none w-full"
            >
              {confirmText}
            </button>
          </div>
        )}

        {/* Renderizamos un botón "Cerrar" o "Ok" si es un modal informativo */}
        {type === 'informative' && (
          <button
            onClick={onCancel} // onCancel cierra el modal
            className={`${modalStyle} hover:${modalStyle} text-white font-bold py-2 px-4 rounded focus:outline-none w-full`}
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
