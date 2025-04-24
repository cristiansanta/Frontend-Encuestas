import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import TableSurveyList from '../components/TableSurveyList.jsx';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/img/NewSurvey.svg';

const SurveyList = () => {
  const endpoint = import.meta.env.VITE_API_ENDPOINT;
  const navigate = useNavigate();

  // Función que realiza la petición
  const fetchsurveys = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${endpoint}surveys/all/details`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  };

  // useQuery para obtener los datos
  const { data, isLoading, error } = useQuery({
    queryKey: ['PreviewDetailslist'],
    queryFn: fetchsurveys,
  });

  // Condiciones para mostrar estados de carga o error
  if (isLoading) return <div>Cargando preguntas...</div>;
  if (error) return <div>Error al cargar preguntas</div>;

  const surveyslist = data || [];
  console.log(surveyslist)
  const handleFinalize = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex bg-gray-back-custom">
      <Navbar />
      <div className="flex-1 flex flex-col items-center mt-7">
        <HeaderBanner />
        <HeaderBar props="Listado de Encuestas" />
        <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mx-auto flex justify-between items-center">
          <button
            className="bg-[#00324D] px-4 py-2 rounded-lg"
            onClick={() => navigate('/category-list')}
          >
            <img src={bannerImage} alt="Nueva encuesta" className="h-15" />
          </button>
          {/* <input
                type="text"
                placeholder="Buscar encuesta"
                className="border border-gray-300 rounded-lg p-2 w-1/3"
              /> */}
        </div>
        <div className="mt-10 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12">
          <TableSurveyList surveys={surveyslist} />
          {/* Contenedor del botón Finalizar al final de la tabla, alineado a la derecha */}
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
              onClick={handleFinalize}
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
