import React, { useState } from 'react';
import ProfileUser from '../assets/img/profile_user.svg';
import Select from '../assets/img/select.svg';

function HeaderBar({ username }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center p-2 absolute top-0 right-0">
      <p className="font-bold text-white text-lg flex items-center">
        {username}
      </p>
      <div className="flex items-center ml-4 relative">
        <button onClick={toggleMenu} className="flex items-center">
          <img src={Select} alt="Seleccionar" className="h-2 mr-2" />
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <button className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
              Ver perfil
            </button>
            <button className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
      <img src={ProfileUser} alt="Usuario" className="h-8 ml-4" />
    </div>
  );
}

export default HeaderBar;
