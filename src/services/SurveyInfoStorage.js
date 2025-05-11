/**
 * Utilidad para manejar el almacenamiento y persistencia de información general de encuestas
 * usando localStorage
 */

const SURVEY_INFO_STORAGE_KEY = 'survey_info';

/**
 * Guarda toda la información de la encuesta de una vez
 * @param {Object} info - Objeto completo con información de la encuesta
 */
export const saveSurveyInfo = (info) => {
    try {
        // Crear copia para evitar modificar el objeto original
        const infoToSave = { ...info };

        // Convertir fechas a ISO strings
        if (infoToSave.startDate instanceof Date) {
            infoToSave.startDate = infoToSave.startDate.toISOString();
        }
        if (infoToSave.endDate instanceof Date) {
            infoToSave.endDate = infoToSave.endDate.toISOString();
        }

        localStorage.setItem(SURVEY_INFO_STORAGE_KEY, JSON.stringify(infoToSave));
        notifySurveyInfoChange(infoToSave);
        return true;
    } catch (error) {
        console.error('Error al guardar información completa de la encuesta:', error);
        return false;
    }
};

/**
 * Obtiene la información general de la encuesta desde localStorage
 * @param {Boolean} parseDates - Si es true, convierte strings de fechas a objetos Date
 * @returns {Object} - Objeto con datos generales o objeto vacío si no hay datos
 */
export const getSurveyInfo = (parseDates = true) => {
    try {
        const surveyInfoData = localStorage.getItem(SURVEY_INFO_STORAGE_KEY);
        if (!surveyInfoData) return {};

        const parsedInfo = JSON.parse(surveyInfoData);

        // Convertir strings ISO a objetos Date si se solicita
        if (parseDates) {
            if (parsedInfo.startDate) {
                parsedInfo.startDate = new Date(parsedInfo.startDate);
            }
            if (parsedInfo.endDate) {
                parsedInfo.endDate = new Date(parsedInfo.endDate);
            }
        }

        return parsedInfo;
    } catch (error) {
        console.error('Error al obtener información de la encuesta:', error);
        return {};
    }
};

/**
 * Actualiza un campo específico de la información de la encuesta
 * @param {String} field - Nombre del campo a actualizar
 * @param {Any} value - Nuevo valor para el campo
 */
export const updateSurveyInfoField = (field, value) => {
    try {
        const currentInfo = getSurveyInfo(false); // Obtener sin convertir fechas
        const updatedInfo = {
            ...currentInfo,
            [field]: value instanceof Date ? value.toISOString() : value
        };

        localStorage.setItem(SURVEY_INFO_STORAGE_KEY, JSON.stringify(updatedInfo));
        notifySurveyInfoChange(updatedInfo);
        return true;
    } catch (error) {
        console.error(`Error al actualizar campo "${field}" de la encuesta:`, error);
        return false;
    }
};

/**
 * Notifica a otros componentes sobre cambios en la información de la encuesta
 */
export const notifySurveyInfoChange = (surveyInfo) => {
    try {
        // Crear y disparar un evento personalizado con la información actualizada
        const event = new CustomEvent('surveyInfoUpdated', { detail: surveyInfo });
        window.dispatchEvent(event);

        // También disparar evento de storage para compatibilidad
        const storageEvent = new StorageEvent('storage', {
            key: SURVEY_INFO_STORAGE_KEY,
            newValue: JSON.stringify(surveyInfo),
            url: window.location.href
        });
        window.dispatchEvent(storageEvent);
    } catch (error) {
        console.error('Error al notificar cambios en información de la encuesta:', error);
    }
};