/**
 * Utilidad para manejar el almacenamiento y persistencia de secciones
 * usando localStorage
 */

const SECTIONS_STORAGE_KEY = 'survey_sections';
const SELECTED_SECTION_KEY = 'selected_section_id';

/**
 * Guarda las secciones en localStorage
 * @param {Array} sections - Array de objetos de sección
 */
export const saveSections = (sections) => {
  try {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
    notifySectionsChange(sections);
    return true;
  } catch (error) {
    console.error('Error al guardar secciones:', error);
    return false;
  }
};

/**
 * Obtiene las secciones desde localStorage
 * @returns {Array} - Array de objetos de sección o array vacío si no hay datos
 */
export const getSections = () => {
  try {
    const sectionsData = localStorage.getItem(SECTIONS_STORAGE_KEY);
    return sectionsData ? JSON.parse(sectionsData) : [];
  } catch (error) {
    console.error('Error al obtener secciones:', error);
    return [];
  }
};

/**
 * Agrega una nueva sección a las existentes
 * @param {Object} section - Objeto con datos de la sección
 * @returns {Boolean} - True si se agregó correctamente
 */
export const addSection = (section) => {
  try {
    const currentSections = getSections();

    // Verificar si ya existe una sección con el mismo ID
    const exists = currentSections.some(s => s.id === section.id);

    if (!exists) {
      currentSections.push(section);
      saveSections(currentSections);
    }

    return true;
  } catch (error) {
    console.error('Error al agregar sección:', error);
    return false;
  }
};

/**
 * Agrega múltiples secciones a las existentes
 * @param {Array} newSections - Array de objetos de sección
 * @returns {Boolean} - True si se agregaron correctamente
 */
export const addMultipleSections = (newSections) => {
  try {
    const currentSections = getSections();

    // Filtrar y agregar solo las secciones que no existen
    newSections.forEach(newSection => {
      if (!currentSections.some(s => s.id === newSection.id)) {
        currentSections.push(newSection);
      }
    });

    saveSections(currentSections);
    return true;
  } catch (error) {
    console.error('Error al agregar múltiples secciones:', error);
    return false;
  }
};

/**
 * Actualiza todas las secciones (reemplaza las existentes)
 * @param {Array} sections - Array completo de objetos de sección
 * @returns {Boolean} - True si se actualizaron correctamente
 */
export const updateSections = (sections) => {
  const result = saveSections(sections);
  return result;
};

/**
 * Actualiza una sección específica
 * @param {Object} updatedSection - Objeto con los datos actualizados de la sección
 * @returns {Boolean} - True si se actualizó correctamente
 */
export const updateSection = (updatedSection) => {
  try {
    const currentSections = getSections();
    const updatedSections = currentSections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    );

    saveSections(updatedSections);
    return true;
  } catch (error) {
    console.error('Error al actualizar sección:', error);
    return false;
  }
};

/**
 * Elimina una sección por su ID
 * @param {Number|String} sectionId - ID de la sección a eliminar
 * @returns {Boolean} - True si se eliminó correctamente
 */
export const removeSection = (sectionId) => {
  try {
    const currentSections = getSections();
    const updatedSections = currentSections.filter(s => s.id !== sectionId);

    // Guardar directamente para evitar problemas de sincronización
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(updatedSections));

    // Disparar evento de storage para que otros componentes se enteren
    // Esto es útil para componentes en diferentes contextos
    const event = new StorageEvent('storage', {
      key: SECTIONS_STORAGE_KEY,
      newValue: JSON.stringify(updatedSections),
      url: window.location.href
    });
    window.dispatchEvent(event);

    return true;
  } catch (error) {
    console.error('Error al eliminar sección:', error);
    return false;
  }
};

/**
 * Guarda el ID de la sección seleccionada
 * @param {Number|String} sectionId - ID de la sección seleccionada
 */
export const saveSelectedSection = (sectionId) => {
  try {
    localStorage.setItem(SELECTED_SECTION_KEY, sectionId);
    return true;
  } catch (error) {
    console.error('Error al guardar sección seleccionada:', error);
    return false;
  }
};

/**
 * Obtiene el ID de la sección seleccionada
 * @returns {Number|String|null} - ID de la sección seleccionada o null
 */
export const getSelectedSectionId = () => {
  try {
    const sectionId = localStorage.getItem(SELECTED_SECTION_KEY);
    return sectionId ? parseInt(sectionId, 10) : null;
  } catch (error) {
    console.error('Error al obtener sección seleccionada:', error);
    return null;
  }
};

/**
 * Obtiene el objeto completo de la sección seleccionada
 * @returns {Object|null} - Objeto de la sección seleccionada o null
 */
export const getSelectedSection = () => {
  try {
    const sectionId = getSelectedSectionId();
    if (!sectionId) return null;

    const sections = getSections();
    return sections.find(s => s.id === sectionId) || null;
  } catch (error) {
    console.error('Error al obtener objeto de sección seleccionada:', error);
    return null;
  }
};

/**
 * Limpia todos los datos de secciones guardados
 */
export const clearSectionsData = () => {
  try {
    localStorage.removeItem(SECTIONS_STORAGE_KEY);
    localStorage.removeItem(SELECTED_SECTION_KEY);
    return true;
  } catch (error) {
    console.error('Error al limpiar datos de secciones:', error);
    return false;
  }
};

/**
 * Notifica a los componentes sobre cambios en las secciones
 * @param {Array} sections - Array de objetos de sección actualizados
 */
export const notifySectionsChange = (sections) => {
  // Crear y disparar un evento personalizado con las secciones actualizadas
  const event = new CustomEvent('sectionsUpdated', { detail: sections });
  window.dispatchEvent(event);
};
