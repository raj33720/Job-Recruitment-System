import React from "react";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../components/CandidateLayout";
import "../style/round.css";

const AptitudeTest = () => {
  const navigate = useNavigate();

  return (
    <CandidateLayout
      title="Interview Rounds"
      subtitle="Complete each round in sequence and keep your evaluation moving forward."
    >
      <section className="candidate-panel round-intro">
        <p>
          Interview rounds help us evaluate problem-solving, communication, and technical skill.
          Focus on clarity, timing, and structured answers.
        </p>
        <ul>
          <li>Research the company and role before every interview.</li>
          <li>Practice concise answers with role-specific examples.</li>
          <li>Review coding and aptitude fundamentals.</li>
          <li>Track status updates from the Progress page.</li>
        </ul>
      </section>

      <section className="round-actions-grid">
        <article className="candidate-panel round-test-card">
          <h2>General Aptitude</h2>
          <p>Solve quantitative and reasoning questions to demonstrate fundamentals.</p>
          <button type="button" onClick={() => navigate("/genral-test")}>
            Start General Test
          </button>
        </article>

        <article className="candidate-panel round-test-card">
          <h2>Technical Coding</h2>
          <p>Submit coding tasks and AI-reviewed solutions for technical screening.</p>
          <button type="button" onClick={() => navigate("/coding-test")}>
            Start Coding Test
          </button>
        </article>
      </section>
    </CandidateLayout>
  );
};

export default AptitudeTest;

