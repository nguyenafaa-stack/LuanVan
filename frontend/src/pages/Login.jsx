import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 bg-white p-4 border rounded shadow-sm">
          <h3 className="text-center fw-bold mb-4">ĐĂNG NHẬP</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Email</label>
              <input
                type="email"
                className="form-control"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">
                Mật khẩu
              </label>
              <input
                type="password"
                title="password"
                className="form-control"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
              ĐĂNG NHẬP
            </button>
          </form>
          <p className="text-center mt-3 small">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-decoration-none text-primary">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
