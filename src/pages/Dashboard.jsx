import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import bannerImage from '../assets/img/NewSurvey.png';
import DashboardCard from '../components/DashboardCard.jsx';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import apiRequest from '../Provider/apiHelper';

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

  // useQuery para obtener los permisos del usuario
  const { data: userPermissions = {}, isLoading, error } = useQuery({
    queryKey: ['UserPermissions'],
    queryFn: fetchUserPermissions,
  });

  // Manejo de estados de carga o error
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg font-medium text-gray-700">Cargando permisos...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg font-medium text-red-600">Error al cargar permisos</div>
    </div>
  );

  // Verificar si no hay roles asignados
  const hasNoRoles = !userPermissions.roles || userPermissions.roles.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col items-center">
        {/* Contenedor del banner - altura responsive */}
        <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 relative">
          <HeaderBanner showDashboardBanner={showDashboardBanner} username={username} />
        </div>

        {/* Mensaje de advertencia si no tiene roles - padding responsive */}
        {hasNoRoles && (
          <div className="mt-24 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto bg-gray-200 text-white rounded-lg text-center p-4 z-50">
            <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#002C4D" }}>
              No hay roles registrados
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Comunícate con un administrador que te asigne un rol para continuar.
            </p>
            <p className="text-sm sm:text-base text-blue-600 mt-2 underline cursor-pointer">
              Número de contacto: 000000000000
            </p>
          </div>

        )}

        {/* Contenido principal del dashboard si tiene roles */}
        {!hasNoRoles && (
          <div className="w-full px-4 sm:px-6">
            <div className="mt-4 sm:mt-6 w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto flex flex-col gap-4 sm:gap-6 items-center">
              {/* Botón Nueva Encuesta - tamaño responsive */}
              <button
                className="bg-[#00324D] px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-[#004d76] transition-colors w-full sm:w-auto flex justify-center"
                onClick={() => navigate('/Categorylist')}
              >
                <img
                  src={bannerImage}
                  alt="Nueva encuesta"
                  className="h-12 sm:h-14 md:h-15"
                />
              </button>

              {/* Barra de búsqueda - ancho responsive */}
              <input
                type="text"
                placeholder="Buscar encuesta"
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3"
              />
            </div>

            {/* Tarjetas del dashboard */}
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