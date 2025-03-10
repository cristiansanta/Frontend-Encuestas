// InputsRole.jsx
import React from 'react';
import InputSlide from './InputSlide';

function InputsRole() {
  return (
    <form className="grid gap-4 mt-5">
      {/* Primera fila: 4 inputs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg font-bold text-[#00324D]">Título</label>
          <input type="text" id="title" className="border border-dashed border-blue-800 p-2 rounded-lg" placeholder="Título" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="attempts" className="text-lg font-bold text-[#00324D]">Número de intentos</label>
          <input type="number" id="attempts" className="border border-dashed border-blue-800 p-2 rounded-lg" placeholder="Intentos" />
        </div>
        <div className="flex items-center flex-row-reverse">
          <label htmlFor="anonymous" className="text-lg font-bold text-[#00324D] ml-2">Encuesta anónima</label>
          <InputSlide />
        </div>
        <div className="flex items-center flex-row-reverse">
          <label htmlFor="notifications" className="text-lg font-bold text-[#00324D] ml-2">Activar notificación</label>
          <InputSlide />
        </div>
      </div>

      {/* Segunda fila: 2 inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-lg font-bold text-[#00324D]">Fecha inicio</label>
          <div className="relative">
            <input type="date" id="startDate" className="border border-dashed border-blue-800 p-2 rounded-lg w-full" />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800">
              📅 {/* Reemplaza con un ícono adecuado */}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-lg font-bold text-[#00324D]">Fecha fin</label>
          <div className="relative">
            <input type="date" id="endDate" className="border border-dashed border-blue-800 p-2 rounded-lg w-full" />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800">
              📅 {/* Reemplaza con un ícono adecuado */}
            </span>
          </div>
        </div>
      </div>

      {/* Tercera fila: 3 inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="enableDays" className="text-lg font-bold text-[#00324D]">Días de habilitación</label>
          <input type="number" id="enableDays" className="border border-dashed border-blue-800 p-2 rounded-lg" placeholder="Días" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="activationDays" className="text-lg font-bold text-[#00324D]">Días de Activación</label>
          <input type="number" id="activationDays" className="border border-dashed border-blue-800 p-2 rounded-lg" placeholder="Días" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="notificationDays" className="text-lg font-bold text-[#00324D]">Días de Notificación</label>
          <input type="number" id="notificationDays" className="border border-dashed border-blue-800 p-2 rounded-lg" placeholder="Días" />
        </div>
      </div>
    </form>
  );
}

export default InputsRole;
