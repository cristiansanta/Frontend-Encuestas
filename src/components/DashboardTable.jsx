import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import apiRequest from '../Provider/apiHelper.jsx';

import ShareIcon from '../assets/img/shareicon.svg';
import ViewIcon from '../assets/img/viewicon.svg';
import EditIcon from '../assets/img/editicon.svg';
import DeleteIcon from '../assets/img/deleteicon.svg';
import Tool from '../assets/img/tool.svg';
import CardSurvey from '../assets/img/CardImg.svg';

const surveyData = [
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Encuestas para Administrativos', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Solo Funciona', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Finalizada', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Ve que no', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'no se si', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Por Finalizar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Activa', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
  { id: 136, title: 'Prueba', estado: 'Sin publicar', creador: 'Usuario Administrador', categoria: 'Salud y Bienestar', fechaCreacion: '10/03/2025', asignaciones: 0 },
];

const DashboardTable = ({ searchTerm = '', stateFilter = 'all' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar animación de carga
  const navigate = useNavigate();

  // Efecto para simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simular tiempo de carga

    return () => clearTimeout(timer);
  }, []);

  // Mapear IDs de filtro a estados de encuesta
  const mapFilterToEstado = {
    'active': 'Activa',
    'ending': 'Por Finalizar',
    'unpublished': 'Sin publicar',
    'finished': 'Finalizada',
    'all': '' // Filtro para mostrar todos
  };

  // Obtener el estado de filtro correspondiente
  const estadoFilter = mapFilterToEstado[stateFilter] || '';

  // Filtrar datos según búsqueda y filtro seleccionado
  const filteredData = surveyData.filter(survey => {
    // Filtrar por estado si no es 'all'
    const passesStateFilter = stateFilter === 'all' || survey.estado === estadoFilter;

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
      case 'Activa':
        return 'text-green-custom';
      case 'Por Finalizar':
        return 'text-orange-custom';
      case 'Sin publicar':
        return 'text-celeste-custom';
      case 'Finalizada':
        return 'text-purple-custom';
      default:
        return 'text-gray-500';
    }
  };

  // Obtener color de fondo para el indicador de estado
  const getIndicatorColor = (estado) => {
    switch (estado) {
      case 'Activa':
        return 'bg-green-custom';
      case 'Por Finalizar':
        return 'bg-orange-custom';
      case 'Sin publicar':
        return 'bg-celeste-custom';
      case 'Finalizada':
        return 'bg-purple-custom';
      default:
        return 'bg-gray-500';
    }
  };

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

  // Funciones para la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Configuración de animación para las filas de la tabla
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Retraso escalonado basado en el índice
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
      className="mt-0 w-full"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      {/* Tabla de encuestas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-custom text-white">
            <tr>
              {/* Columna para el checkbox */}
              <th className="py-3 px-2 text-center font-medium border-r border-blue-800 w-12">
                <div className="flex items-center justify-center">
                  <img src={Tool} alt="Herramienta" className="w-6 h-6" />
                </div>
              </th>
              <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-3/12">Título de la Encuesta</th>
              <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-1/12">Estado</th>
              <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-2/12">Creador</th>
              <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-2/12">Categoría</th>
              <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-1/12">Fecha de Creación</th>
              <th className="py-3 px-4 text-center font-medium border-r border-blue-800 w-1/12">Nº de Asignaciones</th>
              <th className="py-3 px-4 text-center font-medium w-2/12">
                <div className="flex items-center justify-center">
                  <img src={CardSurvey} alt="Imagen encuesta" className="w-6 h-6 mr-2" />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <AnimatePresence>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((survey, index) => (
                  <motion.tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Celda con checkbox e indicador de estado */}
                    <td className="border-r py-3 px-2 relative">
                      {/* Barra vertical de color según estado - ahora más ancha y a la izquierda */}
                      <div className={`absolute left-0 top-0 bottom-0 w-4 ${getIndicatorColor(survey.estado)}`}></div>

                      {/* Checkbox con padding a la izquierda para compensar el indicador */}
                      <div className="flex items-center justify-center pl-6">
                        <div
                          className={`w-5 h-5 border border-gray-300 rounded cursor-pointer flex items-center justify-center ${selectedRows.includes(index) ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}
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
                    <td className="py-3 px-4 border-r truncate">{survey.title}</td>
                    <td className={`py-3 px-4 border-r font-medium ${getEstadoClasses(survey.estado)}`}>
                      {survey.estado}
                    </td>
                    <td className="py-3 px-4 border-r truncate">{survey.creador}</td>
                    <td className="py-3 px-4 border-r truncate">{survey.categoria}</td>
                    <td className="py-3 px-4 border-r">{survey.fechaCreacion}</td>
                    <td className="py-3 px-4 border-r text-center">{survey.asignaciones}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button className="p-2 bg-purple-custom rounded-full text-white hover:bg-opacity-80">
                          <img src={ShareIcon} alt="Compartir" className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-green-custom rounded-full text-white hover:bg-opacity-80">
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
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td colSpan="8" className="py-6 text-center text-gray-500 text-lg">
                    No se encontraron encuestas que coincidan con los criterios de búsqueda
                  </td>
                </motion.tr>
              )}
            </tbody>
          </AnimatePresence>
        </table>
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
              className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              &lt;
            </button>
            <div className="mx-4 flex space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first page, last page, current page, and pages around current
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === pageToShow
                        ? 'bg-green-500 text-white'
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
              className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
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
        <button className="bg-green-500 text-white py-2 px-6 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
          <span className="mr-2">✓</span> Finalizar
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardTable;