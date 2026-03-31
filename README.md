# 💼 Job Recruitment System

A full-stack **Job Recruitment System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.
This platform connects **job seekers and recruiters**, allowing companies to post job openings and candidates to apply for available positions through a user-friendly interface.

---

# 🚀 Features

### 👤 User Authentication

* User Registration
* Secure Login System
* Password hashing using **bcrypt**
* MongoDB database storage

### 👨‍💼 Recruiter Features

* Post new job openings
* Manage job listings
* View applicants for posted jobs

### 👩‍💻 Job Seeker Features

* Browse available jobs
* View job details
* Apply for jobs
* Track job applications

### 📊 Application Management

* Store applicant data
* Manage job postings
* Update job listings

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Vite
* CSS / Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* bcryptjs

## Database

* MongoDB Atlas

---

# 📂 Project Structure

```
Job-Recruitment-System
│
├── job
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
├── server
│   ├── models
│   ├── routes
│   └── controllers
│
├── index2.js
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/raj33720/Job-Recruitment-System.git
cd Job-Recruitment-System
```

---

### 2️⃣ Install Backend Dependencies

```
npm install
```

---

### 3️⃣ Install Frontend Dependencies

```
cd job
npm install
```

---

### 4️⃣ Setup Environment Variables

Create a `.env` file in the root folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

---

### 5️⃣ Run Backend Server

```
npm start
```

---

### 6️⃣ Run Frontend

```
cd job
npm run dev
```

---

# 🌐 Application Pages

The system includes the following pages:

* Login Page
* Register Page
* Job Listings
* Job Details
* Job Application Page
* Recruiter Dashboard

---

# 🔒 Authentication

User authentication is implemented using:

* **bcrypt** for password hashing
* **MongoDB** for storing user data
* **JWT (optional)** for secure authentication

---

# 📈 Future Improvements

* Resume upload system
* Admin dashboard
* Job filtering & search
* Email notifications
* Application status tracking
* Company profiles


