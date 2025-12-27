import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register", formData);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 bg-white p-4 border rounded shadow-sm">
          <h3 className="text-center fw-bold mb-4">ĐĂNG KÝ</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary small">
                Họ và tên
              </label>
              <input
                type="text"
                className="form-control"
                required
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">Email</label>
              <input
                type="email"
                className="form-control"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">
                Số điện thoại
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
              TẠO TÀI KHOẢN
            </button>
          </form>
          <p className="text-center mt-3 small">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-decoration-none text-primary">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
