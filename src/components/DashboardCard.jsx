import React from "react";
import bannerImage from '../assets/img/CardImg.svg';
import Eyel from '../assets/img/EyeIconWhite.svg';
import Download from "../assets/img/downloadpdf.svg";
import Edit from "../assets/img/edit.svg";
import Calendar from '../assets/img/calendar.svg';
import Done from '../assets/img/done.svg';

const cardsData = [
  { id: 1, estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 2, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 3, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 4, estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 5, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 6, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 7, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 8, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 9, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 10, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 11, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 12, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 13, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 14, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
];

const DashboardCard = () => {
  return (
    <div className="mt-6 w-full mx-auto mb-10">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cardsData.map((card) => (
          <div
            key={card.id}
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
              <h2 className="text-lg font-semibold ml-4">Encuesta #{card.id.toString().padStart(8, '0')}</h2>
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
                <button className="flex items-center px-4 py-2 bg-gren-custom text-white rounded-full transition-all duration-300 hover:bg-opacity-80 hover:scale-105">
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
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Finalizada':
      return 'bg-purple-custom';
    case 'Activa':
      return 'bg-gren-custom';
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
      return 'text-gren-custom';
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
      return 'border-gren-custom';
    case 'Próxima a Finalizar':
      return 'border-orange-custom';
    case 'Sin publicar':
      return 'border-celeste-custom';
    default:
      return 'border-gray-500';
  }
};

export default DashboardCard;
