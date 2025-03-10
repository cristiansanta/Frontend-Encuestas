// RoleSelectionSection.jsx

import React, { useState } from 'react';

function RoleSelectionSection() {
  const [search, setSearch] = useState("");

  // Datos de ejemplo para los roles
  const roleData = [
    { id: 1, code: "R001", name: "Rol de ejemplo 1" },
    { id: 2, code: "R002", name: "Rol de ejemplo 2" },
    { id: 3, code: "R003", name: "Rol de ejemplo 3" },
    { id: 4, code: "R004", name: "Rol de ejemplo 4" },
    { id: 5, code: "R005", name: "Rol de ejemplo 5" },
    { id: 6, code: "R006", name: "Rol de ejemplo 6" },
    // Agrega más roles si es necesario
  ];

  // Filtrar roles en función del término de búsqueda
  const filteredRoles = roleData.filter(
    (role) =>
      role.code.toLowerCase().includes(search.toLowerCase()) ||
      role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-100">
      {/* Contenedor fijo para el título y la barra de búsqueda */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#00324D]">1. Selección de roles</h3>
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
      
      {/* Tabla con esquinas redondeadas y contenido centrado */}
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#00324D] text-white text-left">
            <th className="px-4 py-2 text-center">Seleccioanr</th>
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">Código</th>
            <th className="px-4 py-2 text-center">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role, index) => (
            <tr
              key={role.id}
              className={`${
                index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"
              } text-center`}
            >
              <td className="px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="px-4 py-2">{role.id}</td>
              <td className="px-4 py-2">{role.code}</td>
              <td className="px-4 py-2">{role.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoleSelectionSection;
