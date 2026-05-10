import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateLayout from "../components/CandidateLayout";
import "../style/roles.css";
import { UserContext } from "../assets/UserContext";

const API_BASE_URL = "http://127.0.0.1:3001";

const ROLE_IMAGES = {
  frontend:
    "https://images.unsplash.com/photo-1569748130764-3fed0c102c59?auto=format&fit=crop&w=1200&q=80",
  frontendAlt:
    "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?auto=format&fit=crop&w=1200&q=80",
  backend:
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
  backendAlt:
    "https://images.unsplash.com/photo-1555952494-efd681c7e3f9?auto=format&fit=crop&w=1200&q=80",
  ai: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?auto=format&fit=crop&w=1200&q=80",
  data: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?auto=format&fit=crop&w=1200&q=80",
  cyber:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  devops:
    "https://images.unsplash.com/photo-1631624210938-539575f92e3c?auto=format&fit=crop&w=1200&q=80",
  cloud:
    "https://images.unsplash.com/photo-1690627931320-16ac56eb2588?auto=format&fit=crop&w=1200&q=80",
  cloudAlt:
    "https://images.unsplash.com/photo-1637937459053-c788742455be?auto=format&fit=crop&w=1200&q=80",
  mobile:
    "https://images.unsplash.com/photo-1633250391894-397930e3f5f2?auto=format&fit=crop&w=1200&q=80",
  mobileAlt:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
  blockchain:
    "https://images.unsplash.com/photo-1643944430120-f20504376070?auto=format&fit=crop&w=1200&q=80",
  qa: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=1200&q=80",
};

const roles = [
  {
    name: "Frontend Developer",
    track: "Web",
    image: ROLE_IMAGES.frontend,
    description:
      "Builds responsive user interfaces with HTML, CSS, JavaScript, and modern frontend frameworks.",
  },
  {
    name: "React Developer",
    track: "Web",
    image: ROLE_IMAGES.frontendAlt,
    description:
      "Creates reusable React components, dynamic pages, and smooth single-page application flows.",
  },
  {
    name: "UI Engineer",
    track: "Web",
    image: ROLE_IMAGES.frontend,
    description:
      "Turns design systems into polished, accessible, and production-ready web interfaces.",
  },
  {
    name: "Backend Developer",
    track: "Backend",
    image: ROLE_IMAGES.backend,
    description:
      "Develops APIs, business logic, and secure services that power modern web applications.",
  },
  {
    name: "Node.js Developer",
    track: "Backend",
    image: ROLE_IMAGES.backendAlt,
    description:
      "Builds scalable server-side applications, REST APIs, and microservices with Node.js.",
  },
  {
    name: "Java Developer",
    track: "Backend",
    image: ROLE_IMAGES.backend,
    description:
      "Creates enterprise-grade backend systems, services, and integrations using Java technologies.",
  },
  {
    name: "Python Developer",
    track: "Backend",
    image: ROLE_IMAGES.backendAlt,
    description:
      "Develops backend tools, automations, APIs, and data-driven applications using Python.",
  },
  {
    name: "Full Stack Developer",
    track: "Full Stack",
    image: ROLE_IMAGES.frontendAlt,
    description:
      "Handles both frontend and backend development to deliver complete web application features.",
  },
  {
    name: "MERN Stack Developer",
    track: "Full Stack",
    image: ROLE_IMAGES.backend,
    description:
      "Builds end-to-end MongoDB, Express, React, and Node.js applications for modern products.",
  },
  {
    name: "DevOps Engineer",
    track: "Platform",
    image: ROLE_IMAGES.devops,
    description:
      "Automates deployments, CI/CD pipelines, and infrastructure workflows for reliable delivery.",
  },
  {
    name: "Cloud Engineer",
    track: "Platform",
    image: ROLE_IMAGES.cloud,
    description:
      "Designs cloud-based environments, scalable services, and resilient deployment architectures.",
  },
  {
    name: "Site Reliability Engineer",
    track: "Platform",
    image: ROLE_IMAGES.cloudAlt,
    description:
      "Improves uptime, observability, incident response, and production system performance.",
  },
  {
    name: "AI/ML Engineer",
    track: "AI",
    image: ROLE_IMAGES.ai,
    description:
      "Builds machine learning pipelines, models, and intelligent product features for real-world use.",
  },
  {
    name: "Computer Vision Engineer",
    track: "AI",
    image: ROLE_IMAGES.ai,
    description:
      "Develops image-processing and vision models for detection, recognition, and automation tasks.",
  },
  {
    name: "Data Scientist",
    track: "Data",
    image: ROLE_IMAGES.data,
    description:
      "Analyzes data, builds predictive models, and extracts insights to support product decisions.",
  },
  {
    name: "Data Engineer",
    track: "Data",
    image: ROLE_IMAGES.data,
    description:
      "Builds data pipelines, ETL workflows, and storage systems for analytics and machine learning.",
  },
  {
    name: "Cybersecurity Analyst",
    track: "Security",
    image: ROLE_IMAGES.cyber,
    description:
      "Monitors systems, detects threats, and helps protect applications, networks, and user data.",
  },
  {
    name: "Security Engineer",
    track: "Security",
    image: ROLE_IMAGES.cyber,
    description:
      "Implements secure coding practices, access controls, and defense layers across software systems.",
  },
  {
    name: "QA Automation Engineer",
    track: "Quality",
    image: ROLE_IMAGES.qa,
    description:
      "Designs automated test suites to verify quality, regressions, and release readiness faster.",
  },
  {
    name: "Mobile App Developer",
    track: "Mobile",
    image: ROLE_IMAGES.mobile,
    description:
      "Builds feature-rich mobile applications with strong performance, usability, and API integration.",
  },
  {
    name: "Android Developer",
    track: "Mobile",
    image: ROLE_IMAGES.mobileAlt,
    description:
      "Creates Android apps with clean architecture, native performance, and device-friendly UX.",
  },
  {
    name: "iOS Developer",
    track: "Mobile",
    image: ROLE_IMAGES.mobile,
    description:
      "Develops polished iPhone and iPad applications with reliable performance and smooth interactions.",
  },
  {
    name: "Blockchain Developer",
    track: "Emerging Tech",
    image: ROLE_IMAGES.blockchain,
    description:
      "Builds decentralized applications, smart contract integrations, and blockchain-based workflows.",
  },
  {
    name: "Database Engineer",
    track: "Data",
    image: ROLE_IMAGES.cloudAlt,
    description:
      "Designs schemas, query strategies, and database infrastructure for fast and secure applications.",
  },
  {
    name: "IoT Developer",
    track: "Embedded",
    image: ROLE_IMAGES.cloud,
    description:
      "Connects software with smart devices, sensors, and real-time data systems for modern solutions.",
  },
];

function Roles() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const getApplicantName = () => {
    if (userData?.fullName?.trim()) {
      return userData.fullName.trim();
    }

    if (userData?.email?.trim()) {
      return userData.email.split("@")[0];
    }

    return "Candidate";
  };

  const handleApplyClick = async (role) => {
    navigate(
      `/personal-details?role=${encodeURIComponent(role.name)}&track=${encodeURIComponent(role.track)}`
    );

    try {
      await axios.post(`${API_BASE_URL}/apply`, {
        applicantName: getApplicantName(),
        jobRole: role.name,
        track: role.track,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CandidateLayout
      title="Explore Open Roles"
      subtitle="Choose a track that matches your strengths and move to the application form."
    >
      <div className="roles-shell">
        <section className="roles-hero candidate-panel">
          <div className="roles-hero-copy">
            <p className="roles-kicker">Open Applications</p>
            <h2>Computer Engineering Roles</h2>
            <p className="roles-subtitle">
              Explore current openings across frontend, backend, AI, data, cloud,
              security, mobile, and platform engineering.
            </p>
          </div>

          <div className="roles-summary">
            <span className="summary-count">{roles.length}</span>
            <span className="summary-label">Active roles</span>
            <p>Choose a position and continue directly to the candidate application form.</p>
          </div>
        </section>

        <div className="roles-grid">
          {roles.map((role) => (
            <article key={role.name} className="role-card">
              <img src={role.image} alt={role.name} className="card-image" loading="lazy" />

              <div className="card-content">
                <span className="card-chip">{role.track}</span>
                <h3 className="card-title">{role.name}</h3>
                <p className="card-description">{role.description}</p>
                <button className="apply-btn" type="button" onClick={() => handleApplyClick(role)}>
                  Apply Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </CandidateLayout>
  );
}

export default Roles;
