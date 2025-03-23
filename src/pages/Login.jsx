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
  
  // Estados para detección de dispositivo y orientación
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight && window.innerWidth < 768
  );
  
  // Referencias para medir el tamaño exacto y posición del GIF
  const gifRef = useRef(null);
  const staticRef = useRef(null);
  
  // Estado para la transición del GIF a la imagen estática
  const [gifPlayed, setGifPlayed] = useState(false);
  // Estado para controlar la opacidad de la transición
  const [transitionOpacity, setTransitionOpacity] = useState({ gif: 1, static: 0 });
  // Estado para verificar si el GIF está cargado
  const [gifLoaded, setGifLoaded] = useState(false);
  // Estado para controlar las dimensiones precisas
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  // UseEffect mejorado para detectar cambios de orientación y tamaño
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determinar si es móvil basado en el ancho
      const newIsMobile = width < 768;
      
      // Determinar si es landscape (importante: solo para dispositivos móviles)
      // La condición adicional width < 768 asegura que solo consideramos "landscape"
      // cuando estamos en un dispositivo móvil
      const newIsLandscape = width > height && width < 768;
      
      // Actualizar estados solo si hay cambios
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
      
      if (newIsLandscape !== isLandscape) {
        setIsLandscape(newIsLandscape);
        
        // Reiniciar dimensiones cuando cambia la orientación
        setDimensions({ width: 0, height: 0 });
        
        // Pequeño retraso para permitir que el DOM se actualice
        setTimeout(() => {
          if (gifRef.current) {
            const rect = gifRef.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
          }
        }, 300);
      }
    };

    // Llamar a handleResize inmediatamente para establecer el estado inicial correcto
    handleResize();
    
    // Escuchar cambios de tamaño y orientación
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Pequeño retraso después del cambio de orientación para asegurar que
      // las dimensiones de la ventana ya se han actualizado
      setTimeout(handleResize, 100);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile, isLandscape]);

  // Precargar el GIF y capturar su tamaño cuando se carga
  useEffect(() => {
    const preloadGif = new Image();
    preloadGif.src = backgroundImage;
    preloadGif.onload = () => {
      setGifLoaded(true);
      
      // Esperar un poco para que el DOM se actualice con el GIF
      setTimeout(() => {
        if (gifRef.current) {
          // Capturar las dimensiones exactas del GIF renderizado
          const { width, height } = gifRef.current.getBoundingClientRect();
          setDimensions({ width, height });
        }
      }, 100);
    };
    
    return () => {
      preloadGif.onload = null;
    };
  }, []);

  // Efecto para sincronizar las dimensiones de la imagen estática con el GIF
  useEffect(() => {
    if (staticRef.current) {
      if (dimensions.width && dimensions.height) {
        // Si tenemos dimensiones válidas, las aplicamos
        if (isMobile) {
          // Para móvil, aseguramos que se ajusta al contenedor
          staticRef.current.style.width = '100%';
          staticRef.current.style.height = 'auto';
          staticRef.current.style.maxHeight = 'calc(100% - 80px)';
        } else {
          // Para desktop, aplicamos las dimensiones exactas
          staticRef.current.style.width = `${dimensions.width}px`;
          staticRef.current.style.height = `${dimensions.height}px`;
        }
      } else if (!isMobile) {
        // Si no tenemos dimensiones pero estamos en desktop,
        // aplicamos un estilo base para evitar que se vea mal
        staticRef.current.style.width = '100%';
        staticRef.current.style.height = '100%';
      }
    }
  }, [dimensions, gifPlayed, isMobile]);

  // Efecto mejorado para controlar la reproducción del GIF y la transición más suave
  useEffect(() => {
    if (!gifLoaded) return;
    
    // La duración real del GIF - 7 segundos
    const gifDuration = 7000;
    
    // Iniciar la transición con más tiempo para hacerla más gradual
    // Aumentamos el tiempo de transición a 955ms para una transición más suave
    const transitionStart = gifDuration - 955;
    
    let animationFrame;
    const startTime = performance.now();
    
    const animateTransition = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      
      // Si estamos en el periodo de transición
      if (elapsedTime >= transitionStart && elapsedTime < gifDuration) {
        // Usamos una curva de ease personalizada más suave
        const progress = (elapsedTime - transitionStart) / (gifDuration - transitionStart);
        
        // Función de ease personalizada para una transición muy gradual
        const easeProgress = easeOutQuint(progress);
        
        setTransitionOpacity({ 
          gif: 1 - easeProgress, 
          static: easeProgress 
        });
        
        animationFrame = requestAnimationFrame(animateTransition);
      } 
      // Si hemos completado la animación
      else if (elapsedTime >= gifDuration) {
        // Aseguramos una transición completa limpia
        setTransitionOpacity({ gif: 0, static: 1 });
        setGifPlayed(true);
      } 
      // Si aún no hemos llegado al tiempo de transición
      else {
        animationFrame = requestAnimationFrame(animateTransition);
      }
    };
    
    // Función de ease mejorada - easeOutQuint proporciona una salida muy suave
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
  }, [gifLoaded]);

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
  
  // Fallback a la imagen que ya tenemos en caso de error
  const handleImageError = (e) => {
    e.target.src = backgroundImage;
  };

  // Renderizado para vista móvil vertical
  const renderMobileView = () => (
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
              {!gifPlayed && gifLoaded && (
                <img
                  ref={gifRef}
                  src={backgroundImage}
                  alt="Sistema de Encuestas Zajuna (Animado)"
                  className="w-full object-contain"
                  style={{ 
                    maxHeight: "calc(100% - 80px)",
                    opacity: transitionOpacity.gif,
                    transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                  onError={handleImageError}
                />
              )}
              
              {/* Imagen estática con transición */}
              <img
                ref={staticRef}
                src={backgroundStatic}
                alt="Sistema de Encuestas Zajuna"
                className="w-full object-contain absolute top-0 left-0 right-0"
                style={{ 
                  maxHeight: "calc(100% - 80px)",
                  opacity: gifPlayed ? 1 : transitionOpacity.static,
                  transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                }}
                onError={handleImageError}
              />
              
              {/* Zajuna Frame superpuesto sobre el GIF/imagen estática */}
              <div className="absolute top-0 left-0 right-0 flex justify-center items-start pt-2">
                <img
                  src={zajunaframe}
                  alt="Zajuna Frame"
                  className="w-auto max-w-[100%] h-auto max-h-16 fixed top-20 left-0 right-0 z-20 object-contain"
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

  // Renderizado mejorado para vista móvil horizontal (landscape)
  const renderMobileLandscapeView = () => (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      {/* Header móvil con logo GOV.CO */}
      <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white py-1 px-4 flex items-center z-30">
        <img src={logoGov} alt="GOV.CO" className="h-4" />
      </div>
      
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-row w-full h-full pt-6">
        {/* Panel izquierdo con fondo azul e imagen */}
        <div className="w-1/2 h-full relative overflow-hidden" 
             style={{ background: 'linear-gradient(to bottom, #002C4D 0%, #002032 100%)' }}>
          {/* Zajuna Frame */}
          <div className="absolute top-1 left-0 right-0 flex justify-center">
            <img
              src={zajunaframe}
              alt="Zajuna Frame"
              className="w-auto h-auto max-h-8 z-20 object-contain"
            />
          </div>
          
          {/* Contenedor para imágenes */}
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Imagen animada (GIF) */}
              {!gifPlayed && gifLoaded && (
                <img
                  ref={gifRef}
                  src={backgroundImage}
                  alt="Sistema de Encuestas Zajuna (Animado)"
                  className="w-auto h-auto max-h-[80%] max-w-[90%] object-contain"
                  style={{ 
                    opacity: transitionOpacity.gif,
                    transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                  onError={handleImageError}
                />
              )}
              
              {/* Imagen estática */}
              <img
                ref={staticRef}
                src={backgroundStatic}
                alt="Sistema de Encuestas Zajuna"
                className="w-auto h-auto max-h-[80%] max-w-[90%] object-contain absolute"
                style={{ 
                  opacity: gifPlayed ? 1 : transitionOpacity.static,
                  transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                }}
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
        
        {/* Panel derecho con formulario (más simple y controlado) */}
        <div className="w-1/2 h-full bg-white flex flex-col justify-between py-2 pl-4 pr-2">
          <div className="flex flex-col items-center">
            {/* Texto de bienvenida más compacto */}
            <h2 className="text-base sm:text-lg" style={{ color: '#00324D' }}>
              Bienvenido al
            </h2>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#39A900' }}>
              Sistema de Encuestas
            </h2>
            <p className="text-xs text-center px-1 max-w-[200px]" style={{ color: '#00324D' }}>
              Un espacio diseñado para hacer más fácil y eficiente la experiencia
              de toda la comunidad <span className="font-bold">SENA</span>.
            </p>
            
            {/* Formulario compacto */}
            <form className="w-full space-y-2 mt-2 px-2" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-1 rounded-md border focus:outline-none text-xs"
                style={{ borderColor: '#D1D5DB' }}
                placeholder="Correo electrónico"
                required
              />
              
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2 py-1 rounded-md border focus:outline-none text-xs"
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
                    className="w-3 h-3"
                  />
                </button>
              </div>
              
              {error && <p className="text-red-500 text-center text-xs">{error}</p>}
              
              <button
                type="submit"
                className="w-full py-1 bg-green-600 text-white font-medium rounded-md text-xs"
                style={{ backgroundColor: '#39A900' }}
              >
                Iniciar sesión
              </button>
            </form>
            
            {/* Enlace de registro */}
            <div className="text-center mt-1">
              <Link to="/register">
                <div className="text-xs" style={{ color: '#00324D' }}>
                  ¿No tiene una cuenta aún? <span style={{ textDecoration: 'underline', color: '#00324D', fontWeight: 'bold' }}>Registrarme</span>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Logo SENA */}
          <div className="flex justify-center mt-1 mb-2">
            <img src={logo2} alt="Logo SENA" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizado para vista desktop
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
        
          {/* Contenedor para las imágenes con transición suave */}
          <div className="absolute inset-0 flex items-center justify-center pr-[40%]">
            {/* Utilizamos ambas imágenes con posición absoluta y controlamos la opacidad */}
            <div className="w-4/5 h-4/5 relative flex items-center justify-center">
              {/* Imagen animada (GIF) con transición mejorada */}
              {!gifPlayed && gifLoaded && (
                <img
                  ref={gifRef}
                  src={backgroundImage}
                  alt="Sistema de Encuestas Zajuna (Animado)"
                  className="object-contain absolute z-10"
                  style={{ 
                    opacity: transitionOpacity.gif,
                    width: "100%",
                    height: "100%",
                    transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                />
              )}
              
              {/* Imagen estática con transición mejorada */}
              <img
                ref={staticRef}
                src={backgroundStatic}
                alt="Sistema de Encuestas Zajuna"
                className="object-contain absolute z-10"
                style={{ 
                  opacity: gifPlayed ? 1 : transitionOpacity.static,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  transition: "opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                }}
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

  // Función para determinar qué vista renderizar
  const determineView = () => {
    if (!isMobile) {
      return renderDesktopView();
    }
    
    if (isLandscape) {
      return renderMobileLandscapeView();
    }
    
    return renderMobileView();
  };

  // Return final con la función determineView
  return determineView();
};

export default Login;