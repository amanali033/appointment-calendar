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
import { LocationProvider } from "./contexts/LocationContext";

function App() {
  return (
    <UserProfileProvider>
      <LocationProvider>
        <Routes>
          <Route
            path="/"
            element={<DashboardLayout Navigate={"Default Page"} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard Layout Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/user-profile" element={<Profile />} />
                    <Route
                      path="/change-password"
                      element={<ChangePassword />}
                    />
                    <Route path="/appointments" element={<Calendar />} />
                    {/* <Route path="/appointments" element={<Appointments />} /> */}
                    {/* <Route
                    path="/appointments/details/:id"
                    element={<AppointmentsView />}
                    /> */}
                    <Route
                      path="/appointments/add-new-appointment"
                      element={<NewAppointment />}
                    />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ✅ Global NotFound route (outside DashboardLayout) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LocationProvider>
    </UserProfileProvider>
  );
}

export default App;
