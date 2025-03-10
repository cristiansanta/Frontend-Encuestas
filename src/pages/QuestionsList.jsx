
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import TableComponent from  '../components/Table.jsx'




const QuestionsList = () => {
  return (
    <div className="flex"> {/* Mantiene el layout principal flex */}
      <Navbar /> {/* Navbar fijo a la izquierda */}
      <div className="flex-1 flex flex-col items-center mt-7"> {/* Contenedor centrado y responsivo */}
        <HeaderBanner /> {/* Banner en la parte superior */}
        <HeaderBar props="Configuración de la encuesta: Listado de preguntas"/> 
        <div className="mt-10 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12">
            <TableComponent
                  endpoint='http://127.0.0.1:8000/api/questions/'
                  visibleColumns='id, title, descrip'
                  columnAliases={{ id: 'ID', title: 'Título', descrip: 'Descripción'}}
                  showEdit={false}
                  showDelete={false}
                  showSelect={true}
                  showNextButton = {true}
                  showBackButton = {false}
              /> 
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;