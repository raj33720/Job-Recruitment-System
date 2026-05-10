import React, { useState } from "react";
import "../style/scheduleexam.css";

const ScheduleExam = ({ candidate }) => {
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");

  const handleSchedule = () => {
    if (examDate && examTime) {
      alert(`Exam scheduled for ${candidate.name} on ${examDate} at ${examTime}`);
      // Later we can replace this with an API call
    } else {
      alert("Please select both date and time.");
    }
  };

  return (
    <div className="schedule-exam-container">
      <h3>Schedule Exam for {candidate.name}</h3>
      <label>Date:</label>
      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
      />

      <label>Time:</label>
      <input
        type="time"
        value={examTime}
        onChange={(e) => setExamTime(e.target.value)}
      />

      <button onClick={handleSchedule}>Schedule</button>
    </div>
  );
};

export default ScheduleExam;
