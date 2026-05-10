import React, { useContext } from "react";
import { UserContext } from "../assets/UserContext";
import CandidateLayout from "../components/CandidateLayout";
import "../style/dashboard.css";

function Dashboard() {
  const { userData } = useContext(UserContext);
  const displayName = userData?.fullName || "Candidate";

  return (
    <CandidateLayout
      title={`Welcome ${displayName}`}
      subtitle="Track every step of your hiring journey from role selection to final interview."
    >
      <section className="candidate-panel">
        <div className="dashboard-kpi-grid">
          <article className="dashboard-kpi-card">
            <p>Step 1</p>
            <h3>Apply for a Role</h3>
            <span>Select the role that best matches your skills.</span>
          </article>

          <article className="dashboard-kpi-card">
            <p>Step 2</p>
            <h3>Complete Tests</h3>
            <span>Submit aptitude and coding rounds with confidence.</span>
          </article>

          <article className="dashboard-kpi-card">
            <p>Step 3</p>
            <h3>Interview Rounds</h3>
            <span>Prepare, practice, and wait for your schedule update.</span>
          </article>

          <article className="dashboard-kpi-card">
            <p>Step 4</p>
            <h3>Track Progress</h3>
            <span>Follow HR approval and interview status in real-time.</span>
          </article>
        </div>
      </section>

      <section className="candidate-panel instruction-box">
        <h3>Application Process Instructions</h3>
        <ol className="instruction-list">
          <li>
            <strong>Apply for a Role:</strong> Select a role and continue to the candidate form.
          </li>
          <li>
            <strong>Submit Assessments:</strong> Complete the quantitative and coding tests.
          </li>
          <li>
            <strong>Interview Schedule:</strong> Check your progress page for interview updates.
          </li>
          <li>
            <strong>Final Selection:</strong> HR review and final shortlist are communicated to you.
          </li>
        </ol>
      </section>
    </CandidateLayout>
  );
}

export default Dashboard;

