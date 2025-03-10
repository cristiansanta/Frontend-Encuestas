import React from 'react';
import bannerImage from '../assets/img/bannner_encuestas.png';
import dashboardImage from '../assets/img/DashboardHeader.png';

function HeaderBanner({ showDashboardBanner }) {
  // Mostrar la imagen según el estado booleano
  const imageToShow = showDashboardBanner ? dashboardImage : bannerImage;

  return (
    <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-36 overflow-hidden">
      <img 
        src={imageToShow} 
        alt="Banner Encuestas" 
        className="w-full h-full object-fill" 
      />
    </div>
  );
}

export default HeaderBanner;
