import React from 'react';
import axios from 'axios';

const ApiHandler = ({
  url,
  method = 'GET', // Método HTTP por defecto
  data = {}, // Datos para enviar en la petición (POST, PUT)
  headers = {}, // Headers personalizados
  onSuccess = (response) => console.log('Solicitud exitosa:', response),
  onError = (error) => console.error('Error en la solicitud:', error),
}) => {
  
  // Función para manejar la solicitud HTTP
  const handleRequest = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      // Añadir token a los headers si existe
      if (accessToken) {
        headers = { ...headers, Authorization: `Bearer ${accessToken}` };
      }

      // Configuración de la solicitud según el método
      const config = {
        method: method.toUpperCase(),
        url,
        headers,
        data: method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE' ? null : data,
      };

      // Realizar la solicitud HTTP con axios
      const response = await axios(config);

      // Manejo de la respuesta exitosa
      onSuccess(response.data);
    } catch (error) {
      // Manejo del error de la solicitud
      onError(error.response?.data || error.message);
    }
  };

  // Botón para iniciar la solicitud (puedes cambiar esto según tus necesidades)
  return (
    <button onClick={handleRequest} className="bg-blue-500 text-white px-4 py-2 rounded">
      {`Enviar ${method}`}
    </button>
  );
};

export default ApiHandler;
