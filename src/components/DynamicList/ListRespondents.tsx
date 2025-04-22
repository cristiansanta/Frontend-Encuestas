import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Importar iconos
import zoomIcon from '../../assets/img/zoom.svg';
import voiceIcon from '../../assets/img/zoom.svg';
import archivoIcon from '../../assets/img/zoom.svg';
import verIcon from '../../assets/img/zoom.svg';

const ListRespondents = () => {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Datos de encuestados
  const [respondents, setRespondents] = useState([
    { 
      id: 1, 
      nombre: 'Juan Carlos Rodríguez Gómez', 
      correo: 'jr.rodriguezgomez@gmail.com', 
      fechaRespuesta: '10/03/2025' 
    },
    {
      id: 2, 
      nombre: 'Luis Fernando Martínez López', 
      correo: 'lf.martinezlopez@gmail.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 3, 
      nombre: 'María Camila González Rojas', 
      correo: 'mcamila.gonzalezr@gmail.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 4, 
      nombre: 'Carlos Andrés Ramírez Castro', 
      correo: 'carlos.ramirezcastro@correo.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 5, 
      nombre: 'Ana Sofía Herrera Muñoz', 
      correo: 'asofia.herreram@gmail.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 6, 
      nombre: 'Javier Alejandro Torres Pineda', 
      correo: 'jatorres.pineda@email.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 7, 
      nombre: 'Paula Andrea Gutiérrez Vargas', 
      correo: 'paula.gutierrezvargas@mail.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 8, 
      nombre: 'José Manuel Mendoza Silva', 
      correo: 'jm.mendozasilva@correo.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 9, 
      nombre: 'Diana Carolina Sánchez Ortega', 
      correo: 'dc.sanchezortega@email.com', 
      fechaRespuesta: '10/03/2025' 
    },
    { 
      id: 10, 
      nombre: 'Felipe Antonio Pérez Suárez', 
      correo: 'faperez.suarez@mail.com', 
      fechaRespuesta: '10/03/2025' 
    }
  ]);

  // Reconocimiento de voz
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(row => row !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  // Filtrado de encuestados según término de búsqueda
  const filteredRespondents = respondents.filter(respondent => {
    return (
      respondent.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      respondent.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRespondents.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Animaciones para las filas de la tabla
  const tableRowVariants = {
    hidden: (i) => ({
      opacity: 0,
      y: -5,
      transition: {
        delay: i * 0.05
      }
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05
      }
    }),
    exit: {
      opacity: 0,
      y: 5
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-4 sm:mb-0">Lista de encuestados</h1>
        
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
                className={`h-6 ${isListening ? 'filter hue-rotate-90' : ''}`} 
              />
              {isListening && (
                <span className="absolute h-2 w-2 rounded-full bg-red-500 top-0 right-0"></span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Tabla de encuestados */}
      <div className="overflow-hidden w-full">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-auto border-collapse min-w-max rounded-xl overflow-hidden">
            <thead className="bg-blue-900 text-white rounded-t-xl">
              <tr>
                <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Nombre</th>
                <th className="py-3 px-4 text-left font-medium border-r border-blue-800">Correo</th>
                <th className="py-3 px-4 text-center font-medium border-r border-blue-800">Fecha de respuesta</th>
                <th className="py-3 px-4 text-center font-medium">Acciones</th>
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
                        className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                        custom={index}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <td className="py-3 px-4 border-r">{DOMPurify.sanitize(respondent.nombre)}</td>
                        <td className="py-3 px-4 border-r">{DOMPurify.sanitize(respondent.correo)}</td>
                        <td className="py-3 px-4 border-r text-center">{DOMPurify.sanitize(respondent.fechaRespuesta)}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                              <img src={verIcon} alt="Ver" className="h-4 mr-1" />
                              <span>Ver respuestas</span>
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                              <img src={archivoIcon} alt="Archivar" className="h-4 mr-1" />
                              <span>Archivar</span>
                            </button>
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
                    <td colSpan={4} className="py-6 text-center text-gray-500 text-lg">
                      No se encontraron encuestados que coincidan con los criterios de búsqueda
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {filteredRespondents.length > itemsPerPage && (
        <div className="mt-4 flex justify-center">
          <nav className="flex items-center">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 mr-2"
            >
              Anterior
            </button>
            {Array.from({ length: Math.ceil(filteredRespondents.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md mx-1 ${
                  currentPage === index + 1 ? 'bg-blue-900 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => 
                paginate(currentPage < Math.ceil(filteredRespondents.length / itemsPerPage) 
                  ? currentPage + 1 
                  : Math.ceil(filteredRespondents.length / itemsPerPage)
                )
              }
              disabled={currentPage === Math.ceil(filteredRespondents.length / itemsPerPage)}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 ml-2"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ListRespondents;