
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

  return (
    <div className="w-full h-80 border border-[#00324D] border-opacity-70 overflow-hidden bg-white rounded-lg">
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
