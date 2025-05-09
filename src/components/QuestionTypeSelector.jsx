// src/components/QuestionTypeSelector.jsx
import React from 'react';
import { questionTypes } from '../utils/questionUtils.js';

const QuestionTypeSelector = ({ selectedType, onSelect, disabled = false }) => (
  <div className="flex flex-wrap gap-2">
    {questionTypes.map(type => (
      <button
        key={type.id}
        onClick={() => !disabled && onSelect(type.id)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-4 py-1 rounded-full border transition-colors duration-200
          ${selectedType === type.id
            ? 'bg-green-custom text-white border-green-500 shadow-sm'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}
      >
        <img
          src={type.icon}
          alt={type.name}
          className="w-5 h-5"
          style={selectedType === type.id ? { filter: 'brightness(0) invert(1)' } : {}}
        />
        <span className="font-semibold">{type.name}</span>
      </button>
    ))}
  </div>
);

export default QuestionTypeSelector;
