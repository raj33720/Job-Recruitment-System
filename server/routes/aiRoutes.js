const express = require("express");
const axios = require("axios");

const router = express.Router();

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";
const DEFAULT_GEMINI_API_VERSIONS = ["v1beta", "v1"];
const DEFAULT_GEMINI_MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
];

const isDummyKey = (key = "") =>
  !String(key).trim() ||
  String(key).toLowerCase().includes("dummy") ||
  String(key).toLowerCase().includes("replace_me");

const clampRating = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(10, numeric));
};

const parseCsvEnv = (rawValue = "") =>
  String(rawValue || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const uniqueValues = (values = []) => {
  const seen = new Set();
  return values.filter((value) => {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

const normalizeModelName = (value = "") =>
  String(value || "").trim().replace(/^models\//i, "");

const getGeminiApiVersions = () => {
  const fromEnv = parseCsvEnv(process.env.GEMINI_API_VERSIONS);
  const candidates = uniqueValues([
    ...fromEnv.map((value) => value.toLowerCase()),
    ...DEFAULT_GEMINI_API_VERSIONS,
  ]);

  const normalized = uniqueValues(
    candidates
      .filter((value) => value === "v1" || value === "v1beta")
  );

  return normalized.length ? normalized : DEFAULT_GEMINI_API_VERSIONS;
};

const getGeminiModelCandidates = () => {
  const preferredModel = normalizeModelName(process.env.GEMINI_MODEL);
  const envModels = parseCsvEnv(process.env.GEMINI_MODEL_CANDIDATES).map(
    normalizeModelName
  );
  const defaults = DEFAULT_GEMINI_MODEL_CANDIDATES.map(normalizeModelName);

  return uniqueValues([preferredModel, ...envModels, ...defaults].filter(Boolean));
};

const isUnavailableModelError = (message = "") => {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("not found for api version") ||
    text.includes("is not found") ||
    text.includes("not supported for generatecontent") ||
    text.includes("method not found")
  );
};

const buildAnalyzePrompt = (code = "") => `Analyze this JavaScript code.
Return strict JSON only (no markdown, no extra text) with keys:
correctness (0-10 number), timeComplexity (string), codeQuality (string), feedback (string), rating (0-10 number).

Code:
${code}`;

const callGeminiWithFallbacks = async (geminiKey, code) => {
  const apiVersions = getGeminiApiVersions();
  const modelCandidates = getGeminiModelCandidates();
  const attempts = [];

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: buildAnalyzePrompt(code) }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
    },
  };

  for (const apiVersion of apiVersions) {
    for (const model of modelCandidates) {
      const url = `${GEMINI_API_BASE}/${apiVersion}/models/${model}:generateContent`;

      try {
        const response = await axios.post(`${url}?key=${geminiKey}`, payload, {
          timeout: 20000,
          headers: { "Content-Type": "application/json" },
        });

        return response.data;
      } catch (error) {
        const message =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          "request failed";

        attempts.push(`${apiVersion}/${model}: ${message}`);

        const status = Number(error.response?.status || 0);
        const shouldTryNextModel = status === 400 || status === 404 || isUnavailableModelError(message);

        if (!shouldTryNextModel) {
          error.attempts = attempts;
          throw error;
        }
      }
    }
  }

  const finalError = new Error("No available Gemini model endpoint succeeded.");
  finalError.attempts = attempts;
  throw finalError;
};

const extractJson = (text = "") => {
  const source = String(text || "").trim();
  if (!source) return null;

  const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] || source;

  try {
    return JSON.parse(candidate);
  } catch {
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }

    try {
      return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
};

const extractText = (responseData) => {
  const parts = responseData?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => String(part?.text || "").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
};

const estimateComplexity = (code = "") => {
  const source = String(code || "");
  const forCount = (source.match(/\bfor\b/g) || []).length;
  const whileCount = (source.match(/\bwhile\b/g) || []).length;
  const totalLoops = forCount + whileCount;

  if (totalLoops >= 2) return "Likely O(n^2) or higher";
  if (totalLoops === 1) return "Likely O(n)";
  return "Likely O(1) to O(n)";
};

const localFallbackAnalysis = (code = "", reason = "") => {
  const trimmed = String(code || "").trim();
  const hasReturn = /\breturn\b/.test(trimmed);
  const hasFunction = /\bfunction\b|=>/.test(trimmed);
  const nonEmptyLines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;

  let correctness = 4;
  let codeQuality = "Basic";

  if (hasFunction) correctness += 1;
  if (hasReturn) correctness += 2;
  if (nonEmptyLines > 8) correctness += 1;
  if (nonEmptyLines > 4 && hasReturn) codeQuality = "Fair";
  if (nonEmptyLines > 10 && hasReturn) codeQuality = "Good";

  correctness = clampRating(correctness);

  const hint = reason
    ? `AI provider unavailable (${reason}). Using local fallback analysis.`
    : "Using local fallback analysis.";

  return {
    feedback: [
      `Correctness: ${correctness}/10`,
      `Time Complexity: ${estimateComplexity(trimmed)}`,
      `Code Quality: ${codeQuality}`,
      "Feedback: Add clear return values and test edge cases to improve score.",
      hint,
    ].join("\n"),
    rating: correctness,
    source: "local-fallback",
  };
};

router.post("/analyze", async (req, res) => {
  try {
    const { code } = req.body || {};

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Code is required" });
    }
    const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
    if (isDummyKey(geminiKey)) {
      return res.json(localFallbackAnalysis(code, "dummy key"));
    }

    const responseData = await callGeminiWithFallbacks(geminiKey, code);
    const output = extractText(responseData);
    const parsed = extractJson(output);

    if (parsed && typeof parsed === "object") {
      const correctness = clampRating(parsed.correctness);
      const rating = clampRating(
        parsed.rating !== undefined ? parsed.rating : parsed.correctness
      );

      const feedback = [
        `Correctness: ${correctness}/10`,
        `Time Complexity: ${String(parsed.timeComplexity || "Not provided")}`,
        `Code Quality: ${String(parsed.codeQuality || "Not provided")}`,
        `Feedback: ${String(parsed.feedback || "No feedback provided")}`,
      ].join("\n");

      return res.json({ feedback, rating });
    }

    const ratingMatch = output.match(
      /(?:rating|correctness)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)/i
    );
    const rating = clampRating(ratingMatch?.[1]);

    return res.json({ feedback: output || "No feedback generated", rating });
  } catch (err) {
    const apiMessage =
      err.response?.data?.error?.message ||
      err.response?.data?.message ||
      err.message ||
      "request failed";
    const attemptsDetail =
      Array.isArray(err.attempts) && err.attempts.length
        ? ` Attempts: ${err.attempts.join(" | ")}`
        : "";
    const reason = `${apiMessage}${attemptsDetail}`;

    console.error("AI analyze error:", err.response?.data || err.message);
    return res.json(localFallbackAnalysis(req.body?.code || "", reason));
  }
});

module.exports = router;
