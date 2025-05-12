import React, { createContext, useState, useEffect } from 'react';
import { getSurveyInfo, updateSurveyInfoField } from '../services/SurveyInfoStorage';
// Crear el contexto para la encuesta
const SurveyContext = createContext();

// Crear el proveedor del contexto
const SurveyProvider = ({ children }) => {
  const [survey, setSurvey] = useState({ id: null, title: '' });
  const surveyInfo = getSurveyInfo();
  const [selectedCategory, setSelectedCategory] = useState(surveyInfo.selectedCategory || null);

  // Estado para almacenar todas las categorías disponibles
  // Formato: array de arrays donde cada elemento es [id, nombre]
  const [categories, setCategories] = useState([
    [1, 'Recursos Humanos'],
    [2, 'Satisfacción del Cliente'],
    [3, 'Evaluación de Productos'],
    [4, 'Investigación de Mercado'],
    [5, 'Educación y Capacitación'],
    [6, 'Salud y Bienestar']
  ]);
  // Efecto para sincronizar cambios en selectedCategory con el servicio
  useEffect(() => {
    if (selectedCategory) {
      updateSurveyInfoField('selectedCategory', selectedCategory);
    }
  }, [selectedCategory]);

  // Opcional: Puedes cargar categorías desde una API cuando el componente se monte
  useEffect(() => {
    // Función para cargar categorías desde la API
    const fetchCategories = async () => {
      try {
        // Ejemplo de cómo podrías cargar categorías desde una API
        // const response = await fetch('tu-api/categorias');
        // const data = await response.json();
        // setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    // Descomentar si quieres cargar categorías desde una API
    // fetchCategories();
  }, []);

  return (
    <SurveyContext.Provider
      value={{
        survey,
        setSurvey,
        selectedCategory,
        setSelectedCategory,
        categories,
        setCategories
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export { SurveyContext, SurveyProvider };