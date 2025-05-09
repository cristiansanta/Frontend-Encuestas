// src/components/Page404.jsx

import React from "react";
import { Link } from "react-router-dom";
import Page404Image from "../assets/img/404.svg";
import TopBanner from "./TopBanner";

const Page404 = () => {
  return (
    <>
      {/* Banner superior */}
      <TopBanner />

      {/* Contenido 404 centrado */}
      <div
        className="
          flex flex-col items-center justify-center
          min-h-screen
          bg-gradient-to-b from-[#002C4D] to-[#002032]
          px-4 text-center
        "
      >
        {/* Título */}
        <h1 className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl mb-8">
          Página no Encontrada
        </h1>

        {/* Ilustración SVG (404 + fotografía + fisura) */}
        <img
          src={Page404Image}
          alt="404 - Página no encontrada"
          className="
            w-[280px] sm:w-[360px] md:w-[480px] lg:w-[300px]
            max-w-full h-auto
          "
        />

        {/* Botón de regreso */}
        <Link
          to="/"
          className="
            mt-8 inline-block
            bg-green-500 hover:bg-green-600
            text-white font-medium
            px-6 py-3 rounded-full
            transition-colors duration-200
          "
        >
          Regresar a la ventana de inicio
        </Link>
      </div>
    </>
  );
};

export default Page404;
