import React, { useState, useContext } from "react";
import "../style/test.css";
import { UserContext } from "../assets/UserContext";

const quizData = [
  
  {
    id: 1,
    text: "A and B can complete a task in 12 days and 18 days, respectively. If they work together, how many days will they take to complete the work?",
    options: ["7.2 days", "6.2 days", "8 days", "9 days"],
  },
  {
    id: 2,
    text: "C can do a job in 15 days, while D takes 25 days. If both work together for 5 days, how much of the work remains?",
    options: ["9/4", "5/6", "2/3", "1/2"],
  },
  {
    id: 3,
    text: "The present age of a father is three times that of his son. After 10 years, the father’s age will be twice that of his son. What is the present age of the son?",
    options: ["10 years", "15 years", "20 years", "25 years"],
  },
  {
    id: 4,
    text: "The sum of the ages of a mother and her daughter is 50 years. 5 years ago, the mother was four times as old as the daughter. What is the present age of the daughter?",
    options: ["10 years", "15 years", "12 years", "18 years"],
  },
  {
    id: 5,
    text: "A person walks 5 km north, then turns right and walks 3 km, then turns right and walks 5 km, and finally turns left and walks 2 km. How far is he from his starting point?",
    options: ["3 km", "2 km", "5 km", "4 km"],
  },
  {
    id: 6,
    text: "A is facing east. He turns 90° clockwise, then 180° counterclockwise, and finally 90° clockwise. In which direction is he facing now?",
    options: ["East", "West", "North", "South"],
  },
  {
    id: 7,
    text: "At what time between 2:00 and 3:00 will the hour and minute hands of the clock coincide?",
    options: ["2:10", "2:21", "2:21.8", "2:25"],
  },
  {
    id: 8,
    text: "A clock gains 5 minutes every hour. If it shows the correct time at 12:00 noon, what will be the time on the clock after 6 hours, when the actual time is 6:00 PM?",
    options: ["6:20 pm", "6:25 pm", "6:30 pm", "6:35 pm"],
  },
  {
    id: 9,
    text: "A shopkeeper sells an item at a 20% profit. If the cost price of the item is ₹500, what is the selling price?",
    options: ["₹550", "₹600", "₹620", "₹650"],
  },
  {
    id: 10,
    text: "A product is marked at ₹1200 with a discount of 10%. What is the selling price of the product?",
    options: ["₹1000", "₹1080", "₹1100", "₹1120"],
  },
];


const QuantitativeTest = () => {
  const [answers, setAnswers] = useState({});
  const [score, ] = useState(null);
  const { userData } = useContext(UserContext);

  const handleChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allAnswered = quizData.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const email = userData?.email;
    if (!email) {
      alert("User email not found. Please login.");
      return;
    }

    const payload = {
      email,
      answers: Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [String(k), v])
      ),
    };

    try {
      const response = await fetch("http://localhost:3001/api/submit-quant-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Apptitude test answers submitted successfully!`);
      } else {
        alert("Failed to submit: " + result.message);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container">
      <h1>Quantitative Aptitude Assessment</h1>
      <form onSubmit={handleSubmit}>
        {quizData.map((question) => (
          <div key={question.id} className="question-box">
            <h2>Question {question.id}</h2>
            <p>{question.text}</p>
            {question.options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name={`q${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleChange(question.id, option)}
                />{" "}
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {score !== null && (
        <div className="score-box">
          <h2>Your Score: {score} / {quizData.length}</h2>
        </div>
      )}
    </div>
  );
};

export default QuantitativeTest;
