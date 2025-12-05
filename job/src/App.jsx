import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Roles from './pages/Roles'
import PersonalDetails from "./pages/PersonalDetails";
import Material from "./pages/Material"
import Round from "./pages/Rounds"
import GenralTest from "./pages/GenralTest"
import CodingTest from "./pages/CodingTest"
import Welcome from './pages/Welcome';
import Profile from "./pages/Profile";
import Login from './components/Login';
import { UserContext } from './assets/UserContext'
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import HRDashboard from './pages/HRDashboard';
import HRLogin from './components/HRLogin';
import HRProfile from './pages/HRProfile';
import ProgressTracker from './components/ProgressTracker';
import InterviewRound from './pages/InterviewRound';



function App() {
  return (
   
      <Routes>
        
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login showRegister={true} />} />
        <Route path="/hr-login" element={<HRLogin showRegister={true} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/preparation-materials" element={<Material />} />
        <Route path="/round" element={<Round />} />
        <Route path="/genral-test" element={<GenralTest />} />
        <Route path="/coding-test" element={<CodingTest />} />
        <Route path="/profile" element={<Profile />} ></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>} ></Route>
        <Route path="/reset-password/:id/:token" element={<ResetPassword/>} ></Route>
        <Route path="/hr-dashboard" element={<HRDashboard/>} ></Route>
        <Route path="/hr-profile" element={<HRProfile/>} ></Route>
        <Route path="/progress" element={<ProgressTracker/>} ></Route>
        <Route path="/interviews" element={<InterviewRound/>} ></Route>
        
       
       
      </Routes>
      
  );
}

export default App
