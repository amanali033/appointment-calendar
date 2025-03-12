import "./App.css";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./components/not-found";
import Login from "./pages/auth/login/Login";
import { Route, Routes } from "react-router-dom";
import ForgetPassword from "./pages/auth/forget-password/ForgetPassword";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import Profile from "./pages/user/profile/Profile";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import ChangePassword from "./pages/user/change-password/ChangePassword";
import ProtectedRoute from "./hooks/ProtectedRoute";
import NewAppointment from "./components/forms/new-appointment/NewAppointment";
import Appointments from "./pages/appointments/Appointments";
import AppointmentsView from "./pages/appointments/view/AppointmentsView";
import Calendar from "./components/Calendar";

function App() {
  return <Calendar />;
}

export default App;
