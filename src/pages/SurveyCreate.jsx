import React, { useContext } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import ProgressBar from '../components/ProgresBar.jsx';
import DetailForm from '../components/DetailForm.jsx';
import BackHomeButton from '../components/BackHomeButton.jsx';
import { SurveyContext } from '../Provider/SurveyContext'; // Importar el contexto

const SurveyCreate = () => {
  const { selectedCategory } = useContext(SurveyContext);
  if (selectedCategory) {
    localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
  }
  const categorydate = localStorage.getItem('selectedCategory');
  const parsedCategoryData = JSON.parse(categorydate);
  console.log(typeof (parsedCategoryData))
  console.log(parsedCategoryData[0][0])

  return (
    <div className="flex flex-col min-h-screen bg-gray-back-custom">
      <Navbar />
      <div className="flex-1 flex flex-col items-center">
        <HeaderBanner />
        <HeaderBar props={`Configuración de la encuesta: Categoría seleccionada: ${parsedCategoryData[0][0]} ${parsedCategoryData[0][1]}`} /> {/* Mostrar la categoría seleccionada */}
        <ProgressBar currentView="SurveyCreate" />
        <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto">
          <div className="mb-4">
            <BackHomeButton />
          </div>
          <DetailForm />
        </div>
      </div>
    </div>
  );
};

export default SurveyCreate;
