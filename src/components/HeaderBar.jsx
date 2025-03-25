import React, { useState, useEffect, useRef } from 'react';
import ProfileUser from '../assets/img/profile_user.svg';
import Select from '../assets/img/select.svg';
import Logo from '../assets/img/zajuna.svg';
import Phone from '../assets/img/phone.svg';
import Email from '../assets/img/gmail.svg';
import Logout from '../assets/img/logout.svg';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../Provider/apiHelper';

function HeaderBar({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const url = "logout";
      const method = "POST";
      const response = await apiRequest(method, url);

      if (response?.message) {
        console.log(`Mensaje del servidor: ${response.message}`);
        if (response.message.toLowerCase().includes("successfully")) {
          localStorage.removeItem("accessToken");
          navigate('/'); // Redirige al usuario a la página de inicio
        } else {
          console.warn("Logout no completado:", response.message);
        }
      } else {
        console.warn("Respuesta inesperada del servidor:", response);
      }
    } catch (error) {
      console.error("Error al realizar el logout:", error?.response?.data || error.message);
    }
  }; 
  
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center p-2 absolute top-[45px] right-[75px]">
      <p className="font-bold text-white text-lg flex items-center">
        {username}
      </p>
      <div className="flex items-center ml-4 relative" ref={menuRef}>
        <button onClick={toggleMenu} className="flex items-center">
          <img src={Select} alt="Seleccionar" className="h-2 mr-2" />
        </button>
        <div
          className={`absolute top-full left-[-170px] mt-4 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg transform transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <button
            onClick={() => window.open("https://zajuna.sena.edu.co/", "_blank")}
            className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left flex items-center"
          >
            <img src={Logo} alt="Logo" className="h-4 w-4 mr-2" />
            Ir a Zajuna
          </button>

          <div className="px-4 py-2 text-gray-400 text-sm flex items-center">
            <img src={Phone} alt="Teléfono" className="h-4 w-4 mr-2" />
            +57 3214567890
          </div>
          <div className="px-4 py-2 text-gray-400 text-sm flex items-center">
            <img src={Email} alt="Correo" className="h-4 w-4 mr-2" />
            correo@gmail.com
          </div>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left flex items-center"
          >
            <img src={Logout} alt="Cerrar sesión" className="h-4 w-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      </div>
      <img src={ProfileUser} alt="Usuario" className="h-8 ml-4" />
    </div>
  );
}

export default HeaderBar;