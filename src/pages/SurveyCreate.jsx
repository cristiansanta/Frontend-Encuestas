import React, { useContext, useState } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import DetailForm from '../components/DetailForm';
import { SurveyContext } from '../Provider/SurveyContext';
import { getSurveyInfo, updateSurveyInfoField } from '../services/SurveyInfoStorage';
import { useNavigate } from 'react-router-dom';
import DataSender from '../components/DataSender';

const SurveyCreate = () => {
  const { selectedCategory } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [formIsValid, setFormIsValid] = useState(false);
  const [formData, setFormData] = useState(null);

  // Obtener datos desde el servicio
  const surveyInfo = getSurveyInfo();
  const categoryData = selectedCategory || surveyInfo.selectedCategory;

  // Crear el título del header basado en la categoría seleccionada
  const headerTitle = `Configuración de la encuesta: Categoría seleccionada: ${categoryData ? `${categoryData[0][1]}` : ''
    }`;

  // Manejar el cambio de validez del formulario
  const handleFormValidChange = (isValid) => {
    setFormIsValid(isValid);
  };

  // Manejar el guardado y continuación
  const handleSaveAndContinue = (data) => {
    setFormData(data);
    // Enviar datos al servidor o guardarlos en el contexto
    // y luego navegar a la siguiente página
    navigate('/questions-create');
  };

  // Manejar el clic en el botón de navegación
  const handleNavButtonClick = () => {
    if (formIsValid && formData) {
      // Si tenemos los datos, podemos enviarlos
      // Aquí se implementaría la lógica de DataSender
      const { title, description, id_category, accessToken } = formData;

      // Ejemplo de uso de DataSender (ajustar según tu implementación)
      // Este componente se renderizaría condicionalmente
      return (
        <DataSender
          title={title}
          description={description}
          id_category={id_category}
          status={true}
          accessToken={accessToken}
          onSuccess={() => navigate('/questions-create')}
          onError={(error) => console.error('Error al guardar:', error)}
        />
      );
    } else {
      // Si el formulario no es válido, activamos la validación en DetailForm
      handleSaveAndContinue();
    }
  };

  return (
    <SurveyLayout
      currentView="SurveyCreate"
      headerTitle={headerTitle}
      navButtonType="save"
      onNavButtonClick={handleNavButtonClick}
      navButtonDisabled={!formIsValid}
    >
      <DetailForm
        onFormValidChange={handleFormValidChange}
        onSaveAndContinue={handleSaveAndContinue}
      />
    </SurveyLayout>
  );
};

export default SurveyCreate;