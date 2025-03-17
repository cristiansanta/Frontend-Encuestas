import React from 'react';
import PropTypes from 'prop-types';
import bannerImage from '../assets/img/bannner_encuestas.png';
import dashboardImage from '../assets/img/newbanner.svg';
import '../style/HeaderBanner.css';

const HeaderBanner = ({ showDashboardBanner }) => {
  // Seleccionar la imagen basada en el estado booleano
  const imageSrc = showDashboardBanner ? dashboardImage : bannerImage;

  return (
    <div className={`banner-container ${showDashboardBanner ? 'svg-container' : ''}`}>
      <img
        src={imageSrc}
        alt="Banner Encuestas"
        className="banner-image"
      />
    </div>
  );
};

// Definir los tipos de propiedades esperadas
HeaderBanner.propTypes = {
  showDashboardBanner: PropTypes.bool.isRequired,
};

// Definir los valores por defecto de las propiedades
HeaderBanner.defaultProps = {
  showDashboardBanner: false,
};

export default HeaderBanner;