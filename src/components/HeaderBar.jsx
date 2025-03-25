import React, { useState } from 'react';
import ProfileUser from '../assets/img/profile_user.svg';
import Select from '../assets/img/select.svg';
import Logo from '../assets/img/zajuna.svg';

function HeaderBar({ username }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Cerrar sesión');
  };

  const handleViewProfile = () => {
    // Lógica para ver perfil
    console.log('Ver perfil');
  };

  return (
    <div className="flex items-center p-2 absolute top-[45px] right-[75px]">
      <p className="font-bold text-white text-lg flex items-center">
        {username}
      </p>
      <div className="flex items-center ml-4 relative">
        <button onClick={toggleMenu} className="flex items-center">
          <img src={Select} alt="Seleccionar" className="h-2 mr-2" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-[-150px] mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <button
              onClick={handleViewProfile}
              className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
            >
              <Logo/>
              Ir a Zajuna
            </button>
            <div className="px-4 py-2 text-gray-400 text-sm">

              +57 3214567890
            </div>
            <div className="px-4 py-2 text-gray-400 text-sm">
              correo@gmail.com
            </div>
            <div className="px-4 py-2 text-gray-400 text-sm">
              +57 3214567890
            </div>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
            >
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
