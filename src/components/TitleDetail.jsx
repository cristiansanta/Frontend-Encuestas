// TitleDetail.jsx
import React from 'react';

const TitleDetail = ({ value, onChange, title_name="N/A" }) => {
  return (
    <>
      <div className="h-12 w-full border border-[#00324D] border-opacity-70 rounded-lg flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="font-sans text-lg md:text-xl lg:text-2xl font-bold leading-tight text-left p-4 w-full h-full focus:outline-none rounded-lg"
          placeholder={title_name}
        />
      </div>
      <div className="mt-4 w-full">
        <p className="font-sans text-lg md:text-xl lg:text-2xl font-bold leading-tight text-left text-[#00324D]">
           Descripción
        </p>
      </div>
    </>
  );
};

export default TitleDetail;


