import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/slidebar.css";


function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">

      <button className="sidebar-button">
      <i className="fas fa-home"></i> Home
      </button>

      <button className="sidebar-button" onClick={() => navigate("/roles")}>
      <i className="fas fa-file-alt"></i> Apply Now
      </button>

      <button className="sidebar-button" onClick={() => navigate("/progress")}>
      <i className="fas fa-chart-bar"></i> Progress
      </button>

      <button className="sidebar-button" onClick={() => navigate("/round")}>
      <i className="fas fa-user-check"></i> Interview Rounds
      </button>

      <button className="sidebar-button" onClick={() => navigate("/preparation-materials")}>
      <i className="fas fa-book"></i> Preparation Materials
      </button>
    </div>
  );
}

export default Sidebar;
