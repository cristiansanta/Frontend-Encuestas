/**
 * Utilidad para manejar el almacenamiento y persistencia de preguntas del banco
 * usando localStorage
 */

const BANK_QUESTIONS_STORAGE_KEY = 'bank_questions';

/**
 * Guarda las preguntas del banco en localStorage
 * @param {Array} questions - Array de objetos de preguntas
 */
export const saveBankQuestions = (questions) => {
  try {
    localStorage.setItem(BANK_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    notifyBankQuestionsChange(questions);
    return true;
  } catch (error) {
    console.error('Error al guardar preguntas del banco:', error);
    return false;
  }
};

/**
 * Obtiene las preguntas del banco desde localStorage
 * @returns {Array} - Array de objetos de preguntas o array vacío si no hay datos
 */
export const getBankQuestions = () => {
  try {
    const questionsData = localStorage.getItem(BANK_QUESTIONS_STORAGE_KEY);
    return questionsData ? JSON.parse(questionsData) : [];
  } catch (error) {
    console.error('Error al obtener preguntas del banco:', error);
    return [];
  }
};

/**
 * Verifica si una pregunta similar ya existe en el banco
 * @param {Object} questionData - Datos de la pregunta a verificar
 * @returns {Boolean} - True si ya existe una pregunta similar
 */
export const isSimilarQuestionInBank = (questionData) => {
  try {
    if (!questionData.title || !questionData.questionType) return false;
    
    const currentQuestions = getBankQuestions();
    
    return currentQuestions.some(q => 
      q.id !== questionData.id && // No es la misma pregunta (por ID)
      q.title.toLowerCase().trim() === questionData.title.toLowerCase().trim() && 
      q.questionType === questionData.questionType
    );
  } catch (error) {
    console.error('Error al verificar pregunta similar:', error);
    return false;
  }
};

/**
 * Agrega una pregunta al banco
 * @param {Object} question - Objeto con datos de la pregunta
 * @returns {Object} - { success: boolean, isDuplicate: boolean }
 */
export const addQuestionToBank = (question) => {
  try {
    // Verificar que la pregunta tenga los datos mínimos necesarios
    if (!question.title || !question.questionType) {
      return { success: false, isDuplicate: false };
    }
    
    const currentQuestions = getBankQuestions();
    
    // Verificar si ya existe una pregunta con el mismo ID
    const existingIdIndex = currentQuestions.findIndex(q => q.id === question.id);
    
    // Verificar si ya existe una pregunta similar
    const isDuplicate = isSimilarQuestionInBank(question);
    
    // Si es un duplicado, no guardar
    if (isDuplicate) {
      console.warn('Ya existe una pregunta similar en el banco.');
      return { success: false, isDuplicate: true };
    }
    
    // Actualizar o agregar la pregunta
    if (existingIdIndex >= 0) {
      currentQuestions[existingIdIndex] = question;
    } else {
      currentQuestions.push(question);
    }
    
    saveBankQuestions(currentQuestions);
    return { success: true, isDuplicate: false };
  } catch (error) {
    console.error('Error al agregar pregunta al banco:', error);
    return { success: false, isDuplicate: false };
  }
};

/**
 * Elimina una pregunta del banco basada en propiedades de título y tipo
 * @param {Object} questionData - Objeto con título y tipo de pregunta
 * @returns {Boolean} - True si se eliminó correctamente
 */
export const removeSimilarQuestionFromBank = (questionData) => {
  try {
    // Verificar que tengamos datos mínimos para buscar
    if (!questionData.title || !questionData.questionType) {
      return false;
    }
    
    const currentQuestions = getBankQuestions();
    
    // Buscar pregunta similar por título y tipo
    const updatedQuestions = currentQuestions.filter(q => 
      !(q.title.toLowerCase().trim() === questionData.title.toLowerCase().trim() && 
        q.questionType === questionData.questionType)
    );
    
    // Si encontramos y eliminamos alguna
    if (updatedQuestions.length < currentQuestions.length) {
      saveBankQuestions(updatedQuestions);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al eliminar pregunta similar del banco:', error);
    return false;
  }
};

/**
 * Elimina una pregunta del banco por su ID
 * @param {Number|String} questionId - ID de la pregunta a eliminar
 * @returns {Boolean} - True si se eliminó correctamente
 */
export const removeBankQuestion = (questionId) => {
  try {
    const currentQuestions = getBankQuestions();
    const updatedQuestions = currentQuestions.filter(q => q.id !== questionId);
    
    saveBankQuestions(updatedQuestions);
    return true;
  } catch (error) {
    console.error('Error al eliminar pregunta del banco:', error);
    return false;
  }
};

/**
 * Limpia todos los datos de preguntas del banco
 */
export const clearBankQuestionsData = () => {
  try {
    localStorage.removeItem(BANK_QUESTIONS_STORAGE_KEY);
    notifyBankQuestionsChange([]);
    return true;
  } catch (error) {
    console.error('Error al limpiar datos de preguntas del banco:', error);
    return false;
  }
};

/**
 * Notifica a otros componentes sobre cambios en las preguntas del banco
 */
export const notifyBankQuestionsChange = (questions) => {
  try {
    // Crear y disparar un evento personalizado con las preguntas actualizadas
    const event = new CustomEvent('bankQuestionsUpdated', { detail: questions });
    window.dispatchEvent(event);
    
    // También disparar evento de storage para compatibilidad
    const storageEvent = new StorageEvent('storage', {
      key: BANK_QUESTIONS_STORAGE_KEY,
      newValue: JSON.stringify(questions),
      url: window.location.href
    });
    window.dispatchEvent(storageEvent);
  } catch (error) {
    console.error('Error al notificar cambios en preguntas del banco:', error);
  }
};