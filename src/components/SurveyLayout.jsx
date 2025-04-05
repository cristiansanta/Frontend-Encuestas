import React from 'react';
import MainLayout from './MainLayout';
import ProgressBar from './ProgresBar';
import BackHomeButton from './BackHomeButton';

/**
 * Layout específico para las páginas relacionadas con encuestas
 * Extiende el MainLayout agregando la barra de progreso y botón de regreso
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido específico de la página
 * @param {string} props.currentView - Vista actual para la barra de progreso
 * @param {string} props.headerTitle - Título para mostrar en el HeaderBar
 * @param {boolean} props.showBackButton - Indica si se debe mostrar el botón de regreso
 * @returns {JSX.Element} Layout específico para páginas de encuestas
 */
const SurveyLayout = ({ 
  children, 
  currentView,
  headerTitle,
  showBackButton = true 
}) => {
  return (
    <MainLayout headerTitle={headerTitle}>
      <ProgressBar currentView={currentView} />
      <div className="mb-4">
        {showBackButton && <BackHomeButton />}
      </div>
      {children}
    </MainLayout>
  );
};

export default SurveyLayout;