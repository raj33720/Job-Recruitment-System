# Job Recruitment System

A full-stack recruitment platform where candidates can apply for roles, complete aptitude/coding assessments, and track progress while HR can review applicants, approve/reject profiles, and schedule interviews.

## Features

### Candidate Features
- Candidate signup/login with JWT session token.
- Role exploration across multiple tracks (Web, Backend, AI, Data, Platform, Security, Mobile, etc.).
- Application form with resume upload (`PDF/DOC/DOCX`).
- General aptitude test submission.
- Coding assessment with Monaco editor.
- Code execution against test cases.
- AI feedback and AI rating for submitted code.
- Final score calculation and result submission.
- Progress tracking (HR approval + interview schedule).
- Forgot password and reset password flow.

### HR Features
- HR signup/login with role-based access.
- Candidate listing with role filter.
- Approve or reject candidate applications.
- Schedule interviews with datetime.
- Interview schedule email notification support.
- Interview round dashboard with candidate test score overview.

## Updated Functionality

- Role-based route protection on frontend (`candidate`, `hr`, `admin`) and JWT validation.
- Quiz API normalization so MCQs remain single-select even if external API returns multiple correct options.
- Coding runner fallback:
  - Primary: Judge0 API execution.
  - Fallback: secure local JavaScript VM execution if Judge0 fails/unavailable.
- AI analysis fallback:
  - Tries multiple Gemini API versions/models automatically.
  - Falls back to local heuristic analysis when API/key is unavailable.
- Final result persistence with upsert by email (`mcqScore`, `codingScore`, `aiRating`, `weightedScore`, `finalScore`, feedback).
- Progress scheduling logic sends email only when interview status/date actually changes.

## Tech Stack

### Frontend (`job/`)
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS + Bootstrap
- Monaco Editor (`@monaco-editor/react`)

### Backend (`server/`)
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- Multer (resume upload)
- Nodemailer (email notifications)
- Axios (third-party API calls)
- Google Gemini API (AI code analysis)
- Judge0 API (code execution)

## Project Structure

```text
Job-Recruitment-System/
|- job/                      # React frontend
|  |- src/
|  |  |- components/         # Auth, layout, HR/candidate UI blocks
|  |  |- pages/              # Dashboard, tests, roles, progress, HR pages
|  |  |- utils/              # JWT token helpers
|  |  |- assets/
|  |  `- style/
|  |- public/
|  `- package.json
|- server/                   # Express backend
|  |- routes/                # Auth, quiz, coding, AI, results, progress, submit
|  |- models/                # User, Candidate, Progress, Result, Question/Answer schemas
|  |- middleware/            # Auth/role middleware
|  |- utils/                 # Mailer utility
|  |- uploads/               # Uploaded resumes
|  |- index.js               # Server entry point
|  |- seedCodingQuestions.js # Optional coding question seed script
|  |- .env.example
|  `- package.json
|- .gitignore
`- README.md
```

## Environment Variables

Create `server/.env` from `server/.env.example` and set real values:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
QUIZ_API_KEY=your_quiz_api_key
RAPID_API_KEY=your_rapidapi_key
GEMINI_API_KEY=your_gemini_api_key
```

## Installation

1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../job
   npm install
   ```
4. Configure environment:
   - Copy `server/.env.example` to `server/.env`.
   - Fill real credentials/API keys.

## Run Locally

### Start backend
```bash
cd server
npm start
```
Backend runs on `http://localhost:3001`

### Start frontend
```bash
cd job
npm run dev
```
Frontend runs on `http://localhost:5173`

## Key API Routes

### Auth
- `POST /signup` - candidate register
- `POST /login` - candidate login
- `POST /reg` - HR register
- `POST /log` - HR login
- `POST /forgot-password`
- `POST /reset-password/:id/:token`

### Candidate Application
- `POST /apply` - save selected role
- `POST /register` - submit profile + resume
- `GET /candidates` - candidate list with progress fields

### Assessments
- `GET /api/quiz/questions` - fetch MCQs
- `GET /api/coding` - fetch coding questions
- `POST /api/code/run` - execute code
- `POST /api/ai/analyze` - AI code review
- `POST /api/submit-quant-answers` - save aptitude test
- `POST /api/submit-answers` - save MCQ/coding answers
- `GET /api/submit-answers/:email` - fetch score summary
- `POST /api/results` - save final aggregated result
- `GET /api/results/:email` - fetch final result

### Progress & Interview
- `POST /progress/by-email` - update HR approval/interview schedule
- `GET /progress/by-email/:email` - fetch candidate progress

## Notes

- If external services fail, the app still handles graceful fallbacks for code run and AI analysis.
- Uploaded resumes are served from `server/uploads` via `/uploads/...`.
- Keep `server/.env` private. Only commit `server/.env.example`.
