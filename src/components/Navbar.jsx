import React, { useState, useEffect } from 'react';
import Listsurveys from '../assets/ListSurveys';
import ListCategory from '../assets/ListCategory';
import Statereport from '../assets/StateReport';
import HomeIcon from '../assets/HomeIcon';
import LogoutIcon from '../assets/LogoutIcon';
import SettingsIcon from '../assets/SettingsIcon';
import '../style/Navbar.css';
import apiRequest from '../Provider/apiHelper';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState("");

  // Actualiza la ruta activa cuando cambia la ubicación
  useEffect(() => {
    const currentPath = location.hash ? location.hash.substring(1) : location.pathname;
    setActivePath(currentPath);
  }, [location]);

  const menuItems = [
    {
      icon: HomeIcon,
      path: "#/Dashboard",
      active: activePath === "/Dashboard",
      label: "Inicio",
    },
    {
      icon: Listsurveys,
      path: "#/SurveyList",
      active: activePath === "/SurveyList",
      label: "Lista de encuestas",
    },
    {
      icon: ListCategory,
      path: "#/CategoryList",
      active: activePath === "/CategoryList",
      label: "Lista de categorías",
    },
    {
      icon: Statereport,
      path: "#/SectionsCreate",
      active: activePath === "/SectionsCreate",
      label: "Reportes",
    },
    {
      icon: SettingsIcon,
      path: "#/ManageUsers",
      active: activePath === "/ManageUsers",
      label: "Configuración",
    },
  ];

  const handleReturlogin = () => {
    navigate('/');
  };

  const fetchlogout = async () => {
    try {
      const url = "logout";
      const method = "POST";
      const response = await apiRequest(method, url);

      if (response?.message) {
        console.log(`Mensaje del servidor: ${response.message}`);
        if (response.message.toLowerCase().includes("successfully")) {
          localStorage.removeItem("accessToken");
          handleReturlogin();
        } else {
          console.warn("Logout no completado:", response.message);
        }
      } else {
        console.warn("Respuesta inesperada del servidor:", response);
      }

      return response;
    } catch (error) {
      console.error("Error al realizar el logout:", error?.response?.data || error.message);
      throw error;
    }
  };

  // Estilo para el elemento activo
  const getActiveItemStyle = (isActive) => {
    if (isActive) {
      return "bg-white rounded-l-full"; // Redondear solo el borde izquierdo
    }
    return "";
  };

  return (
    <div>
      {/* Navbar superior para pantallas pequeñas */}
      <div className="flex justify-around items-center h-16 w-full fixed top-0 left-0 bg-[#002B3D] xl:hidden">
        {menuItems.map((value, index) => (
          <a
            key={index}
            href={value.path}
            className={`text-white flex justify-center items-center relative p-2 ${
              value.active ? "bg-white rounded-full" : ""
            }`}
          >
            <value.icon
              className="w-8 h-8"
              strokeColor={value.active ? "#39A900" : "#FFFFFF"}
            />
            <span className="absolute bottom-[-1.5rem] hidden text-sm bg-gray-700 text-white px-2 py-1 rounded shadow-md group-hover:block">
              {value.label}
            </span>
          </a>
        ))}

        <a
          onClick={(e) => {
            e.preventDefault();
            fetchlogout()
              .then(() => {
                console.log("El usuario ha cerrado sesión.");
              })
              .catch((error) => {
                console.error("Error al cerrar sesión:", error);
              });
          }}
          className="text-white flex justify-center items-center cursor-pointer p-2"
        >
          <LogoutIcon className="w-8 h-8" />
          <span className="absolute bottom-[-1.5rem] hidden text-sm bg-gray-700 text-white px-2 py-1 rounded shadow-md group-hover:block">
            Cerrar sesión
          </span>
        </a>
      </div>

      {/* Navbar lateral para pantallas grandes */}
      <div className="navbar fixed h-screen w-20 sticky inset-0 hidden xl:flex flex-col items-center bg-[#00324d]">
        {menuItems.map((value, index) => (
          <div
            key={index}
            className="w-full flex justify-center py-4"
          >
            <a
              href={value.path}
              className={`relative group flex justify-center items-center py-3 px-6 ${getActiveItemStyle(value.active)}`}
            >
              <value.icon
                className="w-8 h-8 mx-auto"
                strokeColor={value.active ? "#39A900" : "#FFFFFF"}
              />
              <span className="absolute left-16 hidden group-hover:block bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md z-10">
                {value.label}
              </span>
            </a>
          </div>
        ))}
        <div className="mt-auto mb-4 w-full flex justify-center">
          <a
            onClick={(e) => {
              e.preventDefault();
              fetchlogout()
                .then(() => {
                  console.log("El usuario ha cerrado sesión.");
                })
                .catch((error) => {
                  console.error("Error al cerrar sesión:", error);
                });
            }}
            className="relative group flex justify-center items-center py-3 px-6 cursor-pointer"
          >
            <LogoutIcon className="w-8 h-8 mx-auto" />
            <span className="absolute left-16 hidden group-hover:block bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md z-10">
              Cerrar sesión
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
