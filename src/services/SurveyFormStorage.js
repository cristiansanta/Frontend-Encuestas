/**
 * Utilidad para manejar el almacenamiento y persistencia del formulario de encuesta
 * usando localStorage
 */

// Claves para almacenar cada parte del formulario
const FORM_DATA_KEY = 'survey_form_data';
const SECTIONS_KEY = 'survey_sections'; // Nueva clave para secciones independientes

// Estructura inicial del formulario
const initialFormData = {
  title: '',
  description: '',
  selectedCategory: null,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  sections: []
};

/**
 * Guarda todos los datos del formulario en localStorage
 * @param {Object} formData - Objeto con todos los datos del formulario
 * @returns {Boolean} - True si se guardó correctamente
 */
export const saveFormData = (formData) => {
  try {
    // Validar fechas antes de convertirlas
    const validateDate = (date) => {
      if (date instanceof Date && !isNaN(date)) {
        return date;
      }
      return new Date(); // Retornar la fecha actual si la fecha no es válida
    };

    // Asegurarse de que las fechas se convierten a string para JSON
    const dataToSave = {
      ...formData,
      startDate: validateDate(formData.startDate).toISOString(),
      endDate: validateDate(formData.endDate).toISOString()
    };

    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error al guardar datos del formulario:', error);
    return false;
  }
};


/**
 * Obtiene todos los datos del formulario desde localStorage
 * @returns {Object} - Objeto con todos los datos del formulario o valores iniciales
 */
export const getFormData = () => {
  try {
    const formDataStr = localStorage.getItem(FORM_DATA_KEY);

    if (!formDataStr) {
      return { ...initialFormData };
    }

    const formData = JSON.parse(formDataStr);

    // Convertir las fechas de string a objetos Date
    return {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDatejkh) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : new Date()
    };
  } catch (error) {
    console.error('Error al obtener datos del formulario:', error);
    return { ...initialFormData };
  }
};

/**
 * Actualiza un campo específico del formulario
 * @param {String} fieldName - Nombre del campo a actualizar
 * @param {any} value - Nuevo valor para el campo
 * @returns {Boolean} - True si se actualizó correctamente
 */
export const updateFormField = (fieldName, value) => {
  try {
    const currentFormData = getFormData();

    // Crear un nuevo objeto con el campo actualizado
    const updatedFormData = {
      ...currentFormData,
      [fieldName]: value
    };

    return saveFormData(updatedFormData);
  } catch (error) {
    console.error(`Error al actualizar campo ${fieldName}:`, error);
    return false;
  }
};

/**
 * Actualiza múltiples campos del formulario a la vez
 * @param {Object} fields - Objeto con los campos a actualizar
 * @returns {Boolean} - True si se actualizó correctamente
 */
export const updateMultipleFields = (fields) => {
  try {
    const currentFormData = getFormData();

    // Crear un nuevo objeto con los campos actualizados
    const updatedFormData = {
      ...currentFormData,
      ...fields
    };

    return saveFormData(updatedFormData);
  } catch (error) {
    console.error('Error al actualizar múltiples campos:', error);
    return false;
  }
};

/**
 * Limpia todos los datos del formulario del localStorage
 * @returns {Boolean} - True si se limpió correctamente
 */
export const clearFormData = () => {
  try {
    localStorage.removeItem(FORM_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error al limpiar datos del formulario:', error);
    return false;
  }
};

/**
 * Verifica si el formulario está completo y válido
 * @returns {Boolean} - True si el formulario es válido
 */
export const isFormValid = () => {
  const formData = getFormData();

  // Verificar campos requeridos
  const isTitleValid = formData.title && formData.title.trim() !== '';
  const isCategoryValid = formData.selectedCategory && formData.selectedCategory.length > 0;
  const isSectionsValid = formData.sections && formData.sections.length > 0;

  return isTitleValid && isCategoryValid && isSectionsValid;
};

/**
 * Notifica cambios en el formulario mediante un evento personalizado
 * @param {Object} formData - Datos actualizados del formulario
 */
export const notifyFormChange = (formData) => {
  const event = new CustomEvent('formDataUpdated', { detail: formData });
  window.dispatchEvent(event);
};

/**
 * Obtiene datos del formulario para enviar al servidor
 * @returns {Object} - Datos formateados para el servidor
 */
export const getFormDataForSubmission = () => {
  const formData = getFormData();

  return {
    title: formData.title,
    description: formData.description,
    id_category: formData.selectedCategory && formData.selectedCategory[0] ? formData.selectedCategory[0][0] : null,
    startDate: formData.startDate,
    endDate: formData.endDate,
    sections: formData.sections
  };
};

/**
 * FUNCIONES PARA GESTIONAR SECCIONES DE MANERA INDEPENDIENTE
 * Estas funciones manejan las secciones como un módulo independiente
 * para permitir su reutilización en otros formularios
 */

/**
 * Obtiene las secciones almacenadas
 * @returns {Array} - Lista de secciones o array vacío
 */
export const getSections = () => {
  try {
    const sectionsStr = localStorage.getItem(SECTIONS_KEY);
    return sectionsStr ? JSON.parse(sectionsStr) : [];
  } catch (error) {
    console.error('Error al obtener secciones:', error);
    return [];
  }
};

/**
 * Actualiza la lista completa de secciones
 * @param {Array} sections - Nueva lista de secciones
 * @returns {Boolean} - True si se actualizó correctamente
 */
export const updateSections = (sections) => {
  try {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
    return true;
  } catch (error) {
    console.error('Error al actualizar secciones:', error);
    return false;
  }
};

/**
 * Añade una nueva sección a la lista
 * @param {Object} section - Objeto sección con id y name
 * @returns {Boolean} - True si se añadió correctamente
 */
export const addSection = (section) => {
  try {
    const sections = getSections();
    // Verificar que la sección no exista ya (por id o nombre)
    const exists = sections.some(s =>
      s.id === section.id ||
      s.name.toLowerCase() === section.name.toLowerCase()
    );

    if (!exists) {
      sections.push(section);
      updateSections(sections);
      return true;
    }
    return false; // No se añadió porque ya existe
  } catch (error) {
    console.error('Error al añadir sección:', error);
    return false;
  }
};

/**
 * Elimina una sección por su id
 * @param {Number|String} id - ID de la sección a eliminar
 * @returns {Boolean} - True si se eliminó correctamente
 */
export const removeSection = (id) => {
  try {
    const sections = getSections();
    const filteredSections = sections.filter(s => s.id !== id);

    // Si el tamaño cambió, significa que se encontró y eliminó una sección
    if (filteredSections.length !== sections.length) {
      updateSections(filteredSections);
      return true;
    }
    return false; // No se encontró la sección
  } catch (error) {
    console.error('Error al eliminar sección:', error);
    return false;
  }
};

/**
 * Obtiene la sección seleccionada actual
 * @returns {Object|null} - La sección seleccionada o null si no hay ninguna
 */
export const getSelectedSection = () => {
  try {
    const formData = getFormData();
    const currentSectionId = localStorage.getItem('selected_section_id');

    if (!currentSectionId) return null;

    // Buscar primero en las secciones del formulario
    if (formData.sections && formData.sections.length > 0) {
      const section = formData.sections.find(s => s.id.toString() === currentSectionId.toString());
      if (section) return section;
    }

    // Si no se encuentra en el formulario, buscar en las secciones independientes
    const sections = getSections();
    return sections.find(s => s.id.toString() === currentSectionId.toString()) || null;
  } catch (error) {
    console.error('Error al obtener la sección seleccionada:', error);
    return null;
  }
};

/**
 * Guarda la sección seleccionada en localStorage
 * @param {Number|String} sectionId - ID de la sección a seleccionar
 * @returns {Boolean} - True si se guardó correctamente
 */
export const saveSelectedSection = (sectionId) => {
  try {
    localStorage.setItem('selected_section_id', sectionId.toString());
    return true;
  } catch (error) {
    console.error('Error al guardar la sección seleccionada:', error);
    return false;
  }
};
