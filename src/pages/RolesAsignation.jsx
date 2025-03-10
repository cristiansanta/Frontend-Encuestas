
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from '../components/HeaderBanner.jsx';
import InputsRole from '../components/InputsRole.jsx'
import ProgresBarRole from '../components/ProgresBarRole.jsx';
import Roles from '../components/ComponentsRoles/Roles.jsx';
import ListOptions from '../components/ComponentsRoles/ListOptions.jsx';



const RolesAsignation = () => {

  return (
    <div className="flex min-h-screen"> 
      <Navbar /> 
      <div className="flex-1 flex flex-col items-center mt-10  overflow-y-auto"> 
        <HeaderBanner />
        <HeaderBar props={"Asignacion para la encuesta  :  "+localStorage.getItem('selectedSurveyId')} />
        <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-36 mt-5 mb-32">
            <InputsRole/>
        </div>
        <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 h-36 ">
            <h1 className="text-lg font-bold text-[#00324D] mt-6">Tipos de asignacion</h1>
            <ProgresBarRole/>
            <Roles/>
        </div>
      </div>
    </div>
  );
};

export default RolesAsignation;
