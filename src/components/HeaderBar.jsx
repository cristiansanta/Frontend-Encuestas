// HeaderBar.jsx

import React from 'react';

function HeaderBar({ props }) {
  
  return (
    <div className="flex w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-14 items-center justify-center p-2 bg-[#ffc400]"> {/* Ajustes responsivos */}
      <p className="font-bold text-[#00324d] text-lg">
         {props}
      </p>
    </div>
  );
}

export default HeaderBar;