import axios from 'axios';

const apiRequest = async (method, endpoint, data = null, headers = {}) => {
    try {
        // Obtener el token del localStorage (si aplica)
        const accessToken = localStorage.getItem('accessToken');
        const url =import.meta.env.VITE_API_ENDPOINT+endpoint
        // Configuración de los headers
        const defaultHeaders = {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            ...headers, // Permite sobrescribir o agregar headers adicionales
        };

        // Configuración de la petición
        const config = {
            method,
            url,
            data, // Datos para POST, PUT, etc.
            headers: defaultHeaders,
        };

        // Realizar la petición
        const response = await axios(config);
        return response.data; // Retornar los datos
    } catch (error) {
        // Manejo de errores
        console.error('Error en la petición:', error);
        throw error.response ? error.response.data : error.message;
    }
};

export default apiRequest;
