import React, { useContext } from "react";
import Header from "../components/Header";
import Slidbar from "../components/Slidbar";

import "../style/dashboard.css";
import { UserContext } from "../assets/UserContext";

function Dashboard() {
  const { userData } = useContext(UserContext);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Slidbar />
        <div className="main-content">
          <h1>
            Welcome {userData?.fullName ? userData.fullName : "to Your Dashboard"}
          </h1>
          <div className="instruction-box">
            <h3>Application Process Instructions</h3>
            <ul className="instruction-list">
              <li>
                <strong>Apply for a Role:</strong> Select a job role that matches your profile. Fill out the registration form and upload your resume to complete the application.
              </li>
              <li>
                <strong>Test Round:</strong> After submitting your application, proceed to the Quantitative Aptitude and Coding Test. Submit both tests to move forward in the selection process.
              </li>
              <li>
                <strong>Interview Schedule:</strong> Once your tests are reviewed, wait for your interview to be scheduled. You will be notified once the schedule is available.
              </li>
              <li>
                <strong>Track Your Progress:</strong> Stay updated with your application status through the Progress Tracker on your dashboard.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
