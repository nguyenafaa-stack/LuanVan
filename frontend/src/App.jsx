import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/HomePage"; // Import trang Home mới
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        <Header />

        <div className="content-wrapper">
          <Routes>
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
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
