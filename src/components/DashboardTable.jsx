import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';

// Icons
import ShareIcon from '../assets/img/shareicon.svg';
import ViewIcon from '../assets/img/viewicon.svg';
import EditIcon from '../assets/img/editicon.svg';
import CalendarIcon from '../assets/img/calendar.svg';
import DoneIcon from '../assets/img/done.svg';
import Tool from '../assets/img/tool.svg';
import CardSurvey from '../assets/img/CardImg.svg';
import DropdownIcon from '../assets/img/tabledeploy.svg';

// Sample data (en una implementación real, esto vendría de tu API)
const surveyData = [
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Próxima a Finalizar', creador: 'Usuario Administrador', categoria: 'Encuestas para Administrativos', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Próxima a Finalizar', creador: 'Usuario Administrador', categoria: 'Encuestas para Administrativos', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Próxima a Finalizar', creador: 'Usuario Administrador', categoria: 'Encuestas para Administrativos', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Solo Funciona', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  // ... otros datos
];

// Mapear IDs de filtro a estados de encuesta
const mapFilterToEstado = {
  'active': 'Activa',
  'ending': 'Próxima a Finalizar',
  'unpublished': 'Sin publicar',
  'finished': 'Finalizada',
  'all': '' // Filtro para mostrar todos
};

const DashboardTable = ({ searchTerm = '', stateFilter = 'all' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // Para controlar qué fila tiene desplegados los iconos

  // Efecto para simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Obtener el estado de filtro correspondiente
  const estadoFilter = mapFilterToEstado[stateFilter] || '';

  // Actualizar datos con fechas de inicio y final
  const surveyDataWithDates = surveyData.map(survey => ({
    ...survey,
    fechaInicio: survey.fechaCreacion,
    fechaFinal: '15/05/2025' // Fecha ficticia para el ejemplo
  }));

  // Filtrar datos según búsqueda y filtro seleccionado
  const filteredData = surveyDataWithDates.filter(survey => {
    // Filtrar por estado si no es 'all'
    const passesStateFilter = stateFilter === 'all' || survey.estado === estadoFilter;

    // Filtrar por término de búsqueda
    const passesSearchFilter =
      searchTerm === '' ||
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.fechaInicio.includes(searchTerm) ||
      survey.fechaFinal.includes(searchTerm) ||
      survey.id.toString().includes(searchTerm);

    return passesStateFilter && passesSearchFilter;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Funciones para la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Manejar selección de fila
  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Obtener clases de estilo según el estado
  const getEstadoClasses = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'text-green-custom border-2 border-green-custom rounded-full px-3 py-1';
      case 'Próxima a Finalizar':
        return 'text-orange-custom border-2 border-orange-custom rounded-full px-3 py-1';
      case 'Sin publicar':
        return 'text-celeste-custom border-2 border-celeste-custom rounded-full px-3 py-1';
      case 'Finalizada':
        return 'text-purple-custom border-2 border-purple-custom rounded-full px-3 py-1';
      default:
        return 'text-gray-500 border-2 border-gray-500 rounded-full px-3 py-1';
    }
  };

  // Obtener color de fondo para el indicador de estado
  const getIndicatorColor = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'bg-green-custom';
      case 'Próxima a Finalizar':
        return 'bg-orange-custom';
      case 'Sin publicar':
        return 'bg-celeste-custom';
      case 'Finalizada':
        return 'bg-purple-custom';
      default:
        return 'bg-gray-500';
    }
  };

  // Función para renderizar los iconos de acción según el estado
  const renderActionIcons = (estado) => {
    switch (estado) {
      case 'Finalizada':
        return (
          <div className="flex justify-center space-x-2">
            <button className="p-2 bg-purple-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={ShareIcon} alt="Compartir" className="w-5 h-5" />
            </button>
            <button className="p-2 bg-purple-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={ViewIcon} alt="Ver" className="w-5 h-5" />
            </button>
          </div>
        );
      case 'Activa':
        return (
          <div className="flex justify-center space-x-2">
            <button className="p-2 bg-green-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={ShareIcon} alt="Compartir" className="w-5 h-5" />
            </button>
            <button className="p-2 bg-green-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={ViewIcon} alt="Ver" className="w-5 h-5" />
            </button>
          </div>
        );
      case 'Próxima a Finalizar':
        return (
          <div className="flex justify-center space-x-2">
            <button className="p-2 bg-orange-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={CalendarIcon} alt="Ampliar plazo" className="w-5 h-5" />
            </button>
            <button className="p-2 bg-orange-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={ViewIcon} alt="Ver" className="w-5 h-5" />
            </button>
          </div>
        );
      case 'Sin publicar':
        return (
          <div className="flex justify-center space-x-2">
            <button className="p-2 bg-celeste-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={EditIcon} alt="Editar" className="w-5 h-5" />
            </button>
            <button className="p-2 bg-celeste-custom rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={DoneIcon} alt="Publicar" className="w-5 h-5" />
            </button>
          </div>
        );
      default:
        return (
          <div className="flex justify-center space-x-2">
            <button className="p-2 bg-gray-500 rounded-full text-white hover:bg-opacity-80 transition-all duration-300">
              <img src={ShareIcon} alt="Compartir" className="w-5 h-5" />
            </button>
          </div>
        );
    }
  };

  // Configuración de animación para las filas de la tabla
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut"
      }
    }),
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animación para la tabla completa
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  // Si está cargando, mostrar animación de carga
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
          className="w-16 h-16 border-4 border-blue-custom border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="mt-0 w-full mx-auto mb-10"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      {/* Tabla de encuestas con scroll horizontal */}
      <div className="overflow-hidden w-full px-8 py-2">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-auto border-collapse min-w-max rounded-xl overflow-hidden">
            <thead className="bg-blue-custom text-white rounded-t-xl">
              <tr>
                <th className="py-3 px-2 text-center font-medium border-r border-blue-800 w-12 sticky left-0 bg-blue-custom z-10 first:rounded-tl-xl">
                  <div className="flex items-center justify-center">
                    <img src={CardSurvey} alt="Imagen encuesta" className="w-6 h-6" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-64">Título de la Encuesta</th>
                <th className="py-3 px-4 text-center font-medium border-r border-blue-800 w-40">Estado</th>
                <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-48">Categoría</th>
                <th className="py-3 px-4 text-center font-medium border-r border-blue-800 w-48">Rango de tiempo</th>
                <th className="py-3 px-4 text-center font-medium border-r border-blue-800 w-32">Nº de Respuestas</th>
                {/* Columna de acciones - sticky right */}
                <th className="py-3 px-4 text-center font-medium w-24 sticky right-0 bg-blue-custom z-10">
                  <div className="flex items-center justify-center">
                    <img src={Tool} alt="Herramienta" className="w-6 h-6 mr-2" />
                    <span>Acciones</span>
                  </div>
                </th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((survey, index) => {
                    const rowBgColor = index % 2 === 0 ? 'white' : '#f9fafb';
                    return (
                      <motion.tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                        custom={index}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {/* Celda con checkbox e indicador de estado - sticky left */}
                        <td className="border-r py-3 px-2 relative sticky left-0 z-10" style={{ backgroundColor: rowBgColor }}>
                          {/* Barra vertical de color según estado */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getIndicatorColor(survey.estado)}`}></div>

                          {/* Checkbox con padding a la izquierda para compensar el indicador */}
                          <div className="flex items-center justify-center pl-6">
                            <div
                              className={`w-5 h-5 border border-gray-300 rounded cursor-pointer flex items-center justify-center transition-colors ${selectedRows.includes(index) ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}
                              onClick={() => handleRowSelect(index)}
                            >
                              {selectedRows.includes(index) && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-r truncate">{DOMPurify.sanitize(survey.title)}</td>
                        <td className="py-3 px-4 border-r text-center">
                          <span className={`inline-block ${getEstadoClasses(survey.estado)}`}>
                            {DOMPurify.sanitize(survey.estado)}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-r truncate">{DOMPurify.sanitize(survey.categoria)}</td>
                        <td className="py-3 px-4 border-r text-center">
                          <div className="flex flex-col md:flex-row justify-center items-center">
                            <span>{DOMPurify.sanitize(survey.fechaInicio)}</span>
                            <span className="mx-2 hidden md:inline">-</span>
                            <span>{DOMPurify.sanitize(survey.fechaFinal)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-r text-center">{DOMPurify.sanitize(String(survey.asignaciones))}</td>

                        {/* Celda de acciones - sticky right (MODIFICADA con botón de despliegue) */}
                        <td className="py-3 px-4 text-center sticky right-0 z-10 transition-all duration-300" style={{ backgroundColor: rowBgColor }}>
                          {/* Vista de escritorio: Mostrar botones directamente */}
                          <div className="hidden md:flex justify-center space-x-2">
                            {renderActionIcons(survey.estado)}
                          </div>

                          {/* Vista móvil: Mostrar botón de despliegue o iconos de acción */}
                          <div className="flex md:hidden relative justify-center">
                            {expandedRow === index ? (
                              <motion.div
                                className="flex justify-center space-x-2"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              >
                                {renderActionIcons(survey.estado)}
                              </motion.div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedRow(expandedRow === index ? null : index);
                                }}
                                className={`p-2 rounded-full
                                ${survey.estado === 'Activa' ? 'bg-green-custom' :
                                    survey.estado === 'Próxima a Finalizar' ? 'bg-orange-custom' :
                                      survey.estado === 'Sin publicar' ? 'bg-celeste-custom' :
                                        survey.estado === 'Finalizada' ? 'bg-purple-custom' : 'bg-gray-500'}
                                text-white hover:bg-opacity-80 transition-all duration-300`}
                              >
                                <img src={DropdownIcon} alt="Desplegar acciones" className="h-2 sm:h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td colSpan="7" className="py-6 text-center text-gray-500 text-lg">
                      No se encontraron encuestas que coincidan con los criterios de búsqueda
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {filteredData.length > 0 && (
        <motion.div
          className="flex justify-center mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <nav className="flex items-center">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-custom text-white hover:bg-opacity-80 transition-all duration-300'}`}
            >
              &lt;
            </button>
            <div className="mx-4 flex space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Lógica para mostrar correctamente la paginación
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                  if (i === 4) pageToShow = totalPages;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                  if (i === 0) pageToShow = 1;
                } else {
                  pageToShow = currentPage - 2 + i;
                  if (i === 0) pageToShow = 1;
                  if (i === 4) pageToShow = totalPages;
                }

                return (
                  <button
                    key={pageToShow}
                    onClick={() => paginate(pageToShow)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentPage === pageToShow
                        ? 'bg-green-custom text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                  >
                    {pageToShow}
                  </button>
                );
              })}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-custom text-white hover:bg-opacity-80 transition-all duration-300'
                }`}
            >
              &gt;
            </button>
          </nav>
        </motion.div>
      )}

      {/* Botón de finalizar */}
      <motion.div
        className="flex justify-end mt-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button className="bg-green-custom text-white py-2 px-6 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-300">
          <span className="mr-2">✓</span> Finalizar
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardTable;