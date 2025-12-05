import React from "react";
import Sidebar from "../components/HRSidebar";
import Header from "../components/HRHeader";
import CandidateList from "../components/CandidateList";
import "../style/hrdashboard.css";


function HRDashboard() {
  return (
    <div className="hr-dashboard-container">
      <Header />
      <div className="hr-main-content">
        <Sidebar />
        <CandidateList />
        
      </div>
    </div>
  );
}

export default HRDashboard;
