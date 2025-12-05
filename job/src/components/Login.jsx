import React, { useState } from "react"; // ✅ added useContext
import { Link, useNavigate } from "react-router-dom";
import "../style/login.css";
import { useContext } from "react";
import { UserContext } from "../assets/UserContext"; // ✅ your context import
import axios from 'axios'
import ForgotPassword from "./ForgotPassword";

function Login({ showRegister }) {
  const navigate = useNavigate();

  const { setUserData } = useContext(UserContext); // ✅ get context setter

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
  
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      try {
        const response = await axios.post("http://127.0.0.1:3001/signup", formData);
        alert("Registered successfully!");
  
        setUserData({
          username: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
        });
  
        localStorage.setItem("userData", JSON.stringify({
          username: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
        }));
  
        navigate("/dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Signup failed");
        console.error(err);
      }
    } else {
      try {
        const response = await axios.post("http://127.0.0.1:3001/login", {
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
  
        setUserData({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
        });
        
        localStorage.setItem("userData", JSON.stringify({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
        }));
        
  
        navigate("/dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Login failed");
        console.error(err);
      }
    }
  };
  

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
      <h1>Login</h1>
  
    <>
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
          <i className="bx bxs-user"></i>
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
        <i className="bx bxs-envelope"></i>
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
        <i className="bx bxs-phone"></i>
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
        <i className="bx bxs-lock-alt"></i>
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
          <i className="bx bxs-lock"></i>
        </div>
      )}
      {!isRegister && (
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot-password">Forgot Password ?</Link>
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
    </>
  
</form>

    </div>
  );
  
}

export default Login;
