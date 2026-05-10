import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/hrsidebar.css";

function HRSidebar() {
  const navigate = useNavigate();

  return (
    <div className="hr-sidebar">
      {/* <h3>HR Panel</h3> */}
      <button onClick={() => navigate("/hr-dashboard")}>View Candidates</button>
      {/* <button onClick={() => navigate("/schedule-exam")}>Schedule Exam</button> */}
      <button onClick={() => navigate("/interviews")}>Interview Rounds</button>
    </div>
  );
}

export default HRSidebar;
