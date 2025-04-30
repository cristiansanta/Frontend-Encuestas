import Page404Image from "../assets/img/404.svg";

const Page404 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="mt-4 text-xl text-gray-600">Página no encontrada</p>
            <img src={Page404Image} alt="404" className="w-15 h-15 mr-2" />
            <p className="mt-2 text-gray-500">Lo sentimos, la página que buscas no existe.</p>
        </div>
    );
}

export default Page404

