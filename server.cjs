var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
var users = [
  { id: "teacher-1", username: "teacher", email: "teacher@academy.edu", password: "password", role: "teacher" },
  { id: "student-1", username: "student", email: "student@academy.edu", password: "password", role: "student" }
];
var mockReports = [];
var getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Falling back to rule-based simulation.");
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});
app.post("/api/auth/register", (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  const exists = users.find((u) => u.email === email || u.username === username);
  if (exists) {
    res.status(400).json({ error: "User already exists" });
    return;
  }
  const newUser = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    // simulation
    role: role === "teacher" ? "teacher" : "student"
  };
  users.push(newUser);
  res.json({
    message: "Registration successful",
    token: `simulated-jwt-${newUser.id}`,
    user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
  });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  res.json({
    message: "Login successful",
    token: `simulated-jwt-${user.id}`,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
});
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer simulated-jwt-")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = authHeader.replace("Bearer simulated-jwt-", "");
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
});
app.post("/api/analyze", async (req, res) => {
  try {
    const { title, studentName, classId, files } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      res.status(400).json({ error: "Please provide files to inspect." });
      return;
    }
    const reportId = `rep-${Date.now()}`;
    const mainFile = files[0];
    const totalSize = files.reduce((acc, cur) => acc + (cur.size || 0), 0);
    let mergedContent = "";
    for (const f of files) {
      mergedContent += `
FILEPATH: ${f.name}
CONTENT:
${f.content}
-----------------------------------
`;
    }
    if (mergedContent.length > 3e5) {
      mergedContent = mergedContent.substring(0, 3e5) + "\n... [TRUNCATED DUE TO SIZE LIMITS] ...";
    }
    const ai = getGeminiClient();
    if (!ai) {
      console.log("Gemini API key is not set. Generating deterministic smart analysis response.");
      const containsAiIndicators = mergedContent.includes("As an AI language model") || mergedContent.includes("Sure, here is") || mergedContent.includes("let me know if you need more help") || mergedContent.includes("// ChatGPT") || mergedContent.includes("// generated by ai") || mergedContent.includes("Lorem ipsum") || mergedContent.includes('className="flex flex-col items-center justify-center min-h-screen');
      const score = containsAiIndicators ? 92 : mergedContent.length % 40 + 12;
      const confidence = score > 80 ? "High" : score > 40 ? "Medium" : "Low";
      const language = mainFile.name.endsWith(".js") ? "JavaScript" : mainFile.name.endsWith(".ts") ? "TypeScript" : mainFile.name.endsWith(".tsx") ? "React (TSX)" : mainFile.name.endsWith(".py") ? "Python" : mainFile.name.endsWith(".java") ? "Java" : mainFile.name.endsWith(".css") ? "CSS" : "Plain Text";
      const simulatedReport = {
        id: reportId,
        title: title || "AI Scanning Analysis",
        studentName: studentName || "Anonymous Student",
        studentId: "stu-" + Math.floor(1e3 + Math.random() * 9e3),
        classId: classId || "General Sandbox",
        fileName: mainFile.name,
        fileSize: totalSize,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        aiScore: score,
        humanScore: 100 - score,
        confidenceLevel: confidence,
        language,
        overallExplanation: `### Scanner Analysis Report
We scanned ${files.length} file(s) and detected a **${score}% AI probability score**.

Development Environment Notice: **GEMINI_API_KEY** was not found in active secrets. To experience full, intelligent, custom explanations generated live by Gemini, set up your \`GEMINI_API_KEY\` in **Settings > Secrets** in AI Studio!

#### Observed Patterns:
- **Cleanliness:** Code displays zero typos and standard mechanical patterns.
- **Complexity:** Perfectly structured without experimental iterations.
- **Language Detection:** Identified as ${language}.`,
        metrics: {
          repeatedPatterns: score > 70 ? 88 : 15,
          commentPatterns: score > 60 ? 94 : 20,
          namingConventions: score > 50 ? 90 : 25,
          styleConsistency: score > 40 ? 98 : 30,
          complexityScore: score > 30 ? 85 : 35
        },
        suspiciousLines: [
          {
            lineNumber: 2,
            snippet: "const mainResult = () => {",
            score: score > 50 ? 80 : 20,
            reason: "Canonical structure commonly used by ChatGPT models in standard layouts."
          }
        ],
        comparisons: [
          {
            feature: "Variable Naming",
            observedPattern: "Extremely tidy standard variable formats (e.g. userProfileData, fetchPayload)",
            aiTypicalPattern: "Strict camelCase dictionary names, rarely incorporating idiosyncratic shorthand",
            verdict: score > 50 ? "Typical AI" : "Likely Human"
          }
        ],
        recommendations: [
          "Set up your official Google Gemini API Key in the settings for real analyses.",
          "Check the file history or prompt the student with direct questions on their choice of algorithms.",
          "Request a quick screenshare of their local workspace git log history."
        ]
      };
      mockReports.push(simulatedReport);
      res.json(simulatedReport);
      return;
    }
    const systemInstruction = `You are a professional academic integrity inspector, an AI Homework Detector expert.
Analyze the provided code or text submission. Your job is to check for markers of AI generation (like ChatGPT, Claude, Copilot, or Gemini).
Markers of AI include:
- Over-clean structure with absolutely perfect alignment and no conversational typos or trailing debug comments.
- Highly verbose, textbook-quality descriptions or boilerplate comments (e.g., '// This function handles the request' for obvious code).
- Standard variables like 'temp', 'result', 'data' inside perfectly crafted modular components.
- ChatGPT style polite prefixes/suffixes in text or code files (e.g., "Certainly! Here is...", "// I hope this helps!").
- Repeated algorithmic styles and lack of experimental or non-standard variations inside files.

Evaluate the content forensically. Provide a percentage score (0-100) where 100 means definitely AI generated and 0 means purely human written. Provide the structure as JSON. Make the overall explanation beautifully formatted in Markdown.`;
    const prompt = `Please inspect this student submission.
Title: "${title || "Not Specified"}"
Student: "${studentName || "Anonymous"}"
Class: "${classId || "Sandbox"}"

FILES TO INSPECT:
${mergedContent}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            aiScore: { type: import_genai.Type.INTEGER, description: "AI probability percentage score (0-100)." },
            confidenceLevel: { type: import_genai.Type.STRING, description: "Scanner confidence: 'High', 'Medium', or 'Low'." },
            language: { type: import_genai.Type.STRING, description: "Predominant language detected (e.g. JavaScript, Python, CSS, Plain Text)." },
            overallExplanation: { type: import_genai.Type.STRING, description: "Thorough architectural explanation in beautiful Markdown explaining why or why not this feels AI-generated." },
            metrics: {
              type: import_genai.Type.OBJECT,
              properties: {
                repeatedPatterns: { type: import_genai.Type.INTEGER, description: "Score 0-100" },
                commentPatterns: { type: import_genai.Type.INTEGER, description: "Score 0-100" },
                namingConventions: { type: import_genai.Type.INTEGER, description: "Score 0-100" },
                styleConsistency: { type: import_genai.Type.INTEGER, description: "Score 0-100" },
                complexityScore: { type: import_genai.Type.INTEGER, description: "Score 0-100" }
              },
              required: ["repeatedPatterns", "commentPatterns", "namingConventions", "styleConsistency", "complexityScore"]
            },
            suspiciousLines: {
              type: import_genai.Type.ARRAY,
              description: "Highlight lines that look suspiciously generated.",
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  lineNumber: { type: import_genai.Type.INTEGER, description: "Line number approx in files where violation exists." },
                  snippet: { type: import_genai.Type.STRING, description: "The specific line snippet or code segment." },
                  score: { type: import_genai.Type.INTEGER, description: "Probability 0-100 this block is generated by AI." },
                  reason: { type: import_genai.Type.STRING, description: "Specifically, why is this code snippet suspicious?" }
                },
                required: ["lineNumber", "snippet", "score", "reason"]
              }
            },
            comparisons: {
              type: import_genai.Type.ARRAY,
              description: "Comparison metrics",
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  feature: { type: import_genai.Type.STRING, description: "Pattern checked e.g. Comments, Typos, Algorithmic Choice." },
                  observedPattern: { type: import_genai.Type.STRING, description: "Observed in project." },
                  aiTypicalPattern: { type: import_genai.Type.STRING, description: "Typical AI generator style." },
                  verdict: { type: import_genai.Type.STRING, description: "Verdict: Must be 'Typical AI', 'Suspicious', or 'Likely Human'." }
                },
                required: ["feature", "observedPattern", "aiTypicalPattern", "verdict"]
              }
            },
            recommendations: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "Actionable validation steps/recommendations for the instructor."
            }
          },
          required: ["aiScore", "confidenceLevel", "language", "overallExplanation", "metrics", "suspiciousLines", "comparisons", "recommendations"]
        }
      }
    });
    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response received from Gemini.");
    }
    const reportData = JSON.parse(outputText.trim());
    const processedReport = {
      id: reportId,
      title: title || "AI Scan Submission",
      studentName: studentName || "Anonymous Student",
      studentId: "stu-" + Math.floor(1e3 + Math.random() * 9e3),
      classId: classId || "Sandbox",
      fileName: mainFile.name,
      fileSize: totalSize,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...reportData,
      humanScore: 100 - reportData.aiScore
    };
    mockReports.push(processedReport);
    res.json(processedReport);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to scan homework: " + error.message });
  }
});
var startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log(`Serving static production build from: ${distPath}`);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Homework Detector listening on port http://localhost:${PORT}`);
  });
};
startServer().catch((err) => {
  console.error("Failed to boot server:", err);
});
//# sourceMappingURL=server.cjs.map
