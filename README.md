# Student Internship Portal (ByteXL MERN Project)

A full-stack MERN application built for ByteXL that enables students to browse available internships, inspect detailed opportunity requirements, submit validated applications with their student details, and review persisted application records stored in MongoDB.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, React Router v7, Vite 5, Modern CSS (Responsive, Mobile-first)
- **Backend**: Node.js, Express.js 4, Mongoose 8, CORS, Dotenv
- **Database**: MongoDB (Remote cluster on `db01.dbhost.dev:5050`)
- **Deployment**:
  - Frontend: **Vercel** (`https://internship-portal-khaki.vercel.app`)
  - Backend: **Render** (`https://internship-portal-rr66.onrender.com`)

---

## 📁 Project Directory Structure

```text
my-project/
├── .vscode/
├── src/
│   ├── routes/
│   │   └── index.js             # API route handlers & static internship catalogue
│   └── models/
│       └── Application.js       # Mongoose Application schema & validation
├── client/
│   ├── public/                  # Public frontend assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Accessible header with navigation links
│   │   │   ├── InternshipCard.jsx  # Reusable card component for opportunity listing
│   │   │   └── ApplicationForm.jsx # Validated student application form
│   │   ├── pages/
│   │   │   ├── InternshipList.jsx  # Home page with catalog & hero banner
│   │   │   ├── InternshipDetails.jsx# Detailed specification & application page
│   │   │   └── Applications.jsx    # Application tracker querying MongoDB
│   │   ├── api.js               # Centralized fetch wrapper with URL normalization
│   │   ├── App.jsx              # Main layout & React Router routing
│   │   ├── App.css              # Application styling & responsive rules
│   │   ├── index.css            # Global CSS variables & typography
│   │   └── main.jsx             # React entry point with BrowserRouter wrapper
│   ├── index.html               # Frontend HTML shell
│   ├── vite.config.js           # Vite configuration with 0.0.0.0 host & dev proxy
│   ├── vercel.json              # Vercel SPA rewrite rule for client-side routing
│   ├── package.json             # Frontend dependencies & build scripts
│   └── package-lock.json
├── app.js                       # Express backend server entry point
├── package.json                 # Backend dependencies & orchestration scripts
├── package-lock.json
├── .env                         # Local environment variables (never committed)
├── .env.example                 # Environment template
├── .gitignore                   # Git exclusion rules
├── Dockerfile                   # Multi-stage production container build
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root (copied from `.env.example`):

```bash
MONGO_DB_URI=mongodb://<username>:<password>@db01.dbhost.dev:5050/<database_name>
PORT=5000
FRONTEND_URL=http://localhost:5173,https://internship-portal-khaki.vercel.app
NODE_ENV=development
```

> [!IMPORTANT]
> Never commit `.env` or hardcode credentials into source files. The `.gitignore` file strictly excludes `.env` and all secret files.

For the client application (in `client/.env.production` or Vercel dashboard):
```bash
VITE_API_URL=https://internship-portal-rr66.onrender.com
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

### 2. Start the Application
You can run services separately or concurrently:

```bash
# Run backend server (http://localhost:5000)
npm run dev

# In another terminal, run frontend client (http://localhost:5173)
npm --prefix client run dev

# Or run both concurrently
npm run develop
```

### 3. Build & Lint Frontend
```bash
# Run ESLint verification
npm --prefix client run lint

# Build production bundle
npm --prefix client run build
```

---

## 📡 REST API Documentation

### 1. Service Health & Status
- **`GET /`**
  - **Status**: `200 OK`
  - **Response**: `{ "status": "OK", "message": "Student Internship Portal API is running!" }`
- **`GET /api/health`**
  - **Status**: `200 OK` (when connected to MongoDB) or `503 Service Unavailable`
  - **Response**: `{ "status": "OK", "database": "connected", "timestamp": "..." }`

### 2. Internships Catalogue
- **`GET /api/internships`**
  - **Status**: `200 OK`
  - **Response**: Array of available internships (Frontend, Backend, Data Analyst, Full Stack, UI/UX).
- **`GET /api/internships/:id`**
  - **Status**: `200 OK` or `404 Not Found`
  - **Response**: Single internship details object.

### 3. Student Applications
- **`POST /api/applications`**
  - **Status**: `201 Created` on success, `400 Bad Request` on validation failure, `503 Service Unavailable` if database is down.
  - **Request Body**:
    ```json
    {
      "studentName": "Alex ByteXL Student",
      "email": "alex.bytexl@testcollege.edu",
      "rollNumber": "24BCS999",
      "internshipId": "frontend-developer"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Application submitted successfully!",
      "applicationId": "6adf79a3421401a520807833",
      "application": { ... }
    }
    ```
- **`GET /api/applications`**
  - **Status**: `200 OK`
  - **Response**: List of persisted student applications sorted newest first.

---

## 🌐 Production Deployment Guide

### Render Backend Configuration
- **Repository**: `https://github.com/SANJAY-7-7-7/Internship-portal`
- **Branch**: `main`
- **Root Directory**: `.` (Repository root)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_DB_URI`: Full MongoDB connection string (`mongodb://<user>:<password>@db01.dbhost.dev:5050/<database>`)
  - `FRONTEND_URL`: `https://internship-portal-khaki.vercel.app` (Normalized without trailing slash)
  - `NODE_ENV`: `production`

### Vercel Frontend Configuration
- **Repository**: `https://github.com/SANJAY-7-7-7/Internship-portal`
- **Branch**: `main`
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://internship-portal-rr66.onrender.com` (Normalized origin without `/api` suffix)
- **SPA Routing**: Handled automatically by `client/vercel.json` rewrites.

---

## 📸 Verification & Screenshots Guide

To capture genuine verification proofs for ByteXL:
1. **Application Submission**:
   - Navigate to `https://internship-portal-khaki.vercel.app/`
   - Select any internship (e.g., *Frontend Developer Intern*)
   - Fill in your Full Name, College Email, and Student Roll Number
   - Click **Submit Application →**
   - Capture a screenshot showing the green success banner with the generated **Application Reference ID**.
2. **Database Retrieval**:
   - Navigate to `https://internship-portal-khaki.vercel.app/applications`
   - Capture a screenshot of the table displaying your newly submitted application row retrieved directly from MongoDB.
