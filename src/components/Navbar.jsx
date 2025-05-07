import React, { useState, useEffect, useRef, act } from 'react';
import Listsurveys from '../assets/ListSurveys';
import PlusIcon from '../assets/PlusIcon';
import HomeIcon from '../assets/HomeIcon';
import ReportsIcon from '../assets/ReportsIcon';
import LogoutIcon from '../assets/LogoutIcon';
import SettingsIcon from '../assets/SettingsIcon';
import '../style/Navbar.css';
import apiRequest from '../Provider/apiHelper';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '../assets/img/zajuna.svg';
import LogoZajuna from '../assets/img/zajuna_navbar.svg';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activePath, setActivePath] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandTimeout, setExpandTimeout] = useState(null);
    const menuRef = useRef(null);
    // Update active path when location changes
    useEffect(() => {
        const currentPath = location.pathname;
        setActivePath(currentPath);
    }, [location]);

    // Limpia el timeout cuando el componente se desmonta
    useEffect(() => {
        return () => {
            if (expandTimeout) {
                clearTimeout(expandTimeout);
            }
        };
    }, [expandTimeout]);

    // Ajusta la clase de los elementos span cuando cambia isExpanded
    useEffect(() => {
        if (menuRef.current) {
            const spans = menuRef.current.querySelectorAll('a.menu-item span');
            spans.forEach(span => {
                if (isExpanded) {
                    // Retraso ligero para sincronizar con la expansión
                    setTimeout(() => {
                        span.classList.add('expanded');
                    }, 50);
                } else {
                    span.classList.remove('expanded');
                }
            });
        }
    }, [isExpanded]);

    const menuItems = [
        {
            icon: HomeIcon,
            path: "/dashboard",
            active: activePath === "/dashboard",
            label: "Inicio",
        },
        {
            icon: Listsurveys,
            path: "/survey-list",
            active: activePath === "/survey-list",
            label: "Lista de encuestas",
        },
        {
            icon: PlusIcon,
            path: "/survey-create",
            active: activePath === "/survey-create" || activePath === "/questions-create" || activePath === "/preview-survey" || activePath === "/details-survey",
            label: "Crear Encuesta",
        },
        {
            icon: ReportsIcon,
            path: "/manage-users",
            active: activePath === "/manage-users",
            label: "Reportes",
        },
    ];

    // Función mejorada para manejar la expansión
    const handleExpand = () => {
        // Cancelar cualquier timeout pendiente
        clearTimeout(expandTimeout);
        // Establecer el estado de expansión
        setIsExpanded(true);
    };

    // Función mejorada para manejar la contracción
    const handleCollapse = () => {
        // Establecer un timeout para contraer
        const timeout = setTimeout(() => {
            setIsExpanded(false);
        }, 300);
        setExpandTimeout(timeout);
    };

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
                    <Link
                        key={index}
                        to={value.path}
                        className={value.active ? "active" : ""}
                        data-title={value.label}
                    >
                        <value.icon
                            className="w-6 h-6"
                            strokeColor={value.active ? "#00324D" : "#FFFFFF"}
                        />
                    </Link>
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

            {/* Sidebar for large screens - con optimizaciones */}
            <div
                ref={menuRef}
                className={`navbar hidden xl:flex ${isExpanded ? "expanded" : ""}`}
                onMouseEnter={handleExpand}
                onMouseLeave={handleCollapse}
            >

                {/* Elemento invisible para aumentar el área de detección del hover */}
                <div className="navbar-hover-extension"></div>
                {/* Logo section - con ambos logos siempre presentes */}
                <div className="navbar-logo">
                    <div className="logo-container">
                        <img src={Logo} alt="Logo Z" className="logo-icon" />
                        <img src={LogoZajuna} alt="Logo Zajuna" className="logo-zajuna" />
                    </div>
                </div>

                {/* Menu items - con etiquetas span ocultas hasta expansión */}
                <div className="navbar-menu">
                    {menuItems.map((value, index) => (
                        <Link
                            key={index}
                            to={value.path}
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
                                strokeColor={value.active ? "#00324D" : "#FFFFFF"}
                                className="w-6 h-6"
                            />
                            <span>{value.label}</span>
                        </Link>
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
