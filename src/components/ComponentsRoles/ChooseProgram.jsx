// ProgramSelection.jsx

import React, { useState } from 'react';
import DOMPurify from 'dompurify'; // Importar DOMPurify

function ProgramSelection() {
  const [search, setSearch] = useState("");

  // Datos de ejemplo para los programas
  const programsData = [
    { id: 1, code: "12345", name: "Programación Básica" },
    { id: 2, code: "67890", name: "Desarrollo Web" },
    { id: 3, code: "11223", name: "Ciencia de Datos" },
    { id: 4, code: "44556", name: "Inteligencia Artificial" },
    { id: 5, code: "77889", name: "Ciberseguridad" },
    // Agrega más datos si es necesario
  ];

  // Filtrar los programas en función del término de búsqueda
  const filteredPrograms = programsData.filter(
    (program) =>
      program.name.toLowerCase().includes(search.toLowerCase()) ||
      program.code.toString().includes(search)
  );

  return (
    <div className="mt-4">
      {/* Contenedor fijo para el título y la barra de búsqueda */}
      <div className="flex justify-between items-center sticky top-0 bg-white p-4 z-10 shadow-sm">
        <h3 className="font-semibold text-[#00324D]">Programa de formación</h3>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar en la tabla"
            className="border border-[#00324D] rounded px-3 py-1 text-sm outline-none text-[#00324D] placeholder-[#00324D]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="text-green-600 font-bold text-lg ml-2">🔍</button>
        </div>
      </div>
      {/* Tabla con datos filtrados */}
      <table className="w-full mt-4 border-t">
        <thead>
          <tr className="text-left text-[#00324D] font-medium">
            <th className="px-2 py-1"></th>
            <th className="px-2 py-1">ID</th>
            <th className="px-2 py-1">Código</th>
            <th className="px-2 py-1">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrograms.map((program) => (
            <tr key={program.id}>
              <td className="px-2 py-1"><input type="checkbox" /></td>
              <td className="px-2 py-1">{DOMPurify.sanitize(String(program.id))}</td>
              <td className="px-2 py-1">{DOMPurify.sanitize(program.code)}</td>
              <td className="px-2 py-1">{DOMPurify.sanitize(program.name)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProgramSelection;