import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import FileDropZone from '../components/FileDropZone.jsx';
import Papa from 'papaparse';
import FormatCorreo from '../components/FormatCorreo.jsx';
import { useNavigate } from 'react-router-dom';
import DownloadXLSX from '../components/DownloadXLSX.jsx';

const AsignationMigrate = () => {
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [totalEmails, setTotalEmails] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]); // Para almacenar errores de validación
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setMessage('');
    setTotalEmails(0);
    setValidationErrors([]);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const validateData = (parsedData) => {
    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const rowErrors = [];
  
      // Validar nombre
      if (!row.nombre) {
        rowErrors.push("El nombre está vacío o no existe.");
      }
  
      // Validar correo
      if (!isValidEmail(row.correo)) {
        rowErrors.push("El correo no tiene un formato válido.");
      }
  
      // Validar fecha
      if (!isValidDate(row.expired_date)) {
        rowErrors.push("La fecha no tiene un formato válido (YYYY-MM-DD).");
      }
  
      // Si hay errores, retornar información sobre la fila problemática
      if (rowErrors.length > 0) {
        return {
          valid: false,
          error: {
            fila: i + 1, // Fila actual (1-indexed para usuario)
            errores: rowErrors,
          },
        };
      }
    }
  
    // Si no hay errores, retornar que los datos son válidos
    return { valid: true };
  };
  
  const handleProcess = () => {
    if (selectedFile) {
      setMessage('Procesando el archivo, por favor espera...');
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((row) => ({
            nombre: row.Nombre,
            correo: row.Correo,
            expired_date: row.Fecha_vence,
          }));
  
          // Validar datos
          const validation = validateData(parsedData);
  
          if (!validation.valid) {
            // Si hay un error, mostrar el mensaje correspondiente
            setValidationErrors([validation.error]);
            setMessage('⚠️ El archivo contiene errores de validación.');
          } else {
            // Procesar datos si son válidos
            setData(parsedData);
            setTotalEmails(parsedData.length);
            setMessage(`✅ El archivo ha sido procesado exitosamente. Se procesarán ${parsedData.length} correos.`);
            sendEmails(parsedData);
          }
        },
        error: (error) => {
          console.error("Error al procesar el archivo:", error);
          setMessage('Hubo un error al procesar el archivo.');
        },
      });
    } else {
      setMessage("No se ha seleccionado ningún archivo.");
    }
  };

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const sendEmails = (emailData) => {
    const surveyId = localStorage.getItem('selectedSurveyId'); 
    let processedCount = 0;

    emailData.forEach((user) => {
      const accessToken = localStorage.getItem('accessToken');
      const formattedEmail = FormatCorreo(user.correo, surveyId);
      const currentDate = getFormattedDate();

      const payload = {
        data: JSON.stringify({
          asunto: "Recordatorio Encuesta",
          correo: user.correo,
          cuerpo: formattedEmail.cuerpo,
          project:"notificationsurvays",

        }),
        state: "1",
        state_results: false,
        date_insert: currentDate,
        expired_date: user.expired_date,
        id_survey: surveyId,
        email: user.correo,
      };

      const endpoint = import.meta.env.VITE_API_ENDPOINT;

      fetch(`${endpoint}Notification/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Correo enviado:', data);
        processedCount += 1;
        if (processedCount === emailData.length) {
          setMessage(`✅ El archivo ha sido procesado exitosamente. Total de correos enviados: ${processedCount}`);
        }
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
      });
    });
  };

  const handleExit = () => {
    navigate('/SurveyList');
  };

  return (
    <div className="flex"> 
      <Navbar /> 
      <div className="flex-1 flex flex-col items-center mt-10"> 
        <HeaderBanner />
        <HeaderBar props={`Asignacion para la encuesta: ${localStorage.getItem('selectedSurveyId')} ${localStorage.getItem('selectedSurveyTitle')}`} />
      
        <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-36">
          <h1 className="text-lg font-bold text-[#00324D] mt-6">📨 Carga el archivo para el envio de las notificaciones.</h1>
          
          {/* Enlace de descarga del formato */}
          <div className="my-4">
          <DownloadXLSX 
            endpoint="/api/download" 
             filename="Formato_correos_notificacion.xlsx" 
          />
            <p className="text-sm text-gray-600 mt-1">
              Nota: El archivo debe guardarse como CSV antes de cargarlo aquí.
            </p>
          </div>

          <FileDropZone onFileSelect={handleFileSelect} />

          {message && <p className="mt-4 text-[#00324D]">{message}</p>}
          {validationErrors.length > 0 && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
                <h3 className="font-bold">Errores de validación:</h3>
                <ul className="list-disc pl-6">
                  {validationErrors.map((error, index) => (
                    <li key={index}>
                      <strong>Fila {error.fila}:</strong>
                      <ul>
                        {error.errores.map((detalle, i) => (
                          <li key={i}>{detalle}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="flex justify-end mt-4 space-x-4">
            <button 
              onClick={handleProcess} 
              className="px-4 py-2 bg-[rgba(57,169,0,1)] text-white rounded"
            >
              Procesar Correos
            </button>
            <button 
              onClick={handleExit} 
              className="px-4 py-2 bg-[rgba(57,169,0,1)] text-white rounded"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignationMigrate;
