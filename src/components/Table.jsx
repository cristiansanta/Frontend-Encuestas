import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SurveyContext } from "../Provider/SurveyContext"; 
import { FaEdit, FaTrash } from "react-icons/fa"; 
import Modal from "../components/Modal"; 
import apiRequest from '../Provider/apiHelper.jsx';

const TableComponent = ({
  endpoint,
  visibleColumns = [],
  columnAliases = {},
  showEdit = false,
  showDelete = false,
  showSelect = false,
  showNextButton = false,
  showBackButton = false,
  onEdit,
  origin,
}) => {

  const { setSelectedCategory } = useContext(SurveyContext);
   
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = origin === "listsurvey" ? 10 : 6;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalTitle, setModalTitle] = useState(""); 
  const [modalMessage, setModalMessage] = useState(""); 
  const [modalType, setModalType] = useState("default"); 
  const [confirmAction, setConfirmAction] = useState(null);

  const showModal = (title, message, onConfirm, type = 'default') => {
    setModalTitle(title);
    setModalMessage(message);
    setConfirmAction(() => onConfirm);
    setModalType(type);
    setIsModalOpen(true);
    
  };

  const idsurvey = localStorage.getItem('id_survey');
  const fetchData = async () => {
    console.log("en fectchdata")
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showModal("Error", "No se encontró un token de acceso. Por favor, inicia sesión nuevamente.", () => setIsModalOpen(false), 'informative');
      setLoading(false);
      return;
    }

    try {
      endpoint = origin === "Sections" ? endpoint + "/survey/" + idsurvey : endpoint;
     
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
     console.log(response.data)
      setData(response.data);
      if (response.data.length > 0) {
        const allHeaders = Object.keys(response.data[0]);
        const filteredHeaders = visibleColumns.length > 0
          ? allHeaders.filter((header) => visibleColumns.includes(header))
          : allHeaders;
        setHeaders(filteredHeaders);
      }
      setLoading(false);
    } catch (error) {
      
      console.log("entro al cacht")
      if(!error.status === 404){
       console.log("error 404")
        console.error("Error al obtener los datos:", error.status);
        showModal("Error", "Error al obtener los datos. Por favor, revisa tu conexión o vuelve a intentarlo.", () => setIsModalOpen(false), 'informative');
      }

      setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, visibleColumns]);

   // Función para validar si una seccion contiene una pregunta 
   const fetchquestionsvalidate = async (sectionId) => {
   
    try {
        // Construir la URL con el parámetro section_id si está presente
        const url = sectionId ? `surveyquestion?section_id=${sectionId}` : `surveyquestion`;
        const method = 'GET';

        // Realizar la petición usando la función reutilizable apiRequest
        const response = await apiRequest(method, url);
        return response;
    } catch (error) {
        console.error('Error al traer los datos:', error);
        throw error; // Opcional: Lanza el error para que sea manejado donde se llame esta función
    }
};

const handleDelete = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    showModal(
      "Error",
      "No se encontró un token de acceso. Por favor, inicia sesión nuevamente.",
      () => setIsModalOpen(false),
      "informative"
    );
    return;
  }

  try {
    // Verificar si la sección tiene preguntas asociadas
    const questions = await fetchquestionsvalidate(id);

    if (questions.length > 0) {
      showModal(
        "Error",
        `La ${origin === "Category" ? "Categoría" : "Sección"} con ID: ${id} no puede eliminarse porque tiene preguntas asociadas.`,
        () => setIsModalOpen(false),
        "informative"
      );
      return; // Detener la eliminación si hay preguntas asociadas
    }

    // Confirmar la eliminación
    showModal(
      "Confirmación",
      `¿Está seguro de que desea eliminar la ${origin === "Category" ? "Categoría" : "Sección"} con ID: ${id}?`,
      async () => {
        try {
          const response = await axios.delete(`${endpoint}/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          });

          if (response.status === 200 || response.status === 204) {
            showModal(
              "Éxito",
              `${origin === "Category" ? "Categoría" : "Sección"} con ID: ${id} eliminada con éxito.`,
              () => setIsModalOpen(false),
              "informative"
            );
            console.log("antes")
            fetchData(); // Refrescar datos después de eliminar
          } else {
            throw new Error("No se pudo completar la solicitud.");
          }
        } catch (error) {
          console.error(
            `Error al eliminar la ${origin === "Category" ? "Categoría" : "Sección"}.`,
            error.response?.data || error.message
          );

          const errorMessage = error.response?.data?.message || error.message;
         
          if (
            errorMessage.includes("SQLSTATE[23503]: Foreign key violation:")
          )
           
          {
            showModal(
              "Error",
              `No se puede eliminar la ${origin === "Category" ? "Categoría por que contiene encuestas asociadas" : "Sección por que contiene preguntas  asociadas"}`,
              () => setIsModalOpen(false),
              "informative"
            );
          } else {
            // Manejar otros errores genéricos
            showModal(
              "Error",
              `Error al eliminar la..... ${origin === "Category" ? "Categoría" : "Sección"}: ${
                errorMessage || "Por favor, inténtelo de nuevo."
              }`,
              () => setIsModalOpen(false),
              "informative"
            );
          }
        }
      }
    );
  } catch (error) {
    console.error(
      "Error al verificar preguntas asociadas:",
      error.response?.data || error.message
    );
    showModal(
      "Error",
      `Error al verificar preguntas asociadas: ${
        error.response?.data?.message || "Por favor, inténtelo de nuevo."
      }`,
      () => setIsModalOpen(false),
      "informative"
    );
  }
};



  const handleCheckboxChange = (id, title) => {
    setSelectedCategoryName(title)
    setSelectedCategoryId(id === selectedCategoryId ? null : id);
  };

  const validateSelection = () => {
    if (!selectedCategoryId) {
      showModal("Advertencia", "Debe seleccionar una categoría antes de continuar.", () => setIsModalOpen(false), 'informative');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateSelection()) {
     const idname=[]
     idname.push([selectedCategoryId, selectedCategoryName])
     console.log(idname)
      setSelectedCategory(idname ); 
      navigate("/survey-create");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 border rounded mx-1 ${
            currentPage === i ? "bg-[rgba(57,169,0,1)] text-white" : "bg-white text-[rgba(57,169,0,1)]"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col w-full items-center mt-4">
      <div className="flex justify-center w-full overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto w-full border border-gray-300 rounded-[19px]"> {/* Cambiado a w-full */}
          <table className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 bg-[#003f63] text-white z-10">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className={`border border-[#003f63] py-2 px-6 text-lg ${
                      header === "id" ? "w-32" : ""
                    }`}
                  >
                    {columnAliases[header] || header}
                  </th>
                ))}
                {showSelect && (
                  <th className="border border-[#003f63] py-2 px-6 text-lg w-32">
                    Seleccionar
                  </th>
                )}
                {showEdit && (
                  <th className="border border-[#003f63] py-2 px-6 text-lg w-32">
                    Editar
                  </th>
                )}
                {showDelete && (
                  <th className="border border-[#003f63] py-2 px-6 text-lg w-32">
                    Eliminar
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      headers.length +
                      (showSelect ? 1 : 0) +
                      (showEdit ? 1 : 0) +
                      (showDelete ? 1 : 0)
                    }
                    className="py-6 px-8 border border-gray-300 w-full text-center"
                  >
                    Cargando datos...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border border-gray-300 bg-gray-200"
                  >
                    {headers.map((header) => (
                      <td
                        key={header}
                        className={`py-2 px-6 border border-gray-300 text-center text-[#00324D] ${
                          header === "id" ? "w-32" : ""
                        }`}
                      >
                        {item[header]}
                      </td>
                    ))}
                    {showSelect && (
                      <td className="py-2 px-6 border border-gray-300 text-center text-[#00324D]">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-[#003f63]"
                          checked={selectedCategoryId === item.id}
                          onChange={() => handleCheckboxChange(item.id, item.title )}
                          disabled={
                            selectedCategoryId !== null &&
                            selectedCategoryId !== item.id
                          }
                        />
                      </td>
                    )}
                    {showEdit && (
                      <td className="py-2 px-6 border border-gray-300 text-center w-32">
                        <button onClick={() => onEdit(item)}>
                          {/* <FaEdit className="text-[#003f63]" /> */}
                          ✏️
                        </button>
                      </td>
                    )}
                    {showDelete && (
                      <td className="py-2 px-6 border border-gray-300 text-center w-32">
                        <button onClick={() => handleDelete(item.id)}>
                          {/* <FaTrash className="text-[#003f63]" /> */}
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      headers.length +
                      (showSelect ? 1 : 0) +
                      (showEdit ? 1 : 0) +
                      (showDelete ? 1 : 0)
                    }
                    className="py-6 px-8 border border-gray-300 w-full text-center"
                  >
                    No se encontraron datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center w-full mt-4"> 
        {renderPageNumbers()}
      </div>

      <div className="w-full flex justify-end mt-2"> 
        {showBackButton && (
          <button
            className="bg-[rgba(57,169,0,1)] text-white py-2 px-4 rounded"
            onClick={() =>
              origin === "Sections" ? navigate("/QuestionsCreate") : navigate(-1)
            }
          >
            {origin === "Sections" ? "Siguiente" : "Volver"}
          </button>
        )}

            {showNextButton && (
              <div className="relative inline-block group">
                <button
                  className={`py-2 px-4 rounded text-white ${
                    selectedCategoryId 
                      ? 'bg-[rgba(57,169,0,1)] hover:bg-green-600' // Fondo normal cuando está habilitado
                      : 'bg-gray-400 cursor-not-allowed' // Fondo gris y cursor no permitido cuando está deshabilitado
                  }`}
                  onClick={handleNext}
                  disabled={!selectedCategoryId}
                >
                  Siguiente
                </button>

                {/* Tooltip visible solo cuando el botón está deshabilitado */}
                {!selectedCategoryId && (
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Por favor, seleccione una categoría
                  </span>
                )}
              </div>
            )}



      
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={confirmAction}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Aceptar"
        cancelText="Cancelar"
        type={modalType}
      />
    </div>
  );
};

export default TableComponent;
