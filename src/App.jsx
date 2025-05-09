const categoriasData = {
  categorias: [
    {
      id: 1,
      nombre: "Egresados 2014",
      encuestas: [
        {
          id: 1,
          titulo: "Encuesta sobre tu Perfil Personal y Profesional",
          rangoDeTiempo: {
            fechaInicio: "2025-02-10",
            fechaFinalizacion: "2025-02-10"
          },
          descripcion: "Esta encuesta tiene como objetivo recopilar información sobre tus datos generales, tu experiencia laboral y tu trayectoria académica...",
          configuracionVisualizacion: {
            publicada: false,
            guardadaSinPublicar: true,
            fechaCreacion: "2025-05-07T10:30:00Z",
            fechaUltimaModificacion: "2025-05-07T10:30:00Z"
          },
          secciones: [
            {
              id: 1,
              nombre: "Información Personal",
              orden: 1,
              preguntas: [
                {
                  id: 1,
                  titulo: "Nombre",
                  tipo: "respuestaAbierta",
                  descripcion: "",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 1,  // Orden de aparición dentro de la sección
                  estado: {  // Estado de guardado de la pregunta
                    guardada: true,
                    fechaGuardado: "2025-05-07T15:25:00Z"
                  },
                  preguntasHijas: []
                },
                {
                  id: 2,
                  titulo: "Fecha de nacimiento",
                  tipo: "fecha",
                  descripcion: "",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 2,  // Orden de aparición
                  estado: {
                    guardada: true,
                    fechaGuardado: "2025-05-07T15:28:00Z"
                  },
                  preguntasHijas: []
                },
                {
                  id: 3,
                  titulo: "¿En qué género te identificas?",
                  tipo: "opcionUnica",
                  descripcion: "",
                  esPreguntaMadre: true,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 3,  // Orden de aparición dentro de la sección
                  estado: {  // Estado de guardado de la pregunta
                    guardada: true,
                    fechaGuardado: "2025-05-07T15:30:00Z"
                  },
                  opciones: [ // Opciones para preguntas de tipo opcionUnica
                    { id: 1, texto: "Masculino" },
                    { id: 2, texto: "Femenino" },
                    { id: 3, texto: "No binario" },
                    { id: 4, texto: "Prefiero no decirlo" }
                  ],
                  visualizacion: {
                    mostrarComoSeleccionable: false // false para radio buttons, true para dropdown
                  },
                  preguntasHijas: [
                    {
                      id: 4,
                      titulo: "¿Cómo prefieres que nos refiramos a ti?",
                      tipo: "respuestaAbierta",
                      descripcion: "",
                      esObligatoria: true,
                      enBancoDePreguntas: false,
                      orden: 1,  // Orden dentro de las preguntas hijas
                      estado: {   // Estado de guardado
                        guardada: true,
                        fechaGuardado: "2025-05-07T15:32:00Z"
                      },
                      // Nuevo campo que indica qué opción de la pregunta madre activa esta pregunta hija
                      condicionActivacion: {
                        opcionId: 3  // ID de la opción que activa esta pregunta (en este caso "No binario")
                      }
                    }
                  ]
                },
                {
                  id: 5,
                  titulo: "¿En cuál de los siguientes países has vivido?",
                  tipo: "opcionMultiple",
                  descripcion: "",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 4,  // Orden de aparición dentro de la sección
                  estado: {  // Estado de guardado de la pregunta
                    guardada: true,
                    fechaGuardado: "2025-05-07T15:35:00Z"
                  },
                  opciones: [ // Opciones para preguntas de tipo opcionMultiple
                    { id: 1, texto: "Colombia" },
                    { id: 2, texto: "Estados Unidos" },
                    { id: 3, texto: "España" },
                    { id: 4, texto: "México" },
                    { id: 5, texto: "Argentina" },
                    { id: 6, texto: "Otro" }
                  ],
                  visualizacion: {
                    mostrarComoSeleccionable: false // false para checkboxes, true para multi-select
                  },
                  preguntasHijas: []
                },
                {
                  id: 6,
                  titulo: "¿Has estudiado en el extranjero?",
                  tipo: "falsoVerdadero",
                  descripcion: "Indica si has realizado estudios fuera de tu país de origen",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 5,
                  estado: {
                    guardada: true,
                    fechaGuardado: "2025-05-07T15:40:00Z"
                  },
                  opciones: [
                    { id: 1, texto: "Verdadero" },
                    { id: 2, texto: "Falso" }
                  ],
                  preguntasHijas: []
                }
              ]
            },
            {
              id: 2,
              nombre: "Experiencia Laboral",
              orden: 2,
              preguntas: [
                {
                  id: 7,
                  titulo: "¿En cuántos trabajos has tenido experiencia laboral hasta ahora?",
                  tipo: "numerica",
                  descripcion: "",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 1,
                  estado: {
                    guardada: true,
                    fechaGuardado: "2025-05-07T16:00:00Z"
                  },
                  preguntasHijas: []
                },
                {
                  id: 8,
                  titulo: "¿Cuál es tu situación laboral actual?",
                  tipo: "opcionUnica",
                  descripcion: "",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 2,
                  estado: {
                    guardada: true,
                    fechaGuardado: "2025-05-07T16:05:00Z"
                  },
                  opciones: [
                    { id: 1, texto: "Empleado tiempo completo" },
                    { id: 2, texto: "Empleado medio tiempo" },
                    { id: 3, texto: "Trabajador independiente" },
                    { id: 4, texto: "Desempleado" },
                    { id: 5, texto: "Estudiante" }
                  ],
                  visualizacion: {
                    mostrarComoSeleccionable: true // true para mostrar como dropdown
                  },
                  preguntasHijas: []
                }
              ]
            },
            {
              id: 3,
              nombre: "Experiencia Académica",
              orden: 3,
              preguntas: [
                {
                  id: 9,
                  titulo: "¿Qué nivel educativo has alcanzado hasta el momento?",
                  tipo: "opcionUnica",
                  descripcion: "",
                  esPreguntaMadre: false,
                  esObligatoria: true,
                  enBancoDePreguntas: false,
                  orden: 1,
                  estado: {
                    guardada: true,
                    fechaGuardado: "2025-05-07T16:10:00Z"
                  },
                  opciones: [
                    { id: 1, texto: "Pregrado" },
                    { id: 2, texto: "Especialización" },
                    { id: 3, texto: "Maestría" },
                    { id: 4, texto: "Doctorado" }
                  ],
                  visualizacion: {
                    mostrarComoSeleccionable: false
                  },
                  preguntasHijas: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      nombre: "Sin categoría",
      encuestas: []
    }
  ],
  
  // Banco de preguntas global (reutilizables en cualquier encuesta)
  bancoDePreguntas: [
    {
      id: 100,
      titulo: "¿Cuál es tu nivel de satisfacción con la formación recibida?",
      tipo: "escala",
      descripcion: "Valora del 1 al 5, donde 1 es muy insatisfecho y 5 es muy satisfecho",
      esPreguntaMadre: false,
      esObligatoria: true,
      fechaCreacion: "2025-04-15T09:20:00Z",
      opciones: [
        { id: 1, texto: "1 - Muy insatisfecho" },
        { id: 2, texto: "2 - Insatisfecho" },
        { id: 3, texto: "3 - Neutral" },
        { id: 4, texto: "4 - Satisfecho" },
        { id: 5, texto: "5 - Muy satisfecho" }
      ],
      preguntasHijas: []
    },
    {
      id: 101,
      titulo: "¿Recomiendas estudiar en nuestra institución?",
      tipo: "opcionUnica",
      descripcion: "Nos interesa conocer tu opinión para mejorar nuestra oferta educativa",
      esPreguntaMadre: true,
      esObligatoria: true,
      fechaCreacion: "2025-04-15T10:15:00Z",
      opciones: [
        { id: 1, texto: "Sí" },
        { id: 2, texto: "No" }
      ],
      visualizacion: {
        mostrarComoSeleccionable: false
      },
      preguntasHijas: [
        {
          id: 102,
          titulo: "¿Por qué no recomendarías nuestra institución?",
          tipo: "respuestaAbierta",
          descripcion: "Tu opinión nos ayudará a mejorar",
          esObligatoria: true,
          enBancoDePreguntas: true,
          // Indica qué opción de la pregunta madre activa esta pregunta hija
          condicionActivacion: {
            opcionId: 2  // ID de la opción "No" que activa esta pregunta
          }
        }
      ]
    },
    {
      id: 103,
      titulo: "¿Trabajas actualmente en tu área de estudio?",
      tipo: "falsoVerdadero",
      descripcion: "Queremos saber si estás aplicando los conocimientos adquiridos",
      esPreguntaMadre: false,
      esObligatoria: true,
      fechaCreacion: "2025-04-15T11:00:00Z",
      opciones: [
        { id: 1, texto: "Verdadero" },
        { id: 2, texto: "Falso" }
      ],
      preguntasHijas: []
    }
  ]
};