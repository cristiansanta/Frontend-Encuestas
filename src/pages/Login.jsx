import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/img/zajunaMove.gif';
// Asumimos que tienes esta imagen estática (último frame del GIF)
import backgroundStatic from '../assets/img/zajunaStatic.svg'; 
import logo2 from '../assets/img/logo_sena.svg';
import EyeIcon from '../assets/img/EyeIcon.svg';
import logoGov from '../assets/img/log_gov.svg'; // Importar el logo GOV.CO
import TopBanner from '../components/TopBanner';
import zajunaframe from '../assets/img/zajunaFrame.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Nuevo estado para controlar si el GIF ya se reprodujo
  const [gifPlayed, setGifPlayed] = useState(false);

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  // Detectar si es vista móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efecto para controlar la reproducción del GIF una sola vez
  useEffect(() => {
    // Solo si no se ha reproducido todavía
    if (!gifPlayed) {
      // Duración aproximada del GIF - ajusta esto según la duración real
      const gifDuration = 3000; // 3 segundos
      
      const timer = setTimeout(() => {
        setGifPlayed(true);
      }, gifDuration);
      
      return () => clearTimeout(timer);
    }
  }, [gifPlayed]);

  // Auto-rotación del carrusel en móvil
  useEffect(() => {
    if (isMobile) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isMobile]);

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

  // Imágenes para el carrusel móvil
  const carouselImages = [
    `${import.meta.env.VITE_PUBLIC_URL}/carrusel_1.jpg`, 
    `${import.meta.env.VITE_PUBLIC_URL}/carrusel_2.jpg`,
    `${import.meta.env.VITE_PUBLIC_URL}/carrusel_3.jpg`
  ];
  
  // Fallback a la imagen que ya tenemos en caso de error
  const handleImageError = (e) => {
    e.target.src = backgroundImage;
  };

  const renderMobileView = () => (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-blue-600">
      {/* Header móvil con logo GOV.CO como imagen */}
      <div className="w-full bg-blue-600 text-white py-2 px-4 flex items-center">
        <img src={logoGov} alt="GOV.CO" className="h-5" />
      </div>

      {/* Área de contenido principal */}
      <div className="flex-grow relative overflow-hidden" 
           style={{ background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)' }}>
          {/* Carrusel en versión móvil */}
        <div className="absolute inset-0 flex items-center justify-center pt-16 pb-40">
          <div className="w-full h-full relative flex flex-col items-center">            
            {/* Imagen principal del carrusel */}
            <img
              src={carouselImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full object-contain"
              style={{ maxHeight: "calc(100% - 80px)" }}
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-[42%] w-full flex justify-center items-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-green-500' : 'bg-white'
              }`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>

        {/* Panel blanco redondeado en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[25px] pt-6 pb-12 px-6">
          <div className="flex flex-col items-center">
            {/* Texto de bienvenida */}
            <h2 className="text-2xl text-center" style={{ color: '#00324D' }}>
              Bienvenido al
            </h2>
            <h2 className="text-2xl font-bold text-center" style={{ color: '#39A900' }}>
              Sistema de Encuestas
            </h2>
            <p className="mt-2 text-xs text-center px-4 mx-auto" style={{ color: '#00324D', maxWidth: "320px" }}>
              Un espacio diseñado para hacer más fácil y eficiente la experiencia
              de toda la comunidad <span className="font-bold">SENA</span>.
            </p>

            {/* Formulario */}
            <form className="w-full space-y-3 mt-4" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border focus:outline-none text-sm"
                style={{ borderColor: '#D1D5DB' }}
                placeholder="Correo electrónico"
                required
              />
              
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none text-sm"
                  style={{ borderColor: '#D1D5DB' }}
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <img
                    src={EyeIcon}
                    alt="Mostrar contraseña"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              {error && <p className="text-red-500 text-center text-xs">{error}</p>}

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white font-medium rounded-md text-sm"
                style={{ backgroundColor: '#39A900' }}
              >
                Iniciar sesión
              </button>
            </form>

            {/* Enlace de registro */}
            <div className="text-center mt-3">
              <Link to="/register">
                <div className="text-xs" style={{ color: '#00324D' }}>
                  ¿No tiene una cuenta aún? <span style={{ textDecoration: 'underline', color: '#00324D', fontWeight: 'bold' }}>Registrarme</span>
                </div>
              </Link>
            </div>

            {/* Logo SENA */}
            <div className="mt-8 flex justify-center">
              <img src={logo2} alt="Logo SENA" className="h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* TopBanner para desktop */}
      <div className="block">
        <TopBanner />
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-row flex-grow w-full relative">
        {/* Background azul que ocupa toda la pantalla */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)'
          }}
        >
          {/* Contenedor para el logo/frame de Zajuna en la parte superior */}
          <div className="absolute inset-0 flex items-start justify-center pr-[40%] pt-16">
            <img
              src={zajunaframe}
              alt="Zajuna Frame"
              className="z-20 w-auto h-auto max-w-[80%] max-h-[30%] object-contain"
            />
          </div>
        
          {/* Contenedor para la imagen de fondo (gif o estática) */}
          <div className="absolute inset-0 flex items-center justify-center pr-[40%]">
            <img
              src={gifPlayed ? backgroundStatic : backgroundImage}
              alt="Sistema de Encuestas Zajuna"
              className="w-4/5 h-4/5 object-contain z-10"
            />
          </div>
        </div>

        {/* Panel blanco con bordes redondeados */}
        <div className="relative ml-auto w-2/5 h-full">
          <div className="absolute inset-0 bg-white rounded-l-[25px] flex items-center justify-center">
            <div className="w-full max-w-3xl px-8">
              {/* Cabecera */}
              <div className="text-center mb-10">
                <h2 className="text-5xl" style={{ color: '#00324D' }}>
                  Bienvenido al
                </h2>
                <h2 className="text-5xl font-bold" style={{ color: '#39A900' }}>
                  Sistema de Encuestas
                </h2>
                <p className="mt-3 text-1xl text-center" style={{ color: '#00324D' }}>
                  Un espacio diseñado para hacer más fácil y eficiente
                  <br />
                  la experiencia de toda la comunidad <span className="font-bold">SENA</span>.
                </p>
              </div>

              {/* Formulario con placeholders */}
              <form className="space-y-6 w-full flex flex-col items-center" onSubmit={handleSubmit}>
                {/* Campo de correo con placeholder */}
                <div className="w-4/5 mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-3 rounded-md border focus:outline-none text-base"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Correo electrónico"
                    required
                  />
                </div>

                {/* Campo de contraseña con placeholder */}
                <div className="relative w-4/5 mx-auto">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-3 rounded-md border focus:outline-none text-base"
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
                {error && <p className="text-red-500 text-center text-2xl w-4/5 mx-auto">{error}</p>}

                {/* Botón de inicio de sesión */}
                <button
                  type="submit"
                  className="w-4/5 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none transition-colors text-xl mx-auto"
                  style={{ backgroundColor: '#39A900' }}
                >
                  Iniciar sesión
                </button>

                {/* Enlace de registro */}
                <div className="text-center mt-2 w-4/5 mx-auto">
                  <Link to="/register">
                    <div style={{ color: '#00324D' }} className="inline-block text-xl">
                      ¿No tiene una cuenta aún? <span className="font-bold text-xl" style={{ color: '#00324D', textDecoration: 'underline' }}>Registrarme</span>
                    </div>
                  </Link>
                </div>
              </form>

              {/* Logotipos inferiores */}
              <div className="flex justify-center items-center mt-40 mb-10">
                <img src={logo2} alt="Logo SENA" className="h-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar vista según el tamaño de la pantalla
  return isMobile ? renderMobileView() : renderDesktopView();
};

export default Login;