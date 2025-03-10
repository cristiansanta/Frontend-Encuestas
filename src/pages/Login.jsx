import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate para la redirección y Link para el enlace de registro
import axios from 'axios';
import backgroundImage from '../assets/img/login_enc.svg';
import logo1 from '../assets/img/Vector.png';
import logo2 from '../assets/img/logo_sena.png';
import EyeIcon from '../assets/img/EyeIcon.svg';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(endpoint + 'login', {
        email,
        password,
      });
  
      if (response.data && response.data.access_token) {
        if (response.data.user.active) {
          // Si el usuario está activo, se almacenan los datos y se navega al Dashboard
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('userName', response.data.user.name);
          localStorage.setItem('id_user', response.data.user.id);
          localStorage.setItem('active', response.data.user.active);
          navigate('Dashboard');
        } else {
          // Si el usuario está inactivo, se muestra el error
          setError(
            'La cuenta con la que intenta acceder está inactiva. Por favor, contacte al administrador del sistema.'
          );
        }
      } else {
        console.error('No se recibió un token de acceso.');
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('Error en el login:', err);
    }
  };
  

  return (
    <div
      className="w-full min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-end p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/10 backdrop-blur-[57.53px] rounded-[48.91px] shadow-xl p-10 sm:p-12 md:p-16 lg:p-20 xl:p-24 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mr-2 sm:mr-8 md:mr-20 border border-white/40 bg-opacity-50">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6" style={{ color: '#00324D' }}>
          Bienvenido al <br /> <span style={{ color: '#39A900' }}>Sistema de encuestas</span>
        </h2>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xl font-bold text-start" style={{ color: '#00324D' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-4 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
              style={{ borderColor: '#00324D' }}
            />
          </div>

          <div>
            <label className="block text-xl font-bold text-start" style={{ color: '#00324D' }}>
              Contraseña
            </label>
            <div className="relative mt-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white/10 backdrop-blur-[57.53px] bg-opacity-50"
                style={{ borderColor: '#00324D' }}
              />
              <img src={EyeIcon} alt="Mostrar contraseña" className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer w-6 h-6" onClick={() => setShowPassword(!showPassword)}/>
              </div>
            </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

         
         
          <button
            type="submit"
            className="text-xl font-bold w-full py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none mt-2"
            style={{ backgroundColor: '#39A900', hover: { backgroundColor: '#2F8A00' } }}
          >
            Iniciar sesión
          </button>
        </form>

        <div className="flex justify-center mt-6 space-x-6 mt-14">
          <img src={logo2} alt="Logo 1" className="w-18 h-18" />
          <img src={logo1} alt="Logo 2" className="w-18 h-18" />
        </div>
      </div>
    </div>
  );
};

export default Login;
