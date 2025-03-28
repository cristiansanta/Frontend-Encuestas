// import React, { useState, useRef, useEffect } from 'react';
// import Navbar from '../components/Navbar.jsx';
// import HeaderBanner from '../components/HeaderBanner.jsx';
// import DashboardCard from '../components/DashboardCard.jsx';
// import { useNavigate } from "react-router-dom";
// import { useQuery } from '@tanstack/react-query';
// import apiRequest from '../Provider/apiHelper.jsx';

// // Importar imágenes SVG
// import zoomIcon from '../assets/img/zoom.svg';
// import voiceIcon from '../assets/img/voice.svg';
// import Addsurvey from '../assets/img/addsurvey.svg';
// import Filtersurvey from '../assets/img/filtersurvey.svg';
// import Selectsurvey from '../assets/img/selectsurvey.svg';
// import Tablesurvey from '../assets/img/tablesurvey.svg';


// const Dashboard = () => {
//   const [showDashboardBanner] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState('all'); // Por defecto muestra todas
//   const navigate = useNavigate();
//   const username = localStorage.getItem('userName');
//   const user_id = localStorage.getItem('id_user');
  
//   // Referencias separadas para las versiones desktop y móvil
//   const desktopDropdownRef = useRef(null);
//   const mobileDropdownRef = useRef(null);

//   // Efecto para cerrar el desplegable cuando se hace clic fuera
//   useEffect(() => {
//     function handleClickOutside(event) {
//       // Verificar si el clic fue fuera de ambos contenedores
//       const desktopClicked = desktopDropdownRef.current && desktopDropdownRef.current.contains(event.target);
//       const mobileClicked = mobileDropdownRef.current && mobileDropdownRef.current.contains(event.target);
      
//       if (!desktopClicked && !mobileClicked) {
//         setIsFilterOpen(false);
//       }
//     }
    
//     // Agregar evento cuando el desplegable está abierto
//     if (isFilterOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
    
//     // Cleanup
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isFilterOpen]);

//   // Función para obtener los permisos del usuario
//   const fetchUserPermissions = async () => {
//     const response = await apiRequest('GET', `getUserRoles?user_id=${user_id}`);
//     console.log('Permisos del usuario desde dashboard:', response.roles);
//     return response;
//   };

//   // useQuery para obtener permisos
//   const { data: userPermissions = {}, isLoading, error } = useQuery({
//     queryKey: ['UserPermissions'],
//     queryFn: fetchUserPermissions,
//   });

//   // Definimos los filtros con clases de Tailwind personalizadas
//   const filters = [
//     { id: 'active', label: 'Encuestas activas', bgClass: 'bg-gren-custom', textClass: 'text-gren-custom', borderClass: 'border-gren-custom' },
//     { id: 'ending', label: 'Próximas a finalizar', bgClass: 'bg-orange-custom', textClass: 'text-orange-custom', borderClass: 'border-orange-custom' },
//     { id: 'unpublished', label: 'Encuentas sin publicar', bgClass: 'bg-celeste-custom', textClass: 'text-celeste-custom', borderClass: 'border-celeste-custom' },
//     { id: 'finished', label: 'Encuestas finalizadas', bgClass: 'bg-purple-custom', textClass: 'text-purple-custom', borderClass: 'border-purple-custom' },
//     { id: 'all', label: 'Todas las encuestas', bgClass: 'bg-blue-custom', textClass: 'text-blue-custom', borderClass: 'border-blue-custom' },
//   ];

//   // Obtener el filtro seleccionado
//   const getCurrentFilter = () => {
//     return filters.find(f => f.id === selectedFilter) || filters[filters.length - 1]; // Default al último (all)
//   };

//   const toggleFilterDropdown = (e) => {
//     // Evitar que el evento se propague al documento
//     e.stopPropagation();
//     setIsFilterOpen(!isFilterOpen);
//   };

//   const handleFilterSelect = (filterId) => {
//     console.log(`Intento cambiar filtro a: ${filterId}`); // Debug
//     setSelectedFilter(filterId);
//     setIsFilterOpen(false); // Cierra el dropdown después de seleccionar
//     console.log(`Filtro cambiado a: ${filterId}`); // Debug
//   };

//   // Manejo de estados de carga o error
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-lg font-medium text-gray-700">
//         Cargando permisos...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-lg font-medium text-red-600">
//         Error al cargar permisos
//       </div>
//     );
//   }

//   // Verificar si no hay roles asignados
//   const hasNoRoles = false; // Forzado a false para desactivar la validación

//   // Obtener el filtro actual
//   const currentFilter = getCurrentFilter();

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="flex-1 flex flex-col items-center">
//         {/* Banner */}
//         <div className="w-full relative h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
//           <HeaderBanner showDashboardBanner={showDashboardBanner} username={username} />
//         </div>

//         {/* Mensaje si no tiene roles */}
//         {hasNoRoles && (
//           <div className="mt-34 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto bg-gray-200 text-white rounded-lg text-center p-4">
//             <h2 className="text-lg sm:text-xl font-semibold text-blue-custom">No hay roles registrados</h2>
//             <p className="text-sm sm:text-base text-gray-600 mt-2">Comunícate con un administrador que te asigne un rol para continuar.</p>
//             <p className="text-sm sm:text-base text-blue-600 mt-2 underline cursor-pointer">Número de contacto: 000000000000</p>
//           </div>
//         )}
//         {/* Contenido si tiene roles */}
//         {!hasNoRoles && (
//           <div className="w-full px-4 sm:px-6">
//             {/* Espaciado superior */}
//             <div className="mt-12 sm:mt-16"></div>

//             <div className="mt-4 sm:mt-6 w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto flex flex-col gap-4 sm:gap-6 items-center">
//               {/* Botones de acciones */}
//               <div className="w-full flex justify-between items-center space-x-4">
//                 {/* Lado izquierdo: Nueva Encuesta y Filtrar por Estado */}
//                 <div className="flex space-x-4">
//                   {/* Botón Nueva Encuesta */}
//                   <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
//                     <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
//                       <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
//                     </span>
//                     <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
//                       Nueva Encuesta
//                     </span>
//                   </button>

//                   {/* Versión móvil - Solo icono */}
//                   <button className="md:hidden bg-blue-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105">
//                     <img src={Addsurvey} alt="Nueva encuesta" className="w-5 h-5" />
//                   </button>

//                   {/* Botón y dropdown Filtrar por Estado - VERSIÓN MEJORADA VISUALMENTE */}
//                   <div className="hidden md:block relative" ref={desktopDropdownRef}>
//                     {/* Botón de filtro con estado seleccionado */}
//                     <div className="flex rounded-full overflow-hidden">
//                       {/* Parte principal del botón */}
//                       <button 
//                         className="flex items-center cursor-pointer transition-all duration-300 hover:scale-105"
//                         onClick={toggleFilterDropdown}
//                       >
//                         <span className="bg-blue-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
//                           <img src={Filtersurvey} alt="Filtrar" className="w-5 h-5" />
//                         </span>
//                         <span className="bg-yellow-custom text-blue-custom px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
//                           Filtro por estado
//                           {selectedFilter === 'all' ? (
//                             <img 
//                               src={Selectsurvey} 
//                               alt="Seleccionar" 
//                               className="w-5 h-5 ml-3" 
//                             />
//                           ) : (
//                             <img 
//                               src={Selectsurvey} 
//                               alt="Seleccionar" 
//                               className="w-5 h-5 ml-3 transform -rotate-90" 
//                             />
//                           )}
//                         </span>
//                       </button>
                      
//                       {/* Mostrar el filtro seleccionado si no es "all" */}
//                       {selectedFilter !== 'all' && (
//                         <span 
//                           className={`py-2 px-5 font-semibold text-white text-sm flex items-center ${currentFilter.bgClass}`}
//                         >
//                           {currentFilter.label}
//                         </span>
//                       )}
//                     </div>

//                     {/* Dropdown de filtros */}
//                     {isFilterOpen && (
//                       <div 
//                         className="absolute z-50 mt-2 -right-12 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
//                         onClick={(e) => e.stopPropagation()} // Prevenir cierre accidental
//                       >
//                         <div className="flex flex-col">
//                           <div className="py-2">
//                             {filters.map((filter) => (
//                               <div 
//                                 key={filter.id}
//                                 className="hover:bg-gray-50 py-3 px-4 cursor-pointer border-b border-gray-200 transition-colors last:border-b-0"
//                                 onClick={(e) => {
//                                   e.stopPropagation(); // Detener propagación
//                                   handleFilterSelect(filter.id);
//                                 }}
//                               >
//                                 <div className="flex items-center">
//                                   <div 
//                                     className={`w-5 h-5 rounded-full border-2 ${filter.borderClass} flex items-center justify-center mr-3`}
//                                   >
//                                     {selectedFilter === filter.id && (
//                                       <div 
//                                         className={`w-2.5 h-2.5 rounded-full ${filter.bgClass}`}
//                                       ></div>
//                                     )}
//                                   </div>
//                                   <span 
//                                     className={`font-medium text-sm ${filter.textClass}`}
//                                   >
//                                     {filter.label}
//                                   </span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Versión móvil del filtro - Solo icono */}
//                   <button 
//                     className="md:hidden bg-blue-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105" 
//                     onClick={toggleFilterDropdown}
//                   >
//                     <img src={Filter} alt="Filtrar" className="w-5 h-5" />
//                   </button>
                  
//                   {/* Dropdown móvil (aparece cuando se hace clic en el icono) */}
//                   {isFilterOpen && (
//                     <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                       <div 
//                         className="bg-white rounded-3xl shadow-lg border border-gray-200 w-72 overflow-hidden transition-all duration-300" 
//                         ref={mobileDropdownRef}
//                       >
//                         <div className="flex flex-col">
//                           <div className="bg-yellow-custom py-3 px-4 text-blue-custom font-bold flex items-center">
//                             <span className="ml-2">Filtrar por estado</span>
//                             <span 
//                               className="ml-auto cursor-pointer pr-2" 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setIsFilterOpen(false);
//                               }}
//                             >
//                               ✕
//                             </span>
//                           </div>
//                           <div className="py-2">
//                             {filters.map((filter) => (
//                               <div 
//                                 key={filter.id}
//                                 className="hover:bg-gray-50 py-3 px-4 cursor-pointer border-b border-gray-200 transition-colors last:border-b-0"
//                                 onClick={(e) => {
//                                   e.stopPropagation(); // Detener propagación
//                                   handleFilterSelect(filter.id);
//                                 }}
//                               >
//                                 <div className="flex items-center">
//                                   <div 
//                                     className={`w-5 h-5 rounded-full border-2 ${filter.borderClass} flex items-center justify-center mr-3`}
//                                   >
//                                     {selectedFilter === filter.id && (
//                                       <div 
//                                         className={`w-2.5 h-2.5 rounded-full ${filter.bgClass}`}
//                                       ></div>
//                                     )}
//                                   </div>
//                                   <span 
//                                     className={`font-medium text-sm ${filter.textClass}`}
//                                   >
//                                     {filter.label}
//                                   </span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Lado derecho: Vista de Lista y Barra de Búsqueda */}
//                 <div className="flex space-x-4 items-center">
//                   {/* Botón Vista de Lista */}
//                   <button className="hidden md:flex items-center rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
//                     <span className="bg-yellow-custom text-white px-4 py-2 flex items-center h-full hover:bg-opacity-80">
//                       <img src={Tablesurvey} alt="Vista de lista" className="w-5 h-5" />
//                     </span>
//                     <span className="bg-blue-custom text-white px-5 py-2 font-semibold flex items-center h-full text-sm hover:bg-opacity-80">
//                       <img src={Filter} alt="Filtrar" className="w-5 h-5 mr-4" />
//                       Lista
//                     </span>
//                   </button>

//                   {/* Versión móvil - Solo icono */}
//                   <button className="md:hidden bg-yellow-custom text-white p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105" onClick={() => navigate('/Categorylist')}>
//                     <img src={Tablesurvey} alt="Vista de lista" className="w-5 h-5" />
//                   </button>

//                   {/* Barra de Búsqueda */}
//                   <div className="relative flex items-center w-48 md:w-64 lg:w-50">
//                     <span className="absolute left-3 flex items-center">
//                       <img src={zoomIcon} alt="Zoom" className="h-5 sm:h-6" />
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Buscar encuesta"
//                       className="border border-gray-300 rounded-lg p-2 pl-10 pr-10 w-full"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <span className="absolute right-3 flex items-center">
//                       <img src={voiceIcon} alt="Voice" className="h-5 sm:h-6" />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Indicador visual del filtro seleccionado solo para dispositivos móviles */}
//             {selectedFilter !== 'all' && (
//               <div className="md:hidden w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto mt-4">
//                 <div className="flex items-center">
//                   <span className="text-gray-600 mr-2">Filtrando por:</span>
//                   <span 
//                     className={`px-3 py-1 rounded-full text-sm font-medium text-white ${currentFilter.bgClass}`}
//                   >
//                     {currentFilter.label}
//                   </span>
//                   <button 
//                     className="ml-2 text-gray-500 hover:text-gray-700"
//                     onClick={() => setSelectedFilter('all')}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Tarjetas del Dashboard */}
//             <div className="w-11/12 sm:w-5/6 md:w-3/4 lg:w-4/5 xl:w-5/6 mx-auto mt-4 sm:mt-6">
//               <DashboardCard searchTerm={searchTerm} stateFilter={selectedFilter} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;