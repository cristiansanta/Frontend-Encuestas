import React, { useState } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const PreviewSurvey = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  
  // Recuperar datos de categoría del localStorage
  const categoryData = JSON.parse(localStorage.getItem('selectedCategory'));
  
  // Crear el título del header
  const headerTitle = `Previsualización de la encuesta: ${
    categoryData ? `${categoryData[0][0]} ${categoryData[0][1]}` : ''
  }`;

  // Manejar la publicación de la encuesta
  const handlePublish = () => {
    setIsSaving(true);
    
    // Simular una llamada a la API para publicar
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  // Manejar el guardado sin publicar
  const handleSaveDraft = () => {
    setIsSaving(true);
    
    // Simular una llamada a la API para guardar como borrador
    setTimeout(() => {
      setIsSaving(false);
      setShowButtons(false);
      navigate('/survey-list');
    }, 1500);
  };

  return (
    <SurveyLayout 
      currentView="PreviewSurvey"
      headerTitle={headerTitle}
      // Aquí desactivamos el botón de navegación predeterminado
      showNavButton={false}
    >
      {/* Contenido de la previsualización */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <h1 className="text-3xl font-bold text-dark-blue-custom mb-4">
          Previsualización de la Encuesta
        </h1>
        
        {/* Aquí iría el contenido de la previsualización */}
        <div className="border p-4 rounded-lg min-h-[300px] mb-6">
          {/* Contenido de muestra */}
          <p className="text-gray-500 italic">
            Vista previa de la encuesta...
          </p>
        </div>
        
        {/* Botones personalizados en lugar del botón de navegación predeterminado */}
        {showButtons && (
          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="save"
              text="Guardar sin publicar"
              onClick={handleSaveDraft}
              disabled={isSaving}
              size="md"
            />
            
            <Button 
              variant="publish"
              text="Publicar"
              onClick={handlePublish}
              disabled={isSaving}
              size="md"
            />
          </div>
        )}
        
        {isSaving && (
          <div className="text-center mt-4">
            <p className="text-blue-custom">Guardando cambios...</p>
          </div>
        )}
      </div>
    </SurveyLayout>
  );
};

export default PreviewSurvey;