import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Slidbar";
import "../style/round.css"

import { useNavigate } from "react-router-dom";

const AptitudeTest = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleNavigate=(path)=>{
    navigate(path);
  };
  
  return (
    <>
      <div className="preparation-container">

        <Header />
        <div className="dashboard-content">

          <Sidebar />
          <div className="content-body">
            <h1>Interview Rounds</h1>
            <p>Interview rounds are a crucial part of the hiring process. They help the interviewer assess
              the candidate's skills, experience, and fit for the role. Here are some tips to help
              you prepare for interview rounds:</p>
            <ul>
              <li>Research the company and the role</li>
              <li>Review the job description and requirements</li>
              <li>Prepare answers to common interview questions</li>
              <li>Practice your responses with a friend or family member</li>
            </ul>

           
            {/* General Aptitude Section */}
            <div className="test-section">
              <h2>General Aptitude</h2>
              <button onClick={() => handleNavigate("/genral-test")}>Start General Test</button>
            </div>
            {/* Technical Aptitude Section */}
            <div className="test-section">
              <h2>Technical Aptitude</h2>
              <button className='inline-button' onClick={() => handleNavigate("/coding-test")}>Coding Test</button>
              
            </div>

          </div>
        </div>
      </div>
    </>);
};

export default AptitudeTest;
