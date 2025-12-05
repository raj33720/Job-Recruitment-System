import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'


function ForgotPassword() {
    const [email, setEmail] = useState()
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/forgot-password', { email })
        .then(res => {
          console.log("Response:", res.data); // Log for debug
          if(res.data.status === "Success") {
            alert("Reset Link: " + res.data.link);
            navigate('/login');
          } else {
            alert(res.data.status); // show error (e.g., user not found)
          }
        })
        .catch(err => {
          console.error("Axios Error:", err);
          alert("Something went wrong. Check console.");
        });
      
    }

    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h4>Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Send
          </button>
          </form>
        
      </div>
    </div>
    )
}

export default ForgotPassword;