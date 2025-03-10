import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const ManageCategory = () => {
  const [categorySelected, setCategorySelected] = useState(false); // Controla si se seleccionó una categoría

  // Simular la selección de una categoría (esto dependería de tu lógica real)
  const handleCategorySelect = () => {
    setCategorySelected(true); // Simula que se seleccionó una categoría
  };

  return (
    <div className="w-full flex flex-col items-start">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faCog} className="text-[#00324D] mr-2" />
        <Link to="/Categorycreate" className="text-2xl font-bold text-[#00324D] hover:underline">
          Gestionar Categorías
        </Link>
      </div>      
   
    </div>
  );
};

export default ManageCategory;
