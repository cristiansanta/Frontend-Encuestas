import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBanner from  '../components/HeaderBanner.jsx'
import TableComponent from  '../components/Table.jsx'
import HeaderBar from '../components/HeaderBar.jsx';
import CategoryForm from  '../components/HeaderCategories.jsx'

const CategoryCreate = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const endpoint = import.meta.env.VITE_API_ENDPOINT + 'category';
  

  const fetchSections = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Asegúrate de obtener el token de acceso
     
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
  
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Asegúrate de enviar el token de acceso correctamente
        },
      });
     
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        console.error('Error al cargar las secciones');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };
  

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSave = (newSection) => {
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const handleEdit = (section) => {
    
    setSelectedSection(section); // Establece los datos del registro seleccionado
  };

  return (
    <div className="encuestas-container flex">      
      <Navbar/>
      <div className='headerbar-container flex-1 flex flex-col items-center mt-10'>
        <HeaderBanner />
        <HeaderBar props="Configuración de la encuesta: Administrador de Categorias"/>
        <CategoryForm 
          descrip="Creación de Categoría"
          nametext="Nombre de la categoría"
          namedescrip="Descripción de la categoría"
          endpoint={endpoint}         
          onSave={handleSave}
          origin="Category"
          selectedSection={selectedSection}  
          onEditComplete={() => setSelectedSection(null)}
          />
        
        <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12">
        <TableComponent
          data={sections}
          endpoint={endpoint}
          visibleColumns={['id', 'title', 'descrip_cat']}
          columnAliases={{ id: 'ID', title: 'Título', descrip_cat: 'Descripción'}}
          showEdit={true}
          showDelete={true}
          showSelect={false}
          showNextButton={false}
          showBackButton={true}
          onEdit={handleEdit}
          origin="Category"
          
        />
        </div>
      </div>     
    </div>
  );
};

export default CategoryCreate;
