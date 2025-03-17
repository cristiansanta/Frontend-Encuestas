import React, { useState } from 'react';
import ProfileUser from '../assets/img/profile_user.svg';
import Select from '../assets/img/select.svg';

function HeaderBar({ username }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-14 items-center justify-center p-2 bg-[#ffc400] relative">
      <p className="font-bold text-[#00324d] text-lg flex items-center">
        {username}
      </p>
      <div className="flex items-center ml-4 relative">
        <button onClick={toggleMenu} className="flex items-center">
          <img src={Select} alt="Seleccionar" className="h-6 mr-2" />          
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
              Ver perfil
            </button>
            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">
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
