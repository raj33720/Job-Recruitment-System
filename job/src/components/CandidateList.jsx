import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/candidatelist.css";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [selectedCandidateEmail, setSelectedCandidateEmail] = useState(null);

  // Fetch candidate data only (no progress)
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  // Filters
  const filteredCandidates = candidates.filter(
    (candidate) => selectedRole === "" || candidate.role === selectedRole
  );

  const uniqueRoles = [...new Set(candidates.map((candidate) => candidate.role).filter(Boolean))];

  const handleApprove = async (candidate) => {
    try {
      await axios.post("http://localhost:3001/progress/by-email", {
        email: candidate.email,
        hrApproval: "Approved",
      });

      setCandidates((currentCandidates) =>
        currentCandidates.map((item) =>
          item.email === candidate.email
            ? { ...item, status: "Approved", hrApproval: "Approved" }
            : item
        )
      );
    } catch (err) {
      console.error("Error approving candidate:", err.message);
      alert("Approval failed.");
    }
  };

  const handleReject = async (candidate) => {
    try {
      await axios.post("http://localhost:3001/progress/by-email", {
        email: candidate.email,
        hrApproval: "Rejected",
      });

      setCandidates((currentCandidates) =>
        currentCandidates.map((item) =>
          item.email === candidate.email
            ? { ...item, status: "Rejected", hrApproval: "Rejected" }
            : item
        )
      );
    } catch (err) {
      console.error("Error rejecting candidate:", err.message);
      alert("Rejection failed.");
    }
  };

  const toggleScheduleBox = (candidate) => {
    const nextSelection =
      candidate.email === selectedCandidateEmail ? null : candidate.email;

    setSelectedCandidateEmail(nextSelection);
    setScheduleDateTime(nextSelection ? candidate.interviewDate || "" : "");
  };

  const handleScheduleConfirm = async (candidate) => {
    if (!scheduleDateTime) {
      alert("Please select the interview date and time first.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/progress/by-email", {
        email: candidate.email,
        interview: "Scheduled",
        interviewDate: scheduleDateTime,
      });

      setCandidates((currentCandidates) =>
        currentCandidates.map((item) =>
          item.email === candidate.email
            ? {
                ...item,
                interview: "Scheduled",
                interviewDate: scheduleDateTime,
                status: "Interview Scheduled",
              }
            : item
        )
      );

      const emailStatus = response.data?.emailStatus;
      const emailMessage =
        emailStatus === "sent"
          ? "Interview scheduled and email sent to the candidate."
          : emailStatus === "not_configured"
          ? "Interview scheduled, but email service is not configured yet."
          : emailStatus === "failed"
          ? `Interview scheduled, but the email could not be sent.${response.data?.emailError ? ` ${response.data.emailError}` : ""}`
          : "Interview scheduled!";

      alert(emailMessage);
      setSelectedCandidateEmail(null);
      setScheduleDateTime("");
    } catch (err) {
      console.error("Error scheduling interview:", err.message);
      alert(err.response?.data?.error || "Interview scheduling failed.");
    }
  };

  return (
    <div className="candidate-list-container">
      <h2>Candidate List</h2>

      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
          <option value="">All Roles</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Candidate Table */}
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Contact</th>
            <th>HR Approval</th>
            <th>Interview</th>
            <th>Interview Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((candidate) => (
            <React.Fragment key={candidate._id || candidate.email}>
              <tr>
                <td>{candidate.fullName || `${candidate.firstname} `}</td>
                <td>{candidate.role || "N/A"}</td>
                <td>{candidate.phone || candidate.contact}</td>
                <td>{candidate.hrApproval || "Pending"}</td>
                <td>{candidate.interview || "Not Scheduled"}</td>
                <td>
                  {candidate.interviewDate ? new Date(candidate.interviewDate).toLocaleString() : ""}
                </td>
                <td>
                  <span
                    className={`status ${(candidate.status || "Pending")
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {candidate.status || "Pending"}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleApprove(candidate)}>Approve</button>
                  <button onClick={() => handleReject(candidate)}>Reject</button>
                  <button onClick={() => toggleScheduleBox(candidate)}>
                    {selectedCandidateEmail === candidate.email ? "Close" : "Schedule"}
                  </button>
                </td>
              </tr>

              {/* Schedule Box */}
              {selectedCandidateEmail === candidate.email && (
                <tr>
                  <td colSpan="8">
                    <div className="schedule-box">
                      <p>
                        Schedule interview for: {candidate.firstname} 
                      </p>
                      <input
                        type="datetime-local"
                        value={scheduleDateTime}
                        onChange={(e) => setScheduleDateTime(e.target.value)}
                      />
                      <button onClick={() => handleScheduleConfirm(candidate)}>Confirm</button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidateList;
