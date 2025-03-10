// HeaderBar.jsx
import React, { useState } from 'react';
import ChooseProgram from '../ComponentsRoles/ChooseProgram';
import ChooseModality from '../ComponentsRoles/ChooseModality';
import ChooseRole from '../ComponentsRoles/ChooseRole.jsx';

function Dropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b bg-white rounded-md shadow-sm"> {/* Agrega el redondeado y una sombra ligera */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 font-medium text-[#00324D] flex justify-between items-center"
      >
        {title}
        <span className="text-[#00324D]">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="px-4 py-2 text-[#00324D]">{children}</div>}
    </div>
  );
}

function ListOptions() {
  return (
    <div className="w-full bg-[#F0F0F0] p-4 rounded-lg shadow-md"> {/* Contenedor con fondo y espacio */}
      <Dropdown title="1. Selección de roles">
        <ChooseRole/>
      </Dropdown>
      <Dropdown title="2. Selección de modalidad">
        <ChooseModality/>
      </Dropdown>
      <Dropdown title="3. Selección de tipo de curso">Contenido de selección de tipo de curso</Dropdown>
      <Dropdown title="4. Selección de fechas">Contenido de selección de fechas</Dropdown>
      <Dropdown title="5. Selección de programa">
        <ChooseProgram/>
      </Dropdown>
    </div>
  );
}

export default ListOptions;
