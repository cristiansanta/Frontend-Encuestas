import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importación estándar de estilos Quill Snow
import '../style/quill.css'; // Tu archivo CSS personalizado (asegúrate que la ruta sea correcta)

const RichTextEditor = ({ value, onChange, placeholder = "Descripción detallada de la encuesta, incluyendo su propósito, estructura y los temas que aborda, con el fin de brindar una comprensión clara antes de su realización." }) => {
  // Configuración de módulos de la barra de herramientas (como en tu original)
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'], // Manteniendo image y video como en tu original
      ['clean'],
    ],
    clipboard: {
      // Evita pegar formato complejo si no se desea explícitamente
      matchVisual: false,
    }
  };

  // Formatos permitidos (buena práctica definirlos explícitamente)
   const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video' // Manteniendo image y video
  ];

  // Estilos personalizados aplicados directamente (como en tu original)
  // Asegúrate que estos estilos no causen conflictos inesperados.
  // El uso de !important puede ser necesario a veces pero debe usarse con cuidado.
  const customStyles = `
    /* Estilos para la barra de herramientas */
    .ql-toolbar.ql-snow {
      background-color: #003366 !important; /* Azul oscuro */
      border-color: #003366 !important;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      z-index: 10 !important; /* Asegura que la barra esté por encima */
    }

    /* Estilos para botones e iconos */
    .ql-toolbar.ql-snow .ql-formats button,
    .ql-toolbar.ql-snow .ql-picker {
      color: white !important;
      fill: white !important; /* Para SVGs */
      stroke: white !important; /* Para SVGs */
    }

    .ql-toolbar.ql-snow .ql-picker-label {
      color: white !important;
    }

    /* Color de líneas SVG */
    .ql-toolbar.ql-snow .ql-stroke {
      stroke: white !important;
    }

    /* Color de relleno SVG */
    .ql-toolbar.ql-snow .ql-fill {
      fill: white !important;
    }

    /* Estilos para el área de edición */
    .ql-container.ql-snow {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border-color: #d1d5db !important; /* Gris claro */
      z-index: 9 !important; /* Por debajo de la toolbar */
      min-height: 250px; /* Asegura una altura mínima */
      background-color: white; /* Fondo blanco para el área de texto */
    }

    .ql-editor {
      min-height: 250px; /* Mínima altura también para el editor */
      font-family: sans-serif; /* O la fuente que prefieras */
      font-size: 1rem; /* Tamaño de fuente base */
      color: #333; /* Color de texto oscuro */
      padding: 12px 15px !important; /* Padding interno */
      line-height: 1.6; /* Espaciado de línea */
    }

    /* Placeholder styling */
    .ql-editor.ql-blank::before {
        color: #a0aec0; /* Gris medio para el placeholder */
        font-style: normal;
        /* Ajusta posición si es necesario */
        left: 15px;
        right: 15px;
    }

    /* Contenedor general */
    .rich-text-editor-container {
      border: 1px solid #d1d5db; /* Borde general opcional */
      border-radius: 6px; /* Redondeo general */
      overflow: hidden; /* Para contener los bordes redondeados */
      height: 350px; /* Altura fija como en tu original, ajusta si prefieres auto */
      display: flex;
      flex-direction: column;
    }

     .ql-container.ql-snow {
        flex-grow: 1; /* Permitir que el contenedor crezca */
        overflow-y: auto; /* Scroll si el contenido excede la altura */
     }

     /* Scrollbar (si usas una clase personalizada como 'scrollbar-image-match') */
     .scrollbar-image-match::-webkit-scrollbar {
        /* Estilos de scrollbar si los tienes */
     }
  `;

  return (
    // Usando un div contenedor con la clase para aplicar estilos generales si es necesario
    <div className="rich-text-editor-container w-full bg-gray-back-custom">
      <style>{customStyles}</style>
      <ReactQuill
        theme="snow"
        value={value || ''} // Asegurar que el valor nunca sea null/undefined para Quill
        onChange={onChange}
        modules={modules}
        formats={formats} // Pasar los formatos permitidos
        className="h-full flex flex-col" // h-full para intentar ocupar el contenedor
        placeholder={placeholder}
        // No aplicar height aquí, dejar que el contenedor y CSS lo manejen
      />
    </div>
  );
};

export default RichTextEditor;