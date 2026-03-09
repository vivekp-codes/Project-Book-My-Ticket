import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/SignUp/Signup";
import ChangePassword from "./Pages/ChangePassword/ChangePassword"
import Home from "./Pages/User/UserHome/Home";
import PaymentSuccess from "./Pages/User/PaymentSuccess/PaymentSuccess";
import MyBookings from "./Pages/User/MyBookings/MyBookings";
import WishlistPage from "./Pages/User/WishlistPage/WishlistPage";
import PurchasesPage from "./Pages/User/PurchasesPage/PurchasesPage"

import Admin from "./Pages/Admin/AdminHome/Admin";
import AdminUsers from "./Pages/Admin/AdminUserView/AdminUsers";
import AdminDashboard from "./Pages/Admin/AdminDashboard/AdminDashboard";

import AdminEvents from "./Pages/Admin/AdminEventSetUp/AdminEvents";





function App() {
  return (
    <BrowserRouter>

     
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
          },
        }}
      />

      <Routes>

        
        <Route path="/" element={<Signup />} />

        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ChangePassword />} />

        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />


       
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/purchases"
          element={
            <ProtectedRoute>
              <PurchasesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>


    </BrowserRouter>
  );
}

export default App;
