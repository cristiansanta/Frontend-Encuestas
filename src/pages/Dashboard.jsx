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
  if (isLoading) return <div>Cargando permisos...</div>;
  if (error) return <div>Error al cargar permisos</div>;

  // Verificar si no hay roles asignados
  const hasNoRoles = !userPermissions.roles || userPermissions.roles.length === 0;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center mt-0">
        <div className="w-full h-48"> {/* Asegura que el contenedor ocupe todo el ancho y tenga altura fija */}
          <HeaderBanner showDashboardBanner={showDashboardBanner} username={username} />
        </div>
        {hasNoRoles ? (
          <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto bg-red-500 text-white rounded-lg text-center p-4">
            <h2 className="text-lg font-bold">⚠️ No tienes roles asignados</h2>
            <p className="text-sm">Por favor, solicita a un administrador que te asigne un rol para continuar.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto flex justify-between items-center">
              <button
                className="bg-[#00324D] px-4 py-2 rounded-lg"
                onClick={() => navigate('/Categorylist')}
              >
                <img src={bannerImage} alt="Nueva encuesta" className="h-15" />
              </button>
              <input
                type="text"
                placeholder="Buscar encuesta"
                className="border border-gray-300 rounded-lg p-2 w-1/3"
              />
            </div>
            <DashboardCard />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
