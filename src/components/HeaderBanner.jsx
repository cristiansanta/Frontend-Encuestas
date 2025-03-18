import React from 'react';
import PropTypes from 'prop-types';
import bannerImage from '../assets/img/bannner_encuestas.png';
import dashboardImage from '../assets/img/newbanner.svg';
import '../style/HeaderBanner.css';
import TopBanner from '../components/TopBanner';
import HeaderBar from '../components/HeaderBar';

const HeaderBanner = ({ showDashboardBanner, username }) => {
  // Seleccionar la imagen basada en el estado booleano
  const imageSrc = showDashboardBanner ? dashboardImage : bannerImage;

  return (
    <div className={`banner-container ${showDashboardBanner ? 'svg-container' : ''} relative`}>
      <TopBanner />
      <div className="banner-image-wrapper relative">
        <img
          src={imageSrc}
          alt="Banner Encuestas"
          className={`banner-image ${showDashboardBanner ? 'dashboard-svg' : ''}`}
        />
        <HeaderBar username={username} />
      </div>
    </div>
  );
};

// Definir los tipos de propiedades esperadas
HeaderBanner.propTypes = {
  showDashboardBanner: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

// Definir los valores por defecto de las propiedades
HeaderBanner.defaultProps = {
  showDashboardBanner: false,
  username: '',
};

export default HeaderBanner;