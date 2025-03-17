import React from 'react';
import logoGov from '../assets/img/log_gov.svg';

const TopBanner = () => {
  return (
    <div className="w-full bg-blue-600 py-1.5 px-4 flex items-center">
      <img 
        src={logoGov} 
        alt="GOV.CO" 
        className="h-[18px] w-[200px]"
      />
    </div>
  );
};

export default TopBanner;