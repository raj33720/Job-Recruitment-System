import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/interviewround.css";

const InterviewRound = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidateScores = async () => {
      try {
        const candidateRes = await axios.get("http://localhost:3001/candidates");

        const withScores = await Promise.all(
          candidateRes.data.map(async (candidate) => {
            const email = candidate.email;
            let quantScore = "Not Submitted";
            let codingScore = "Not Submitted";

            // Get Quant Score
           
            try {
              const res = await axios.get(
                `http://localhost:3001/api/submit-answers/${encodeURIComponent(email)}`
              );
              if (res.data?.quantScore !== undefined && res.data.quantScore !== null) {
                quantScore = `${res.data.quantScore} / 10`;
              }
              if (res.data?.codingScore !== undefined && res.data.codingScore !== null) {
                codingScore = `${res.data.codingScore} / 10`;
              }
            } catch (err) {
              console.error(`Score fetch error for ${email}:`, err.response?.data || err.message);
            }
            
            return {
              ...candidate,
              quantScore,
              codingScore,
            };
          })
        );

        setCandidates(withScores);
      } catch (err) {
        console.error("Error fetching candidates:", err.message);
      }
    };

    fetchCandidateScores();
  }, []);

  return (
    <div className="interview-round-container">
      <h2 className="interview-title">Interview Round - Test Overview</h2>
      <table className="interview-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Quant Test Score</th>
            <th>Coding Test Score</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c._id}>
              <td>{c.firstname} {c.lastname}</td>
              <td>{c.role}</td>
              <td>{c.quantScore}</td>
              <td>{c.codingScore}</td>
              <td>
                {c.resume ? (
                  <a href={c.resume} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewRound;
