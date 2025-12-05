import React, { useState } from 'react';
import '../style/personaldetails.css'; // Ensure this CSS file is correctly linked



const PersonalDetails = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        gender: '',
        resume: '',
        url: '',
        about: ''
    });

    const [message, setMessage] = useState("");


    // Function to update form fields dynamically
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file selection
    //  const handleFileChange = (e) => {
    //      setFormData({
    //          ...formData,
    //          resume: e.target.files[0]
    //      });
    //      console.log("Selected file:", e.target.files[0]);
    //  };

    // Function to reset form fields
    const handleReset = () => {
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            contact: '',
            gender: '',
            city: '',
            resume: null,
            url: '',
            about: ''
        });
        setMessage("Form has been reset!");
        setTimeout(() => setMessage(""), 3000);
    };
    const [selectedFile, setSelectedFile] = useState(null);
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!selectedFile) {
          alert("Please upload a resume.");
          return;
        }
      
        const data = new FormData();
        data.append('resume', selectedFile); // file
        data.append('firstname', formData.firstname);
        data.append('lastname', formData.lastname);
        data.append('email', formData.email);
        data.append('contact', formData.contact);
        data.append('city', formData.city);
        data.append('role', formData.role);
      
        try {
          const res = await fetch('http://localhost:3001/register', {
            method: 'POST',
            body: data,
          });
      
          const result = await res.json();
          console.log(result);
          alert(`Candidate registered! Resume URL: http://localhost:3001/${result.resumePath}`);
          handleReset();
        } catch (err) {
          console.error("Submit error:", err);
          alert("Failed to register candidate.");
        }
      };
      

   
    return (
        <div className="container">
            <h1>Personal Details</h1>

            {message && <div className="alert">{message}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data" >
                <label htmlFor="firstname">First Name:</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="Enter First Name" />

                <label htmlFor="lastname">Last Name:</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Enter Last Name" />

                <label htmlFor="email">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" />

                <label htmlFor="contact">Phone Number:</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter Phone Number" />


                <label htmlFor="city">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" />

                <label htmlFor="role">Role</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Enter Role" />

                <label htmlFor="resume">Resume:</label>
                <input type="file" placeholder="Select Resume" name="resume" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />


                <div className="button-container">
                    <button type="button" onClick={handleReset}>Reset</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default PersonalDetails;
