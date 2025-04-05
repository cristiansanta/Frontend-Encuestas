import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de importar axios
import DOMPurify from 'dompurify'; // Importamos DOMPurify para sanitizar datos

const SelectorSections = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sections, setSections] = useState([]); // Estado para almacenar las secciones
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const accessToken = localStorage.getItem('accessToken'); // Obtener token de autorización si está en localStorage

  // Llamada a la API para obtener las secciones
  useEffect(() => {
    const fetchSections = async () => {
      const endpoint = import.meta.env.VITE_API_ENDPOINT;
      try {
        const surveyId = localStorage.getItem('id_survey');
        const sanitizedSurveyId = DOMPurify.sanitize(surveyId);
        
        const response = await axios.get(endpoint + 'sections/survey/' + sanitizedSurveyId, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }); // Ajusta la URL si es necesario
        const data = response.data; // axios ya convierte la respuesta
       
        setSections(data); // Guardar las secciones en el estado
        setLoading(false); // Deshabilitar el estado de carga
      } catch (error) {
        console.error('Error fetching sections:', error);
        setLoading(false);
      }
    };

    fetchSections();
  }, [accessToken]);

  const handleSelectSection = (section) => {
    const sanitizedId = DOMPurify.sanitize(String(section.id));
    const sanitizedTitle = DOMPurify.sanitize(section.title);
    
    setSelectedOption({ 
      id: sanitizedId, 
      label: sanitizedTitle 
    });
    setIsOpen(false);
    localStorage.setItem('section_id', sanitizedId); // Guarda el ID de la sección sanitizado
  };

  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg border border-gray-200 shadow-lg bg-white w-11/12 mx-auto mt-8">
      <h2 className="text-2xl font-bold text-[#00324D]">Elija la sección donde desea clasificar las preguntas a crear</h2>

      {loading ? (
        <p>Cargando secciones...</p> // Mensaje de carga
      ) : (
        <div className="relative w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-gray-200 text-left p-4 rounded-lg shadow flex items-center justify-between"
          >
            {selectedOption ? (
              <div className="flex items-center">
                <span>{selectedOption.label}</span>
              </div>
            ) : (
              'Seleccione una sección'
            )}
            <span className="ml-2">&#9662;</span>
          </button>

          {isOpen && (
            <ul className="absolute w-full bg-white shadow-lg mt-2 rounded-lg z-10">
              {sections.map((section) => (
                <li
                  key={section.id}
                  onClick={() => handleSelectSection(section)}
                  className="cursor-pointer p-4 hover:bg-gray-100"
                >
                  <span>{DOMPurify.sanitize(section.title)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectorSections;