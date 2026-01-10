import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminDesign from "./components/admin/AdminDesign";

// Component trung gian để giữ Header/Footer cho phía người dùng
const ClientLayout = () => (
  <>
    <Header />
    <div className="content-wrapper">
      <Outlet />
    </div>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        <Routes>
          {/* Cụm Route dành cho khách hàng - CÓ Header & Footer */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <div className="container py-4">
                  <Cart />
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className="container py-4">
                  <Login />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="container py-4">
                  <Register />
                </div>
              }
            />
          </Route>

          {/* Cụm Route dành cho Admin - KHÔNG CÓ Header & Footer của Client */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="designs" element={<AdminDesign />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
