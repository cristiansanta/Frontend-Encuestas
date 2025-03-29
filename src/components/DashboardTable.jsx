import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import apiRequest from '../Provider/apiHelper.jsx';

import ShareIcon from '../assets/img/shareicon.svg'; // Reemplazar con la ruta correcta
import ViewIcon from '../assets/img/viewicon.svg'; // Reemplazar con la ruta correcta
import EditIcon from '../assets/img/editicon.svg'; // Reemplazar con la ruta correcta
import DeleteIcon from '../assets/img/deleteicon.svg'; // Reemplazar con la ruta correcta

const surveyData = [
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Encuestas para Administrativos', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activo', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
];

const DashboardTable = () => {
  const [showDashboardBanner] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // Por defecto muestra todas
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const navigate = useNavigate();
  const username = localStorage.getItem('userName');
  const user_id = localStorage.getItem('id_user');
  
  // Referencias separadas para las versiones desktop y móvil
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // Efecto para cerrar el desplegable cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      // Verificar si el clic fue fuera de ambos contenedores
      const desktopClicked = desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target);
      const mobileClicked = mobileDropdownRef.current && mobileDropdownRef.current.contains(event.target);
      
      if (!desktopClicked && !mobileClicked) {
        setIsFilterOpen(false);
      }
    }
    
    // Agregar evento cuando el desplegable está abierto
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

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

  // Definimos los filtros con clases de Tailwind personalizadas
  const filters = [
    { id: 'active', label: 'Encuestas activas', bgClass: 'bg-gren-custom', textClass: 'text-gren-custom', borderClass: 'border-gren-custom' },
    { id: 'ending', label: 'Próximas a finalizar', bgClass: 'bg-orange-custom', textClass: 'text-orange-custom', borderClass: 'border-orange-custom' },
    { id: 'unpublished', label: 'Encuentas sin publicar', bgClass: 'bg-celeste-custom', textClass: 'text-celeste-custom', borderClass: 'border-celeste-custom' },
    { id: 'finished', label: 'Encuestas finalizadas', bgClass: 'bg-purple-custom', textClass: 'text-purple-custom', borderClass: 'border-purple-custom' },
    { id: 'all', label: 'Todas las encuestas', bgClass: 'bg-blue-custom', textClass: 'text-blue-custom', borderClass: 'border-blue-custom' },
  ];

  // Mapear IDs de filtro a estados de encuesta
  const mapFilterToEstado = {
    'active': 'Activo',
    'ending': 'Próxima a Finalizar',
    'unpublished': 'Sin publicar',
    'finished': 'Finalizada',
    'all': '' // Filtro para mostrar todos
  };

  // Obtener el filtro seleccionado
  const getCurrentFilter = () => {
    return filters.find(f => f.id === selectedFilter) || filters[filters.length - 1]; // Default al último (all)
  };

  const toggleFilterDropdown = (e) => {
    // Evitar que el evento se propague al documento
    e.stopPropagation();
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
    setIsFilterOpen(false); // Cierra el dropdown después de seleccionar
    setCurrentPage(1); // Resetear a la primera página al cambiar el filtro
  };

  // Filtrar datos según búsqueda y filtro seleccionado
  const filteredData = surveyData.filter(survey => {
    // Filtrar por estado si no es 'all'
    const estadoFilter = mapFilterToEstado[selectedFilter] || '';
    const passesStateFilter = selectedFilter === 'all' || survey.estado === estadoFilter;
    
    // Filtrar por término de búsqueda
    const passesSearchFilter = 
      searchTerm === '' || 
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.creador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.fechaCreacion.includes(searchTerm) ||
      survey.id.toString().includes(searchTerm);
    
    return passesStateFilter && passesSearchFilter;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Obtener clases de estilo según el estado
  const getEstadoClasses = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'text-gren-custom';
      case 'Próxima a Finalizar':
        return 'text-orange-custom';
      case 'Sin publicar':
        return 'text-celeste-custom';
      case 'Finalizada':
        return 'text-purple-custom';
      default:
        return 'text-gray-500';
    }
  };

  // Funciones para la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

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

  // Obtener el filtro actual
  const currentFilter = getCurrentFilter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     

      <div className="flex-1 flex flex-col items-center">
        {/* Banner */}

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
            {/* Espaciado superior */}
            <div className="mt-12 sm:mt-16"></div>

            <div className="mt-4 sm:mt-6 w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto flex flex-col gap-4 sm:gap-6 items-center">
              {/* Botones de acciones */}
              <div className="w-full flex justify-between items-center space-x-4">
    
              

              
            
              </div>
            </div>

            {/* Tabla de encuestas */}
            <div className="w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto mt-6 overflow-x-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-blue-custom text-white">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">ID</th>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Título de la Encuesta</th>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Estado</th>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Creador</th>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Categoría</th>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Fecha de Creación</th>
                      <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Nº de Asignaciones</th>
                      <th className="py-3 px-4 text-center font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((survey, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-3 px-4 border-r">{survey.id}</td>
                          <td className="py-3 px-4 border-r">{survey.title}</td>
                          <td className={`py-3 px-4 border-r font-medium ${getEstadoClasses(survey.estado)}`}>
                            {survey.estado}
                          </td>
                          <td className="py-3 px-4 border-r">{survey.creador}</td>
                          <td className="py-3 px-4 border-r">{survey.categoria}</td>
                          <td className="py-3 px-4 border-r">{survey.fechaCreacion}</td>
                          <td className="py-3 px-4 border-r text-center">{survey.asignaciones}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-2">
                              <button className="p-2 bg-purple-custom rounded-full text-white hover:bg-opacity-80">
                                <img src={ShareIcon} alt="Compartir" className="w-5 h-5" />
                              </button>
                              <button className="p-2 bg-gren-custom rounded-full text-white hover:bg-opacity-80">
                                <img src={ViewIcon} alt="Ver" className="w-5 h-5" />
                              </button>
                              <button className="p-2 bg-orange-custom rounded-full text-white hover:bg-opacity-80">
                                <img src={EditIcon} alt="Editar" className="w-5 h-5" />
                              </button>
                              <button className="p-2 bg-celeste-custom rounded-full text-white hover:bg-opacity-80">
                                <img src={DeleteIcon} alt="Eliminar" className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-6 text-center text-gray-500 text-lg">
                          No se encontraron encuestas que coincidan con los criterios de búsqueda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {filteredData.length > 0 && (
                <div className="flex justify-center mt-6 mb-8">
                  <nav className="flex items-center">
                    <button 
                      onClick={goToPreviousPage} 
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      &lt;
                    </button>
                    <div className="mx-4 flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentPage === number 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={goToNextPage} 
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      &gt;
                    </button>
                  </nav>
                </div>
              )}

              {/* Botón de finalizar */}
              <div className="flex justify-end mt-4 mb-8">
                <button className="bg-green-500 text-white py-2 px-6 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <span className="mr-2">✓</span> Finalizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTable;