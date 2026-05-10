import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../assets/UserContext";
import CandidateLayout from "../components/CandidateLayout";
import "../style/personaldetails.css";

const API_BASE_URL = "http://localhost:3001";

const createInitialForm = (role = "", email = "") => ({
  firstname: "",
  lastname: "",
  email,
  contact: "",
  city: "",
  address: "",
  experience: "",
  role,
});

const PersonalDetails = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role")?.trim() || "";
  const selectedTrack = searchParams.get("track")?.trim() || "";
  const loggedInEmail = userData?.email?.trim() || "";
  const [formData, setFormData] = useState(createInitialForm(selectedRole, loggedInEmail));
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "", link: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData((currentData) => ({
      ...currentData,
      role: selectedRole || currentData.role,
      email: loggedInEmail || currentData.email,
    }));

    if (selectedRole) {
      localStorage.setItem("selectedRole", selectedRole);
    }

    if (selectedTrack) {
      localStorage.setItem("selectedTrack", selectedTrack);
    }

    if (userData && (selectedRole || selectedTrack)) {
      setUserData({
        ...userData,
        role: userData.role || "candidate",
        appliedRole: selectedRole || userData.appliedRole || "",
        track: selectedTrack || userData.track || "",
      });
    }
  }, [selectedRole, selectedTrack, loggedInEmail]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const clearForm = (nextRole = selectedRole) => {
    setFormData(createInitialForm(nextRole, loggedInEmail));
    setSelectedFile(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9]{7,15}$/;

    if (!formData.firstname.trim()) newErrors.firstname = "First name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailPattern.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!formData.contact.trim()) newErrors.contact = "Phone number is required.";
    else if (!phonePattern.test(formData.contact)) newErrors.contact = "Please enter a valid phone number.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.experience.trim()) newErrors.experience = "Experience is required.";
    else if (isNaN(formData.experience) || Number(formData.experience) < 0) newErrors.experience = "Experience must be a non-negative number.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";
    if (!selectedFile) newErrors.resume = "Resume upload is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    clearForm();
    setErrors({});
    setMessage({
      type: "info",
      text: "The form has been cleared. You can start again anytime.",
      link: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const appliedRole = selectedRole || formData.role.trim();
    const appliedTrack = selectedTrack || userData?.track || localStorage.getItem("selectedTrack") || "";
    const appliedEmail = loggedInEmail || formData.email.trim();

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted errors before submitting.",
        link: "",
      });
      return;
    }

    if (!appliedRole) {
      setMessage({
        type: "error",
        text: "Please choose a role from the Apply Now page before submitting.",
        link: "",
      });
      return;
    }

    if (!appliedEmail) {
      setMessage({
        type: "error",
        text: "Please login first so we can use your registered email for interview updates.",
        link: "",
      });
      return;
    }

    if (!selectedFile) {
      setMessage({
        type: "error",
        text: "Please upload your resume before submitting the application.",
        link: "",
      });
      return;
    }

    const data = new FormData();
    data.append("resume", selectedFile);
    data.append("firstname", formData.firstname.trim());
    data.append("lastname", formData.lastname.trim());
    data.append("email", appliedEmail);
    data.append("contact", formData.contact.trim());
    data.append("city", formData.city.trim());
    data.append("address", formData.address.trim());
    data.append("experience", formData.experience.trim());
    data.append("role", appliedRole);
    data.append("track", appliedTrack);

    try {
      setIsSubmitting(true);
      setMessage({ type: "", text: "", link: "" });

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application.");
      }

      clearForm(appliedRole);
      setMessage({
        type: "success",
        text: "Application submitted successfully. Our team can now review your profile and resume.",
        link: result.resumePath || "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit application.",
        link: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CandidateLayout
      title="Candidate Application"
      subtitle="Share your details carefully so the hiring team can evaluate your profile quickly."
    >
      <div className="form-wrapper">
        <div className="form-content candidate-panel">
          <div className="form-title-section">
            <h1 className="form-main-title">Candidate Application</h1>
            <p className="form-subtitle">Please fill out this form carefully so the hiring team can assess your profile.</p>
          </div>

          {message.text && (
            <div className={`form-message ${message.type}`}>
              <p>{message.text}</p>
              {message.link && (
                <a href={message.link} target="_blank" rel="noreferrer">
                  View uploaded resume
                </a>
              )}
            </div>
          )}

          <form className="interview-form" onSubmit={handleSubmit} encType="multipart/form-data">
            {/* General Information Section */}
            <div className="form-section">
              <h3 className="section-heading">General Information</h3>
              
              {/* Applicant Name */}
              <div className="form-field-group">
                <label className="field-label">Applicant <span className="required">*</span></label>
                <div className="two-column-inputs">
                  <div className="field-group">
                    <input
                      id="firstname"
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoComplete="given-name"
                      required
                    />
                    {errors.firstname && <span className="error-text">{errors.firstname}</span>}
                  </div>
                  <div className="field-group">
                    <input
                      id="lastname"
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Last Name"
                      autoComplete="family-name"
                      required
                    />
                    {errors.lastname && <span className="error-text">{errors.lastname}</span>}
                  </div>
                </div>
              </div>

              {/* Applied Position */}
              <div className="form-field-group">
                <label htmlFor="role" className="field-label">Applied Position <span className="required">*</span></label>
                <div className="field-group">
                  <input
                    id="role"
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Type a placeholder"
                    readOnly={Boolean(selectedRole)}
                    required
                  />
                  {errors.role && <span className="error-text">{errors.role}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-field-group">
                <label htmlFor="email" className="field-label">Email <span className="required">*</span></label>
                <div className="field-group">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Type a placeholder"
                    autoComplete="email"
                    readOnly={Boolean(loggedInEmail)}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-field-group">
                <label htmlFor="contact" className="field-label">Phone Number <span className="required">*</span></label>
                <div className="field-group">
                  <input
                    id="contact"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Type a placeholder"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />
                  {errors.contact && <span className="error-text">{errors.contact}</span>}
                </div>
              </div>

              {/* City and Address */}
              <div className="form-field-group">
                <label className="field-label">Location</label>
                <div className="two-column-inputs">
                  <div className="field-group">
                    <label htmlFor="city" className="sub-label">Current City <span className="required">*</span></label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Type a placeholder"
                      autoComplete="address-level2"
                      required
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="field-group">
                    <label htmlFor="address" className="sub-label">Address <span className="required">*</span></label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      placeholder="Type a placeholder"
                      autoComplete="street-address"
                      required
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="form-field-group">
                <label htmlFor="experience" className="field-label">Experience (years) <span className="required">*</span></label>
                <div className="field-group">
                  <input
                    id="experience"
                    type="number"
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleChange}
                    placeholder="e.g., 2.5"
                    min="0"
                    step="0.1"
                    required
                  />
                  {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="form-field-group">
                <label htmlFor="resume" className="field-label">Resume Upload <span className="required">*</span></label>
                <div className="upload-area">
                  <input
                    ref={fileInputRef}
                    id="resume"
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="upload-content">
                    <p className="upload-filename">{selectedFile ? selectedFile.name : "No file selected yet"}</p>
                    <p className="upload-hint">Accepted formats: PDF, DOC, DOCX</p>
                  </div>
                  <button 
                    type="button" 
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </button>
                </div>
                {errors.resume && <div className="error-text">{errors.resume}</div>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Clear Form
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default PersonalDetails;
