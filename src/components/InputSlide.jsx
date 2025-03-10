
// import React, { useState } from 'react';
// import '../style/InputSlide.css'; 


// const inputSlide = () => {
//   const [isSwitchOn, setIsSwitchOn] = useState(false);

//   const handleSwitchChange = () => {
//     setIsSwitchOn(!isSwitchOn);
//   };

//   return (
//     <div className="flex flex-col rounded-lg bg-[#F0F0F0] ml-3">
//       {/* Aquí puedes agregar otros componentes como título y editor de texto */}
      
//       {/* Switch Toggle */}
//       <label className="switch">
//         <input
//           type="checkbox"
//           checked={isSwitchOn}
//           onChange={handleSwitchChange}
//         />
//         <span className="slider"></span>
//       </label>
//     </div>
//   );
// };

// export default inputSlide;

import React from 'react';
import '../style/InputSlide.css'; 

const InputSlide = ({ value, onChange }) => {
  return (
    <div className="flex flex-col rounded-lg bg-[#F0F0F0] ml-3">
      {/* Switch Toggle */}
      <label className="switch">
        <input
          type="checkbox"
          checked={value} // Utilizar el valor pasado como prop
          onChange={onChange} // Llamar a la función de cambio pasada como prop
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default InputSlide;
