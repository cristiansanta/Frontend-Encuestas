import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import ModalUser from '../components/ModalUser.jsx';
import TableUsers from '../components/TableUsers.jsx';
import Userbanner from '../components/UserBanner.jsx';

const ManageUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir o cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 flex flex-col items-center mt-10">
        <Userbanner />
        <TableUsers toggleModal={toggleModal} />
        <ModalUser isOpen={isModalOpen} toggleModal={toggleModal} />
      </div>
    </div>
  );
};

export default ManageUsers;
