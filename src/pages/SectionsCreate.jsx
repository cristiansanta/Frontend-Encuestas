import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import TableComponent from '../components/Table.jsx';
import CategoryForm from '../components/HeaderCategories.jsx';
import ProgresBar from '../components/ProgresBar.jsx';

const SectionsCreate = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  
  const idsurvey = localStorage.getItem('id_survey');
  
  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'sections';
 
  const handleSave = (newSection) => {
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const handleEdit = (section) => {
    
    setSelectedSection(section); // Establece los datos del registro seleccionado
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 flex flex-col items-center mt-7">
        <HeaderBanner />
        <HeaderBar props="Configuración de la encuesta: Administrador de Secciones" />
        <ProgresBar currentView="SectionsCreate" />
        <CategoryForm
          descrip="Creación de Sección"
          nametext="Nombre de la sección"
          namedescrip="Descripción de la sección"
          endpoint={endpoint}
          id_survey={idsurvey}
          onSave={handleSave}
          origin="Sections"
          selectedSection={selectedSection} // Pasar los datos seleccionados
          onEditComplete={() => setSelectedSection(null)}
        />
        <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12">
        <TableComponent
          data={sections}
          endpoint={endpoint}
          visibleColumns={['id', 'title', 'descrip_sect']}
          columnAliases={{ id: 'ID', title: 'Título', descrip_sect: 'Descripción' }}
          showEdit={true}
          showDelete={true}
          showSelect={false}
          showNextButton={false}
          showBackButton={true}
          onEdit={handleEdit}
          origin="Sections"
        />
        </div>
      </div>
    </div>
  );
};

export default SectionsCreate;