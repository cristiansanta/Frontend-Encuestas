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
  // Estos se añadirán al archivo CSS existente o se incluirán inline
  const customStyles = `
    /* Estilos para la barra de herramientas */
    .ql-toolbar.ql-snow {
      background-color: #003366 !important;
      border-color: #003366 !important;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
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
    }
  `;

  return (
    <div className="w-full h-[350px] overflow-hidden bg-gray-back-custom rounded-lg flex flex-col">
      {/* Incluimos los estilos personalizados */}
      <style>
        {customStyles + `
          /* Estilos para mantener la toolbar fija */
          .ql-toolbar.ql-snow {
            position: sticky;
            top: 0;
            z-index: 10;
          }
          
          /* Ajustar el contenedor para permitir scroll mientras mantiene la estructura */
          .ql-container.ql-snow {
            flex: 1;
            overflow-y: auto;
          }
        `}
      </style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="flex flex-col h-full"
        placeholder="Escribe la descripción aquí..."
      />
    </div>
  );
};

export default RichTextEditor;