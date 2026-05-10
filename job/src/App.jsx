
import { Routes, Route, Navigate } from 'react-router-dom'
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
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import HRDashboard from './pages/HRDashboard';
import HRLogin from './components/HRLogin';
import HRProfile from './pages/HRProfile';
import ProgressTracker from './components/ProgressTracker';
import InterviewRound from './pages/InterviewRound';
import ProgressPage from './pages/ProgressPage';
import './style/tailwind.css'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/*   */}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login showRegister={true} />} />
        <Route path="/hr-login" element={<HRLogin showRegister={true} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-details"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <PersonalDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preparation-materials"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Material />
            </ProtectedRoute>
          }
        />
        <Route
          path="/round"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Round />
            </ProtectedRoute>
          }
        />
        <Route
          path="/genral-test"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <GenralTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding-test"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CodingTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute allowedRoles={["hr", "admin"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-profile"
          element={
            <ProtectedRoute allowedRoles={["hr", "admin"]}>
              <HRProfile/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-progress"
          element={
            <ProtectedRoute allowedRoles={["hr", "admin"]}>
              <ProgressTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviews"
          element={
            <ProtectedRoute allowedRoles={["hr", "admin"]}>
              <InterviewRound/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App
