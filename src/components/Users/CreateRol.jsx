import React from 'react';

function CreateRole() {
  return (
    <div className="w-full mt-6">
      <div className="bg-white w-full rounded-2xl">
        <form className="space-y-6">
          {/* Fila 1: Nombre del Rol (select) y Descripción (input) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Editar Rol
              </label>
              <select
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="rol1">Rol 1</option>
                <option value="rol2">Rol 2</option>
                <option value="rol3">Rol 3</option>
                <option value="rol4">Rol 4</option>
              </select>
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Renombrar Rol
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Botón debajo de "Renombrar Rol" */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-[#00324D] text-lg font-bold text-white px-10 rounded-md"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>

          {/* Fila 2: Crear Nuevo Rol (input) y Confirmar Nuevo Rol (input) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Crear Nuevo Rol
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Confirmar Nuevo Rol
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Botón debajo de "Confirmar Nuevo Rol" */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-[#00324D] text-lg font-bold text-white  px-10 rounded-md"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Botones de Volver y Siguiente (debajo de todos los inputs) */}
          <div className="flex justify-between mt-6">
            {/* Botón Volver (izquierda) */}
            <button
              type="button"
              className="bg-[#39A900] text-lg font-bold text-white py-2 px-12 rounded-xl"
            >
              Volver
            </button>
            {/* Botón Siguiente (derecha) */}
            <button
              type="submit"
              className="bg-[#39A900] text-lg font-bold text-white py-2 px-10 rounded-xl"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRole;
