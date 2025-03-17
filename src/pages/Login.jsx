import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/img/login_enc.svg';
import logo2 from '../assets/img/logo_sena.svg';
import EyeIcon from '../assets/img/EyeIcon.svg';
import TopBanner from '../components/TopBanner';

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
      {/* En la versión móvil, usamos un encabezado más simple */}
      <div className="w-full bg-blue-600 text-white py-2 px-4 flex items-center md:hidden">
        <span className="text-sm font-semibold">GOV.CO</span>
      </div>
      {/* En desktop usamos el TopBanner completo */}
      <div className="hidden md:block">
        <TopBanner />
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row flex-grow w-full relative">
        {/* Background azul que ocupa toda la pantalla */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)'
          }}
        >
          {/* Carrusel indicadores en móvil */}
          <div className="absolute bottom-[42%] w-full flex justify-center items-center space-x-2 md:hidden">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>

          {/* Contenido de imagen de fondo */}
          <div className="absolute inset-0 flex items-center justify-center md:pr-[40%] pt-16 pb-[40%] md:py-0">
            
              <img
                src={backgroundImage}
                alt="Sistema de Encuestas Zajuna"
                className="w-full h-full object-contain md:object-cover"
              />
          </div>
        </div>

        {/* Panel blanco con bordes redondeados */}
        <div className="relative ml-auto w-full md:w-2/5 h-[60%] md:h-full mt-auto md:mt-0">
          <div className="absolute inset-0 bg-white rounded-t-[25px] md:rounded-t-none md:rounded-l-[25px] flex items-center justify-center overflow-y-auto">
            <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8">
              {/* Cabecera */}
              <div className="text-center mb-6 md:mb-10">
                <h2 className="text-3xl md:text-5xl" style={{ color: '#00324D' }}>
                  Bienvenido al
                </h2>
                <h2 className="text-3xl md:text-5xl font-bold" style={{ color: '#39A900' }}>
                  Sistema de Encuestas
                </h2>
                <p className="mt-2 md:mt-3 text-sm md:text-1xl text-center" style={{ color: '#00324D' }}>
                  Un espacio diseñado para hacer más fácil y eficiente
                  <br className="hidden md:block" />
                  la experiencia de toda la comunidad <span className="font-bold">SENA</span>.
                </p>
              </div>

              {/* Formulario con placeholders */}
              <form className="space-y-4 md:space-y-6 w-full flex flex-col items-center" onSubmit={handleSubmit}>
                {/* Campo de correo con placeholder */}
                <div className="w-[90%] md:w-4/5 mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 md:px-6 py-2 md:py-3 rounded-md border focus:outline-none text-sm md:text-lg"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Correo electrónico"
                    required
                  />
                </div>

                {/* Campo de contraseña con placeholder */}
                <div className="relative w-[90%] md:w-4/5 mx-auto">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 md:px-6 py-2 md:py-3 rounded-md border focus:outline-none text-sm md:text-lg"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Contraseña"
                    required
                  />
                  <img
                    src={EyeIcon}
                    alt="Mostrar contraseña"
                    className="absolute top-1/2 right-6 transform -translate-y-1/2 cursor-pointer w-5 h-5 md:w-6 md:h-6"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>

                {/* Mensaje de error */}
                {error && <p className="text-red-500 text-center text-sm md:text-2xl w-[90%] md:w-4/5 mx-auto">{error}</p>}

                {/* Botón de inicio de sesión */}
                <button
                  type="submit"
                  className="w-[90%] md:w-4/5 py-2 md:py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none transition-colors text-base md:text-xl mx-auto"
                  style={{ backgroundColor: '#39A900' }}
                >
                  Iniciar sesión
                </button>

                {/* Enlace de registro */}
                <div className="text-center mt-2 w-[90%] md:w-4/5 mx-auto">
                  <Link to="/register">
                    <div style={{ color: '#00324D' }} className="inline-block text-xs md:text-xl">
                      ¿No tiene una cuenta aún? <span className="font-bold text-xs md:text-xl" style={{ color: '#00324D', textDecoration: 'underline' }}>Registrarme</span>
                    </div>
                  </Link>
                </div>
              </form>

              {/* Logotipos inferiores */}
              <div className="flex justify-center items-center mt-8 md:mt-40 mb-4 md:mb-10">
                <img src={logo2} alt="Logo SENA" className="h-16 md:h-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
