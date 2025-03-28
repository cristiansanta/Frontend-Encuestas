import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importar TanStack Query
import { Routes, Route } from 'react-router-dom';
import SurveyCreate from './pages/SurveyCreate.jsx';
import Login from './pages/Login.jsx';
import CategoryList from './pages/CategoryList.jsx';
import CategoryCreate from './pages/CategoryCreate.jsx';
import SectionsCreate from './pages/SectionsCreate.jsx';
import QuestionsList from './pages/QuestionsList.jsx';
import QuestionsCreate from './pages/QuestionsCreate.jsx';
import DependencyList from './pages/DependencyList.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SurveyList from './pages/SurveyList.jsx';
import Register from './pages/Register.jsx';
import { SurveyProvider } from './Provider/SurveyContext.jsx'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import SurveyDetails  from './pages/SurveyDetails.jsx'
import ManageUsers from './pages/ManageUsers.jsx';
import RolesAsignation from './pages/RolesAsignation.jsx'
import AsignationMigrate from './pages/AsignationMigrate'
import SurveyView from './pages/SurveyView'
import SurveyCompletion from './pages/SurveyCompletion.jsx'
import SurveyExpired from './pages/SurveyExpired.jsx'
import SurveyReplied from './pages/SurveyReplied.jsx'
import SurveyEdit from './pages/SurveyEdit.jsx'
import DashboardTable from './pages/DashboardTable.jsx'



const queryClient = new QueryClient(); // Crear el cliente de consulta

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Envolver las rutas con QueryClientProvider */}
      <SurveyProvider> {/* Envolver las rutas con SurveyProvider */}
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Dashboard"  element={<Dashboard />}  />
            <Route path="/SurveyCreate" element={<ProtectedRoute element={<SurveyCreate />} />} />
            <Route path="/SurveyList" element={<ProtectedRoute element={<SurveyList />} />} />
            <Route path="/CategoryList" element={<ProtectedRoute element={<CategoryList />} />} />
            <Route path="/CategoryCreate" element={<ProtectedRoute element={<CategoryCreate />} />} />
            <Route path="/SectionsCreate" element={<ProtectedRoute element={<SectionsCreate />} />} />
            <Route path="/QuestionsList" element={<ProtectedRoute element={<QuestionsList />} />} />
            <Route path="/QuestionsCreate" element={<ProtectedRoute element={<QuestionsCreate />} />} />
            <Route path="/DependencyList" element={<ProtectedRoute element={<DependencyList />} />} />
            <Route path="/SurveyDetails" element={<ProtectedRoute element={<SurveyDetails />} />} />
            <Route path="/ManageUsers"  element={<ManageUsers />}  />
            <Route path="/RolesAsignation"  element={<RolesAsignation />}  />
            <Route path="/AsignationMigrate"  element={<AsignationMigrate />}  />
            <Route path="/SurveyView"  element={<SurveyView />}  />

            <Route path="/DashboardTable"  element={<DashboardTable />}  />

            <Route path="/SurveyCompletion"  element={<SurveyCompletion />}  />
            <Route path="/SurveyExpired"  element={<SurveyExpired />}  />
            <Route path="/SurveyReplied"  element={<SurveyReplied />}  />
            <Route path="/SurveyEdit"  element={<SurveyEdit />}  />
          </Routes>
        </div>
      </SurveyProvider>
    </QueryClientProvider>  
  );
}

export default App;
SurveyView