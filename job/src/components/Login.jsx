import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../assets/UserContext";
import { LoginPage, SignupPage } from "./AuthPages";
import { setAuthToken } from "../utils/auth";

function Login({ showRegister }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserAndContinue = (data) => {
    const token = String(data.token || "").trim();
    if (!token) {
      alert("Authentication token missing. Please try logging in again.");
      return;
    }

    const user = {
      fullName: data.fullName,
      email: String(data.email || "").trim().toLowerCase(),
      phone: data.phone || "",
      role: data.role || 'candidate',
    };

    setAuthToken(token);
    setUserData(user);
    localStorage.setItem("userData", JSON.stringify(user));
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await axios.post("http://127.0.0.1:3001/signup", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        alert("Registered successfully!");
        saveUserAndContinue(response.data);
      } catch (err) {
        alert(err.response?.data?.message || "Signup failed");
        console.error(err);
      }
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:3001/login", {
        email: formData.email,
        password: formData.password,
      });

      saveUserAndContinue(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.error(err);
    }
  };

  const sharedProps = {
    formData,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onToggle: () => setIsRegister((current) => !current),
    showRegister,
    portalLabel: "Candidate Portal",
  };

  return isRegister ? (
    <SignupPage {...sharedProps} />
  ) : (
    <LoginPage {...sharedProps} forgotPath="/forgot-password" />
  );
}

export default Login;
