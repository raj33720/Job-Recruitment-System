import React, { useContext, useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { UserContext } from "../assets/UserContext";
import "../style/test.css";

const API_BASE_URL = "http://localhost:3001/api";

const fallbackCodingQuestions = [
  {
    _id: "fallback-reverse-string",
    title: "Reverse a String",
    description:
      "Write a function that receives a string and returns the string in reverse order.",
    difficulty: "Easy",
    starterCode: `function reverseString(str) {
  // write code here
}`,
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "coding", output: "gnidoc" },
    ],
  },
];

const getQuestionsFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.questions)) return responseData.questions;
  return [];
};

const normalizeOptions = (question) => {
  if (Array.isArray(question.options)) {
    return question.options
      .filter(Boolean)
      .map((option, index) => ({
        id: option.id ?? option.key ?? `option_${index}`,
        text: String(option.text ?? option.label ?? option.value ?? option),
        isCorrect: option.isCorrect === true || option.isCorrect === "true",
      }));
  }

  if (Array.isArray(question.answers)) {
    return question.answers
      .filter(Boolean)
      .map((answer, index) => ({
        id: answer.id ?? answer.key ?? `answer_${index}`,
        text: String(answer.text ?? answer.label ?? answer.value ?? answer),
        isCorrect: answer.isCorrect === true || answer.isCorrect === "true",
      }));
  }

  return Object.entries(question.answers || {})
    .filter(([, value]) => value)
    .map(([key, value]) => ({
      id: key,
      text: String(value),
      isCorrect: question.correct_answers?.[`${key}_correct`] === "true",
    }));
};

const normalizeQuestion = (question, index) => ({
  id: question.id ?? question._id ?? index + 1,
  text: question.question ?? question.text ?? `Question ${index + 1}`,
  options: normalizeOptions(question),
});

const buildDefaultCode = (question) =>
  question.starterCode ||
  `function solve(input) {
  // write your code here
  return input;
}`;

const CodingTest = () => {
  const { userData } = useContext(UserContext);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [codeAnswers, setCodeAnswers] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [codingScore, setCodingScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiRating, setAiRating] = useState(0);
  const [aiByQuestion, setAiByQuestion] = useState({});
  const [finalResult, setFinalResult] = useState(null);
  const [isSavingFinalResult, setIsSavingFinalResult] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [isLoadingCoding, setIsLoadingCoding] = useState(false);
  const [runningQuestionId, setRunningQuestionId] = useState("");
  const [hasSubmittedMcq, setHasSubmittedMcq] = useState(false);

  const appliedRole = useMemo(
    () => userData?.appliedRole || localStorage.getItem("selectedRole") || "",
    [userData?.appliedRole]
  );
  const mcqScore = Number(score) || 0;
  const weightedScore = mcqScore * 0.4 + codingScore * 0.6;
  const combinedFinalScore = weightedScore + aiRating;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/quiz/questions`);
        const questions = getQuestionsFromResponse(res.data).map(normalizeQuestion);

        setQuizData(questions);
        if (!questions.length) {
          setError("No MCQ questions found.");
        }
      } catch (err) {
        console.error("Quiz fetch error:", err);
        setError("Failed to load MCQ questions.");
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!hasSubmittedMcq) return;

    const fetchCodingQuestions = async () => {
      try {
        setIsLoadingCoding(true);
        const res = await axios.get(`${API_BASE_URL}/coding`, {
          params: appliedRole ? { role: appliedRole } : {},
        });

        const questions = Array.isArray(res.data) ? res.data : [];
        setCodingQuestions(questions.length ? questions : fallbackCodingQuestions);
      } catch (err) {
        console.error("Coding fetch error:", err);
        setCodingQuestions(fallbackCodingQuestions);
        setError("Using a default coding question because saved questions could not be loaded.");
      } finally {
        setIsLoadingCoding(false);
      }
    };

    fetchCodingQuestions();
  }, [appliedRole, hasSubmittedMcq]);

  const handleMcqChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    setError("");
  };

  const handleCodeChange = (questionId, value) => {
    setCodeAnswers((prev) => ({
      ...prev,
      [questionId]: value || "",
    }));
  };

  const handleMcqSubmit = async (event) => {
    event.preventDefault();

    if (!quizData.length) {
      setError("No MCQ questions available to submit.");
      return;
    }

    const allAnswered = quizData.every((question) => answers[question.id]);
    if (!allAnswered) {
      setError("Please answer all MCQ questions before opening the coding round.");
      return;
    }

    const mcqScore = quizData.reduce((total, question) => {
      return total + (answers[question.id]?.isCorrect ? 1 : 0);
    }, 0);

    setScore(mcqScore);
    setHasSubmittedMcq(true);
    setError("");

    if (userData?.email) {
      try {
        await axios.post(`${API_BASE_URL}/submit-answers`, {
          fullname:
            userData.fullName ||
            userData.name ||
            userData.username ||
            userData.email.split("@")[0],
          email: userData.email,
          answers: Object.fromEntries(
            Object.entries(answers).map(([questionId, option]) => [
              String(questionId),
              option.text,
            ])
          ),
          score: mcqScore,
          total: quizData.length,
          role: appliedRole,
          track: userData?.track || localStorage.getItem("selectedTrack") || "",
          type: "coding-mcq",
        });
      } catch (err) {
        console.error("MCQ submission save error:", err);
      }
    }
  };

  const updateAggregatedAiState = (nextAiByQuestion) => {
    const feedbackEntries = Object.entries(nextAiByQuestion).filter(
      ([, value]) => value && typeof value.feedback === "string"
    );
    const ratingValues = feedbackEntries.map(([, value]) => Number(value.rating) || 0);
    const averageRating = ratingValues.length
      ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length
      : 0;

    const combinedFeedback = feedbackEntries
      .map(
        ([questionId, value], index) =>
          `Q${index + 1} (${questionId})\nRating: ${(Number(value.rating) || 0).toFixed(
            1
          )}/10\n${value.feedback}`
      )
      .join("\n\n");

    setAiRating(averageRating);
    setAiFeedback(combinedFeedback);
  };

  const analyzeCode = async (questionId, code) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/analyze`, { code });
      const feedback = String(res.data?.feedback || "No AI feedback returned.");
      const rating = Number(res.data?.rating) || 0;

      setAiByQuestion((prev) => {
        const next = { ...prev, [questionId]: { feedback, rating } };
        updateAggregatedAiState(next);
        return next;
      });
    } catch (err) {
      console.error("AI analyze error:", err.response?.data || err.message);
      setAiByQuestion((prev) => {
        const next = {
          ...prev,
          [questionId]: {
            feedback: "AI analysis failed for this answer.",
            rating: 0,
          },
        };
        updateAggregatedAiState(next);
        return next;
      });
    }
  };

  const runCode = async (question) => {
    const questionId = question._id || question.id;
    const code = codeAnswers[questionId] || buildDefaultCode(question);

    try {
      setRunningQuestionId(questionId);
      setError("");

      const res = await axios.post(`${API_BASE_URL}/code/run`, {
        code,
        testCases: question.testCases || [],
      });

      const result = res.data;
      setCodeResults((prev) => {
        const previousScore = Number(prev[questionId]?.score) || 0;
        const nextScore = Number(result.score) || 0;
        setCodingScore((currentTotal) => currentTotal - previousScore + nextScore);
        return {
          ...prev,
          [questionId]: result,
        };
      });

      await analyzeCode(questionId, code);
    } catch (err) {
      console.error("Run error:", err);
      setCodeResults((prev) => {
        const previousScore = Number(prev[questionId]?.score) || 0;
        setCodingScore((currentTotal) => currentTotal - previousScore);
        return {
          ...prev,
          [questionId]: {
          passed: 0,
          total: question.testCases?.length || 0,
          score: 0,
          message: err.response?.data?.message || "Code execution failed.",
        },
        };
      });
    } finally {
      setRunningQuestionId("");
    }
  };

  const handleFinalSubmit = async () => {
    if (!hasSubmittedMcq) return;

    const payload = {
      name:
        userData?.fullName ||
        userData?.name ||
        userData?.username ||
        userData?.email?.split("@")[0] ||
        "Candidate",
      email: userData?.email || "",
      role: appliedRole,
      mcqScore,
      codingScore: Number(codingScore.toFixed(2)),
      aiRating: Number(aiRating.toFixed(2)),
      weightedScore: Number(weightedScore.toFixed(2)),
      finalScore: Number(combinedFinalScore.toFixed(2)),
      feedback: aiFeedback,
    };

    setFinalResult(payload);
    setError("");

    if (!payload.email) {
      setError("Final score is calculated locally. Login email not found, so DB save skipped.");
      return;
    }

    try {
      setIsSavingFinalResult(true);
      await axios.post(`${API_BASE_URL}/results`, payload);
    } catch (err) {
      console.error("Final result save error:", err.response?.data || err.message);
      setError("Final score calculated, but saving result failed.");
    } finally {
      setIsSavingFinalResult(false);
    }
  };

  if (isLoadingQuiz) {
    return <h2 className="assessment-loading">Loading questions...</h2>;
  }

  return (
    <main className="container coding-assessment">
      <h1>Coding Assessment</h1>

      {error && <p className="error">{error}</p>}

      <section className="assessment-section">
        <h2>MCQ Questions</h2>

        <form onSubmit={handleMcqSubmit}>
          {quizData.map((question, questionIndex) => (
            <article key={question.id} className="question-card">
              <h3>
                {questionIndex + 1}. {question.text}
              </h3>

              <div className="option-list">
                {question.options.map((option) => (
                  <label key={option.id} className="option">
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={answers[question.id]?.id === option.id}
                      onChange={() => handleMcqChange(question.id, option)}
                      disabled={hasSubmittedMcq}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}

          <button type="submit" disabled={hasSubmittedMcq}>
            {hasSubmittedMcq ? "MCQs Submitted" : "Submit MCQ"}
          </button>
        </form>
      </section>

      {hasSubmittedMcq && (
        <>
          <div className="score-box">
            <h2>
              MCQ Score: {score} / {quizData.length}
            </h2>
            <p>Coding Score: {codingScore.toFixed(2)}</p>
            <p>AI Rating: {aiRating.toFixed(2)} / 10</p>
          </div>

          <section className="assessment-section coding-section">
            <h2>Coding Questions</h2>

            {isLoadingCoding && <p>Loading coding questions...</p>}

            {!isLoadingCoding && !codingQuestions.length && (
              <p className="empty-state">
                No coding questions found for {appliedRole || "this role"}.
              </p>
            )}

            {codingQuestions.map((question, index) => {
              const questionId = question._id || question.id || `coding-${index}`;
              const result = codeResults[questionId];
              const aiResult = aiByQuestion[questionId];

              return (
                <article key={questionId} className="question-card coding-card">
                  <div className="coding-question-header">
                    <h3>{question.title || `Coding Question ${index + 1}`}</h3>
                    {question.difficulty && (
                      <span className="difficulty-pill">{question.difficulty}</span>
                    )}
                  </div>

                  <p>{question.description}</p>

                  <div className="editor-container">
                    <Editor
                      height="320px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={codeAnswers[questionId] ?? buildDefaultCode(question)}
                      onChange={(value) => handleCodeChange(questionId, value)}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => runCode(question)}
                    disabled={runningQuestionId === questionId}
                  >
                    {runningQuestionId === questionId ? "Running..." : "Run Code"}
                  </button>

                  {result && (
                    <div className="run-result">
                      {result.message ? (
                        <p>{result.message}</p>
                      ) : (
                        <>
                          <p>
                            Passed: {result.passed} / {result.total}
                          </p>
                          {result.runner === "local" && result.judge0Error && (
                            <p className="runner-note">
                              Judge0 unavailable: {result.judge0Error}. Used local
                              JavaScript runner.
                            </p>
                          )}
                          {Array.isArray(result.results) && (
                            <ul className="test-result-list">
                              {result.results.map((testResult, testIndex) => (
                                <li key={`${questionId}-result-${testIndex}`}>
                                  <span>
                                    Test {testIndex + 1}:{" "}
                                    {testResult.passed ? "Passed" : "Failed"}
                                  </span>
                                  {!testResult.passed && (
                                    <small>
                                      Expected "{testResult.expected}", got "
                                      {testResult.output || testResult.error || "no output"}"
                                    </small>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {aiResult && (
                    <div className="ai-box">
                      <h3>AI Feedback</h3>
                      <p>Rating: {(Number(aiResult.rating) || 0).toFixed(1)} / 10</p>
                      <pre>{aiResult.feedback}</pre>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          <section className="assessment-section">
            <h2>Final Result</h2>
            {aiFeedback && (
              <div className="ai-box">
                <h3>AI Feedback Summary</h3>
                <pre>{aiFeedback}</pre>
              </div>
            )}
            <button type="button" onClick={handleFinalSubmit} disabled={isSavingFinalResult}>
              {isSavingFinalResult ? "Saving..." : "Submit Final Result"}
            </button>

            {finalResult && (
              <div className="score-box final-score-box">
                <h2>Final Score: {finalResult.finalScore.toFixed(2)}</h2>
                <p>MCQ: {finalResult.mcqScore}</p>
                <p>Coding: {finalResult.codingScore}</p>
                <p>AI Rating: {finalResult.aiRating}</p>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default CodingTest;
