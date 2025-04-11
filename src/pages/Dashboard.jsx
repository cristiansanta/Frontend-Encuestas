import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import apiRequest from '../Provider/apiHelper';

// Componentes
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DashboardTable from '../components/DashboardTable';

/**
 * Componente principal del Dashboard
 * Utiliza DashboardLayout para la estructura y muestra DashboardCard o DashboardTable según el modo de vista
 * 
 * @returns {JSX.Element} Componente Dashboard completo
 */
const Dashboard = () => {
  // Estados para el dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // Por defecto muestra todas
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  
  // Hooks de navegación
  const navigate = useNavigate();
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

  // Handlers para los diferentes cambios de estado
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleCreateSurvey = () => {
    navigate('/survey-create');
  };

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

  // Verificar si no hay roles asignados (actualmente forzado a false)
  const hasNoRoles = false; // Forzado a false para desactivar la validación

  return (
    <>
      {/* Mensaje si no tiene roles */}
      {hasNoRoles ? (
        <div className="mt-34 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto bg-gray-200 text-white rounded-lg text-center p-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-custom">No hay roles registrados</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Comunícate con un administrador que te asigne un rol para continuar.</p>
          <p className="text-sm sm:text-base text-blue-600 mt-2 underline cursor-pointer">Número de contacto: 000000000000</p>
        </div>
      ) : (
        <DashboardLayout
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onCreateSurvey={handleCreateSurvey}
        >
          {/* Contenido principal: Cards o Tabla según el modo de vista */}
          <div className="-mt-4">
            {viewMode === 'cards' ? (
              <DashboardCard searchTerm={searchTerm} stateFilter={selectedFilter} />
            ) : (
              <DashboardTable searchTerm={searchTerm} stateFilter={selectedFilter} />
            )}
          </div>
        </DashboardLayout>
      )}
    </>
  );
};

export default Dashboard;