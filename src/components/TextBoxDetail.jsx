import React from 'react';
import ReactQuill from 'react-quill';
import '../style/quill.css';

const RichTextEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  // Estilos personalizados para aplicar al ReactQuill
  const customStyles = `
    /* Estilos para la barra de herramientas */
    .ql-toolbar.ql-snow {
      background-color: #003366 !important;
      border-color: #003366 !important;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      z-index: 10 !important; /* Asegura que la barra esté por encima del contenido */
    }
    
    /* Estilos para los botones e iconos de la barra */
    .ql-toolbar.ql-snow .ql-formats button, 
    .ql-toolbar.ql-snow .ql-picker {
      color: white !important;
      fill: white !important;
      stroke: white !important;
    }
    
    .ql-toolbar.ql-snow .ql-picker-label {
      color: white !important;
    }
    
    /* Cambiar color de los íconos SVG */
    .ql-toolbar.ql-snow .ql-stroke {
      stroke: white !important;
    }
    
    .ql-toolbar.ql-snow .ql-fill {
      fill: white !important;
    }
    
    /* Estilos para el área de edición */
    .ql-container.ql-snow {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border-color: #d1d5db !important;
      z-index: 9 !important; /* Asegura que el contenedor esté por debajo de la barra de herramientas */
    }
    
    /* Importante: Asegurar que el editor tenga un z-index menor que el calendario */
    .ql-editor {
      z-index: 9 !important;
    }
    
    /* Asegurar que la toolbar sea fija pero no afecte a otros elementos */
    .ql-toolbar.ql-snow {
      position: relative; /* Cambiamos a relative para que no afecte a otros elementos */
      z-index: 10 !important;
    }
    
    /* Ajustar el contenedor para permitir scroll mientras mantiene la estructura */
    .ql-container.ql-snow {
      flex: 1;
      overflow-y: auto;
    }
  `;

  return (
    <div className="w-full h-[350px] overflow-hidden bg-gray-back-custom rounded-lg flex flex-col">
      {/* Incluimos los estilos personalizados */}
      <style>
        {customStyles}
      </style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="flex flex-col h-full scrollbar-image-match"
        placeholder="Escribe la descripción aquí..."
      />
    </div>
  );
};

export default RichTextEditor;