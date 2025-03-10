import React from 'react';
import CloseIcon from '../assets/img/Close.png';
import ProgresBarUser from '../components/Users/ProgresBarUser';
import CreateUser from '../components/Users/CreateUser';
import CreateRol from '../components/Users/CreateRol';
import Asignation from '../components/Users/Asignation'

const ModalUser = ({ isOpen, toggleModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-1/2 shadow-lg relative p-8"> {/* Modal con solo w-2/3 */}
        <div className="flex justify-end p-4 rounded-t-lg">
          <button onClick={toggleModal} className="text-white">
            <img src={CloseIcon} alt="Cerrar" className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-[#FFC400]">
          <h2 className="flex items-center justify-center color-[#00324D] font-bold text-xl h-14">Crear Usuario</h2>
        </div>
        <div>
          <ProgresBarUser />
        </div>
        <div>
          <CreateUser/>
          <CreateRol/>
          <Asignation/>
        </div>
      </div>
    </div>
  );
};

export default ModalUser;
