import React, { useState, useEffect, useContext } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { SurveyContext } from '../Provider/SurveyContext';
import Modal from '../components/Modal';

const PreviewSurvey = () => {
  const navigate = useNavigate();
  const { surveyData } = useContext(SurveyContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [surveyPreview, setSurveyPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    status: 'info'
  });

  // Recuperar datos de categoría del localStorage
  const categoryData = JSON.parse(localStorage.getItem('selectedCategory'));
  
  // Crear el título del header
  const headerTitle = `Previsualización de la encuesta: ${
    categoryData ? `${categoryData[0][0]} ${categoryData[0][1]}` : ''
  }`;

  // Simular la carga de la previsualización
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a la API para obtener 
    // los datos de la encuesta para previsualizar
    setTimeout(() => {
      // Datos de ejemplo para la previsualización
      setSurveyPreview({
        title: "Encuesta sobre tu Perfil Personal y Profesional",
        sections: [
          { id: 1, name: "Información Personal" },
          { id: 2, name: "Experiencia Laboral" },
          { id: 3, name: "Experiencia Académica" }
        ],
        dateRange: {
          startDate: "02/10/25",
          endDate: "02/10/25"
        },
        description: "Esta encuesta tiene como objetivo recopilar información sobre tus datos generales, tu experiencia laboral y tu trayectoria académica. Las preguntas están organizadas en tres secciones: la primera se enfoca en tus datos personales básicos, la segunda en tu experiencia profesional, y la tercera en tu formación académica. El propósito de esta encuesta es obtener una visión completa de tu perfil para diversos fines, como análisis de tendencias laborales y académicas. Tu participación es valiosa y te agradecemos por dedicar tiempo a completarla."
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  // Manejar la publicación de la encuesta
  const handlePublish = () => {
    setIsLoading(true);
    
    // Simular una llamada a la API para publicar
    setTimeout(() => {
      setIsLoading(false);
      setModalData({
        title: 'Publicación exitosa',
        message: 'La encuesta ha sido publicada correctamente.',
        status: 'success'
      });
      setIsModalOpen(true);
    }, 1500);
  };

  // Manejar el guardado sin publicar
  const handleSaveDraft = () => {
    setIsLoading(true);
    
    // Simular una llamada a la API para guardar como borrador
    setTimeout(() => {
      setIsLoading(false);
      setModalData({
        title: 'Guardado exitoso',
        message: 'La encuesta ha sido guardada correctamente como borrador.',
        status: 'success'
      });
      setIsModalOpen(true);
    }, 1500);
  };

  // Cerrar el modal y navegar al listado de encuestas
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('#/SurveyList');
  };

  return (
    <SurveyLayout 
      currentView="PreviewSurvey"
      headerTitle={headerTitle}
      showNavButton={false}
    >
      {/* Contenedor principal */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-dark-blue-custom mb-4">
          Vista Previa y Revisión Final de Encuesta
        </h1>
        
        <p className="text-base text-gray-700 mb-4">
          Aquí podrás <strong>previsualizar tu encuesta</strong> tal y como la verán quienes la respondan. 
          Revisa cada detalle: la fecha, las secciones y cada pregunta, para asegurarte de que todo 
          esté perfecto <strong>antes de Publicar</strong>.
        </p>
        
        <p className="text-sm text-gray-500 italic mb-6">
          * Recuerda que también puedes guardar tu proceso para publicarlo después.
        </p>
        
        {isLoading ? (
          // Estado de carga
          <div className="flex justify-center items-center h-64">
            <p className="text-blue-custom">Cargando previsualización...</p>
          </div>
        ) : (
          // Vista previa de la encuesta
          surveyPreview && (
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark-blue-custom mb-4">
                {surveyPreview.title}
              </h2>
              
              {/* Secciones */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-dark-blue-custom mb-2">Secciones</h3>
                <div className="flex flex-wrap gap-2">
                  {surveyPreview.sections.map(section => (
                    <div key={section.id} className="bg-gray-100 rounded-full px-4 py-1 text-sm">
                      {section.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rango de tiempo */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-dark-blue-custom mb-2">Rango de tiempo</h3>
                <div className="flex gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Fecha de inicio:</span> {surveyPreview.dateRange.startDate}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Fecha de finalización:</span> {surveyPreview.dateRange.endDate}
                  </div>
                </div>
              </div>
              
              {/* Descripción */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-dark-blue-custom mb-2">Descripción de la Encuesta</h3>
                <p className="text-sm text-gray-700">{surveyPreview.description}</p>
              </div>
              
              {/* Botón para ver todas las preguntas */}
              <div className="mt-6">
                <Button 
                  variant="primary"
                  text="Previsualizar encuesta"
                  onClick={() => {}} // Aquí podrías abrir una vista completa de la encuesta
                  className="float-right"
                />
              </div>
            </div>
          )
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-10">
          <Button 
            variant="save"
            text="Guardar sin publicar"
            onClick={handleSaveDraft}
            disabled={isLoading}
          />
          
          <Button 
            variant="publish"
            text="Publicar"
            onClick={handlePublish}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Modal para mensajes */}
      <Modal
        isOpen={isModalOpen}
        title={modalData.title}
        message={modalData.message}
        onConfirm={handleCloseModal}
        confirmText="Ir a la lista de encuestas"
        type="informative"
        status={modalData.status}
      />
    </SurveyLayout>
  );
};

export default PreviewSurvey;