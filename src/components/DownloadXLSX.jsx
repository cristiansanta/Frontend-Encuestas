import React from 'react';
import axios from 'axios';

const DownloadXLSX = () => {
  const handleDownload = async () => {
    try {
      // Obtener el token de autorización desde el localStorage
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('No se encontró un token de acceso. Por favor, inicia sesión nuevamente.');
        return;
      }
      const endpoint = import.meta.env.VITE_API_ENDPOINT;
      // Realizar la petición a la API
      const response = await axios({
        url: `${endpoint}Notification/download`, // Endpoint de la API
        method: 'GET',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: `Bearer ${accessToken}`, // Incluir el token en los encabezados
        },
        responseType: 'blob', // Tipo de respuesta para manejar archivos binarios
      });

      // Crear una URL temporal para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Formato_correos_notificacion.xlsx'; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Liberar la URL
    } catch (error) {
      console.error('Error durante la descarga:', error);
      alert('Hubo un error al descargar el archivo');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Descargar Formato XLSX
    </button>
  );
};

export default DownloadXLSX;
