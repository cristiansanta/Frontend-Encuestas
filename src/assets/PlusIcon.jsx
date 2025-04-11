import React from 'react';

export const PlusIcon = ({ strokeColor }) => {
    return (
        <>
            <svg
                width="31"
                height="32"
                viewBox="0 0 31 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="15.5"
                    cy="16"
                    r="14"
                    stroke={strokeColor}
                    strokeWidth="2"
                    fill="none"
                />
                <line
                    x1="8"
                    y1="16"
                    x2="23"
                    y2="16"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <line
                    x1="15.5"
                    y1="8.5"
                    x2="15.5"
                    y2="23.5"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        </>
    );
};

export default PlusIcon;