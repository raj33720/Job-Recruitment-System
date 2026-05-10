import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../assets/UserContext";
import "../style/progresstracker.css";

function ProgressTracker() {
  const { userData } = useContext(UserContext);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  const fetchProgress = useCallback(async () => {
    if (!userData?.email) return;

    try {
      const res = await axios.get(
        `http://localhost:3001/progress/by-email/${encodeURIComponent(userData.email)}`
      );
      setProgress(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching progress:", err.response?.data || err.message);
      setError("We could not load your latest progress right now.");
    }
  }, [userData?.email]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!userData?.email) return undefined;

    const intervalId = window.setInterval(fetchProgress, 5000);
    const handleFocus = () => fetchProgress();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProgress, userData?.email]);

  const hrApproval = progress?.hrApproval || "Pending";
  const interviewStatus = progress?.interview || "Not Scheduled";

  return (
    <section className="candidate-panel progress-card">
      <h2>Application Progress</h2>
      {error ? <p className="progress-error">{error}</p> : null}

      {!progress && !error ? <p className="progress-loading">Loading progress...</p> : null}

      {progress ? (
        <div className="progress-status-grid">
          <article className="progress-status-box">
            <p className="status-label">HR Approval</p>
            <span
              className={`status-pill ${
                hrApproval === "Approved" ? "approved" : hrApproval === "Rejected" ? "rejected" : "pending"
              }`}
            >
              {hrApproval}
            </span>
          </article>

          <article className="progress-status-box">
            <p className="status-label">Interview</p>
            <span
              className={`status-pill ${interviewStatus === "Scheduled" ? "scheduled" : "pending"}`}
            >
              {interviewStatus === "Scheduled"
                ? progress.interviewDate
                  ? `Scheduled on ${new Date(progress.interviewDate).toLocaleString()}`
                  : "Scheduled"
                : "Not Scheduled"}
            </span>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default ProgressTracker;

