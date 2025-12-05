import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import "../style/welcome.css";

function Welcome() {
  const navigate = useNavigate();

  const handleLogin = (type) => {
    if (type === "Employee") {
      navigate("/login"); // Route for Candidate
    } else {
      navigate("/hr-login"); // Route for HR (optional)
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1>
          Welcome to <span className="highlight">TechElecon</span>
        </h1>
        <p>We are hiring talented professionals. Join us today!</p>

        <div className="button-group">
          <button className="btn hr-btn" onClick={() => handleLogin("HR")}>
            HR Login
          </button>
          <button
            className="btn employee-btn"
            onClick={() => handleLogin("Employee")}
          >
            Candidate Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
