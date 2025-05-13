// new line
import React, { useState, useEffect } from "react";
// old line
import ResponsiveNav from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VenueDetails from "./pages/VenueDetails";
import LoginPage from "./pages/LoginPage";
import AdminVenueManagement from "./pages/admin/AdminVenueManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBookings from "./pages/admin/AdminBookings";
import RegisterPage from "./pages/RegisterPage";
import CustomerRegisterForm from "./pages/register/customer/CustomerRegisterForm";
import VenueManagerRegisterForm from "./pages/register/venue-manager/VenueManagerRegisterForm";
import ProfilePage from "./pages/ProfilePage";
import "react-datepicker/dist/react-datepicker.css";
import VenueBookingsPage from "./pages/VenueBookingsPage";
import Footer from "./components/Footer/Footer";
// new line
import { getUser } from "./utils/auth"; // Import getUser
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // new line
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setCurrentUser(userData);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ResponsiveNav />

        <ToastContainer position="top-center" autoClose={3000} />

        <main className="flex-1 py-10 sm:py-16 lg:py-24 px-4">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/venue/:venueId" element={<VenueDetails  />} /> */}
            <Route
              path="/venue/:venueId"
              element={<VenueDetails user={currentUser} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/register/customer"
              element={<CustomerRegisterForm />}
            />
            <Route
              path="/register/venue-manager"
              element={<VenueManagerRegisterForm />}
            />
            <Route path="/profile" element={<ProfilePage />} />

            {/* 🔐 Protected Admin Routes */}
            <Route
              path="/admin/manage-venues/:venueIdParam?"
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
            <Route
              path="/admin/venue/:id/bookings"
              element={
                <ProtectedRoute>
                  <VenueBookingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
