import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Importar iconos
import zoomIcon from '../../assets/img/zoom.svg';
import voiceIcon from '../../assets/img/voice.svg';
import archiveIcon from '../../assets/img/archive.svg';
import verIcon from '../../assets/img/EyeIconWhite.svg';
import CardSurvey from '../../assets/img/CardImg.svg';
import Tool from '../../assets/img/tool.svg';
import DropdownIcon from '../../assets/img/tabledeploy.svg';

// Componente de lista de encuestados con filtrado por estado
const ListRespondents = ({ filterByState, listView = false }) => {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de encuestados con estado añadido
  const [respondents, setRespondents] = useState([
    {
      id: 1,
      nombre: 'Juan Carlos Rodríguez Gómez',
      correo: 'jr.rodriguezgomez@gmail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Finalizada'
    },
    {
      id: 2,
      nombre: 'Luis Fernando Martínez López',
      correo: 'lf.martinezlopez@gmail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Activa'
    },
    {
      id: 3,
      nombre: 'María Camila González Rojas',
      correo: 'mcamila.gonzalezr@gmail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Próxima a Finalizar'
    },
    {
      id: 4,
      nombre: 'Carlos Andrés Ramírez Castro',
      correo: 'carlos.ramirezcastro@correo.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Sin publicar'
    },
    {
      id: 5,
      nombre: 'Ana Sofía Herrera Muñoz',
      correo: 'asofia.herreram@gmail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Finalizada'
    },
    {
      id: 6,
      nombre: 'Javier Alejandro Torres Pineda',
      correo: 'jatorres.pineda@email.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Activa'
    },
    {
      id: 7,
      nombre: 'Paula Andrea Gutiérrez Vargas',
      correo: 'paula.gutierrezvargas@mail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Próxima a Finalizar'
    },
    {
      id: 8,
      nombre: 'José Manuel Mendoza Silva',
      correo: 'jm.mendozasilva@correo.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Finalizada'
    },
    {
      id: 9,
      nombre: 'Diana Carolina Sánchez Ortega',
      correo: 'dc.sanchezortega@email.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Activa'
    },
    {
      id: 10,
      nombre: 'Felipe Antonio Pérez Suárez',
      correo: 'faperez.suarez@mail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Sin publicar'
    },
    {
      id: 11,
      nombre: 'Saurio Darwin',
      correo: 'faperez.suarez@mail.com',
      fechaRespuesta: '10/03/2025',
      estado: 'Finalizada'
    }
  ]);

  // Reconocimiento de voz
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Efecto para simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Efecto para actualizar el término de búsqueda cuando cambia el transcript
  useEffect(() => {
    if (transcript && listening) {
      setSearchTerm(transcript);
    }
  }, [transcript, listening]);

  // Efecto para actualizar el estado de escucha
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Restablecer la página actual cuando cambia el filtro o término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByState, searchTerm]);

  // Función para manejar el inicio/fin del reconocimiento de voz
  const handleVoiceSearch = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'es-ES' });
    }
  };

  // Función para manejar la selección de filas
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

  // Obtener color de botones según el estado
  const getButtonColor = (estado) => {
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

  // Filtrado de encuestados según término de búsqueda y estado de la encuesta
  const filteredRespondents = respondents.filter(respondent => {
    // Primero filtramos por el estado de la encuesta si está especificado
    if (filterByState && respondent.estado !== filterByState) {
      return false;
    }
    
    // Luego aplicamos el filtro de búsqueda
    return (
      respondent.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      respondent.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      respondent.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredRespondents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRespondents.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Animaciones para las filas de la tabla
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
          className="w-16 h-16 border-4 border- border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Mensaje cuando no hay encuestados que coincidan con el filtro
  const renderNoResultsMessage = () => {
    let message = 'No se encontraron encuestados';
    
    if (filterByState) {
      message += ` con estado "${filterByState}"`;
    }
    
    if (searchTerm) {
      message += ` que coincidan con la búsqueda "${searchTerm}"`;
    }
    
    return message;
  };

  return (
    <motion.div
      className="w-full bg-white p-6 rounded-lg shadow-sm"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-custom mb-4 sm:mb-0">Lista de encuestados</h1>
          {filterByState && (
            <span className={`ml-4 inline-block ${getEstadoClasses(filterByState)}`}>
              Filtrado por: {filterByState}
            </span>
          )}
        </div>

        {/* Barra de Búsqueda con reconocimiento de voz */}
        <div className="relative flex items-center w-full sm:w-64 lg:w-80">
          {/* Ícono de búsqueda */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img src={zoomIcon} alt="Buscar" className="h-4 sm:h-5" />
          </span>

          {/* Input */}
          <input
            type="text"
            placeholder="Buscar"
            className="border border-gray-300 rounded-full py-2 pl-10 pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Ícono de voz con estado de escucha */}
          <button
            onClick={handleVoiceSearch}
            disabled={!browserSupportsSpeechRecognition}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isListening ? 'animate-pulse' : ''}`}
          >
            <span className={`flex items-center justify-center ${isListening ? 'text-red-500' : ''}`}>
              <img
                src={voiceIcon}
                alt="Voz"
                className={`h-8 ${isListening ? 'filter hue-rotate-90' : ''}`}
              />
              {isListening && (
                <span className="absolute h-2 w-2 rounded-full bg-red-500 top-0 right-0"></span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Tabla de encuestados con scroll horizontal */}
      <div className="overflow-hidden w-full">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-auto border-collapse min-w-max rounded-xl overflow-hidden">
            <thead className="bg-blue-custom text-white rounded-t-xl">
              <tr>
                {/* Checkbox column - sticky left */}
                <th className="py-3 px-2 text-center font-medium border-r border-blue-800 w-12 sticky left-0 bg-blue-custom z-10 first:rounded-tl-xl">
                  <div className="flex items-center justify-center">
                    <img src={CardSurvey} alt="Imagen encuesta" className="w-6 h-6" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-64">Nombre</th>
                <th className="py-3 px-4 text-left font-medium border-r border-blue-800 w-64">Correo</th>
                <th className="py-3 px-4 text-center font-medium border-r border-blue-800 w-40">Estado</th>
                <th className="py-3 px-4 text-center font-medium border-r border-blue-800 w-48">Fecha de respuesta</th>
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
                  currentItems.map((respondent, index) => {
                    const rowBgColor = index % 2 === 0 ? 'white' : '#f9fafb';
                    return (
                      <motion.tr
                        key={index}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 cursor-pointer`}
                        custom={index}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {/* Celda con checkbox e indicador de estado - sticky left */}
                        <td className="border-r py-3 px-2 relative sticky left-0 z-10" style={{ backgroundColor: rowBgColor }}>
                          {/* Barra vertical de color según estado */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getIndicatorColor(respondent.estado)}`}></div>

                          {/* Checkbox con padding a la izquierda para compensar el indicador */}
                          <div className="flex items-center justify-center pl-6">
                            <div
                              className={`w-5 h-5 border border-gray-300 rounded cursor-pointer flex items-center justify-center transition-colors ${selectedRows.includes(index) ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar que el clic se propague a la fila
                                handleRowSelect(index);
                              }}
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
                        <td className="py-3 px-4 border-r truncate">{DOMPurify.sanitize(respondent.nombre)}</td>
                        <td className="py-3 px-4 border-r truncate">{DOMPurify.sanitize(respondent.correo)}</td>
                        <td className="py-3 px-4 border-r text-center">
                          <span className={`inline-block ${getEstadoClasses(respondent.estado)}`}>
                            {DOMPurify.sanitize(respondent.estado)}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-r text-center">{DOMPurify.sanitize(respondent.fechaRespuesta)}</td>

                        {/* Celda de acciones - sticky right */}
                        <td 
                          className="py-3 px-4 text-center sticky right-0 z-10 transition-all duration-300" 
                          style={{ backgroundColor: rowBgColor }}
                          onClick={(e) => e.stopPropagation()} // Evitar que el clic en esta celda navegue a detalles
                        >
                          {/* Vista de escritorio: Mostrar botones directamente */}
                          <div className="hidden md:flex justify-center space-x-2">
                            <button className={`${getButtonColor(respondent.estado)} hover:bg-opacity-80 text-white px-3 py-1 rounded-full text-sm flex items-center transition-all duration-300`}>
                              <img src={verIcon} alt="Ver" className="h-4 mr-1" />
                              <span>Ver respuestas</span>
                            </button>
                            <button className={`${getButtonColor(respondent.estado)} hover:bg-opacity-80 text-white px-3 py-1 rounded-full text-sm flex items-center transition-all duration-300`}>
                              <img src={archiveIcon} alt="Archivar" className="h-4 mr-1" />
                              <span>Archivar</span>
                            </button>
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
                                <button className={`${getButtonColor(respondent.estado)} hover:bg-opacity-80 text-white px-3 py-1 rounded-full text-sm flex items-center transition-all duration-300`}>
                                  <img src={verIcon} alt="Ver" className="h-4 mr-1" />
                                  <span>Ver</span>
                                </button>
                                <button className={`${getButtonColor(respondent.estado)} hover:bg-opacity-80 text-white px-3 py-1 rounded-full text-sm flex items-center transition-all duration-300`}>
                                  <img src={archiveIcon} alt="Archivar" className="h-4 mr-1" />
                                  <span>Archivar</span>
                                </button>
                              </motion.div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedRow(expandedRow === index ? null : index);
                                }}
                                className={`p-2 rounded-full ${getButtonColor(respondent.estado)} text-white hover:bg-opacity-80 transition-all duration-300`}
                              >
                                <img src={DropdownIcon} alt="Desplegar acciones" className="h-2 sm:h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td colSpan={6} className="py-6 text-center text-gray-500 text-lg">
                      {renderNoResultsMessage()}
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>

      {/* Paginación mejorada */}
      {filteredRespondents.length > 0 && (
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
    </motion.div>
  );
};

export default ListRespondents;