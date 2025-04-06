import React from 'react';
import MainLayout from './MainLayout';
import ProgressBar from './ProgresBar';
import BackHomeButton from './BackHomeButton';
import NavigationButtons from './NavigationButtons';

/**
 * Layout específico para las páginas relacionadas con encuestas
 * Extiende el MainLayout agregando la barra de progreso y botón de regreso
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido específico de la página
 * @param {string} props.currentView - Vista actual para la barra de progreso
 * @param {string} props.headerTitle - Título para mostrar en el HeaderBar
 * @param {boolean} props.showBackButton - Indica si se debe mostrar el botón de regreso
 * @param {string} props.navButtonType - Tipo de botón de navegación ('continue', 'save', 'finish')
 * @param {function} props.onNavButtonClick - Función para manejar el clic en el botón de navegación
 * @param {boolean} props.navButtonDisabled - Si el botón de navegación debe estar deshabilitado
 * @param {boolean} props.showNavButton - Indica si se debe mostrar el botón de navegación
 * @returns {JSX.Element} Layout específico para páginas de encuestas
 */
const SurveyLayout = ({ 
  children, 
  currentView,
  headerTitle,
  showBackButton = true,
  navButtonType = 'continue',
  onNavButtonClick,
  navButtonDisabled = false,
  showNavButton = true
}) => {
  // Determinar automáticamente el tipo de botón según la vista actual
  const getButtonType = () => {
    if (currentView === 'SurveyCreate') return 'save';
    if (currentView === 'PreviewSurvey') return 'finish';
    return 'continue';
  };

  // Usar el tipo de botón proporcionado o determinarlo automáticamente
  const buttonType = navButtonType || getButtonType();

  return (
    <MainLayout headerTitle={headerTitle}>
      <ProgressBar currentView={currentView} />
      <div className="mb-4">
        {showBackButton && <BackHomeButton />}
      </div>
      <div className="w-full mr-auto ml-12">
        {children}
        
        {/* Botón de navegación en la parte inferior */}
        {showNavButton && onNavButtonClick && (
          <NavigationButtons 
            type={buttonType}
            onClick={onNavButtonClick}
            disabled={navButtonDisabled}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default SurveyLayout;