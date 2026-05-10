import React from "react";
import CandidateLayout from "../components/CandidateLayout";
import ProgressTracker from "../components/ProgressTracker";

const ProgressPage = () => {
  return (
    <CandidateLayout
      title="Progress Tracker"
      subtitle="Monitor HR approval and interview schedule updates in real time."
    >
      <ProgressTracker />
    </CandidateLayout>
  );
};

export default ProgressPage;

