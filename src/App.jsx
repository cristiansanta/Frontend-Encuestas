import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import PreviewDetails from './pages/PreviewDetails.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import RolesAsignation from './pages/RolesAsignation.jsx';
import AsignationMigrate from './pages/AsignationMigrate.jsx';
import SurveyView from './pages/SurveyView.jsx';
import SurveyCompletion from './pages/SurveyCompletion.jsx';
import SurveyExpired from './pages/SurveyExpired.jsx';
import SurveyReplied from './pages/SurveyReplied.jsx';
import SurveyEdit from './pages/SurveyEdit.jsx';
import DashboardTable from './components/DashboardTable.jsx';
import PreviewSurvey from './pages/PreviewSurvey.jsx';
import DetailsSurvey from './pages/DetailsSurvey.jsx';
import Page404 from './components/Page404.jsx';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SurveyProvider>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/survey-create" element={<ProtectedRoute element={<SurveyCreate />} />} />
            <Route path="/survey-list" element={<ProtectedRoute element={<SurveyList />} />} />
            <Route path="/category-list" element={<ProtectedRoute element={<CategoryList />} />} />
            <Route path="/category-create" element={<ProtectedRoute element={<CategoryCreate />} />} />
            <Route path="/sections-create" element={<ProtectedRoute element={<SectionsCreate />} />} />
            <Route path="/questions-list" element={<ProtectedRoute element={<QuestionsList />} />} />
            <Route path="/questions-create" element={<ProtectedRoute element={<QuestionsCreate />} />} />
            <Route path="/dependency-list" element={<ProtectedRoute element={<DependencyList />} />} />
            <Route path="/preview-details" element={<ProtectedRoute element={<PreviewDetails />} />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/roles-asignation" element={<RolesAsignation />} />
            <Route path="/asignation-migrate" element={<AsignationMigrate />} />
            <Route path="/survey-view" element={<SurveyView />} />
            <Route path="/dashboard-table" element={<DashboardTable />} />
            <Route path="/survey-completion" element={<SurveyCompletion />} />
            <Route path="/survey-expired" element={<SurveyExpired />} />
            <Route path="/survey-replied" element={<SurveyReplied />} />
            <Route path="/survey-edit" element={<SurveyEdit />} />
            <Route path="/preview-survey" element={<PreviewSurvey />} />
            <Route path="/details-survey" element={<DetailsSurvey />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </SurveyProvider>
    </QueryClientProvider>
  );
}

export default App;