import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../assets/UserContext";
import { clearAuthToken } from "../utils/auth";
import logo from "../assets/tech-hiring-logo.png";
import "../style/candidate-theme.css";

const navItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Apply Now", path: "/roles" },
  { label: "Progress", path: "/progress" },
  { label: "Interview Rounds", path: "/round" },
  { label: "Interview Prep", path: "/preparation-materials" },
];

const getDisplayName = (userData) => {
  if (userData?.fullName?.trim()) return userData.fullName.trim();
  if (userData?.email?.trim()) return userData.email.split("@")[0];
  return "Candidate";
};

const CandidateLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData } = useContext(UserContext);
  const profileImage = localStorage.getItem("profileImage");
  const displayName = getDisplayName(userData);

  const handleLogout = () => {
    clearAuthToken();
    setUserData(null);
    navigate("/login");
  };

  const titleText = title || `Welcome ${displayName}`;

  return (
    <div className="candidate-shell">
      <div className="candidate-bg candidate-bg-one" />
      <div className="candidate-bg candidate-bg-two" />
      <div className="candidate-grid-overlay" />

      <header className="candidate-topbar">
        <button
          type="button"
          className="candidate-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <img src={logo} alt="Tech Hiring" className="candidate-brand-logo" />
          <span className="candidate-brand-text">Candidate Workspace</span>
        </button>

        <div className="candidate-topbar-actions">
          <button type="button" className="candidate-ghost-btn" onClick={() => navigate("/profile")}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="candidate-avatar" />
            ) : (
              <span className="candidate-avatar candidate-avatar-fallback">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
            Profile
          </button>
          <button type="button" className="candidate-danger-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="candidate-layout">
        <aside className="candidate-sidebar">
          <p className="candidate-sidebar-title">Navigation</p>
          <nav className="candidate-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `candidate-nav-link${isActive || location.pathname === item.path ? " active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="candidate-main">
          <section className="candidate-page-head">
            <h1>{titleText}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </section>
          {children}
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;

