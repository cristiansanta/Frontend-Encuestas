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
    <div className="w-full h-80 overflow-hidden bg-white rounded-lg">
      {/* Incluimos los estilos personalizados */}
      <style>{customStyles}</style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-full w-full"
        placeholder="Escribe algo aquí..."
      />
    </div>
  );
};

export default RichTextEditor;