import React, { useState, useEffect } from 'react';
import Listsurveys from '../assets/ListSurveys';
import PlusIcon from '../assets/PlusIcon'; // Cambiamos Statereport por PlusIcon
import HomeIcon from '../assets/HomeIcon';
import ReportsIcon from '../assets/ReportsIcon';
import LogoutIcon from '../assets/LogoutIcon';
import SettingsIcon from '../assets/SettingsIcon';
import '../style/Navbar.css';
import apiRequest from '../Provider/apiHelper';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/img/zajuna.svg';
import LogoZajuna from '../assets/img/zajuna_navbar.svg';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Update active path when location changes
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
      icon: PlusIcon, // Cambiado de Statereport a PlusIcon
      path: "#/SurveyCreate",
      active: activePath === "/SurveyCreate",
      label: "Crear Encuesta",
    },
    {
      icon: ReportsIcon,
      path: "#/ManageUsers",
      active: activePath === "/ManageUsers",
      label: "Reportes",
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
  return (
    <div>
      {/* Mobile navbar for small screens */}
      <div className="mobile-navbar xl:hidden">
        <div className="mobile-navbar-background"></div>
        {menuItems.map((value, index) => (
          <a
            key={index}
            href={value.path}
            className={value.active ? "active" : ""}
            data-title={value.label}
          >
            <value.icon
              className="w-6 h-6"
              strokeColor={value.active ? "#39A900" : "#FFFFFF"}
            />
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
          className="cursor-pointer"
          data-title="Cerrar sesión"
        >
          <LogoutIcon className="w-6 h-6" />
        </a>
      </div>

      {/* Sidebar for large screens */}
      <div
        className={`navbar hidden xl:flex ${isExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo section */}
        <div className="navbar-logo">
          <div className="logo-container">
            {isExpanded ? (
              <img src={LogoZajuna} alt="Logo Zajuna" className="logo-zajuna" />
            ) : (
              <img src={Logo} alt="Logo Z" className="logo-icon" />
            )}
          </div>
        </div>

        {/* Menu items */}
        <div className="navbar-menu">
          {menuItems.map((value, index) => (
            <a
              key={index}
              href={value.path}
              className={`menu-item ${value.active ? "active" : ""}`}
              data-title={value.label}
            >
              {value.active && (
                <>
                  <div className="curve-top"></div>
                  <div className="curve-bottom"></div>
                </>
              )}

              <value.icon
                strokeColor={value.active ? "#39A900" : "#FFFFFF"}
                className="w-6 h-6"
              />
              <span>{value.label}</span>
            </a>
          ))}
        </div>

        {/* Logout button */}
        <div className="navbar-logout">
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
            className="cursor-pointer menu-item"
            data-title="Cerrar sesión"
          >
            <LogoutIcon className="w-6 h-6" />
            <span>Cerrar sesión</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;