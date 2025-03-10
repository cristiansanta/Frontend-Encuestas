import React, { useState } from 'react';
import InputSlide from '../InputSlide'; // Importa el componente InputSlide

function Asignation() {
  // Define los datos para los tres campos de usuario
  const [sliderValues, setSliderValues] = useState([
    { id: 1, value: 50 },
    { id: 2, value: 30 },
    { id: 3, value: 75 },
  ]); // Puedes inicializar con los valores que prefieras

  // Maneja el cambio de un slider
  const handleSliderChange = (id, newValue) => {
    setSliderValues((prevValues) =>
      prevValues.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  return (
    <div className="w-full mt-6">
      <div className="bg-white w-full rounded-2xl">
        <form className="space-y-6">
          {/* Fila 1: Asignar Rol y Usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Rol para Asignación
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

            {/* Inputs Slide dinámicos */}
            <div className="space-y-4">
            <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Rol para Asignación
            </label>
              {sliderValues.map((slider) => (
                <div key={slider.id}>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold" style={{ color: '#00324D' }}>
                      {slider.value} {/* Muestra el valor del slider */}
                    </span>
                    {/* Usamos el componente InputSlide y pasamos el valor y el manejador */}
                    <InputSlide
                      value={slider.value}
                      handleSliderChange={(newValue) => handleSliderChange(slider.id, newValue)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-6">
            {/* Botón Volver (izquierda) */}
            <button
              type="button"
              className="bg-[#39A900] text-lg font-bold text-white py-2 px-12 rounded-xl"
            >
              Volver
            </button>
            {/* Botón Asignar (derecha) */}
            <button
              type="submit"
              className="bg-[#39A900] text-lg font-bold text-white py-2 px-10 rounded-xl"
            >
              Asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Asignation;
