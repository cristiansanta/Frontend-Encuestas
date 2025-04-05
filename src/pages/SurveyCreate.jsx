import React, { useContext } from 'react';
import SurveyLayout from '../components/SurveyLayout';
import DetailForm from '../components/DetailForm';
import { SurveyContext } from '../Provider/SurveyContext';

const SurveyCreate = () => {
  const { selectedCategory } = useContext(SurveyContext);
  
  // Guardar en localStorage si hay una categoría seleccionada
  if (selectedCategory) {
    localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
  }
  
  // Recuperar datos de categoría del localStorage
  const categorydata = localStorage.getItem('selectedCategory');
  const parsedCategoryData = JSON.parse(categorydata);
  
  // Crear el título del header basado en la categoría seleccionada
  const headerTitle = `Configuración de la encuesta: Categoría seleccionada: ${
    parsedCategoryData ? `${parsedCategoryData[0][0]} ${parsedCategoryData[0][1]}` : ''
  }`;

  return (
    <SurveyLayout 
      currentView="SurveyCreate"
      headerTitle={headerTitle}
    >
      <DetailForm />
    </SurveyLayout>
  );
};

export default SurveyCreate;
