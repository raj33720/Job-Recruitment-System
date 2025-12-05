import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../style/header.css"; 
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate(); // Hook for navigation
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage"));

  useEffect(() => {
    const updateProfileImage = () => {
      setProfileImage(localStorage.getItem("profileImage"));
    };
    window.addEventListener("storage", updateProfileImage);
    return () => window.removeEventListener("storage", updateProfileImage);
  }, []);

  return (
    <header className="header">
      {/* ✅ Company logo */}
      <div className="logo">
        <img src={logo} alt="Tech Elecon Logo" className="header-logo" />
      </div>

      {/* ✅ Profile section with navigation */}
      <div className="profile">
        <img src={profileImage} alt="Profile" className="profile-pic" />
        <button className="profile-btn" onClick={() => navigate("/hr-profile")}>
          Profile
        </button>
      </div>
    </header>
  );
}

export default Header;
