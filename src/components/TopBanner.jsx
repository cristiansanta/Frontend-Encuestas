import React from 'react';
import logoGov from '../assets/img/log_gov.svg';

const TopBanner = () => {
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-[1000] bg-[#3366CC]">
      <div className="py-1.5 px-4 flex items-center">
        <img
          src={logoGov}
          alt="GOV.CO"
          className="h-[18px] w-[200px]"
        />
      </div>
    </div>
  );
};

export default TopBanner;
