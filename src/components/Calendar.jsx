import React, { useState, useRef, useEffect } from 'react';
import cancel from '../assets/img/cancel.svg';
import ok from '../assets/img/Ok.svg';

// Definir enumeración para los modos de visualización del calendario
const CalendarMode = {
  DAYS: 'days',
  MONTHS: 'months',
  YEARS: 'years',
  DECADES: 'decades'
};

const Calendar = ({
  initialDate = new Date(),
  onDateSelect,
  buttonLabel,
  selectedDate,
  calendarIcon,
  minDate = null,
  isEndDate = false,
  isOpen = false,
  onOpenChange = () => { } // Función para controlar apertura/cierre desde componente padre
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate || initialDate);
  const calendarRef = useRef(null);
  // Nuevo estado para controlar el modo de visualización del calendario
  const [viewMode, setViewMode] = useState(CalendarMode.DAYS);
  // Estado para almacenar la década actual en modo DECADES
  const [currentDecade, setCurrentDecade] = useState(Math.floor(new Date().getFullYear() / 10) * 10);

  // Establecer fecha mínima
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar la hora actual a las 00:00:00

  // Modificación principal: para fecha de finalización, usar el máximo entre la fecha actual y la fecha de inicio
  // Esto asegura que no se pueda seleccionar una fecha de finalización anterior a la fecha de inicio
  // ni anterior a la fecha actual
  const effectiveMinDate = isEndDate ?
    (minDate && new Date(minDate) > today ? minDate : today) : // Si es fecha de finalización, usar el máximo entre minDate y today
    minDate; // Si es fecha de inicio, usar la minDate proporcionada si existe

  // Al abrir el calendario, reiniciar al modo de visualización de días
  useEffect(() => {
    if (isOpen) {
      setViewMode(CalendarMode.DAYS);
    }
  }, [isOpen]);

  // Al abrir el calendario de finalización, asegúrate de que el mes mostrado sea adecuado
  useEffect(() => {
    if (isOpen && isEndDate) {
      // Determinar la fecha mínima efectiva para finalización
      const minEffectiveDate = minDate && new Date(minDate) > today ? new Date(minDate) : new Date(today);

      // Si el mes actual del calendario es anterior al mes mínimo efectivo, actualízalo
      if (
        currentMonth.getFullYear() < minEffectiveDate.getFullYear() ||
        (currentMonth.getFullYear() === minEffectiveDate.getFullYear() &&
          currentMonth.getMonth() < minEffectiveDate.getMonth())
      ) {
        // Establecer al mes mínimo efectivo
        setCurrentMonth(new Date(minEffectiveDate.getFullYear(), minEffectiveDate.getMonth(), 1));
      }

      // Si la fecha seleccionada localmente es anterior a la fecha mínima, actualizarla
      if (isBeforeDate(localSelectedDate, minEffectiveDate)) {
        setLocalSelectedDate(new Date(minEffectiveDate));
      }
    }
  }, [isOpen, isEndDate, minDate]);

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

  // Funciones para navegar entre años
  const prevYear = () => {
    setCurrentDecade(prevDecade => prevDecade - 10);
  };

  const nextYear = () => {
    setCurrentDecade(prevDecade => prevDecade + 10);
  };

  // Funciones para navegar entre décadas
  const prevDecade = () => {
    setCurrentDecade(prevDecade => prevDecade - 100);
  };

  const nextDecade = () => {
    setCurrentDecade(prevDecade => prevDecade + 100);
  };

  // Función para manejar el cambio de modo de visualización
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Función para manejar selección de mes en modo MONTHS
  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode(CalendarMode.DAYS);
  };

  // Función para manejar selección de año en modo YEARS
  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode(CalendarMode.MONTHS);
  };

  // Función para manejar selección de década en modo DECADES
  const handleDecadeSelect = (decade) => {
    setCurrentDecade(decade);
    setViewMode(CalendarMode.YEARS);
  };

  // Función para obtener el mes actual como texto para mostrar en el encabezado
  const getCurrentMonthText = () => {
    return monthNames[currentMonth.getMonth()] + " " + currentMonth.getFullYear();
  };

  // Función para obtener el rango de años actual como texto para mostrar en el encabezado en modo YEARS
  const getCurrentYearRangeText = () => {
    return `${currentDecade} - ${currentDecade + 9}`;
  };

  // Función para obtener el rango de décadas actual como texto para mostrar en el encabezado en modo DECADES
  const getCurrentDecadeRangeText = () => {
    const startDecade = Math.floor(currentDecade / 10) * 10;
    return `${startDecade}0 - ${startDecade + 90}`;
  };

  // Función para generar años para el modo YEARS
  const generateYears = () => {
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentDecade + i);
    }
    return years;
  };

  // Función para generar décadas para el modo DECADES
  const generateDecades = () => {
    const decades = [];
    const baseDecade = Math.floor(currentDecade / 100) * 100;
    for (let i = 0; i < 10; i++) {
      decades.push(baseDecade + i * 10);
    }
    return decades;
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

  // Comprobar si un año es menor que el año mínimo permitido (para deshabilitarlo)
  const isYearDisabled = (year) => {
    if (!effectiveMinDate) return false;

    const minDate = new Date(effectiveMinDate);
    return year < minDate.getFullYear();
  };

  // Comprobar si un mes es anterior al mes mínimo permitido (para deshabilitarlo)
  const isMonthDisabled = (monthIndex) => {
    if (!effectiveMinDate) return false;

    const minDate = new Date(effectiveMinDate);
    if (currentMonth.getFullYear() > minDate.getFullYear()) return false;
    if (currentMonth.getFullYear() < minDate.getFullYear()) return true;

    return monthIndex < minDate.getMonth();
  };

  // El return debe ir dentro de la función del componente
  return (
    <div className="relative">
      {/* Botón que muestra la fecha y activa el calendario */}
      <button
        className="hidden md:grid md:grid-cols-custom w-full items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="bg-blue-custom text-white px-4 py-1 flex items-start justify-start hover:bg-opacity-80 font-work-sans text-lg font-semibold">
        {buttonLabel}
        </span>
        <span className="bg-yellow-custom px-3 py-1 flex items-center justify-start hover:bg-opacity-80">
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

          {/* Navegación del mes/año según el modo de visualización */}
          <div className="flex items-center justify-between mb-2 relative">
            {viewMode === CalendarMode.DAYS && (
              <>
                <button
                  onClick={prevMonth}
                  className={`p-1 text-blue-900 hover:text-blue-700 ${isEndDate && (
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) <
                      new Date(
                        (minDate && new Date(minDate) > today) ?
                          new Date(minDate).getFullYear() : today.getFullYear(),
                        (minDate && new Date(minDate) > today) ?
                          new Date(minDate).getMonth() : today.getMonth(),
                        1
                      )
                    ) ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  // Mantener esto exactamente igual - controla la funcionalidad
                  disabled={isEndDate && (
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) <
                    new Date(
                      (minDate && new Date(minDate) > today) ?
                        new Date(minDate).getFullYear() : today.getFullYear(),
                      (minDate && new Date(minDate) > today) ?
                        new Date(minDate).getMonth() : today.getMonth(),
                      1
                    )
                  )}
                >
                  &lt;
                </button>
                <div
                  className="text-lg font-bold text-blue-900 cursor-pointer hover:text-blue-700"
                  onClick={() => setViewMode(CalendarMode.MONTHS)}
                >
                  {getCurrentMonthText()}
                </div>
                <button
                  onClick={nextMonth}
                  className="p-1 text-blue-900 hover:text-blue-700"
                >
                  &gt;
                </button>
              </>
            )}

            {viewMode === CalendarMode.MONTHS && (
              <>
                <button
                  onClick={() => {
                    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
                  }}
                  className="p-1 text-blue-900 hover:text-blue-700"
                  disabled={isEndDate && isYearDisabled(currentMonth.getFullYear() - 1)}
                >
                  &lt;
                </button>
                <div
                  className="text-lg font-bold text-blue-900 cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    setCurrentDecade(Math.floor(currentMonth.getFullYear() / 10) * 10);
                    setViewMode(CalendarMode.YEARS);
                  }}
                >
                  {currentMonth.getFullYear()}
                </div>
                <button
                  onClick={() => {
                    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
                  }}
                  className="p-1 text-blue-900 hover:text-blue-700"
                >
                  &gt;
                </button>
              </>
            )}

            {viewMode === CalendarMode.YEARS && (
              <>
                <button
                  onClick={prevYear}
                  className="p-1 text-blue-900 hover:text-blue-700"
                >
                  &lt;
                </button>
                <div
                  className="text-lg font-bold text-blue-900 cursor-pointer hover:text-blue-700"
                  onClick={() => setViewMode(CalendarMode.DECADES)}
                >
                  {getCurrentYearRangeText()}
                </div>
                <button
                  onClick={nextYear}
                  className="p-1 text-blue-900 hover:text-blue-700"
                >
                  &gt;
                </button>
              </>
            )}

            {viewMode === CalendarMode.DECADES && (
              <>
                <button
                  onClick={prevDecade}
                  className="p-1 text-blue-900 hover:text-blue-700"
                >
                  &lt;
                </button>
                <div className="text-lg font-bold text-blue-900">
                  {getCurrentDecadeRangeText()}
                </div>
                <button
                  onClick={nextDecade}
                  className="p-1 text-blue-900 hover:text-blue-700"
                >
                  &gt;
                </button>
              </>
            )}

            {/* Línea horizontal debajo del mes */}
            <div className="absolute w-full border-b border-gray-200 -bottom-1 left-0"></div>
          </div>

          {/* Vista de días (calendario normal) */}
          {viewMode === CalendarMode.DAYS && (
            <>
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
                    className={`text-center p-1 relative ${!day.currentMonth ? "invisible" : ""
                      }`}
                  >
                    {day.currentMonth && (
                      <button
                        onClick={() => handleLocalDateSelect(day.date)}
                        disabled={effectiveMinDate && isBeforeDate(day.date, effectiveMinDate)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSameDay(day.date, localSelectedDate)
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
            </>
          )}

          {/* Vista de meses */}
          {viewMode === CalendarMode.MONTHS && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {monthNames.map((monthName, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                  disabled={isMonthDisabled(index)}
                  className={`p-2 rounded-md transition-colors ${currentMonth.getMonth() === index
                      ? "bg-green-custom text-white"
                      : isMonthDisabled(index)
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {monthName}
                </button>
              ))}
            </div>
          )}

          {/* Vista de años */}
          {viewMode === CalendarMode.YEARS && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {generateYears().map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  disabled={isYearDisabled(year)}
                  className={`p-2 rounded-md transition-colors ${currentMonth.getFullYear() === year
                      ? "bg-green-custom text-white"
                      : isYearDisabled(year)
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Vista de décadas */}
          {viewMode === CalendarMode.DECADES && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {generateDecades().map((decade) => (
                <button
                  key={decade}
                  onClick={() => handleDecadeSelect(decade)}
                  className={`p-2 rounded-md transition-colors hover:bg-gray-100`}
                >
                  {decade}
                </button>
              ))}
            </div>
          )}

          {/* Botones de acción (solo visibles en modo DAYS) */}
          {viewMode === CalendarMode.DAYS && (
            <div className="flex justify-center gap-16 mt-1">
              <button
                onClick={cancelSelection}
                className="bg-purple-custom text-white px-3 py-1.5 rounded-full flex items-center text-sm"
              >
                <img src={cancel} alt="cancelar" width="18" height="18" className="mr-2" /> Cancelar
              </button>
              <button
                onClick={confirmSelection}
                className="bg-green-custom text-white px-3 py-1.5 rounded-full flex items-center text-sm"
              >
                <img src={ok} alt="Aceptar" width="18" height="18" className="mr-2" />Aceptar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;