const mongoose = require("mongoose");
const CodingQuestion = require("./models/CodingQuestion");

mongoose.connect("mongodb://127.0.0.1:27017/job-portal");

const seedData = async () => {
  await CodingQuestion.deleteMany();

  await CodingQuestion.insertMany([
    {
      role: "Frontend Developer",
      title: "Reverse a String",
      description: "Write a function to reverse a string.",
      difficulty: "Easy",
      starterCode: `function reverseString(str) {
  // write code here
}`,
      testCases: [
        { input: "hello", output: "olleh" },
        { input: "abc", output: "cba" },
      ],
    },
    {
      role: "Backend Developer",
      title: "Factorial",
      description: "Return factorial of a number.",
      difficulty: "Easy",
      starterCode: `function factorial(n) {
  // write code here
}`,
      testCases: [
        { input: "5", output: "120" },
      ],
    },
  ]);

  console.log("Coding questions inserted");
  process.exit();
};

seedData();