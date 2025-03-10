import React from 'react';
import UserImage from '../assets/img/BannerUsers.png';

function UserBanner() {


  return (
    <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-36 overflow-hidden">
      <img 
        src={UserImage} 
        alt="Banner" 
        className="w-full h-full object-fill" 
      />
    </div>
  );
}

export default UserBanner;
