// Roles.jsx
import React, { useState } from 'react';
import InputSlide from '../InputSlide';

function Roles() {
  const columns = ["Días de habilitación", "Seleccionar"];
  
  // Datos de ejemplo, usando la estructura `steps` proporcionada
  const [rows, setRows] = useState([
    { id: 1, label: 'Categoría', selected: true, },
    { id: 2, label: 'Datos Generales', selected: false,  },
    { id: 3, label: 'Secciones y preguntas', selected: false,  },
    { id: 4, label: 'Despedida', selected: false,  },
  ]);

  // Función para alternar el estado de `selected`
  const handleToggle = (label) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.label === label ? { ...row, selected: !row.selected } : row
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200 text-[#00324D] text-center">
            {columns.map((column, index) => (
              <th key={index} className="py-2 px-4 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id} className={`text-center ${rowIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
              <td className="py-2 px-4 text-[#00324D] font-semibold">{row.label}</td>
              <td className="py-2 px-4 flex justify-center">
                <InputSlide
                  checked={row.selected}
                  onChange={() => handleToggle(row.label)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roles;
