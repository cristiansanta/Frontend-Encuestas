import React from "react";
import bannerImage from '../assets/img/CardImg.svg';

const cardsData = [
  { id: 1, estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 2, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 3, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 4, estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 5, estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 6, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 7, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 8, estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 9, estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 10, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 11, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 12, estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 13, estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 14, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
  { id: 15, estado: "Próxima a Finalizar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 16, estado: "Sin publicar", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Respuestas actuales" },
  { id: 17, estado: "Finalizada", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Encuestas contestadas" },
  { id: 18, estado: "Activa", fechaInicio: "02/10/25", fechaFinal: "04/12/25", total: "33'333.333", tipo: "Total respuestas" },
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
              <img
                src={bannerImage}
                alt="icon"
                className="h-10 w-10 mr-2"
              />
              <h2 className="text-lg font-semibold">Encuesta #{card.id.toString().padStart(8, '0')}</h2>
            </div>
            <div className="space-y-2 flex-grow">
              <p className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Estado de la encuesta:</span>
                <span className={`px-3 py-1 rounded-md text-white ${getStatusColor(card.estado)}`}>
                  {card.estado}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Inicio:</span>
                <span>{card.fechaInicio}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Final:</span>
                <span>{card.fechaFinal}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-bold text-gray-700">{card.tipo}:</span>
                <span>{card.total}</span>
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              {card.estado === "Finalizada" && (
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">Ver Respuestas</button>
              )}
              {card.estado === "Activa" && (
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Ver Respuestas</button>
              )}
              {card.estado === "Próxima a Finalizar" && (
                <>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Ver</button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">Ampliar plazo</button>
                </>
              )}
              {card.estado === "Sin publicar" && (
                <>
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-lg">Editar</button>
                  <button className="px-4 py-2 bg-teal-700 text-white rounded-lg">Publicar</button>
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
      return 'bg-purple-500';
    case 'Activa':
      return 'bg-green-500';
    case 'Próxima a Finalizar':
      return 'bg-yellow-500';
    case 'Sin publicar':
      return 'bg-teal-500';
    default:
      return 'bg-gray-500';
  }
};

export default DashboardCard;
