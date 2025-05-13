/**
 * Utilidad para manejar el almacenamiento y persistencia de información general de encuestas
 * usando localStorage
 */

const SURVEY_INFO_STORAGE_KEY = 'survey_info';
const SECTIONS_STORAGE_KEY = 'survey_sections';
const QUESTIONS_STORAGE_KEY = 'survey_questions';

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

/**
 * Guarda las secciones de la encuesta
 * @param {Array} sections - Array de objetos de sección
 */
export const saveSections = (sections) => {
    try {
        localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
        return true;
    } catch (error) {
        console.error('Error al guardar secciones de la encuesta:', error);
        return false;
    }
};

/**
 * Obtiene las secciones de la encuesta desde localStorage
 * @returns {Array} - Array de objetos de sección o array vacío si no hay datos
 */
export const getSections = () => {
    try {
        const sectionsData = localStorage.getItem(SECTIONS_STORAGE_KEY);
        return sectionsData ? JSON.parse(sectionsData) : [];
    } catch (error) {
        console.error('Error al obtener secciones de la encuesta:', error);
        return [];
    }
};

/**
 * Guarda las preguntas de la encuesta
 * @param {Array} questions - Array de objetos de pregunta
 */
export const saveQuestions = (questions) => {
    try {
        localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
        return true;
    } catch (error) {
        console.error('Error al guardar preguntas de la encuesta:', error);
        return false;
    }
};

/**
 * Obtiene las preguntas de la encuesta desde localStorage
 * @returns {Array} - Array de objetos de pregunta o array vacío si no hay datos
 */
export const getQuestions = () => {
    try {
        const questionsData = localStorage.getItem(QUESTIONS_STORAGE_KEY);
        return questionsData ? JSON.parse(questionsData) : [];
    } catch (error) {
        console.error('Error al obtener preguntas de la encuesta:', error);
        return [];
    }
};

/**
 * Agrega una nueva sección a las secciones existentes
 * @param {Object} section - Objeto de sección a agregar
 */
export const addSection = (section) => {
    try {
        const sections = getSections();
        sections.push(section);
        saveSections(sections);
        return true;
    } catch (error) {
        console.error('Error al agregar nueva sección:', error);
        return false;
    }
};

/**
 * Agrega una nueva pregunta a las preguntas existentes
 * @param {Object} question - Objeto de pregunta a agregar
 */
export const addQuestion = (question) => {
    try {
        const questions = getQuestions();
        questions.push(question);
        saveQuestions(questions);
        return true;
    } catch (error) {
        console.error('Error al agregar nueva pregunta:', error);
        return false;
    }
};

/**
 * Actualiza una sección existente
 * @param {Number} sectionId - ID de la sección a actualizar
 * @param {Object} updatedSection - Nuevos datos de la sección
 */
export const updateSection = (sectionId, updatedSection) => {
    try {
        const sections = getSections();
        const index = sections.findIndex(s => s.id === sectionId);
        if (index !== -1) {
            sections[index] = { ...sections[index], ...updatedSection };
            saveSections(sections);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error al actualizar sección ${sectionId}:`, error);
        return false;
    }
};

/**
 * Actualiza una pregunta existente
 * @param {Number} questionId - ID de la pregunta a actualizar
 * @param {Object} updatedQuestion - Nuevos datos de la pregunta
 */
export const updateQuestion = (questionId, updatedQuestion) => {
    try {
        const questions = getQuestions();
        const index = questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
            questions[index] = { ...questions[index], ...updatedQuestion };
            saveQuestions(questions);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error al actualizar pregunta ${questionId}:`, error);
        return false;
    }
};

/**
 * Elimina una sección por su ID
 * @param {Number} sectionId - ID de la sección a eliminar
 */
export const deleteSection = (sectionId) => {
    try {
        const sections = getSections();
        const filteredSections = sections.filter(s => s.id !== sectionId);
        saveSections(filteredSections);
        return true;
    } catch (error) {
        console.error(`Error al eliminar sección ${sectionId}:`, error);
        return false;
    }
};

/**
 * Elimina una pregunta por su ID
 * @param {Number} questionId - ID de la pregunta a eliminar
 */
export const deleteQuestion = (questionId) => {
    try {
        const questions = getQuestions();
        const filteredQuestions = questions.filter(q => q.id !== questionId);
        saveQuestions(filteredQuestions);
        return true;
    } catch (error) {
        console.error(`Error al eliminar pregunta ${questionId}:`, error);
        return false;
    }
};

/**
 * Limpia todos los datos de la encuesta
 */
export const clearAllSurveyData = () => {
    try {
        localStorage.removeItem(SURVEY_INFO_STORAGE_KEY);
        localStorage.removeItem(SECTIONS_STORAGE_KEY);
        localStorage.removeItem(QUESTIONS_STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar todos los datos de la encuesta:', error);
        return false;
    }
};