import React, { useState } from 'react';
import axios from 'axios';
import AddUser from '../../assets/img/AddUser.png'; // La imagen que mencionaste
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // Estado para el rol seleccionado
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + 'newusers/store', {
        name: `${name} ${lastName}`,
        email,
        password,
        password_confirmation: confirmPassword,
        role_id: selectedRole, // Incluir el rol seleccionado en la solicitud
      });

      if (response.status === 201) {
        setIsModalOpen(true);
        handleCreateMore();
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        const errorMessage = Object.values(errors).flat().join(', ');
        setError(errorMessage);
      } else {
        setError('Error al registrar el usuario. Intenta nuevamente.');
      }
      console.error(err);
    }
  };

  const handleCreateMore = () => {
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSelectedRole('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mt-6">
      <div className="bg-white w-full rounded-2xl">
        {error && <p className="text-red-500">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-start mb-4" style={{ color: '#00324D' }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#00334F] bg-white h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-[#39A900] text-lg font-bold hover:bg-green-600 text-white py-2 px-12 rounded-xl"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
