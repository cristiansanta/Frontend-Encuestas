import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import bannerImage from '../assets/img/CardImg.svg';
import Eyel from '../assets/img/EyeIconWhite.svg';
import Download from "../assets/img/downloadpdf.svg";
import Edit from "../assets/img/edit.svg";
import Calendar from '../assets/img/calendar.svg';
import Done from '../assets/img/done.svg';

const cardsData = [
  { name: "asd", estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { name: "asd", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { name: "asd", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { name: "asd", estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { name: "asd", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { name: "asd", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { name: "asd", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { name: "asd", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { name: "Solo por probar", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { name: "asd", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { name: "asd", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { name: "asd", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { name: "asd", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { name: "ve que si fun", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
];

// Mapear IDs de filtro a estados de tarjeta
const mapFilterToEstado = {
  'active': 'Activa',
  'ending': 'Próxima a Finalizar',
  'unpublished': 'Sin publicar',
  'finished': 'Finalizada',
  'all': '' // Filtro para mostrar todos
};

const DashboardCard = ({ searchTerm = '', stateFilter = 'all' }) => {
  // Obtener el estado de filtro correspondiente
  const estadoFilter = mapFilterToEstado[stateFilter] || '';

  // Filtrar tarjetas basado en el término de búsqueda y el filtro de estado
  const filteredCards = cardsData.filter(card => {
    // Primero aplicar filtro de estado si no es 'all'
    const passesStateFilter = stateFilter === 'all' || card.estado === estadoFilter;
    
    // Luego aplicar filtro de búsqueda si hay un término
    const passesSearchFilter = searchTerm === '' || 
      card.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.fechaInicio.includes(searchTerm) ||
      card.fechaFinal.includes(searchTerm);
    
    // La tarjeta debe pasar ambos filtros
    return passesStateFilter && passesSearchFilter;
  });

  // Configuración de animación para las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-12 w-full -mt-8">
      {filteredCards.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500 text-xl"
        >
          No se encontraron encuestas que coincidan con los criterios de búsqueda
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.name + index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout // Importante para animaciones de layout
                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between border border-gray-300"
              >
                <div className="flex items-center mb-4">
                  {/* Contenedor redondo con color dinámico */}
                  <div className={`h-10 w-10 flex items-center justify-center rounded-full ${getStatusColor(card.estado)}`}>
                    <img
                      src={bannerImage}
                      alt="icon"
                      className="h-6 w-6"
                    />
                  </div>
                  <h2 className="text-lg font-semibold ml-4">Encuesta {card.name.toString()}</h2>
                </div>
                <div className="space-y-2 flex-grow">
                  <p className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Estado de la encuesta:</span>
                    <span
                      className={`px-3 py-1 rounded-md border font-semibold ${getTextColor(card.estado)} ${getBorderColor(card.estado)}`}
                    >
                      {card.estado}
                    </span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="font-bold text-gray-700 mr-1">Inicio:</span>
                      <span>{card.fechaInicio}</span>
                    </span>
                    <span className="flex items-center">
                      <span className="font-bold text-gray-700 mr-1">Final:</span>
                      <span>{card.fechaFinal}</span>
                    </span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">{card.tipo}:</span>
                    <span>{card.total}</span>
                  </p>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {card.estado === "Finalizada" && (
                    <>
                      <button className="flex items-center px-4 py-2 bg-purple-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                        <img src={Eyel} alt="Ver" className="h-5 w-5 mr-2" />
                        Ver
                      </button>
                      <button className="flex items-center px-4 py-2 bg-purple-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                        <img src={Download} alt="Descargar" className="h-5 w-5 mr-2" />
                        Descargar reporte
                      </button>
                    </>
                  )}
                  {card.estado === "Activa" && (
                    <button className="flex items-center px-4 py-2 bg-green-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                      <img src={Eyel} alt="Ver Respuestas" className="h-5 w-5 mr-2" />
                      Ver Respuestas
                    </button>
                  )}
                  {card.estado === "Próxima a Finalizar" && (
                    <>
                      <button className="flex items-center px-4 py-2 bg-orange-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                        <img src={Eyel} alt="Ver" className="h-5 w-5 mr-2" />
                        Ver
                      </button>
                      <button className="flex items-center px-4 py-2 bg-orange-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                        <img src={Calendar} alt="Ampliar plazo" className="h-5 w-5 mr-2" />
                        Ampliar plazo
                      </button>
                    </>
                  )}
                  {card.estado === "Sin publicar" && (
                    <>
                      <button className="flex items-center px-4 py-2 bg-celeste-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                        <img src={Edit} alt="Editar" className="h-5 w-5 mr-2" />
                        Editar
                      </button>
                      <button className="flex items-center px-4 py-2 bg-celeste-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
                        <img src={Done} alt="Publicar" className="h-5 w-5 mr-2" />
                        Publicar
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Finalizada':
      return 'bg-purple-custom';
    case 'Activa':
      return 'bg-green-custom';
    case 'Próxima a Finalizar':
      return 'bg-orange-custom';
    case 'Sin publicar':
      return 'bg-celeste-custom';
    default:
      return 'bg-gray-500';
  }
};

const getTextColor = (status) => {
  switch (status) {
    case 'Finalizada':
      return 'text-purple-custom';
    case 'Activa':
      return 'text-green-custom';
    case 'Próxima a Finalizar':
      return 'text-orange-custom';
    case 'Sin publicar':
      return 'text-celeste-custom';
    default:
      return 'text-gray-500';
  }
};

const getBorderColor = (status) => {
  switch (status) {
    case 'Finalizada':
      return 'border-purple-custom';
    case 'Activa':
      return 'border-green-custom';
    case 'Próxima a Finalizar':
      return 'border-orange-custom';
    case 'Sin publicar':
      return 'border-celeste-custom';
    default:
      return 'border-gray-500';
  }
};

export default DashboardCard;