const express = require("express");
const axios = require("axios");
const vm = require("vm");

const router = express.Router();

const getFunctionName = (code = "") => {
  const source = String(code);
  const declarationMatch = source.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
  const assignmentMatch = source.match(
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/
  );

  return declarationMatch?.[1] || assignmentMatch?.[1] || null;
};

const getCallableNames = (code = "") => {
  const names = ["solve"];
  const detectedName = getFunctionName(code);

  if (detectedName && !names.includes(detectedName)) {
    names.push(detectedName);
  }

  return names;
};

const buildJavascriptSubmission = (code, input) => {
  const callableChecks = getCallableNames(code)
    .map((name) => `typeof ${name} === "function" ? ${name} : null`)
    .join(", ");

  return `const __candidateInput = ${JSON.stringify(String(input ?? ""))};
const input = __candidateInput;

${code}

const __candidateFn = [${callableChecks}].find(Boolean);
if (__candidateFn) {
  const __result = __candidateFn(__candidateInput);
  if (__result !== undefined) {
    console.log(__result);
  }
}`;
};

const normalizeOutput = (value) => String(value ?? "").trim();

const formatJudge0Error = (err) => {
  const responseData = err.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  return (
    responseData?.message ||
    responseData?.error ||
    err.response?.statusText ||
    err.message ||
    "Judge0 request failed"
  );
};

const runWithJudge0 = async (code, input) => {
  const response = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    {
      source_code: buildJavascriptSubmission(code, input),
      language_id: 63, // JavaScript
      stdin: String(input ?? ""),
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      timeout: 20000,
    }
  );

  return {
    output: normalizeOutput(response.data.stdout),
    error: normalizeOutput(
      response.data.stderr || response.data.compile_output || response.data.message
    ),
    status: response.data.status?.description || "Finished",
  };
};

const runJavascriptLocally = (code, input) => {
  const logs = [];
  const callableChecks = getCallableNames(code)
    .map((name) => `typeof ${name} === "function" ? ${name} : null`)
    .join(", ");
  const source = `const input = ${JSON.stringify(String(input ?? ""))};

${code}

const __candidateFn = [${callableChecks}].find(Boolean);
if (__candidateFn) {
  const __result = __candidateFn(input);
  if (__result !== undefined) {
    console.log(__result);
  }
}`;

  try {
    vm.runInNewContext(
      source,
      {
        console: {
          log: (...args) => {
            logs.push(args.map((value) => String(value)).join(" "));
          },
        },
      },
      { timeout: 2000 }
    );

    return { output: normalizeOutput(logs.join("\n")), error: "", status: "Finished" };
  } catch (err) {
    return { output: "", error: err.message, status: "Runtime Error" };
  }
};

router.post("/run", async (req, res) => {
  try {
    const { code, testCases = [] } = req.body;

    if (!code || !Array.isArray(testCases) || !testCases.length) {
      return res.status(400).json({ message: "Code and test cases are required" });
    }

    let passed = 0;
    let runner = "judge0";
    let judge0Error = "";
    const results = [];

    for (let test of testCases) {
      let execution;

      if (runner === "judge0") {
        try {
          execution = await runWithJudge0(code, test.input);
        } catch (err) {
          runner = "local";
          judge0Error = formatJudge0Error(err);
          execution = runJavascriptLocally(code, test.input);
        }
      } else {
        execution = runJavascriptLocally(code, test.input);
      }

      const expected = normalizeOutput(test.output);
      const didPass = !execution.error && execution.output === expected;

      if (didPass) {
        passed++;
      }

      results.push({
        input: String(test.input ?? ""),
        expected,
        output: execution.output,
        passed: didPass,
        error: execution.error,
        status: execution.status,
      });
    }

    res.json({
      passed,
      total: testCases.length,
      score: (passed / testCases.length) * 10,
      runner,
      judge0Error,
      results,
    });
  } catch (err) {
    console.error("Run error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Code execution failed",
      detail: formatJudge0Error(err),
    });
  }
});

module.exports = router;
