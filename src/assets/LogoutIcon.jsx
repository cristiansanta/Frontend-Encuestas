import React from 'react';

const LogoutIcon = ({ className = "w-6 h-6", color = "#FFFFFF" }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Rectangle/frame */}
      <path d="M11 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H11" />
      
      {/* Arrow line */}
      <line x1="11" y1="12" x2="21" y2="12" />
      
      {/* Arrow head */}
      <polyline points="17 8 21 12 17 16" />
    </svg>
  );
};

export default LogoutIcon;