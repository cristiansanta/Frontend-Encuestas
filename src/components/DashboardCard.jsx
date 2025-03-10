import React from "react";
import bannerImage from '../assets/img/CardImg.png';

const cardsData = [
  { id: 1, estado: "Publicado", fecha: "Inactiva", totales: "31852067" },
  { id: 2, estado: "Publicado", fecha: "Inactiva", totales: "31852068" },
  { id: 3, estado: "Publicado", fecha: "Inactiva", totales: "31852069" },
  { id: 4, estado: "Publicado", fecha: "Inactiva", totales: "31852070" },
  { id: 5, estado: "Publicado", fecha: "Inactiva", totales: "31852071" },
  { id: 6, estado: "Publicado", fecha: "Inactiva", totales: "31852072" },
];

const DashboardCard = () => {
  return (
    <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto mb-10 mt- ">
      {/* Ajustamos el grid para que ocupe todo el espacio */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="bg-gray-100 p-4 rounded-lg"
            style={{ backgroundColor: '#D3D3D3', width: '100%', height: '270px' }} // Ajustado para expandirse completamente
          >
            <div className="flex items-center mb-2">
              <img
                src={bannerImage}
                alt="icon"
                className="h-12 w-12 mr-2"
              />
              <h2 className="text-xl font-bold" style={{ color: '#39A900' }}>
                Asignaciones
              </h2>
            </div>
            <div className="ml-4 space-y-2 mb-5">
              <p className="flex items-center">
                <span className="font-bold text-[#00324D] w-1/3">Estado:</span> {/* Ajustar el ancho */}
                <span
                  className="text-white rounded-md px-3 py-1 w-2/3 text-center"
                  style={{ backgroundColor: '#39A900' }}
                >
                  {card.estado}
                </span>
              </p>
              <p className="flex items-center">
                <span className="font-bold text-[#00324D] w-1/3">Fecha:</span> {/* Ajustar el ancho */}
                <span
                  className="text-white rounded-md px-3 py-1 w-2/3 text-center"
                  style={{ backgroundColor: '#878787' }}
                >
                  {card.fecha}
                </span>
              </p>
              <p className="flex items-center">
                <span className="font-bold text-[#00324D] w-1/3">Totales:</span> {/* Ajustar el ancho */}
                <span
                  className="text-white rounded-md px-3 py-1 w-2/3 text-center"
                  style={{ backgroundColor: '#00324D' }}
                >
                  {card.totales}
                </span>
              </p>
            </div>
            <button
              className="text-white w-full py-2 rounded-lg font-bold"
              style={{ backgroundColor: '#39A900' }}
            >
              Ingresar
            </button>
          </div>
        ))}
      </div>
      {/* Botón "Ver más" */}
      <div className="flex justify-end mt-4">
        <button
          className="text-white px-4 py-2 rounded-lg"
          style={{ backgroundColor: '#39A900' }}
        >
          Ver más
        </button>
      </div>
    </div>

  );
};

export default DashboardCard;
