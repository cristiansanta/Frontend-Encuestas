/**
 * Utilidad para manejar el almacenamiento y persistencia de preguntas
 * usando localStorage
 */

const SURVEY_QUESTIONS_STORAGE_KEY = 'survey_questions';

/**
 * Guarda las preguntas en localStorage
 * @param {Array} questions - Array de objetos de preguntas
 */
export const saveQuestions = (questions) => {
  try {
    localStorage.setItem(SURVEY_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    notifyQuestionsChange(questions);
    return true;
  } catch (error) {
    console.error('Error al guardar preguntas:', error);
    return false;
  }
};

/**
 * Obtiene las preguntas desde localStorage
 * @returns {Array} - Array de objetos de preguntas o array vacío si no hay datos
 */
export const getQuestions = () => {
  try {
    const questionsData = localStorage.getItem(SURVEY_QUESTIONS_STORAGE_KEY);
    return questionsData ? JSON.parse(questionsData) : [];
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    return [];
  }
};

/**
 * Agrega una nueva pregunta a las existentes
 * @param {Object} question - Objeto con datos de la pregunta
 * @returns {Boolean} - True si se agregó correctamente
 */
export const addQuestion = (question) => {
  try {
    const currentQuestions = getQuestions();
    
    // Verificar si ya existe una pregunta con el mismo ID
    const index = currentQuestions.findIndex(q => q.id === question.id);
    
    if (index >= 0) {
      // Actualizar pregunta existente
      currentQuestions[index] = question;
    } else {
      // Agregar nueva pregunta
      currentQuestions.push(question);
    }
    
    saveQuestions(currentQuestions);
    return true;
  } catch (error) {
    console.error('Error al agregar pregunta:', error);
    return false;
  }
};

/**
 * Actualiza una pregunta existente
 * @param {String|Number} questionId - ID de la pregunta a actualizar
 * @param {Object} questionData - Nuevos datos para la pregunta
 * @returns {Boolean} - True si se actualizó correctamente
 */
export const updateQuestion = (questionId, questionData) => {
  try {
    const currentQuestions = getQuestions();
    const index = currentQuestions.findIndex(q => q.id === questionId);
    
    if (index >= 0) {
      currentQuestions[index] = {
        ...currentQuestions[index],
        ...questionData
      };
      saveQuestions(currentQuestions);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al actualizar pregunta:', error);
    return false;
  }
};

/**
 * Elimina una pregunta
 * @param {String|Number} questionId - ID de la pregunta a eliminar
 * @returns {Boolean} - True si se eliminó correctamente
 */
export const removeQuestion = (questionId) => {
  try {
    const currentQuestions = getQuestions();
    const updatedQuestions = currentQuestions.filter(q => q.id !== questionId);
    
    saveQuestions(updatedQuestions);
    return true;
  } catch (error) {
    console.error('Error al eliminar pregunta:', error);
    return false;
  }
};

/**
 * Limpiar todas las preguntas
 * @returns {Boolean} - True si se limpiaron correctamente
 */
export const clearQuestions = () => {
  try {
    localStorage.removeItem(SURVEY_QUESTIONS_STORAGE_KEY);
    notifyQuestionsChange([]);
    return true;
  } catch (error) {
    console.error('Error al limpiar preguntas:', error);
    return false;
  }
};

/**
 * Notificar a otros componentes sobre cambios en las preguntas
 * @param {Array} questions - Array actualizado de preguntas
 */
export const notifyQuestionsChange = (questions) => {
  try {
    // Crear y disparar un evento personalizado
    const event = new CustomEvent('questionsUpdated', { detail: questions });
    window.dispatchEvent(event);
    
    // También dispara un evento de storage para compatibilidad entre pestañas
    const storageEvent = new StorageEvent('storage', {
      key: SURVEY_QUESTIONS_STORAGE_KEY,
      newValue: JSON.stringify(questions),
      url: window.location.href
    });
    window.dispatchEvent(storageEvent);
  } catch (error) {
    console.error('Error al notificar cambios en preguntas:', error);
  }
};