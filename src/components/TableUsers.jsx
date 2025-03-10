import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al dashboard
import PlusUser from '../assets/img/PlusUser.png';
import EditUser from '../assets/img/Editar.png';
import DeleteUser from '../assets/img/Eliminar.png';
import apiRequest from '../Provider/apiHelper';

const TableUsers = ({ toggleModal }) => {
  // Estado para almacenar los usuarios
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const usersPerPage = 10; // Número de usuarios por página

  // Hook para navegar
  const navigate = useNavigate();

  // Función para cargar los datos de la API
  const fetchUsers = async () => {
    try {
      const data = await apiRequest('GET', 'roleandusers'); // Reemplaza 'users' con el endpoint correcto
      setUsers(data.data); // Guarda los datos en el estado
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // useEffect para llamar fetchUsers al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Calcular los usuarios visibles en la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
// Función para actualizar el estado del usuario
const handleUpdate = async (userId, currentState) => {
  try {
    // Invertir el estado actual
    const newState = !currentState;

    // Crear los datos para la actualización
    const data = { active: newState }; // El nuevo estado del campo 'active'

    // Realizar la petición al endpoint
    const response = await apiRequest('PUT', `users/${userId}`, data);

    //console.log('Usuario actualizado:', response);

    // Recargar los datos completos después de la actualización
    await fetchUsers(); // Llama a fetchUsers para actualizar la lista completa

    //alert(`Estado del usuario actualizado a ${newState ? 'Activo' : 'Inactivo'}.`);
  } catch (error) {
    console.error('Error actualizando el usuario:', error);
    alert('Hubo un error al actualizar el estado del usuario.');
  }
};



  // Calcular el número total de páginas
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto">
      {/* Encabezado */}
      <div className="bg-[#00334F] p-4 rounded-t-md">
        <h2 className="text-white text-center font-bold text-xl">Usuarios creados</h2>
      </div>

      {/* Contenedor para el botón y búsqueda */}
      <div className="flex items-center justify-between mt-6">
        {/* Botón Añadir Usuario */}
        <button
          onClick={toggleModal}
          className="p-2 rounded-md transition duration-300 flex items-center"
          aria-label="Añadir Usuario"
        >
          <img
            src={PlusUser}
            alt="Añadir Usuario"
            className="w-44 h-10 mr-2"
          />
        </button>

        {/* Caja de búsqueda */}
        <div className="relative flex-grow max-w-xs ml-4">
          <input
            type="text"
            placeholder="Buscar Usuario"
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 rounded-lg border border-[#00334F] focus:outline-none focus:ring-2 focus:ring-[#00334F] transition duration-300 ease-in-out"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00334F] text-lg">
            <i className="fa fa-search"></i>
          </span>
        </div>
      </div>

      {/* Tabla dinámica */}
      <div className="overflow-x-auto mt-4 rounded-xl">
        <table className="min-w-full bg-white shadow-md" style={{ tableLayout: 'fixed' }}>
          <thead className="rounded-t-xl">
            <tr className="bg-[#00324D] text-white text-sm">
              <th className="py-2 px-2 text-center rounded-tl-md" style={{ width: '16%' }}>Código</th>
              <th className="py-2 px-2 text-center" style={{ width: '16%' }}>Usuario</th>
              <th className="py-2 px-2 text-center" style={{ width: '16%' }}>Correo</th>
              <th className="py-2 px-2 text-center" style={{ width: '16%' }}>Rol</th>
              <th className="py-2 px-2 text-center" style={{ width: '16%' }}>Activo</th>
              <th className="py-2 px-2 text-center rounded-tr-md" style={{ width: '20%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`${index % 2 === 0 ? 'bg-[#D9D9D9]' : 'bg-white'} text-sm leading-tight`}
              >
                <td className="py-1 px-2 text-center border-t border-[#D9D9D9]">{user.id}</td>
                <td className="py-1 px-2 text-center border-t border-[#D9D9D9]">{user.name}</td>
                <td className="py-1 px-2 text-center border-t border-[#D9D9D9]">{user.email}</td>
                <td className="py-1 px-2 text-center border-t border-[#D9D9D9]">{user.roles.length > 0
                    ? user.roles.map((role) => role.name).join(', ') 
                    : 'Sin Rol'} </td>
                    <td className="py-1 px-2 text-center border-t border-[#D9D9D9]">
                        <label className="flex items-center space-x-2 justify-center">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={user.active} // El estado actual del usuario
                            onChange={() => handleUpdate(user.id, user.active)} // Cambiar el estado al opuesto
                            className="form-checkbox h-5 w-5 text-green-500 border-gray-300 focus:ring-green-500"
                          />
                          {/* Texto */}
                          <span
                            className={`${
                              user.active ? 'text-green-500' : 'text-red-500'
                            } font-medium`}
                          >
                            {user.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </label>
                      </td>
                <td className="py-1 px-2 text-center border-t border-[#D9D9D9]">
                  <div className="flex flex-row space-x-2 items-center justify-center">
                    <button>
                      <img
                        src={EditUser}
                        alt="Editar Usuario"
                        className="w-16 h-8"
                      />
                    </button>
                    <button
                     onClick={() => handleDelete(user.id)}
                    >
                      <img
                        src={DeleteUser}
                        alt="Eliminar Usuario"
                        className="w-16 h-8"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === index + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Botón Volver */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate('/dashboard')} // Ajusta la ruta según tu configuración
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default TableUsers;
