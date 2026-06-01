import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ElysePage from "./components/ElysePage.jsx";
import MiniPage from "./components/MiniPage.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import SignupPage from "./components/auth/SignupPage.jsx";
import AccessRestrictedPage from "./components/auth/AccessRestrictedPage.jsx";
import LoginSuccessPage from "./components/auth/LoginSuccessPage.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import BookingForm from "./components/bookings/BookingForm.jsx";
import BookingPage from "./components/bookings/BookingPage.jsx";
import { AdminRoute, ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ElysePage />} />
          <Route path="/mini" element={<MiniPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/welcome" element={<LoginSuccessPage />} />
          <Route path="/login-success" element={<LoginSuccessPage />} />
          <Route path="/access-restricted" element={<AccessRestrictedPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book/:activity"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
