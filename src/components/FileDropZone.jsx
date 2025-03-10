import React, { useState } from 'react';

const FileDropZone = ({ onFileSelect }) => {
    const [fileName, setFileName] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        processFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file && file.type === 'text/csv') {
            setFileName(file.name);
            setErrorMessage(''); // Limpiar el mensaje de error
            onFileSelect(file); // Pasar el archivo CSV al componente padre
        } else {
            setErrorMessage("Formato incorrecto. Por favor, sube un archivo en formato CSV.");
            setFileName(null); // Limpiar el nombre de archivo si es inválido
        }
    };

    return (
        <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <p className="text-gray-500 mb-4">Arrastra y suelta tu archivo CSV aquí, o</p>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
            />
            <label htmlFor="fileUpload" className="text-blue-500 cursor-pointer underline">
                selecciona un archivo
            </label>
            {fileName && <p className="mt-2 text-green-500">Archivo cargado: {fileName}</p>}
            {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
        </div>
    );
};

export default FileDropZone;
