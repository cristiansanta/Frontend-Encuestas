import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/img/zajunaMove.gif';
import backgroundStatic from '../assets/img/zajunaStatic.gif';
import logo2 from '../assets/img/logo_sena.svg';
import EyeIcon from '../assets/img/EyeIcon.svg';
import logoGov from '../assets/img/log_gov.svg';
import TopBanner from '../components/TopBanner';
import zajunaframe from '../assets/img/zajunaFrame.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Estados para la detección de dispositivo y orientación
  const [layout, setLayout] = useState({
    isMobile: false,
    isLandscape: false
  });

  // Estado para la transición del GIF a la imagen estática
  const [gifState, setGifState] = useState({
    played: false,
    loaded: false,
    opacity: 1,
    staticOpacity: 0
  });

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  // Detectar tipo de dispositivo y orientación
  useEffect(() => {
    const detectMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobileRegex.test(userAgent) || window.innerWidth < 768;
    };

    const updateLayout = () => {
      const isMobile = detectMobileDevice();
      const isLandscape = window.innerWidth > window.innerHeight;

      // Actualizar layout solo cuando hay cambios reales
      setLayout(prev => {
        if (prev.isMobile !== isMobile || prev.isLandscape !== isLandscape) {
          console.log("Layout changed:", { isMobile, isLandscape });
          // Resetear el estado del GIF si cambia el layout
          setGifState(prev => ({
            ...prev,
            played: false,
            loaded: false
          }));
          return { isMobile, isLandscape };
        }
        return prev;
      });
    };

    // Ejecutar inmediatamente y configurar listeners
    updateLayout();

    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateLayout, 100);
    });

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  // Manejo de la animación del GIF con la transición suave original
  useEffect(() => {
    if (!gifState.loaded) {
      const preloadGif = new Image();
      preloadGif.src = backgroundImage;
      preloadGif.onload = () => {
        setGifState(prev => ({ ...prev, loaded: true }));
      };

      return () => {
        preloadGif.onload = null;
      };
    }

    if (gifState.loaded && !gifState.played) {
      // La duración real del GIF - 7 segundos
      const gifDuration = 7000;

      // La transición comienza 955ms antes del final del GIF para lograr un efecto más suave
      const transitionStart = gifDuration - 955;

      let animationFrame;
      const startTime = performance.now();

      const animateTransition = (currentTime) => {
        const elapsedTime = currentTime - startTime;

        // Si estamos en el periodo de transición
        if (elapsedTime >= transitionStart && elapsedTime < gifDuration) {
          // Calculamos el progreso de la transición (0-1)
          const progress = (elapsedTime - transitionStart) / (gifDuration - transitionStart);

          // Función de ease personalizada para una transición muy gradual (igual que el original)
          const easeProgress = easeOutQuint(progress);

          setGifState(prev => ({
            ...prev,
            opacity: 1 - easeProgress,
            staticOpacity: easeProgress
          }));

          animationFrame = requestAnimationFrame(animateTransition);
        }
        // Si hemos completado la animación
        else if (elapsedTime >= gifDuration) {
          // Aseguramos una transición completa limpia
          setGifState(prev => ({
            ...prev,
            played: true,
            opacity: 0,
            staticOpacity: 1
          }));
        }
        // Si aún no hemos llegado al tiempo de transición
        else {
          animationFrame = requestAnimationFrame(animateTransition);
        }
      };

      // Función de ease mejorada - easeOutQuint proporciona una salida muy suave
      // Esta es la misma función de ease que usabas en tu código original
      const easeOutQuint = (t) => {
        return 1 - Math.pow(1 - t, 5);
      };

      // Iniciar la animación
      animationFrame = requestAnimationFrame(animateTransition);

      // Limpieza
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [gifState.loaded, gifState.played]);

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

  // Estilos declarativos para las imágenes
  const getImageStyles = () => {
    const { isMobile, isLandscape } = layout;
    const { opacity, staticOpacity, played } = gifState;

    // Mantener exactamente la misma transición que estaba en el código original
    const baseStyles = {
      transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
    };

    // Estilos para el GIF animado
    const gifStyles = {
      ...baseStyles,
      opacity: opacity,
      display: played ? 'none' : 'block', // Quitar del DOM cuando termine
    };

    // Estilos para la imagen estática
    const staticStyles = {
      ...baseStyles,
      opacity: played ? 1 : staticOpacity
    };

    // Estilos contenedor adaptados por dispositivo/orientación
    if (isMobile) {
      if (isLandscape) {
        // Móvil horizontal
        return {
          containerClass: "w-auto h-auto max-h-[90%] max-w-[90%] object-contain",
          gifStyles,
          staticStyles
        };
      } else {
        // Móvil vertical
        return {
          containerClass: "w-full object-contain max-h-[calc(100%-80px)]",
          gifStyles,
          staticStyles
        };
      }
    } else {
      // Desktop
      return {
        containerClass: "object-contain w-full h-full",
        gifStyles,
        staticStyles
      };
    }
  };

  // Componentes de vista basados en el layout actual
  const renderMobileLandscapeView = () => {
    const { containerClass, gifStyles, staticStyles } = getImageStyles();
    console.log("Ejecutando móvil horizontal (Landscape)");

    return (
      <div className="flex flex-row w-full h-screen overflow-hidden bg-blue-600">
        {/* Header móvil con logo GOV.CO como imagen */}
        <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white py-1 px-6 flex items-center z-30">
          <img src={logoGov} alt="GOV.CO" className="h-4" />
        </div>

        {/* Área de contenido principal - adaptada para landscape */}
        <div className="flex flex-row w-full h-full relative overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)' }}>

          {/* Sección izquierda para imágenes - 60% del ancho */}
          <div className="w-3/5 h-full relative flex items-center justify-center pt-10">
            {/* Zajuna Frame ajustado para landscape */}
            <div className="absolute top-0 left-0 right-0 flex justify-center items-start pt-14">
              <img
                src={zajunaframe}
                alt="Zajuna Frame"
                className="w-auto max-w-[80%] h-auto max-h-8 z-20 object-contain"
              />
            </div>
            {/* Contenedor para imágenes con transición */}
            <div className="w-full h-full relative flex items-center justify-center">

              {/* Imagen animada (GIF) con transición - modificar así */}
              {!gifState.played && gifState.loaded && (
                <img
                  src={backgroundImage}
                  alt="Sistema de Encuestas Zajuna (Animado)"
                  className={`${containerClass} absolute top-0 left-0 right-0 bottom-0 m-auto`}
                  style={gifStyles}
                />
              )}

              {/* Imagen estática con transición - modificar así */}
              <img
                src={backgroundStatic}
                alt="Sistema de Encuestas Zajuna"
                className={`${containerClass} absolute top-0 left-0 right-0 bottom-0 m-auto`}
                style={staticStyles}
              />
            </div>
          </div>

          {/* Sección derecha para formulario - 40% del ancho CON ESQUINAS REDONDEADAS */}
          <div className="w-2/5 h-full flex items-center justify-center">
            <div className="bg-white h-full w-full flex flex-col justify-center px-4 py-6 rounded-l-[25px]">
              {/* Texto de bienvenida */}
              <div className="text-center mb-4">
                <h2 className="text-lg" style={{ color: '#00324D' }}>
                  Bienvenido al
                </h2>
                <h2 className="text-lg font-bold" style={{ color: '#39A900' }}>
                  Sistema de Encuestas
                </h2>
                <p className="mt-1 text-xs text-center" style={{ color: '#00324D' }}>
                  Un espacio diseñado para hacer más fácil y eficiente
                  la experiencia de toda la comunidad <span className="font-bold">SENA</span>.
                </p>
              </div>

              {/* Formulario adaptado para landscape */}
              <form className="w-full space-y-2" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border focus:outline-none text-xs"
                  style={{ borderColor: '#D1D5DB' }}
                  placeholder="Correo electrónico"
                  required
                />

                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border focus:outline-none text-xs"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <img
                      src={EyeIcon}
                      alt="Mostrar contraseña"
                      className="w-4 h-4"
                    />
                  </button>
                </div>

                {error && <p className="text-red-500 text-center text-xs">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-1.5 bg-green-600 text-white font-medium rounded-md text-xs"
                  style={{ backgroundColor: '#39A900' }}
                >
                  Iniciar sesión
                </button>
              </form>

              {/* Enlace de registro */}
              <div className="text-center mt-2">
                <Link to="/register">
                  <div className="text-xs" style={{ color: '#00324D' }}>
                    ¿No tiene una cuenta aún? <span style={{ textDecoration: 'underline', color: '#00324D', fontWeight: 'bold' }}>Registrarme</span>
                  </div>
                </Link>
              </div>

              {/* Logo SENA */}
              <div className="mt-6 flex justify-center">
                <img src={logo2} alt="Logo SENA" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    const { containerClass, gifStyles, staticStyles } = getImageStyles();
    console.log("Ejecutando móvil verticalmente");

    return (
      <div className="flex flex-col w-full h-screen overflow-hidden bg-blue-600">
        {/* Header móvil con logo GOV.CO como imagen */}
        <div className="w-full bg-blue-600 text-white py-2 px-4 flex items-center">
          <img src={logoGov} alt="GOV.CO" className="h-5" />
        </div>

        {/* Área de contenido principal */}
        <div className="flex-grow relative overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)' }}>

          {/* Contenedor para imágenes con transición */}
          <div className="absolute inset-0 flex items-center justify-center pt-16 pb-40">
            <div className="w-full h-full relative flex flex-col items-center">
              {/* Imagen animada (GIF) con transición */}
              {!gifState.played && gifState.loaded && (
                <img
                  src={backgroundImage}
                  alt="Sistema de Encuestas Zajuna (Animado)"
                  className={containerClass}
                  style={gifStyles}
                />
              )}

              {/* Imagen estática con transición */}
              <img
                src={backgroundStatic}
                alt="Sistema de Encuestas Zajuna"
                className={`${containerClass} absolute top-0 left-0 right-0`}
                style={staticStyles}
              />

              {/* Zajuna Frame superpuesto sobre el GIF/imagen estática */}
              <div className="absolute top-0 left-0 right-0 flex justify-center items-start pt-2">
                <img
                  src={zajunaframe}
                  alt="Zajuna Frame"
                  className="w-auto max-w-[100%] h-auto max-h-16 z-20 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Panel blanco redondeado en la parte inferior - sin modificar */}
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

              {/* Formulario - sin cambios */}
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
  };

  const renderDesktopView = () => {
    const { containerClass, gifStyles, staticStyles } = getImageStyles();
    console.log("Ejecutando versión escritorio");

    return (
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

            {/* Contenedor para las imágenes con transición suave */}
            <div className="absolute inset-0 flex items-center justify-center pr-[40%]">
              <div className="w-4/5 h-4/5 relative flex items-center justify-center">
                {/* Imagen animada (GIF) con transición mejorada */}
                {!gifState.played && gifState.loaded && (
                  <img
                    src={backgroundImage}
                    alt="Sistema de Encuestas Zajuna (Animado)"
                    className={containerClass}
                    style={{ ...gifStyles, position: "absolute", zIndex: 10 }}
                  />
                )}

                {/* Imagen estática con transición mejorada */}
                <img
                  src={backgroundStatic}
                  alt="Sistema de Encuestas Zajuna"
                  className={containerClass}
                  style={{ ...staticStyles, position: "absolute", zIndex: 10 }}
                />
              </div>
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
  };

  // Renderizado basado en el layout actual
  console.log("DECISIÓN DE RENDERIZADO:", layout);

  const { isMobile, isLandscape } = layout;

  if (isMobile) {
    if (isLandscape) {
      console.log("Renderizando: Mobile Landscape");
      return renderMobileLandscapeView();
    } else {
      console.log("Renderizando: Mobile Portrait");
      return renderMobileView();
    }
  } else {
    console.log("Renderizando: Desktop");
    return renderDesktopView();
  }
};

export default Login;