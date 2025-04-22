import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VenueDetails from "./pages/VenueDetails";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVenueManagement from "./pages/admin/AdminVenueManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBookings from "./pages/admin/AdminBookings";
import RegisterPage from "./pages/RegisterPage";
import CustomerRegisterForm from "./pages/register/customer/CustomerRegisterForm";
import VenueManagerRegisterForm from "./pages/register/venue-manager/VenueManagerRegisterForm";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/venue/:venueId" element={<VenueDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/customer" element={<CustomerRegisterForm />} />
        <Route
          path="/register/venue-manager"
          element={<VenueManagerRegisterForm />}
        />

        <Route path="/profile" element={<ProfilePage />} />

        {/* 🔐 Protected Admin Routes */}
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-venues"
          element={
            <ProtectedRoute>
              <AdminVenueManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
