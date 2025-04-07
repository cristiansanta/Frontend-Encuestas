import React, { useState, useRef, useEffect } from 'react';

const Calendar = ({ 
  initialDate = new Date(),
  onDateSelect,
  buttonLabel,
  selectedDate,
  calendarIcon,
  minDate = null,
  isEndDate = false,
  isOpen = false,
  onOpenChange = () => {} // Función para controlar apertura/cierre desde componente padre
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate || initialDate);
  const calendarRef = useRef(null);
  
  // Establecer fecha mínima (por defecto, la fecha actual para fechas de finalización)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar la hora actual a las 00:00:00
  
  const effectiveMinDate = isEndDate ? 
    (minDate || today) : // Si es fecha de finalización, mínimo es hoy
    minDate; // Si no, usar la minDate proporcionada si existe

  // Formatear fecha a DD/MM/YY para mostrar en el botón
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Función para obtener los días de un mes
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Función para obtener el día de la semana del primer día del mes
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Comprobar si una fecha es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Comprobar si dos fechas son el mismo día
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  // Comprobar si una fecha es anterior a otra fecha
  const isBeforeDate = (date, minDate) => {
    if (!date || !minDate) return false;
    
    // Normalizar ambas fechas a las 00:00:00 para comparar solo día/mes/año
    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);
    
    const minDateTime = new Date(minDate);
    minDateTime.setHours(0, 0, 0, 0);
    
    return dateToCompare < minDateTime;
  };

  // Generar calendario del mes actual
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Días del mes anterior
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, currentMonth: false });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    
    return days;
  };

  // Cambiar al mes anterior
  const prevMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  // Cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  // Manejar la selección de fecha temporal (dentro del calendario)
  const handleLocalDateSelect = (date) => {
    setLocalSelectedDate(date);
  };

  // Confirmar la selección y cerrar el calendario
  const confirmSelection = () => {
    onDateSelect(localSelectedDate);
    onOpenChange(false);
  };

  // Cancelar la selección y cerrar el calendario
  const cancelSelection = () => {
    onOpenChange(false);
  };

  // Determinar el título del calendario según el buttonLabel
  const getCalendarTitle = () => {
    if (buttonLabel.includes("Inicio")) {
      return "Fecha de Inicio";
    } else if (buttonLabel.includes("Finalización")) {
      return "Fecha de Finalización";
    }
    return "Seleccione Fecha";
  };

  // Determinar el subtítulo del calendario según el buttonLabel
  const getCalendarSubtitle = () => {
    if (buttonLabel.includes("Inicio")) {
      return "Seleccione fecha de inicio de la encuesta.";
    } else if (buttonLabel.includes("Finalización")) {
      return "Seleccione fecha de finalización.";
    }
    return "Seleccione una fecha.";
  };

  // Cerrar el calendario cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOpenChange]);

  // Nombres de los meses
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Nombres de los días de la semana
  const weekDays = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

  return (
    <div className="relative">
      {/* Botón que muestra la fecha y activa el calendario */}
      <button 
        className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
          <span className="font-work-sans text-lg font-semibold">{buttonLabel}</span>
        </span>
        <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
          <span className="font-work-sans text-lg font-semibold text-dark-blue-custom mr-2">
            {selectedDate ? formatDate(new Date(selectedDate)) : formatDate(new Date())}
          </span>
          <img 
            src={calendarIcon} 
            alt="Calendario" 
            className="w-5 h-5" 
          />
        </span>
      </button>
      
      {/* Calendario desplegable con nuevo diseño */}
      {isOpen && (
        <div 
          ref={calendarRef} 
          className="absolute z-10 mt-2 bg-white shadow-lg rounded-3xl p-4 w-96"
        >
          {/* Cabecera con título */}
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-dark-blue-custom">{getCalendarTitle()}</h2>
            <p className="text-sm text-gray-600">{getCalendarSubtitle()}</p>
          </div>
          
          {/* Navegación del mes */}
          <div className="flex items-center justify-between mb-2 relative">
            <button 
              onClick={prevMonth} 
              className="p-1 text-blue-900 hover:text-blue-700"
            >
              &lt;
            </button>
            <div className="text-lg font-bold text-blue-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button 
              onClick={nextMonth} 
              className="p-1 text-blue-900 hover:text-blue-700"
            >
              &gt;
            </button>
            {/* Línea horizontal debajo del mes */}
            <div className="absolute w-full border-b border-gray-200 -bottom-1 left-0"></div>
          </div>
          
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center font-medium text-gray-400 text-xs py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {generateCalendar(currentMonth).map((day, index) => (
              <div 
                key={index} 
                className={`text-center p-1 relative ${
                  !day.currentMonth ? "invisible" : ""
                }`}
              >
                {day.currentMonth && (
                  <button
                    onClick={() => handleLocalDateSelect(day.date)}
                    disabled={effectiveMinDate && isBeforeDate(day.date, effectiveMinDate)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isSameDay(day.date, localSelectedDate)
                        ? "bg-green-custom text-white"
                        : isToday(day.date)
                        ? "bg-green-custom text-white" // Día actual en verde con texto blanco
                        : effectiveMinDate && isBeforeDate(day.date, effectiveMinDate)
                        ? "text-gray-300 cursor-not-allowed" // Fechas deshabilitadas en gris claro
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {day.day}
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-between mt-1">
            <button 
              onClick={cancelSelection}
              className="bg-purple-custom text-white px-3 py-1.5 rounded-full flex items-center text-sm"
            >
              ✕ Cancelar
            </button>
            <button 
              onClick={confirmSelection}
              className="bg-green-custom text-white px-3 py-1.5 rounded-full flex items-center text-sm"
            >
              ✓ Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;