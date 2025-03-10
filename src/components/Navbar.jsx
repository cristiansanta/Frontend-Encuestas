import React from 'react';
import Listsurveys from '../assets/ListSurveys';
import ListCategory from '../assets/ListCategory';
import Statereport from '../assets/StateReport';
import HomeIcon from '../assets/HomeIcon';
import LogoutIcon from '../assets/LogoutIcon';
import SettingsIcon from '../assets/SettingsIcon';
import '../style/Navbar.css';
import apiRequest from '../Provider/apiHelper';
import { useNavigate } from 'react-router-dom';



export const Navbar = () => {
  const menuItems = [
    {
      icon: HomeIcon,
      path: "#/Dashboard",
      active: window.location.pathname === "/Dashboard",
      label: "Inicio",
    },
    {
      icon: Listsurveys,
      path: "#/SurveyList",
      active: window.location.pathname === "/SurveyList",
      label: "Lista de encuestas",
    },
    {
      icon: ListCategory,
      path: "#/CategoryList",
      active: window.location.pathname === "/CategoryList",
      label: "Lista de categorías",
    },
    {
      icon: Statereport,
      path: "#/SectionsCreate",
      active: window.location.pathname === "/SectionsCreate",
      label: "Reportes",
    },
    {
      icon: SettingsIcon,
      path: "#/ManageUsers",
      active: window.location.pathname === "/ManageUsers",
      label: "Configuración",
    },
  ];
  const navigate = useNavigate();
  const handleReturlogin = () => {
    navigate('/'); 
};

  const fetchlogout = async () => {
    try {
        // Construir la URL para el endpoint de logout
        const url = "logout";
        const method = "POST";

        // Realizar la petición usando la función reutilizable apiRequest
        const response = await apiRequest(method, url);

        // Verificar y manejar la respuesta
        if (response?.message) {
            console.log(`Mensaje del servidor: ${response.message}`);
            if (response.message.toLowerCase().includes("successfully")) {
                // Si el mensaje contiene "success", asumir que el logout fue exitoso
                
                localStorage.removeItem("accessToken"); // Opcional: Eliminar el token
                handleReturlogin() // Redirigir al login
            } else {
                console.warn("Logout no completado:", response.message);
            }
        } else {
            console.warn("Respuesta inesperada del servidor:", response);
        }

        return response;
    } catch (error) {
        console.error("Error al realizar el logout:", error?.response?.data || error.message);
        throw error; // Lanza el error para que sea manejado en la llamada
    }
};


  return (
    <div>
      {/* Navbar superior para pantallas pequeñas */}
      <div className="flex justify-around items-center h-16 w-full fixed top-0 left-0 bg-[#002B3D] xl:hidden">
        {menuItems.map((value, index) => (
          <a
            key={index}
            href={value.path}
            className={`text-white flex justify-center items-center relative ${value.active ? "active" : ""}`}
          >
            <value.icon className="w-8 h-8" strokeColor={value.active ? "#39A900" : "#FFFFFF"} />
            {/* Texto en hover */}
            <span className="absolute bottom-[-1.5rem] hidden text-sm bg-gray-700 text-white px-2 py-1 rounded shadow-md group-hover:flex">
              {value.label}
            </span>
          </a>
        ))}
        
        {/* Icono de logout en el navbar superior */}
        <a
          href="/logout"
          className="text-white flex justify-center items-center"
        >
          <LogoutIcon className="w-8 h-8" />
        </a>
      </div>

      {/* Navbar lateral para pantallas grandes */}
      <div className="navbar fixed h-screen w-20 sticky inset-0 hidden xl:flex flex-col items-center bg-[#00324d]">
        {menuItems.map((value, index) => (
          <a
            key={index}
            href={value.path}
            className={`relative group flex justify-center items-center w-full py-4 ${value.active ? "active" : ""}`}
          >
            <value.icon className="w-8 h-8 mx-auto" strokeColor={value.active ? "#39A900" : "#FFFFFF"} />
            {/* Texto en hover */}
            <span className="absolute left-16 hidden group-hover:flex bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md">
              {value.label}
            </span>
          </a>
        ))}
<a
  onClick={(e) => {
    e.preventDefault(); // Prevenir la navegación por defecto
    fetchlogout()
      .then(() => {
        console.log("El usuario ha cerrado sesión.");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }}
  className="mt-auto mb-4 text-white flex justify-center items-center w-full relative group cursor-pointer"
>
  <LogoutIcon className="w-8 h-8 mx-auto" />
  <span className="absolute left-16 hidden group-hover:flex bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md">
    Cerrar sesión
  </span>
</a>
      </div>
    </div>
  );
};

export default Navbar;
