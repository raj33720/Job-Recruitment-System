import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../assets/UserContext";
import "../style/progresstracker.css";

function ProgressTracker() {
  const { userData } = useContext(UserContext); // ✅ updated from 'user' to 'userData'
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userData?.email) return;

      try {
        const res = await axios.get(
          `http://localhost:3001/progress/by-email/${encodeURIComponent(userData.email)}`
        );
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err.response?.data || err.message);
      }
    };

    fetchProgress();
  }, [userData]);

  return (
  <div className="progress-tracker-wrapper">
    
  <div className="progress-tracker">
  <h3>Application Progress</h3>
  {progress ? (
    <ul>
      <li>
        <span>HR Approval:</span>
        <span
          className={`status ${
            progress.hrApproval === "Approved" ? "approved" : "pending"
          }`}
        >
          {progress.hrApproval}
        </span>
      </li>
      <li>
        <span>Interview:</span>
        <span
          className={`status ${
            progress.interview === "Scheduled"
              ? "scheduled"
              : "not-scheduled"
          }`}
        >
          {progress.interview === "Scheduled"
            ? progress.interviewDate
              ? `Scheduled on ${new Date(progress.interviewDate).toLocaleString()}`
              : "Scheduled"
            : "Not Scheduled"}
        </span>
      </li>
    </ul>
  ) : (
    <p>Loading progress...</p>
  )}
</div>
</div>
  );
}

export default ProgressTracker;
