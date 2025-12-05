import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/candidatelist.css";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  
  const [selectedRole, setSelectedRole] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);

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
  const filteredCandidates = candidates.filter(c =>
    
    (selectedRole === "" || c.role === selectedRole)
  );

  
  const uniqueRoles = [...new Set(candidates.map(c => c.role))];

  const handleApprove = async (index) => {
    const updated = [...candidates];
    const candidate = updated[index];
    candidate.status = "Approved";
    setCandidates(updated);
  
    try {
      await axios.post(`http://localhost:3001/progress/by-email`, {
        email: candidate.email,
        hrApproval: "Approved"
      });
    } catch (err) {
      console.error("Error approving candidate:", err.message);
      alert("Approval failed.");
    }
  };
  
  const handleReject = async (index) => {
    const updated = [...candidates];
    const candidate = updated[index];
    candidate.status = "Rejected";
    setCandidates(updated);
  
    try {
      await axios.post(`http://localhost:3001/progress/by-email`, {
        email: candidate.email,
        hrApproval: "Rejected"
      });
    } catch (err) {
      console.error("Error rejecting candidate:", err.message);
      alert("Rejection failed.");
    }
  };

  const toggleScheduleBox = (index) => {
    setSelectedCandidateIndex(index === selectedCandidateIndex ? null : index);
  };

  const handleScheduleConfirm = async (index) => {
    const updated = [...candidates];
    const candidate = updated[index];
    candidate.interviewDate = scheduleDateTime;
    setCandidates(updated);
  
    try {
      await axios.post(`http://localhost:3001/progress/by-email`, {
        email: candidate.email,
        interview: "Scheduled",
        interviewDate: scheduleDateTime
      });
      alert("Interview scheduled!");
      setSelectedCandidateIndex(null);
    } catch (err) {
      console.error("Error scheduling interview:", err.message);
      alert("Interview scheduling failed.");
    }
  };
  return (
    <div className="candidate-list-container">
      <h2>Candidate List</h2>

      {/* Filters */}
      <div className="filters">
        

        <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
          <option value="">All Roles</option>
          {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      {/* Candidate Table */}
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((c, idx) => (
            <React.Fragment key={c._id}>
              <tr>
                <td>{c.fullName || `${c.firstname} ${c.lastname}`}</td>
                <td>{c.role || "N/A"}</td>
               
                <td>{c.phone || c.contact}</td>
                <td>
                  <span className={`status ${c.status?.toLowerCase() || 'pending'}`}>
                    {c.status || "Pending"}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleApprove(idx)}>Approve</button>
                  <button onClick={() => handleReject(idx)}>Reject</button>
                  <button onClick={() => toggleScheduleBox(idx)}>
                    {selectedCandidateIndex === idx ? "Close" : "Schedule"}
                  </button>
                </td>
              </tr>

              {/* Schedule Box */}
              {selectedCandidateIndex === idx && (
                <tr>
                  <td colSpan="6">
                    <div className="schedule-box">
                      <p>Schedule interview for: {c.firstname} {c.lastname}</p>
                      <input
                        type="datetime-local"
                        value={scheduleDateTime}
                        onChange={(e) => setScheduleDateTime(e.target.value)}
                      />
                      <button onClick={() => handleScheduleConfirm(idx)}>Confirm</button>

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
