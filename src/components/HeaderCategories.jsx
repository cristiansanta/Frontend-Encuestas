import React, { useState, useEffect } from "react";
import Notificationpush from "./Notificationpush"; // Importa el componente de notificación

const CategoryForm = ({
  descrip,
  nametext,
  namedescrip,
  onSave,
  endpoint,
  id_survey,
  origin,
  selectedSection,
  onEditComplete,
}) => {
  const [title, setTitle] = useState("");
  const [descrip_sect, setDescripSect] = useState("");
  const [descrip_cat, setDescripCat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAction, setNotificationAction] = useState("guardar");

  useEffect(() => {
    if (selectedSection) {
      setTitle(selectedSection.title || "");
      setDescripSect(selectedSection.descrip_sect || "");
      setDescripCat(selectedSection.descrip_cat || "");
    }
  }, [selectedSection]);

  const handleSave = async () => {
    if (!title || (origin === "Sections" && !descrip_sect) || (origin !== "Sections" && !descrip_cat)) {
      setNotificationMessage("Por favor, completa todos los campos antes de guardar.");
      setNotificationAction("error");
      setShowNotification(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No se encontró el token de acceso");

      const method = selectedSection ? "PUT" : "POST";
      const url = selectedSection
        ? `${endpoint}/${selectedSection.id}`
        : endpoint + "/store";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body:
          origin === "Sections"
            ? JSON.stringify({ title, descrip_sect, id_survey })
            : JSON.stringify({ title, descrip_cat }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = `Error ${response.status}: ${
          errorData?.message || response.statusText
        }`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      onSave(data);
      setNotificationMessage("Registro guardado con éxito");
      setNotificationAction("guardar");
      setShowNotification(true);
      resetForm();
      onEditComplete();
    } catch (err) {
      console.error("Error detallado:", err);
      setNotificationMessage(`Error al guardar: ${err.message}`);
      setNotificationAction("error");
      setShowNotification(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescripSect("");
    setDescripCat("");
    onEditComplete();
  };

  return (
    <div className="mt-10 md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 p-4 border-black border-2 border-dashed rounded-md">
      {/* Mostrar notificación si es necesario */}
      {showNotification && (
        <Notificationpush
          message={notificationMessage}
          duration={3000}
          action={notificationAction}
          onClose={() => setShowNotification(false)}
        />
      )}
      <h2 className="text-2xl mb-5 font-bold text-[#00324D]">{descrip}</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-7">
  <div className="flex-grow">
    <input
      type="text"
      placeholder={nametext}
      className="w-full p-1 border rounded font-bold text-xl"
      style={{ borderColor: "#00324DAB" }}
      value={title}
      onChange={(e) => {
        if (e.target.value.length <= 200) {
          setTitle(e.target.value);
        }
      }}
    />
    {/* Mensaje pequeño para los caracteres */}
    <p className="text-sm text-gray-600 mt-1">Se admite un máximo de 200 caracteres.</p>
  </div>
  <div className="flex-grow">
    <input
      type="text"
      placeholder={namedescrip}
      className="w-full p-1 border rounded font-bold text-xl"
      style={{ borderColor: "#00324DAB" }}
      value={origin === "Sections" ? descrip_sect : descrip_cat}
      onChange={(e) => {
        const newValue = e.target.value;
        if (newValue.length <= 200) {
          if (origin === "Sections") {
            setDescripSect(newValue);
          } else {
            setDescripCat(newValue);
          }
        }
      }}
    />
  </div>
</div>


      <div className="flex justify-start gap-2 mt-4">
        <button
          className="text-white px-14 py-2 rounded-lg font-bold"
          style={{ backgroundColor: "#39A900" }}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
        <button
          className="text-white px-14 py-2 rounded-lg font-bold"
          style={{ backgroundColor: "#00324D" }}
          onClick={resetForm}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
