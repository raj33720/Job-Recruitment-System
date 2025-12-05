import React, { useState, useContext } from "react";
import '../style/test.css';
import { UserContext } from "../assets/UserContext";

const quizData = [
  {
    id:1,
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "High-Level Text Management Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
  },
  {
    id:2,
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "Java", "HTML", "C++"],
  },
  {
    id:3,
    question: "What is the output of print(2 ** 3) in Python?",
    options: ["6", "8", "9", "16"],
  },
  {
    id:4,
    question: "Which symbol is used for single-line comments in C++?",
    options: ["//", "/* */", "#", "--"],
  },
  {
    id:5,
    question: "What will 5 % 2 return in Python?",
    options: ["2", "2.5", "1", "0"],
  },
  {
    id:6,
    question: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Linked List", "Array"],
  },
  {
    id:7,
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheet",
      "Cascading Style Sheets",
      "Creative Style Syntax",
      "Colorful Style System",
    ],
  },
  {
    id:8,
    question: "Which keyword is used to define a function in Python?",
    options: ["func", "def", "function", "define"],
  },
  {
    id:9,
    question: "What will console.log(typeof '123') output in JavaScript?",
    options: ["number", "string", "integer", "object"],
  },
  {
    id:10,
    question: "Which SQL command is used to retrieve data from a database?",
    options: ["INSERT", "DELETE", "UPDATE", "SELECT"],
  },
];

const Quiz = () => {
  const [answers, setAnswers] = useState({});
  const { userData } = useContext(UserContext);

  const handleChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allAnswered = quizData.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      fullname: userData?.username || userData?.fullName,
      email: userData?.email,
      answers,
    };

    try {
      const res = await fetch("http://localhost:3001/api/submit-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Coding test answers submitted successfully!`);
      } else {
        alert("Submission failed: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An error occurred while submitting your answers.");
    }
  };

  return (
    <div className="container">
      <h1>Coding Test</h1>
      <form onSubmit={handleSubmit}>
        {quizData.map((q) => (
          <div key={q.id} className="mb-4 p-4 border rounded-lg shadow">
            <div className="question-box">
              <h2>Question {q.id}</h2>
              <p>{q.question}</p>
              {q.options.map((option, optionIndex) => (
                <label key={`${q.id}-${optionIndex}`}>
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleChange(q.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Quiz;
