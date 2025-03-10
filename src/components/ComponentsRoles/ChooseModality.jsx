// ModalidadSection.jsx

import React, { useState } from 'react';

function ChooseModality() {
  const [search, setSearch] = useState("");

  // Datos de ejemplo para las modalidades
  const modalidadData = [
    { id: 1, title: "Modalidad 1", name: "Nombre Modalidad 1" },
    { id: 2, title: "Modalidad 2", name: "Nombre Modalidad 2" },
    { id: 3, title: "Modalidad 3", name: "Nombre Modalidad 3" },
    { id: 4, title: "Modalidad 4", name: "Nombre Modalidad 4" },
    { id: 5, title: "Modalidad 5", name: "Nombre Modalidad 5" },
    { id: 6, title: "Modalidad 6", name: "Nombre Modalidad 6" },
    // Agrega más datos si es necesario
  ];

  // Filtrar modalidades en función del término de búsqueda
  const filteredModalidad = modalidadData.filter(
    (modality) =>
      modality.title.toLowerCase().includes(search.toLowerCase()) ||
      modality.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-4 p-4">
      {/* Contenedor fijo para el título y la barra de búsqueda */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#00324D]">Título de sección</h3>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="PALABRA CLAVE"
            className="border border-[#00324D] rounded px-3 py-1 text-sm outline-none text-[#00324D] placeholder-[#00324D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="text-green-600 font-bold text-lg ml-2">🔍</button>
        </div>
      </div>
      {/* Tabla con datos filtrados */}
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-[#00324D] text-white text-left">
            <th className="px-4 py-2">Seleccionar</th>
            <th className="px-4 py-2">Título de sección</th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {filteredModalidad.map((modality, index) => (
            <tr key={modality.id} className={index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"}>
              <td className="px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="px-4 py-2">{modality.title}</td>
              <td className="px-4 py-2">{modality.id}</td>
              <td className="px-4 py-2">{modality.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChooseModality;
