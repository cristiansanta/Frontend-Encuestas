import { getSections, updateSections } from './SectionsStorage';
import { getBankQuestions } from './BankQuestionsStorage';

const SURVEY_DATA_KEY = 'current_survey_data';
const SURVEY_PROGRESS_KEY = 'current_survey_progress';

/**
 * Guarda los datos completos de la encuesta en curso
 * @param {Object} surveyData - Objeto con todos los datos de la encuesta
 */
export const saveSurveyData = (surveyData) => {
    try {
        localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(surveyData));
        return true;
    } catch (error) {
        console.error('Error al guardar datos de la encuesta:', error);
        return false;
    }
};

/**
 * Obtiene los datos completos de la encuesta en curso
 * @returns {Object} - Objeto con todos los datos de la encuesta o objeto vacío
 */
export const getSurveyData = () => {
    try {
        const data = localStorage.getItem(SURVEY_DATA_KEY);
        return data ? JSON.parse(data) : {
            title: '',
            description: '',
            category: null,
            startDate: new Date(),
            endDate: new Date(),
            sections: [],
            questions: []
        };
    } catch (error) {
        console.error('Error al obtener datos de la encuesta:', error);
        return {
            title: '',
            description: '',
            category: null,
            startDate: new Date(),
            endDate: new Date(),
            sections: [],
            questions: []
        };
    }
};

/**
 * Guarda el progreso actual (paso en el que se encuentra)
 * @param {Number} step - Número del paso actual (1, 2 o 3)
 */
export const saveSurveyProgress = (step) => {
    try {
        localStorage.setItem(SURVEY_PROGRESS_KEY, step.toString());
        return true;
    } catch (error) {
        console.error('Error al guardar progreso:', error);
        return false;
    }
};

/**
 * Obtiene el paso actual del progreso
 * @returns {Number} - Número del paso actual (1, 2 o 3) o 1 por defecto
 */
export const getSurveyProgress = () => {
    try {
        const step = localStorage.getItem(SURVEY_PROGRESS_KEY);
        return step ? parseInt(step, 10) : 1;
    } catch (error) {
        console.error('Error al obtener progreso:', error);
        return 1;
    }
};

/**
 * Actualiza solo una parte específica de los datos de la encuesta
 * @param {String} key - Clave del dato a actualizar (title, description, etc)
 * @param {Any} value - Nuevo valor a asignar
 */
export const updateSurveyDataField = (key, value) => {
    try {
        const currentData = getSurveyData();
        currentData[key] = value;
        saveSurveyData(currentData);
        return true;
    } catch (error) {
        console.error(`Error al actualizar campo ${key}:`, error);
        return false;
    }
};

/**
 * Agrega una nueva pregunta a la encuesta
 * @param {Object} question - Objeto con datos de la pregunta
 * @returns {Object} - Objeto con la pregunta agregada incluyendo su ID
 */
export const addQuestion = (question) => {
    try {
        const currentData = getSurveyData();
        const questionId = Date.now(); // Generar ID único
        const newQuestion = {
            ...question,
            id: questionId,
            childQuestions: []
        };

        currentData.questions.push(newQuestion);
        saveSurveyData(currentData);

        return newQuestion;
    } catch (error) {
        console.error('Error al agregar pregunta:', error);
        return null;
    }
};

/**
 * Actualiza una pregunta existente
 * @param {Number|String} questionId - ID de la pregunta a actualizar
 * @param {Object} updatedQuestion - Datos actualizados de la pregunta
 */
export const updateQuestion = (questionId, updatedQuestion) => {
    try {
        const currentData = getSurveyData();
        const questionIndex = currentData.questions.findIndex(q => q.id === questionId);

        if (questionIndex >= 0) {
            currentData.questions[questionIndex] = {
                ...currentData.questions[questionIndex],
                ...updatedQuestion
            };
            saveSurveyData(currentData);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al actualizar pregunta:', error);
        return false;
    }
};

/**
 * Agrega una pregunta hija a una pregunta existente
 * @param {Number|String} parentId - ID de la pregunta padre
 * @param {Object} childQuestion - Datos de la pregunta hija
 */
export const addChildQuestion = (parentId, childQuestion) => {
    try {
        const currentData = getSurveyData();
        const parentIndex = currentData.questions.findIndex(q => q.id === parentId);

        if (parentIndex >= 0) {
            const childId = Date.now(); // Generar ID único
            const newChild = {
                ...childQuestion,
                id: childId,
                parentId
            };

            // Asegurarse de que existe el array de preguntas hijas
            if (!currentData.questions[parentIndex].childQuestions) {
                currentData.questions[parentIndex].childQuestions = [];
            }

            currentData.questions[parentIndex].childQuestions.push(newChild);
            saveSurveyData(currentData);

            return newChild;
        }
        return null;
    } catch (error) {
        console.error('Error al agregar pregunta hija:', error);
        return null;
    }
};

/**
 * Borra todos los datos y reinicia el proceso de creación
 */
export const clearSurveyData = () => {
    try {
        localStorage.removeItem(SURVEY_DATA_KEY);
        localStorage.removeItem(SURVEY_PROGRESS_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar datos de la encuesta:', error);
        return false;
    }
};

/**
 * Sincroniza las secciones del paso 1 con el servicio de secciones
 */
export const syncSectionsBetweenServices = () => {
    try {
        const currentData = getSurveyData();
        if (currentData.sections && currentData.sections.length > 0) {
            updateSections(currentData.sections);
        } else {
            // Si no hay secciones en el storage principal, tomar las del storage de secciones
            const sections = getSections();
            if (sections.length > 0) {
                currentData.sections = sections;
                saveSurveyData(currentData);
            }
        }
        return true;
    } catch (error) {
        console.error('Error al sincronizar secciones:', error);
        return false;
    }
};

/**
 * Prepara los datos completos de la encuesta para la previsualización
 * @returns {Object} - Datos completos y estructurados de la encuesta
 */
export const prepareSurveyPreview = () => {
    try {
        const surveyData = getSurveyData();
        const sections = getSections();
        const bankQuestions = getBankQuestions();

        // Organizar preguntas por sección para la vista previa
        const questionsBySection = {};

        // Inicializar el objeto con las secciones disponibles
        sections.forEach(section => {
            questionsBySection[section.id] = {
                name: section.name,
                questions: []
            };
        });

        // Agrupar las preguntas por sección
        surveyData.questions.forEach(question => {
            if (question.section && question.section.id) {
                if (!questionsBySection[question.section.id]) {
                    questionsBySection[question.section.id] = {
                        name: question.section.name,
                        questions: []
                    };
                }
                questionsBySection[question.section.id].questions.push({
                    ...question,
                    childQuestions: question.childQuestions || []
                });
            }
        });

        return {
            ...surveyData,
            sections,
            questionsBySection,
            bankQuestions
        };
    } catch (error) {
        console.error('Error al preparar vista previa:', error);
        return getSurveyData();
    }
};