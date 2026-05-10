const express = require("express");
const axios = require("axios");

const router = express.Router();

const getQuizConfigFromTrack = (track = "") => {
  const normalizedTrack = track.toLowerCase();

  switch (normalizedTrack) {
    case "web":
      return { category: "code" };

    case "backend":
      return { category: "code" };

    case "full stack":
      return { category: "code" };

    case "data":
      return { category: "sql" };

    case "ai":
      return { category: "code" };

    case "platform":
      return { category: "linux" };

    case "security":
      return { category: "linux" };

    case "mobile":
      return { category: "code" };

    case "quality":
      return { category: "code" };

    default:
      return { category: "code" };
  }
};

const shuffleArray = (items = []) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
};

const toSingleCorrectOptions = (question = {}) => {
  const options = Object.entries(question.answers || {})
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim())
    .map(([key, value]) => ({
      id: key,
      text: String(value),
      isCorrect: question.correct_answers?.[`${key}_correct`] === "true",
    }));

  if (options.length < 2) {
    return [];
  }

  const correctIndexes = options
    .map((option, index) => (option.isCorrect ? index : -1))
    .filter((index) => index !== -1);

  if (!correctIndexes.length) {
    return [];
  }

  // Keep only one correct option so the UI can remain single-select.
  const primaryCorrectIndex = correctIndexes[0];
  const normalized = options.map((option, index) => ({
    ...option,
    isCorrect: index === primaryCorrectIndex,
  }));

  return shuffleArray(normalized);
};

router.get("/questions", async (req, res) => {
  try {
    const { limit = 10, track = "" } = req.query;
    const numericLimit = Number(limit);
    const requestedLimit = Number.isFinite(numericLimit)
      ? Math.max(1, Math.min(20, numericLimit))
      : 10;
    const fetchLimit = Math.max(requestedLimit * 2, requestedLimit);
    const { category } = getQuizConfigFromTrack(track);

    if (!process.env.QUIZ_API_KEY) {
      return res.status(500).json({ message: "Quiz API key is not configured" });
    }

    const response = await axios.get("https://quizapi.io/api/v1/questions", {
      headers: {
        Authorization: `Bearer ${process.env.QUIZ_API_KEY}`,
      },
      params: {
        limit: fetchLimit,
        category,
      },
    });
    const normalizedQuestions = (Array.isArray(response.data) ? response.data : [])
      .map((question) => {
        const options = toSingleCorrectOptions(question);
        if (!options.length) return null;

        return {
          ...question,
          options,
          multiple_correct_answers: "false",
        };
      })
      .filter(Boolean)
      .slice(0, requestedLimit);

    res.json(normalizedQuestions);
  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch quiz questions" });
  }
});

module.exports = router;
