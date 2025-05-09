// src/components/SwitchOption.jsx
import React from 'react';
import InputSlide from './InputSlide.jsx';

const SwitchOption = ({ value, onChange, label, disabled = false }) => (
  <div className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <InputSlide
      value={value}
      onChange={disabled ? undefined : onChange}
      disabled={disabled}
    />
    <span className={`font-semibold text-dark-blue-custom ${disabled ? 'text-gray-400' : ''}`}>
      {label}
    </span>
  </div>
);

export default SwitchOption;
