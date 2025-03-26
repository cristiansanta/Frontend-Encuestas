import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import apiRequest from '../Provider/apiHelper';

// Importar imágenes SVG
import zoomIcon from '../assets/img/zoom.svg';
import voiceIcon from '../assets/img/voice.svg';
import Addsurvey from '../assets/img/addsurvey.svg';
import Filtersurvey from '../assets/img/filtersurvey.svg';
import Selectsurvey from '../assets/img/selectsurvey.svg';
import Tablesurvey from '../assets/img/tablesurvey.svg';
import Filter from '../assets/img/filtersurvey.svg';

const Dashboard = () => {
  const [showDashboardBanner] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('userName');
  const user_id = localStorage.getItem('id_user');

  // Función para obtener los permisos del usuario
  const fetchUserPermissions = async () => {
    const response = await apiRequest('GET', `getUserRoles?user_id=${user_id}`);
    console.log('Permisos del usuario desde dashboard:', response.roles);
    return response;
  };

  // useQuery para obtener permisos
  const { data: userPermissions = {}, isLoading, error } = useQuery({
    queryKey: ['UserPermissions'],
    queryFn: fetchUserPermissions,
  });

  // Manejo de estados de carga o error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium text-gray-700">
        Cargando permisos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium text-red-600">
        Error al cargar permisos
      </div>
    );
  }

  // Verificar si no hay roles asignados
  const hasNoRoles = false; // Forzado a false para desactivar la validación

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col items-center">
        {/* Banner */}
        <div className="w-full relative h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
          <HeaderBanner showDashboardBanner={showDashboardBanner} username={username} />
        </div>

        {/* Mensaje si no tiene roles */}
        {hasNoRoles && (
          <div className="mt-34 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto bg-gray-200 text-white rounded-lg text-center p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-custom">No hay roles registrados</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Comunícate con un administrador que te asigne un rol para continuar.</p>
            <p className="text-sm sm:text-base text-blue-600 mt-2 underline cursor-pointer">Número de contacto: 000000000000</p>
          </div>
        )}

        {/* Contenido si tiene roles */}
        {!hasNoRoles && (
          <div className="w-full px-4 sm:px-6">
            <br />
            <br />
            <br />
            <div className="mt-4 sm:mt-6 w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto flex flex-col gap-4 sm:gap-6 items-center">

              {/* Botones de acciones */}
              <div className="w-full flex justify-between items-center space-x-4">
                {/* Lado izquierdo: Nueva Encuesta y Filtrar por Estado */}
                <div className="flex space-x-4">
                  {/* Botón Nueva Encuesta */}
                  <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                    <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                      <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
                    </span>
                    <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                      Nueva Encuesta
                    </span>
                  </button>

                  {/* Versión móvil - Solo icono */}
                  <button className="md:hidden bg-blue-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105">
                    <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
                  </button>

                  {/* Botón Filtrar por Estado */}
                  <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
                    <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                      <img src={Filtersurvey} alt="Filtrar" className="w-5 h-5" />
                    </span>
                    <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                      Filtrar por Estado
                      <img src={Selectsurvey} alt="Filtrar" className="w-5 h-5" />
                    </span>
                  </button>

                  {/* Versión móvil - Solo icono */}
                  <button className="md:hidden bg-blue-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
                    <img src={Filtersurvey} alt="Filtrar" className="w-5 h-5" />
                  </button>
                </div>

                {/* Lado derecho: Vista de Lista y Barra de Búsqueda */}
                <div className="flex space-x-4 items-center">
                  {/* Botón Vista de Lista */}
                  <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
                    <span className="bg-yellow-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
                      <img src={Tablesurvey} alt="Vista de lista" className="w-5 h-5" />
                    </span>
                    <span className="bg-blue-custom text-white px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
                      <img src={Filter} alt="Filtrar" className="w-5 h-5" />
                      Lista
                    </span>
                  </button>

                  {/* Versión móvil - Solo icono */}
                  <button className="md:hidden bg-yellow-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
                    <img src={Tablesurvey} alt="Vista de lista" className="w-5 h-5" />
                  </button>

                  {/* Barra de Búsqueda */}

                  <div className="relative flex items-center w-48 md:w-64 lg:w-50">
                    <span className="absolute left-3 flex items-center">
                      <img src={zoomIcon} alt="Zoom" className="h-5 sm:h-6" />
                    </span>
                    <input
                      type="text"
                      placeholder="Buscar encuesta"
                      className="border border-gray-300 rounded-lg p-2 pl-10 pr-10 w-full"
                    />
                    <span className="absolute right-3 flex items-center">
                      <img src={voiceIcon} alt="Voice" className="h-5 sm:h-6" />
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Tarjetas del Dashboard */}
            <div className="w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto mt-4 sm:mt-6">
              <DashboardCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
