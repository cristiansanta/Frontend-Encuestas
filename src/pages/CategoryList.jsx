
import Navbar from '../components/Navbar.jsx';
import HeaderBar from '../components/HeaderBar.jsx';
import HeaderBanner from  '../components/HeaderBanner.jsx'
import ProgresBar from  '../components/ProgresBar.jsx'
import TableComponent from  '../components/Table.jsx'
import ManageCategory from '../components/ManageCategory.jsx';

const endpoint = import.meta.env.VITE_API_ENDPOINT + 'category';

const CategoryList = () => {

  return (
    <div className="encuestas-container flex">      
      <Navbar/>
      <div className='headerbar-container flex-1 flex flex-col items-center mt-10'>
          <HeaderBanner /> 
          <HeaderBar props="Configuración de la encuesta: Lista de Categorias"/> 
          <ProgresBar currentView="CategoryList"/>  
          <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 mb-2 mt-6">       
              <ManageCategory/>  
          </div> 
          <div className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12 flex mt-2 text-[#00324D]">
            <svg width="29" height="33" viewBox="0 0 29 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.4738 26.7493C18.8157 30.6109 17.0581 32.3789 14.0727 32.2802C11.2882 32.1885 9.54957 30.2732 9.14436 26.7424C7.72786 26.7424 6.29404 26.7839 4.86541 26.7337C1.31376 26.6073 -0.980702 23.0054 0.41329 19.7395C0.647066 19.194 0.969156 18.6278 1.40207 18.2416C2.00816 17.7013 2.26444 17.0762 2.39432 16.316C2.60731 15.0675 2.82204 13.8137 3.12855 12.586C4.33032 7.7702 7.41269 4.88697 12.2354 3.87394C12.7428 3.76831 12.9211 3.60727 12.8934 3.10681C12.8623 2.5319 12.8588 1.95006 12.9021 1.37688C12.9679 0.491993 13.5532 -0.0361664 14.3601 0.00193036C15.1394 0.0365637 15.6087 0.554333 15.6537 1.44095C15.6918 2.18383 15.4598 3.11547 15.8217 3.61592C16.1455 4.06269 17.1395 3.98477 17.8079 4.22201C22.2704 5.81861 24.8973 8.95293 25.6541 13.6596C25.8463 14.8527 26.1078 16.0372 26.3814 17.2147C26.4403 17.4658 26.6636 17.7048 26.8628 17.8935C28.4732 19.4191 28.9927 21.5127 28.236 23.4989C27.481 25.4782 25.7008 26.706 23.4826 26.7424C22.1613 26.7649 20.84 26.7458 19.472 26.7458L19.4738 26.7493ZM14.2251 23.9717C17.2451 23.9717 20.2651 23.9804 23.2869 23.9682C24.48 23.963 25.2991 23.3985 25.6246 22.4184C25.971 21.3811 25.6125 20.4893 24.6584 19.6962C24.3068 19.4053 23.964 18.9724 23.8566 18.5429C23.4808 17.0364 23.1362 15.5142 22.9111 13.98C22.2912 9.7495 18.7534 6.53898 14.5264 6.4524C10.1678 6.36235 6.4724 9.41875 5.72259 13.6873C5.43859 15.303 5.10438 16.9117 4.72514 18.5065C4.62817 18.9152 4.34418 19.3516 4.01862 19.6217C2.97789 20.491 2.60558 21.3465 2.94672 22.3768C3.30691 23.466 4.10174 23.9682 5.50959 23.97C8.41533 23.9752 11.3193 23.97 14.2251 23.97V23.9717ZM16.5247 26.8463H12.0137C11.9964 28.5225 12.9263 29.5373 14.3584 29.5009C15.7368 29.4663 16.6338 28.3857 16.5247 26.8463Z" fill="#39A900"/>
            </svg>
            Para continuar debes seleccionar una categoría.
          </div >
          <div className="mt-6 w-full md:w-3/4 lg:w-4/5 xl:w-5/6 2xl:w-10/12">
              <TableComponent
                  endpoint={endpoint}
                  visibleColumns='id, title'
                  columnAliases={{ id: 'ID', title: 'Título'}}
                  showEdit={false}
                  showDelete={false}
                  showSelect={true}
                  showNextButton = {true}
                  showBackButton = {false}
                  origin="Category"
                />
          </div>
      </div>
           
  </div>
);



};
export default CategoryList;