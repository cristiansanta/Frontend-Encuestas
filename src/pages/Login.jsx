import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('userName', response.data.user.name);
          localStorage.setItem('id_user', response.data.user.id);
          localStorage.setItem('active', response.data.user.active);
          navigate('Dashboard');
        } else {
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
    <div className="flex w-full h-screen overflow-hidden">
      {/* Lado izquierdo - Imagen completa */}
      <div className="hidden md:block md:w-3/5 bg-navy-dark">
        <img 
          src={backgroundImage} 
          alt="Sistema de Encuestas Zajuna" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Lado derecho - Formulario de login */}
      <div className="w-full md:w-2/5 flex items-center justify-center bg-white">
        <div className="w-full max-w-lg px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: '#00324D' }}>
              Bienvenido al 
              <br />
              <span style={{ color: '#39A900' }}>Sistema de Encuestas</span>
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-base font-medium mb-1" style={{ color: '#00324D' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none"
                style={{ borderColor: '#00324D' }}
                required
              />
            </div>
            
            <div>
              <label className="block text-base font-medium mb-1" style={{ color: '#00324D' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none"
                  style={{ borderColor: '#00324D' }}
                  required
                />
                <img 
                  src={EyeIcon} 
                  alt="Mostrar contraseña" 
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer w-5 h-5"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 mt-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none transition-colors"
              style={{ backgroundColor: '#39A900' }}
            >
              Iniciar sesión
            </button>

            <div className="text-center mt-2">
              <p className="text-gray-600 text-sm">
                ¿No tiene una cuenta aún?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Registrarme
                </Link>
              </p>
            </div>
          </form>

          <div className="flex justify-center items-center mt-8 space-x-8">
            <img src={logo2} alt="Logo SENA" className="h-12" />
            <img src={logo1} alt="Logo Zajuna" className="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;