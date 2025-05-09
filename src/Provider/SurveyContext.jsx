import React, { createContext, useState, useEffect } from 'react';

// Estructura inicial básica basada en el formato JSON proporcionado
const initialSurveyData = {
  categorias: [],
  bancoDePreguntas: []
};

// Crear el contexto para la encuesta
const SurveyContext = createContext();

// Crear el proveedor del contexto
const SurveyProvider = ({ children }) => {
  // Estado principal de la encuesta con la estructura JSON proporcionada
  const [surveyData, setSurveyData] = useState(() => {
    const saved = localStorage.getItem('current_survey_data');
    return saved ? JSON.parse(saved) : initialSurveyData;
  });
  
  // Estado para el progreso actual
  const [currentStep, setCurrentStep] = useState(() => {
    const step = localStorage.getItem('current_survey_progress');
    return step ? parseInt(step, 10) : 1;
  });
  
  // Estado para la categoría actual
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Estado para la encuesta actual que se está editando
  const [currentEncuesta, setCurrentEncuesta] = useState(null);
  
  // Mantener sincronizado el estado local con localStorage
  useEffect(() => {
    localStorage.setItem('current_survey_data', JSON.stringify(surveyData));
  }, [surveyData]);
  
  // Mantener sincronizado el estado del paso actual con localStorage
  useEffect(() => {
    localStorage.setItem('current_survey_progress', currentStep);
  }, [currentStep]);
  
  // Función para avanzar al siguiente paso
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Función para retroceder al paso anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Función para ir a un paso específico
  const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };
  
  // Función para actualizar datos de la encuesta actual
  const updateCurrentEncuesta = (data) => {
    if (!currentEncuesta) return false;
    
    // Crear una copia profunda de los datos actuales
    const updatedData = JSON.parse(JSON.stringify(surveyData));
    
    // Buscar la categoría y encuesta correcta
    const categoriaIndex = updatedData.categorias.findIndex(
      cat => cat.id === currentEncuesta.categoriaId
    );
    
    if (categoriaIndex === -1) return false;
    
    const encuestaIndex = updatedData.categorias[categoriaIndex].encuestas.findIndex(
      enc => enc.id === currentEncuesta.id
    );
    
    if (encuestaIndex === -1) return false;
    
    // Actualizar la encuesta con los nuevos datos
    updatedData.categorias[categoriaIndex].encuestas[encuestaIndex] = {
      ...updatedData.categorias[categoriaIndex].encuestas[encuestaIndex],
      ...data
    };
    
    setSurveyData(updatedData);
    return true;
  };
  
  // Función para crear una nueva encuesta
  const createNewEncuesta = (categoriaId, encuestaData) => {
    // Crear una copia profunda de los datos actuales
    const updatedData = JSON.parse(JSON.stringify(surveyData));
    
    // Buscar la categoría correcta
    const categoriaIndex = updatedData.categorias.findIndex(
      cat => cat.id === categoriaId
    );
    
    if (categoriaIndex === -1) return null;
    
    // Crear un nuevo ID para la encuesta
    const newId = Date.now();
    
    // Crear la nueva encuesta con la estructura adecuada
    const newEncuesta = {
      id: newId,
      titulo: encuestaData.titulo || "Nueva Encuesta",
      rangoDeTiempo: {
        fechaInicio: encuestaData.fechaInicio || new Date().toISOString().split('T')[0],
        fechaFinalizacion: encuestaData.fechaFinalizacion || new Date().toISOString().split('T')[0]
      },
      descripcion: encuestaData.descripcion || "",
      configuracionVisualizacion: {
        publicada: false,
        guardadaSinPublicar: true,
        fechaCreacion: new Date().toISOString(),
        fechaUltimaModificacion: new Date().toISOString()
      },
      secciones: encuestaData.secciones || []
    };
    
    // Añadir la nueva encuesta a la categoría
    updatedData.categorias[categoriaIndex].encuestas.push(newEncuesta);
    
    // Actualizar el estado
    setSurveyData(updatedData);
    setCurrentEncuesta({
      id: newId,
      categoriaId: categoriaId
    });
    
    return newEncuesta;
  };
  
  // Función para añadir una sección a la encuesta actual
  const addSeccionToCurrentEncuesta = (seccionData) => {
    if (!currentEncuesta) return null;
    
    // Crear una copia profunda de los datos actuales
    const updatedData = JSON.parse(JSON.stringify(surveyData));
    
    // Buscar la categoría y encuesta correcta
    const categoriaIndex = updatedData.categorias.findIndex(
      cat => cat.id === currentEncuesta.categoriaId
    );
    
    if (categoriaIndex === -1) return null;
    
    const encuestaIndex = updatedData.categorias[categoriaIndex].encuestas.findIndex(
      enc => enc.id === currentEncuesta.id
    );
    
    if (encuestaIndex === -1) return null;
    
    // Crear un nuevo ID para la sección
    const newId = Date.now();
    
    // Determinar el orden correcto para la nueva sección
    const currentSecciones = updatedData.categorias[categoriaIndex].encuestas[encuestaIndex].secciones;
    const orden = currentSecciones.length > 0 ? 
      Math.max(...currentSecciones.map(s => s.orden)) + 1 : 1;
    
    // Crear la nueva sección
    const newSeccion = {
      id: newId,
      nombre: seccionData.nombre,
      orden: orden,
      preguntas: []
    };
    
    // Añadir la nueva sección a la encuesta
    updatedData.categorias[categoriaIndex].encuestas[encuestaIndex].secciones.push(newSeccion);
    
    // Actualizar el estado
    setSurveyData(updatedData);
    
    return newSeccion;
  };
  
  // Función para añadir una pregunta a una sección específica
  const addPreguntaToSeccion = (seccionId, preguntaData) => {
    if (!currentEncuesta) return null;
    
    // Crear una copia profunda de los datos actuales
    const updatedData = JSON.parse(JSON.stringify(surveyData));
    
    // Buscar la categoría y encuesta correcta
    const categoriaIndex = updatedData.categorias.findIndex(
      cat => cat.id === currentEncuesta.categoriaId
    );
    
    if (categoriaIndex === -1) return null;
    
    const encuestaIndex = updatedData.categorias[categoriaIndex].encuestas.findIndex(
      enc => enc.id === currentEncuesta.id
    );
    
    if (encuestaIndex === -1) return null;
    
    // Buscar la sección correcta
    const seccionIndex = updatedData.categorias[categoriaIndex].encuestas[encuestaIndex].secciones.findIndex(
      sec => sec.id === seccionId
    );
    
    if (seccionIndex === -1) return null;
    
    // Crear un nuevo ID para la pregunta
    const newId = Date.now();
    
    // Determinar el orden correcto para la nueva pregunta
    const currentPreguntas = updatedData.categorias[categoriaIndex].encuestas[encuestaIndex].secciones[seccionIndex].preguntas;
    const orden = currentPreguntas.length > 0 ? 
      Math.max(...currentPreguntas.map(p => p.orden)) + 1 : 1;
    
    // Crear la nueva pregunta con la estructura adecuada
    const newPregunta = {
      id: newId,
      titulo: preguntaData.titulo,
      tipo: preguntaData.tipo,
      descripcion: preguntaData.descripcion || "",
      esPreguntaMadre: preguntaData.esPreguntaMadre || false,
      esObligatoria: preguntaData.esObligatoria || false,
      enBancoDePreguntas: preguntaData.enBancoDePreguntas || false,
      orden: orden,
      estado: {
        guardada: true,
        fechaGuardado: new Date().toISOString()
      },
      preguntasHijas: [],
      opciones: preguntaData.opciones || []
    };
    
    // Añadir la nueva pregunta a la sección
    updatedData.categorias[categoriaIndex].encuestas[encuestaIndex].secciones[seccionIndex].preguntas.push(newPregunta);
    
    // Si se marca para añadir al banco de preguntas, añadirla
    if (preguntaData.enBancoDePreguntas) {
      const bankQuestion = {
        ...newPregunta,
        fechaCreacion: new Date().toISOString()
      };
      
      updatedData.bancoDePreguntas.push(bankQuestion);
    }
    
    // Actualizar el estado
    setSurveyData(updatedData);
    
    return newPregunta;
  };
  
  // Función para preparar los datos para la vista previa (paso 3)
  const getPreviewData = () => {
    if (!currentEncuesta) return null;
    
    // Buscar la encuesta actual en los datos
    const categoria = surveyData.categorias.find(cat => cat.id === currentEncuesta.categoriaId);
    if (!categoria) return null;
    
    const encuesta = categoria.encuestas.find(enc => enc.id === currentEncuesta.id);
    if (!encuesta) return null;
    
    // Devolver la encuesta para su previsualización
    return {
      ...encuesta,
      categoria: [categoria.id, categoria.nombre]
    };
  };

  return (
    <SurveyContext.Provider 
      value={{ 
        // Estados
        surveyData,
        currentStep,
        selectedCategory, 
        setSelectedCategory,
        currentEncuesta,
        setCurrentEncuesta,
        
        // Funciones de navegación
        nextStep,
        prevStep,
        goToStep,
        
        // Funciones de actualización
        updateCurrentEncuesta,
        createNewEncuesta,
        addSeccionToCurrentEncuesta,
        addPreguntaToSeccion,
        getPreviewData
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export { SurveyContext, SurveyProvider };