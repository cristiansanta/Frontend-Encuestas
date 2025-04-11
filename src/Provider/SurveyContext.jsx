<<<<<<< HEAD
import React, { createContext, useState } from 'react';

const SurveyContext = createContext();

const SurveyProvider = ({ children }) => {
  const [survey, setSurvey] = useState({ id: null, title: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sections, setSections] = useState(['Información personal', 'Experiencia Laboral', 'Experiencia Académica']);
  
  const updateSections = (newSections) => {
    setSections(newSections);
  };
  
  return (
    <SurveyContext.Provider 
      value={{ 
        survey, 
        setSurvey, 
        selectedCategory, 
        setSelectedCategory,
        sections,
        setSections: updateSections
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export { SurveyContext, SurveyProvider };
=======
import React, { createContext, useState } from 'react';

// Crear el contexto para la encuesta
const SurveyContext = createContext();

// Crear el proveedor del contexto
const SurveyProvider = ({ children }) => {
  const [survey, setSurvey] = useState({ id: null, title: '' });
  const [selectedCategory, setSelectedCategory] = useState(null); // Añadir la categoría seleccionada
  
// console.log("dentro del usercontex", children)
  return (
    <SurveyContext.Provider value={{ survey, setSurvey, selectedCategory, setSelectedCategory}}>
      {children}
    </SurveyContext.Provider>
  );
};

export { SurveyContext, SurveyProvider };
>>>>>>> cristian
