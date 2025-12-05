// PreparationMaterials.jsx
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Slidbar";
import "../style/material.css"; // Ensure CSS is updated

const PreparationMaterials = () => {
  const preparationData = [
    {
      category: "Engineering & Technical Roles",
      materials: [
        { name: "AutoCAD Tutorials", link: "https://www.autodesk.com/in/campaigns/autocad-tutorials" },
        { name: "Manufacturing Process Basics", link: "https://manufast.in/basic-manufacturing-process-what-you-need-to-know/" },
        { name: "Six Sigma & Quality Control", link: "https://www.asq.org/quality-resources" },
        { name: "Mechanical Maintenance Guide", link: "https://funaab.edu.ng/wp-content/uploads/2009/12/470_MCE%20509%20LECTURE%20NOTE.pdf" },
        { name: "Lean Manufacturing Basics", link: "https://www.lean.org/" },
        { name: "Software & Hardware Testing", link: "https://www.softwaretestinghelp.com/" },
        { name: "Networking Basics - Cisco", link: "https://learningnetwork.cisco.com/s/" },
        { name: "Machine Learning Specialization", link: "https://developers.google.com/machine-learning/crash-course" },
        { name: "Production Engineering", link: "https://www.indiabix.com/mechanical-engineering/production-engineering/" },
        { name: "Technical Interview Q&A", link: "https://www.indiabix.com/technical/interview-questions-and-answers/" },
        { name: "IoT Fundamentals", link: "https://explore.skillbuilder.aws/learn/signin;redirectURL=%2Flearn%2Fcourses%2F402%2Finternet-of-things-foundation-series" },
      ],
    },
    {
      category: "Management & Sales Roles",
      materials: [
        { name: "PMP Certification & Management", link: "https://www.pmi.org/" },
        { name: "Sales Engineering Guide", link: "https://www.salesengineers.com/" },
        { name: "Product Management Essentials", link: "https://www.coursera.org/courses?query=product%20management" },
      ],
    },
    {
      category: "Aptitude Test Preparation",
      materials: [
        { name: "Logical Reasoning", link: "https://www.indiabix.com/logical-reasoning/questions-and-answers/" },
        { name: "GeeksforGeeks - Logical Puzzles", link: "https://www.geeksforgeeks.org/puzzles/" },
        { name: "Aptitude Related", link: "https://www.indiabix.com/" },
        { name: "Verbal Reasoning", link: "https://www.indiabix.com/verbal-reasoning/questions-and-answers/" },
        { name: "Non Verbal Reasoning", link: "https://www.indiabix.com/non-verbal-reasoning/questions-and-answers/" },
        { name: "Time, Speed & Distance Problems", link: "https://www.indiabix.com/aptitude/time-speed-and-distance/" },
        { name: "HR Interview Q&A", link: "https://www.indiabix.com/hr-interview/questions-and-answers/" },
      ],
    },
  ];

  return (
    <div className="preparation-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <h2>Preparation Materials</h2>
          <p>Click the links to access learning resources:</p>
          {preparationData.map((section, index) => (
            <div key={index} className="category-box">
              <h3>{section.category}</h3>
              <ul className="materials-list">
                {section.materials.map((material, idx) => (
                  <li key={idx}>
                    <a href={material.link} target="_blank" rel="noopener noreferrer">
                      {material.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreparationMaterials;
