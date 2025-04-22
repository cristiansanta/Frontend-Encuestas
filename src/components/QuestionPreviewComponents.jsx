// QuestionPreviewComponents.jsx
import React, { useState } from 'react';
import InputSlide from './InputSlide';

// Componente para respuesta abierta (tipo 1)
export const OpenAnswerPreview = () => {
  const [charLimit, setCharLimit] = useState(500);
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="#0A3D62" strokeWidth="2"/>
          <path d="M7 10L12 14L17 10" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">
          ¿Cómo se visualiza el campo de respuesta abierta?
        </h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">
        El encuestado vera un campo como el que se muestra a continuación.
        <br />
        Puedes determinar un límite de caracteres, si no lo haces el límite serán 1500 caracteres.
      </p>
      
      <div className="border border-gray-300 rounded-xl p-4 mb-4 min-h-32 relative">
        <p className="text-gray-500">Ej: En mi último trabajo me desempeñe como...</p>
        <div className="absolute bottom-2 right-4 text-gray-500">
          0/{charLimit}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <label className="font-bold text-dark-blue-custom">Límite de caracteres</label>
        <div className="relative w-32">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">#</span>
          </div>
          <input 
            type="number" 
            value={charLimit}
            onChange={(e) => setCharLimit(e.target.value)}
            className="pl-8 pr-3 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-custom"
          />
        </div>
      </div>
    </div>
  );
};

// Componente para respuesta numérica (tipo 2)
export const NumericAnswerPreview = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 5L12 19" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">
          ¿Cómo se visualiza en campo de respuesta numérica?
        </h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">
        El encuestado vera un campo como el que se muestra a continuación y solo podrá ingresar números como respuesta.
      </p>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500">#</span>
        </div>
        <input 
          type="text" 
          placeholder="Ingresa el numero"
          className="pl-8 pr-3 py-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-custom"
          readOnly
        />
      </div>
    </div>
  );
};

// Componente para opción única (tipo 3)
export const SingleChoicePreview = () => {
  const [options, setOptions] = useState([
    { id: 1, text: 'Opcion de Respuesta 01' },
    { id: 2, text: 'Opcion de Respuesta 01' },
    { id: 3, text: 'Opcion de Respuesta 01' }
  ]);
  const [newOptionText, setNewOptionText] = useState('');
  const [showAllOptions, setShowAllOptions] = useState(false);
  
  const addOption = () => {
    if (newOptionText.trim() !== '') {
      const newOption = {
        id: options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1,
        text: newOptionText
      };
      setOptions([...options, newOption]);
      setNewOptionText('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#0A3D62" strokeWidth="2"/>
          <circle cx="12" cy="12" r="4" fill="#0A3D62"/>
        </svg>
        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">
          Opciones de Respuesta
        </h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">
        Agrega las opciones de respuesta que deseas ofrecer. El usuario que responda la encuesta solo podrá seleccionar una opción entre las que definas.
      </p>
      
      {/* Input para agregar nueva opción */}
      <div className="relative mb-4">
        <input
          type="text"
          value={newOptionText}
          onChange={(e) => setNewOptionText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe una opcion de respuesta"
          className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-custom"
        />
        <button 
          onClick={addOption}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-custom"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      {/* Lista de opciones */}
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8H14" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 4H14" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12H14" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-work-sans text-dark-blue-custom">
              {option.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Opción para mostrar todas las opciones */}
      <div className="mt-6">
        <InputSlide
          value={showAllOptions}
          onChange={() => setShowAllOptions(!showAllOptions)}
        />
        <span className="ml-2 font-work-sans text-dark-blue-custom">
          Se mostraran todas las opciones en pantalla
        </span>
      </div>
    </div>
  );
};

// Componente para opción múltiple (tipo 4)
export const MultipleChoicePreview = () => {
  const [options, setOptions] = useState([
    { id: 1, text: 'Posible respuesta numero 01' },
    { id: 2, text: 'Posible respuesta numero 02' },
    { id: 3, text: 'Posible respuesta numero 03' }
  ]);
  const [newOptionText, setNewOptionText] = useState('');
  
  const addOption = () => {
    if (newOptionText.trim() !== '') {
      const newOption = {
        id: options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1,
        text: newOptionText
      };
      setOptions([...options, newOption]);
      setNewOptionText('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="#0A3D62" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="#0A3D62" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="#0A3D62" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="#0A3D62" strokeWidth="2"/>
        </svg>
        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">
          Opciones de Respuesta
        </h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">
        Agrega las opciones de respuesta que deseas ofrecer. El usuario que responda la encuesta podrá seleccionar una o varias opciones entre las que definas.
      </p>
      
      {/* Input para agregar nueva opción */}
      <div className="relative mb-4">
        <input
          type="text"
          value={newOptionText}
          onChange={(e) => setNewOptionText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe una opcion de respuesta"
          className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-custom"
        />
        <button 
          onClick={addOption}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-custom"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      {/* Lista de opciones */}
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8H14" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 4H14" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12H14" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-work-sans text-dark-blue-custom">
              {option.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para verdadero/falso (tipo 5)
export const TrueFalsePreview = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0A3D62" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">
          ¿Cómo se visualizan las opciones de respuesta <i>falso / verdadero</i>?
        </h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">
        El encuestado vera un campo como el que se muestra a continuación y solo podrá ingresar números como respuesta.
      </p>
      
      <div className="flex space-x-6 mt-4">
        <label className="inline-flex items-center">
          <input type="radio" className="form-radio h-5 w-5 text-blue-custom" name="truefalse" value="true" />
          <span className="ml-2 text-dark-blue-custom">Verdadero</span>
        </label>
        <label className="inline-flex items-center">
          <input type="radio" className="form-radio h-5 w-5 text-blue-custom" name="truefalse" value="false" />
          <span className="ml-2 text-dark-blue-custom">Falso</span>
        </label>
      </div>
    </div>
  );
};

// Componente para fecha (tipo 6)
export const DatePreview = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="15" rx="2" stroke="#0A3D62" strokeWidth="2"/>
          <path d="M3 11H21" stroke="#0A3D62" strokeWidth="2"/>
          <path d="M8 16H16" stroke="#0A3D62" strokeWidth="2"/>
          <path d="M8 3L8 7" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 3L16 7" stroke="#0A3D62" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">
          ¿Cómo se visualizan las opciones de respuesta <i>falso / verdadero</i>?
        </h2>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">
        El encuestado vera un campo como el que se muestra a continuación, al dar click se desplegara un calendario y podrá elegir la fecha.
      </p>
      
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder="DD/MM/AAAA"
          className="pl-3 pr-10 py-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-custom"
          readOnly
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="14" height="12" rx="1" stroke="#0A3D62" strokeWidth="1.5"/>
            <path d="M3 9H17" stroke="#0A3D62" strokeWidth="1.5"/>
            <path d="M7 3L7 6" stroke="#0A3D62" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13 3L13 6" stroke="#0A3D62" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};