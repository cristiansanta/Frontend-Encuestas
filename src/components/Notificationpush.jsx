import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react'; // Agregamos un ícono para errores

const NotificationPush = ({ message, action = 'guardar', duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Llama a onClose después de la animación
    }, duration);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Determinar el color y el ícono según la acción
  const backgroundColor = action === 'eliminar' ? 'bg-red-600' : 'bg-green-600';
  const Icon = action === 'eliminar' ? AlertCircle : CheckCircle;

  return (
    <div
      className={`fixed top-4 right-4 ${backgroundColor} text-white p-4 rounded-lg shadow-lg flex items-center gap-2 transition-transform duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Icon className="w-6 h-6 text-white" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default NotificationPush;
