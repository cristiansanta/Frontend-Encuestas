import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import backgroundImage from '../assets/img/login_enc.svg'; 
import Modal from '../components/Modal';
import EyeIcon from '../assets/img/EyeIcon.svg';

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      });

      if (response.status === 201) {
        setIsModalOpen(true); // Abrir modal al crear el usuario con éxito
      }
    } catch (err) {
      setError('Error al registrar el usuario. Intenta nuevamente.');
      console.error(err);
    }
  };

  const handleCreateMore = () => {
    setIsModalOpen(false); 
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-end p-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="bg-white/10 backdrop-blur-[57.53px] rounded-[48.91px] shadow-xl p-10 sm:p-12 md:p-16 lg:p-20 xl:p-24 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mr-2 sm:mr-8 md:mr-20 border border-white/40 bg-opacity-50">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xl font-bold" style={{ color: '#00324D'}}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
              style={{ borderColor: '#00324D' }}
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold" style={{ color: '#00324D'}}>Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
              style={{ borderColor: '#00324D' }}
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold" style={{ color: '#00324D'}}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
              style={{ borderColor: '#00324D' }}
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold" style={{ color: '#00324D'}}>Contraseña</label>
            <div className="relative mt-4">         
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
                style={{ borderColor: '#00324D' }}
                required
              />
              <img src={EyeIcon} alt="Mostrar contraseña" className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer w-6 h-6" onClick={() => setShowPassword(!showPassword)}/>
              </div>  
            </div>
         

          <div>
            <label className="block text-xl font-bold" style={{ color: '#00324D'}}>Confirmar Contraseña</label>
            <div className="relative mt-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
              style={{ borderColor: '#00324D' }}
              required
            />
             <img src={EyeIcon} alt="Mostrar contraseña" className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer w-6 h-6" onClick={() => setShowPassword(!showPassword)}/>
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button type="submit" className="text-xl font-bold w-full py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none" style={{ backgroundColor: '#39A900', hover: { backgroundColor: '#2F8A00' } }}>
            Crear cuenta
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-[#00324D] hover:text-blue-700 underline">
              Iniciar sesión
            </Link>
          </div>
        </form>

        {/* Modal para preguntar si desea agregar más usuarios */}
      </div>
      <Modal
          isOpen={isModalOpen}
          title="Usuario creado con éxito"
          message="¿Desea crear más usuarios o ir al inicio de sesión?"
          onConfirm={handleCreateMore}
          onCancel={handleGoToLogin}
          confirmText="Crear más"
          cancelText="Ir a login"
          type="default" // Asegura que se rendericen los botones
/>

    </div>
  );
};

export default Register;
