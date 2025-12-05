import React, { useState, useContext, useEffect } from "react";
import "../style/profile.css";
import { UserContext } from "../assets/UserContext";

const Profile = () => {
  const { userData } = useContext(UserContext);
  const storedImage = localStorage.getItem("profileImage");
  const [profileImage, setProfileImage] = useState(storedImage);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (!userData && savedUser) {
      // You can enhance this if needed in your context setup
    }
  },[]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      localStorage.setItem("profileImage", imageUrl);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>HR Profile</h2>

        <div
          className="profile-image-container"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <img
            src={profileImage || "/default-profile.png"}
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        <div className="profile-details">
          {userData ? (
            <>
              <div className="detail-row"><span>Full Name:</span> {userData.fullName}</div>
              <div className="detail-row"><span>Email:</span> {userData.email}</div>
              <div className="detail-row"><span>Phone:</span> {userData.phone}</div>
            </>
          ) : (
            <p>No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
