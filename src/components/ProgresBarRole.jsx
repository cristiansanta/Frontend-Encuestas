// ProgressBarRole.jsx
import React from 'react';

const sections = [
  { title: "Roles", bgColor: "#00324D", textColor: "text-green-500", isFirst: true },
  { title: "Regionales y centros" },
  { title: "Programas de formación" },
  { title: "Correo electrónico" },
  { title: "Fichas" },
  { title: "Usuarios", isLast: true }
];

const ProgressBarRole = () => {
  return (
    <div className="flex w-full mt-5 border border-green-500 rounded-lg">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`relative flex-1 flex items-center justify-center py-2 px-4 font-semibold ${
            section.bgColor ? `bg-[${section.bgColor}] text-white` : "border-r border-green-500 text-[#00324D]"
          } ${section.isFirst ? "rounded-l-lg" : ""} ${section.isLast ? "rounded-r-lg" : ""}`}
        >
          <span className={`${section.textColor || "text-[#00324D]"}`}>{section.title}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBarRole;
