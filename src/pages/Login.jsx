import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/img/login_enc.svg';
import logo1 from '../assets/img/Vector.png';
import logo2 from '../assets/img/logo_sena.svg';
import EyeIcon from '../assets/img/EyeIcon.svg';
import logoGov from '../assets/img/log_gov.svg';

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
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* Barra azul superior */}
      <div className="w-full bg-blue-600 py-3.5 px-4 flex items-center">
        <img 
          src={logoGov} 
          alt="GOV.CO" 
          className="h-[22px] w-[250px]"
        />
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-grow w-full relative">
        {/* Background azul que ocupa toda la pantalla */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)'
          }}
        >
          {/* Contenido de imagen de fondo */}
          <div className="absolute inset-0 flex items-center justify-center md:pr-[40%]">
            <img
              src={backgroundImage}
              alt="Sistema de Encuestas Zajuna"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Panel blanco con bordes redondeados */}
        <div className="relative ml-auto w-full md:w-2/5 h-full">
          <div className="absolute inset-0 bg-white rounded-l-[42px] flex items-center justify-center">
            <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8">
              {/* Cabecera */}
              <div className="text-center mb-10">
                <h2 className="text-6xl" style={{ color: '#00324D' }}>
                  Bienvenido al
                </h2>
                <h2 className="text-6xl font-bold" style={{ color: '#39A900' }}>
                  Sistema de Encuestas
                </h2>
                <p className="mt-3 text-2xl text-center" style={{ color: '#00324D' }}>
                  Un espacio diseñado para hacer más fácil y eficiente
                  <br />
                  la experiencia de toda la comunidad <span className="font-bold">SENA</span>.
                </p>
              </div>

              {/* Formulario con placeholders */}
              <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                {/* Campo de correo con placeholder */}
                <div className="w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-md border focus:outline-none text-2xl"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Correo electrónico"
                    required
                  />
                </div>

                {/* Campo de contraseña con placeholder */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-md border focus:outline-none text-2xl"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Contraseña"
                    required
                  />
                  <img
                    src={EyeIcon}
                    alt="Mostrar contraseña"
                    className="absolute top-1/2 right-6 transform -translate-y-1/2 cursor-pointer w-6 h-6"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>

                {/* Mensaje de error */}
                {error && <p className="text-red-500 text-center text-2xl">{error}</p>}

                {/* Botón de inicio de sesión */}
                <button
                  type="submit"
                  className="w-full py-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none transition-colors text-2xl"
                  style={{ backgroundColor: '#39A900' }}
                >
                  Iniciar sesión
                </button>

                {/* Enlace de registro */}
                <div className="text-center mt-2">
                  <Link to="/register">
                    <div style={{ color: '#00324D', textDecoration: 'underline' }} className="inline-block text-2xl">
                      ¿No tiene una cuenta aún?, <span className="font-bold">Registrarme</span>
                    </div>
                  </Link>
                </div>
              </form>

              {/* Logotipos inferiores */}
              <div className="flex justify-center items-center mt-40 mb-10">
                <img src={logo2} alt="Logo SENA" className="h-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;