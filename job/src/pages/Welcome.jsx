import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/welcome.css";

function Welcome() {
  const navigate = useNavigate();

  const handleLogin = (type) => {
    if (type === "Candidate") {
      navigate("/login");
    } else {
      navigate("/hr-login");
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-overlay" />
      <div className="welcome-accent accent-red" />
      <div className="welcome-accent accent-yellow" />

      <main className="welcome-shell" aria-label="TechElecon hiring portal">
        <section className="welcome-copy">
          <div className="portal-badge">
            <span />
            Hiring Portal
          </div>
          <h1>
            Welcome to <span>Tech Hiring</span>
          </h1>
          <p>
            Choose your workspace and continue into a focused hiring experience
            for roles, assessments, interviews, and progress tracking.
          </p>

          <div className="welcome-metrics" aria-label="Hiring workflow highlights">
            <div>
              <strong>Fast</strong>
              <small>Screening</small>
            </div>
            <div>
              <strong>Clear</strong>
              <small>Profiles</small>
            </div>
            <div>
              <strong>Smart</strong>
              <small>Rounds</small>
            </div>
          </div>
        </section>

        <section className="login-panel" aria-label="Login options">
          <p className="panel-eyebrow">Get Started</p>
          <h2>Select Your Login</h2>
          <p className="panel-text">
            Continue as a hiring team member or enter as a candidate.
          </p>

          <div className="welcome-button-group">
            <button
              className="login-choice welcome-hr-btn"
              onClick={() => handleLogin("HR")}
            >
              <span className="choice-mark">HR</span>
              <span>
                <strong>HR Login</strong>
                <small>Manage jobs and applicants</small>
              </span>
            </button>
            <button
              className="login-choice welcome-candidate-btn"
              onClick={() => handleLogin("Candidate")}
            >
              <span className="choice-mark">C</span>
              <span>
                <strong>Candidate Login</strong>
                <small>Apply, test, and track progress</small>
              </span>
            </button>
          </div>

          <div className="panel-stripes" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Welcome;
