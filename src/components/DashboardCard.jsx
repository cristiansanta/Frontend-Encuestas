import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import bannerImage from '../assets/img/CardImg.svg';
import Eyel from '../assets/img/EyeIconWhite.svg';
import Download from "../assets/img/downloadpdf.svg";
import Edit from "../assets/img/edit.svg";
import Calendar from '../assets/img/calendar.svg';
import Done from '../assets/img/done.svg';

const cardsData = [
  { id: 1, name: "Perfil Personal", estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 2, name: "Satisfacción Laboral", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 3, name: "Clima Organizacional", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 4, name: "Evaluación de Desempeño", estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 5, name: "Bienestar Corporativo", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 6, name: "Formación y Desarrollo", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 7, name: "Comunicación Interna", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 8, name: "Liderazgo", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 9, name: "Salud Ocupacional", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 10, name: "Calidad de Vida", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 11, name: "Compensación", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 12, name: "Innovación", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 13, name: "Tecnología", estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 14, name: "Cultura Corporativa", estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
];

// Mapear IDs de filtro a estados de tarjeta
const mapFilterToEstado = {
  'active': 'Activa',
  'ending': 'Próxima a Finalizar',
  'unpublished': 'Sin publicar',
  'finished': 'Finalizada',
  'all': '' // Filtro para mostrar todos
};

const DashboardCard = ({ searchTerm = '', stateFilter = 'all', onNavigateToDetails }) => {
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
  
  // Función para preparar los datos de la encuesta para la navegación
  const prepareNavigationData = (card) => {
    return {
      id: card.id,
      title: `Encuesta ${card.name}`,
      estado: card.estado,
      fechaInicio: card.fechaInicio,
      fechaFinal: card.fechaFinal,
      description: "Descripción detallada de la encuesta, incluyendo su propósito, estructura y los temas que aborda, con el fin de brindar una comprensión clara antes de su realización.",
      sections: [
        { id: 1, name: "Información Personal" },
        { id: 2, name: "Experiencia Laboral" },
        { id: 3, name: "Valoración" }
      ]
    };
  };

  // Verificar que onNavigateToDetails es una función para evitar errores
  const handleNavigation = (card) => {
    if (typeof onNavigateToDetails === 'function') {
      const data = prepareNavigationData(card);
      console.log('Navegando a detalles con los datos:', data);
      onNavigateToDetails(data);
    } else {
      console.error('onNavigateToDetails no es una función válida');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 lg:p-12 w-full">
      {filteredCards.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500 text-lg sm:text-xl"
        >
          No se encontraron encuestas que coincidan con los criterios de búsqueda
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.name + index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col justify-between border border-gray-100"
              >
                {/* Card Header */}
                <div className="flex items-center mb-4 sm:mb-5">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full ${getStatusColor(card.estado)}`}>
                    <img
                      src={bannerImage}
                      alt="icon"
                      className="h-6 w-6 sm:h-7 sm:w-7"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-base sm:text-xl font-bold text-blue-900">Encuesta</h2>
                    <h3 className="text-base sm:text-xl font-bold text-blue-900">{card.name}</h3>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="space-y-3 sm:space-y-4 flex-grow">
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-gray-700 text-sm sm:text-base">Estado de la Encuesta:</span>
                    <span
                      className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md border font-medium text-sm sm:text-base ${getTextColor(card.estado)} ${getBorderColor(card.estado)}`}
                    >
                      {card.estado}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm sm:text-base">
                      <span className="text-gray-700">Inicio: </span>
                      <span className="font-semibold">{card.fechaInicio}</span>
                    </div>
                    <div className="text-sm sm:text-base">
                      <span className="text-gray-700">Final: </span>
                      <span className="font-semibold">{card.fechaFinal}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-700">{card.tipo}:</span>
                    <span className="font-semibold">{card.total}</span>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="mt-4 sm:mt-5">
                  {card.estado === "Finalizada" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        className="flex items-center justify-center w-full px-4 py-3 bg-purple-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90"
                        onClick={() => handleNavigation(card)}
                      >
                        <img src={Eyel} alt="Ver" className="h-5 w-5 mr-2" />
                        Ver
                      </button>
                      <button className="flex items-center justify-center w-full px-4 py-3 bg-purple-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90">
                        <img src={Download} alt="Descargar" className="h-5 w-5 mr-2" />
                        Descargar reporte
                      </button>
                    </div>
                  )}
                  {card.estado === "Activa" && (
                    <button 
                      className="flex items-center justify-center w-full px-4 py-3 bg-green-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90"
                      onClick={() => handleNavigation(card)}
                    >
                      <img src={Eyel} alt="Ver Respuestas" className="h-5 w-5 mr-2" />
                      Ver Respuestas
                    </button>
                  )}
                  {card.estado === "Próxima a Finalizar" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        className="flex items-center justify-center w-full px-4 py-3 bg-orange-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90"
                        onClick={() => handleNavigation(card)}
                      >
                        <img src={Eyel} alt="Ver" className="h-5 w-5 mr-2" />
                        Ver
                      </button>
                      <button className="flex items-center justify-center w-full px-4 py-3 bg-orange-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90">
                        <img src={Calendar} alt="Ampliar plazo" className="h-5 w-5 mr-2" />
                        Ampliar plazo
                      </button>
                    </div>
                  )}
                  {card.estado === "Sin publicar" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        className="flex items-center justify-center w-full px-4 py-3 bg-celeste-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90"
                        onClick={() => handleNavigation(card)}
                      >
                        <img src={Edit} alt="Editar" className="h-5 w-5 mr-2" />
                        Editar
                      </button>
                      <button className="flex items-center justify-center w-full px-4 py-3 bg-celeste-custom text-white text-sm font-medium rounded-full transition-all duration-300 hover:bg-opacity-90">
                        <img src={Done} alt="Publicar" className="h-5 w-5 mr-2" />
                        Publicar
                      </button>
                    </div>
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