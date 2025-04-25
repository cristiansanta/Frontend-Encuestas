import React, { useState, useRef, useEffect } from 'react';
import cancel from '../assets/img/cancel.svg';
import ok from '../assets/img/Ok.svg';

// Constante para el ancho del dropdown
const DROPDOWN_WIDTH = 515;

/**
 * Componente de dropdown para el Banco de Preguntas
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el dropdown está abierto
 * @param {Function} props.onOpenChange - Función para cambiar el estado de apertura
 * @param {Function} props.onQuestionSelect - Función que se ejecuta cuando se selecciona una pregunta
 * @param {Function} props.onCancel - Función que se ejecuta al cancelar
 * @param {Object} props.anchorRef - Referencia al elemento que ancla el dropdown
 */
const BankQuestionsDropdown = ({
  isOpen,
  onOpenChange,
  onQuestionSelect,
  onCancel,
  anchorRef
}) => {
  // Estado para almacenar las preguntas del banco
  const [bankQuestions, setBankQuestions] = useState([]);
  // Estado para almacenar el texto de búsqueda
  const [searchText, setSearchText] = useState('');
  // Estado para almacenar la pregunta seleccionada
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  // Referencia al dropdown
  const dropdownRef = useRef(null);
  // Referencia al input de búsqueda
  const inputRef = useRef(null);
  // Estado para almacenar la posición del dropdown
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  // Estado para el hover en los botones
  const [hoverState, setHoverState] = useState({
    cancel: false,
    accept: false
  });

  // Determinar si el botón "Aceptar" debería estar habilitado
  const isAcceptButtonEnabled = selectedQuestion !== null;

  // Función para cargar las preguntas del banco desde localStorage
  const loadBankQuestions = () => {
    try {
      const storedQuestions = localStorage.getItem('bank_questions');
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions);
        setBankQuestions(parsedQuestions);
      }
    } catch (error) {
      console.error('Error al cargar preguntas del banco:', error);
    }
  };

  // Cargar preguntas cuando se abre el dropdown
  useEffect(() => {
    if (isOpen) {
      loadBankQuestions();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      // Limpiar la selección y búsqueda cuando se cierra
      setSelectedQuestion(null);
      setSearchText('');
    }
  }, [isOpen]);

  // Función para actualizar la posición del dropdown
  const updateDropdownPosition = () => {
    if (isOpen && anchorRef.current && dropdownRef.current) {
      const buttonRect = anchorRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      
      // Encontrar el contenedor principal
      let containerElement = anchorRef.current;
      let containerRect = null;
      
      // Buscar el contenedor principal
      while (containerElement && containerElement.parentElement) {
        containerElement = containerElement.parentElement;
        const style = window.getComputedStyle(containerElement);
        if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
            style.width && 
            parseInt(style.width) > DROPDOWN_WIDTH) {
          containerRect = containerElement.getBoundingClientRect();
          break;
        }
      }
      
      // Si no encontramos un contenedor adecuado, usar la ventana
      if (!containerRect) {
        containerRect = {
          left: 0,
          right: windowWidth,
          width: windowWidth
        };
      }
      
      // Posición vertical: debajo del botón
      const top = buttonRect.bottom + 5;
      
      // Calcular posición inicialmente centrada con el botón
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      let leftPosition = buttonCenter - (DROPDOWN_WIDTH / 2);
      
      // Asegurar que no se salga por la izquierda del contenedor
      leftPosition = Math.max(containerRect.left + 20, leftPosition);
      
      // Asegurar que no se salga por la derecha del contenedor
      const rightEdge = leftPosition + DROPDOWN_WIDTH;
      if (rightEdge > containerRect.right - 20) {
        leftPosition = containerRect.right - DROPDOWN_WIDTH - 20;
      }
      
      setDropdownPosition({ top, left: leftPosition });
    }
  };

  // Actualizar posición cuando cambia el estado de isOpen o cuando cambia el tamaño de la ventana
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      updateDropdownPosition();
      
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition, true);
      
      return () => {
        window.removeEventListener('resize', updateDropdownPosition);
        window.removeEventListener('scroll', updateDropdownPosition, true);
      };
    }
  }, [isOpen, anchorRef]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        anchorRef.current && !anchorRef.current.contains(event.target)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOpenChange, anchorRef]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Manejar selección de pregunta
  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question.id === selectedQuestion?.id ? null : question);
  };

  // Manejar aceptar selección
  const handleAccept = () => {
    if (selectedQuestion && onQuestionSelect) {
      onQuestionSelect(selectedQuestion);
    }
    onOpenChange(false);
  };

  // Manejar cancelar
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  // Filtrar preguntas basado en la búsqueda
  const filteredQuestions = bankQuestions.filter(question =>
    question.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Si no está abierto, no mostrar nada
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-10 mt-2 bg-white shadow-lg rounded-3xl p-4 w-[515px]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        fontFamily: "'Work Sans', sans-serif"
      }}
    >
      {/* Encabezado */}
      <h2 className="text-xl font-bold text-center text-dark-blue-custom mb-2">Banco de Preguntas</h2>

      {/* Descripción */}
      <p className="text-center text-sm text-gray-600 mb-4">
        Selecciona una pregunta del banco para importarla. Puedes modificarla según tus necesidades.
      </p>

      {/* Input para buscar pregunta */}
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 outline-none focus:border-dark-blue-custom transition-colors"
          placeholder="Buscar pregunta..."
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Lista de preguntas */}
      <div className="max-h-48 overflow-y-auto mb-4 overflow-x-hidden scrollbar-image-match">
        {/* Encabezado con título */}
        <div className="flex items-center justify-between font-bold text-dark-blue-custom sticky top-0 bg-white py-2 mb-1 z-10">
          {/* Línea divisoria para el encabezado */}
          <div className="absolute bottom-0 left-0 right-3 border-b border-gray-300"></div>
          <span>Título de la pregunta</span>
        </div>
        
        {/* Lista de preguntas */}
        {filteredQuestions.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-4">
            {bankQuestions.length === 0 
              ? "No hay preguntas en el banco" 
              : "No se encontraron preguntas con ese texto"}
          </p>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className={`relative flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 ${
                selectedQuestion && selectedQuestion.id === question.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleQuestionSelect(question)}
            >
              {/* Línea divisoria */}
              <div className="absolute bottom-0 left-0 right-3 border-b border-gray-300"></div>

              <div className="flex items-center" style={{ maxWidth: "calc(100% - 40px)", fontFamily: "'Work Sans', sans-serif" }}>
                <span
                  className="text-dark-blue-custom truncate pl-2"
                  title={question.title}
                >
                  {question.title}
                </span>
              </div>

              {/* Checkbox */}
              <div
                className={`w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer flex-shrink-0 mr-3 
                  ${selectedQuestion && selectedQuestion.id === question.id ? 'bg-green-custom border-green-custom' : 'bg-white border-dark-blue-custom'}`}
                style={{ minWidth: "20px" }}
              >
                {selectedQuestion && selectedQuestion.id === question.id && (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center mt-6 gap-16">
        <button
          onClick={handleAccept}
          disabled={!isAcceptButtonEnabled}
          onMouseEnter={() => isAcceptButtonEnabled && setHoverState({ ...hoverState, accept: true })}
          onMouseLeave={() => isAcceptButtonEnabled && setHoverState({ ...hoverState, accept: false })}
          className={`py-1.5 px-5 rounded-full flex items-center text-sm transition-colors ${
            !isAcceptButtonEnabled
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : hoverState.accept
                ? 'bg-green-700 text-white'
                : 'bg-green-custom text-white'
          }`}
        >
          <span className="mr-2">
            <img src={ok} alt="Aceptar" width="18" height="18" />
          </span> Aceptar
        </button>

        <button
          onClick={handleCancel}
          onMouseEnter={() => setHoverState({ ...hoverState, cancel: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, cancel: false })}
          className={`py-1.5 px-5 rounded-full flex items-center text-sm transition-colors ${
            hoverState.cancel
              ? 'bg-red-600 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <img src={cancel} alt="Cancelar" width="18" height="18" className="mr-2" />
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default BankQuestionsDropdown;