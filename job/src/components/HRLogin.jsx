import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.css";
import { UserContext } from "../assets/UserContext";
import axios from "axios";

function Login({ showRegister }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        const response = await axios.post("http://127.0.0.1:3001/reg", formData);
        const { fullName, email, phone } = response.data;

        const user = { fullName, email, phone };
        setUserData(user);
        localStorage.setItem("userData", JSON.stringify(user));
        navigate("/hr-dashboard");
      } else {
        const response = await axios.post("http://127.0.0.1:3001/log", {
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        const { fullName, email, phone } = response.data;
        const user = { fullName, email, phone };
        setUserData(user);
        localStorage.setItem("userData", JSON.stringify(user));
        navigate("/hr-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>{isRegister ? "Register" : "Login"}</h1>

        {isRegister && (
          <div className="input-box">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {isRegister && (
          <div className="input-box">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {!isRegister && (
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/for-pass">Forgot Password?</Link>
          </div>
        )}

        <button className="btn" type="submit">
          {isRegister ? "Register" : "Login"}
        </button>

        {showRegister && (
          <div className="register-link">
            <p>
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <a href="#" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Login" : "Register"}
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
