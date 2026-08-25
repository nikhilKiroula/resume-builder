# 📄 Resume Builder

A full-stack, AI-powered resume builder built with the **MERN stack**. Create, edit, and share professional resumes using beautiful templates — with optional AI assistance to enhance your content.

---

## ✨ Features

- 🔐 **Authentication** — Secure JWT-based auth with access & refresh tokens
- 📝 **Resume Editor** — Full-featured drag-and-drop resume editor
- 🎨 **6 Professional Templates** — Modern, Classic, Minimal, Professional, Creative, ATS-friendly
- 🤖 **AI Integration** — OpenAI-compatible AI to enhance resume content
- 🌐 **Public Sharing** — Share resumes via unique public slugs
- 📋 **Duplicate & Manage** — Duplicate, delete, and organize resumes from a dashboard
- 🌙 **Dark / Light Mode** — Theme toggle with persistent preference
- 📱 **Responsive Design** — Works across desktop and mobile

---

## 🛠️ Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Zustand | Global state management |
| React Hook Form + Zod | Form handling & validation |
| @dnd-kit | Drag-and-drop section reordering |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |

### Backend (`/server`)

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (access + refresh) | Authentication |
| bcryptjs | Password hashing |
| OpenAI SDK | AI content enhancement |
| Helmet + Rate Limiting | Security middleware |
| Morgan | HTTP request logging |

---

## 📁 Project Structure

```
Resume Builder/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── pages/              # Route-level page components
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── EditorPage.jsx
│       │   ├── SettingsPage.jsx
│       │   └── PublicResumePage.jsx
│       ├── templates/          # Resume templates
│       │   ├── ModernTemplate.jsx
│       │   ├── ClassicTemplate.jsx
│       │   ├── MinimalTemplate.jsx
│       │   ├── ProfessionalTemplate.jsx
│       │   ├── CreativeTemplate.jsx
│       │   └── ATSTemplate.jsx
│       ├── features/           # Feature-scoped components
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── editor/
│       │   └── templates/
│       ├── store/              # Zustand state stores
│       ├── services/           # Axios API service layer
│       ├── hooks/              # Custom React hooks
│       ├── layouts/            # Layout wrappers (Main, Dashboard)
│       ├── routes/             # Route guards (Protected, Guest)
│       ├── validations/        # Zod schemas
│       └── utils/              # Helper utilities
│
└── server/                     # Express backend
    └── src/
        ├── controllers/        # Route handler logic
        │   ├── authController.js
        │   ├── resumeController.js
        │   ├── userController.js
        │   └── aiController.js
        ├── models/             # Mongoose data models
        ├── routes/             # Express route definitions
        ├── middleware/         # Auth, validation, error middleware
        ├── services/           # Business logic services
        ├── validators/         # Express-validator schemas
        ├── config/             # DB & app config
        └── utils/              # Utility functions & seed script
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** (Atlas or local instance)
- **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone https://github.com/nikhilKiroula/resume-builder.git
cd "resume-builder"
```

---

### 2. Set Up the Server

```bash
cd server
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `server/.env` with your values:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_ACCESS_SECRET=your_access_token_secret_min_32_chars_change_in_prod
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_chars_change_in_prod
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# AI Configuration (optional — leave AI_API_KEY empty to disable AI features)
AI_PROVIDER=openai
AI_API_KEY=
AI_MODEL=gpt-3.5-turbo
AI_BASE_URL=https://api.openai.com/v1
```

Start the development server:

```bash
npm run dev
```

> The API will be available at `http://localhost:5000`

---

### 3. Set Up the Client

```bash
cd client
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

> The app will be available at `http://localhost:5173`

---

## 🗺️ Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Guest only | User login |
| `/register` | Guest only | User registration |
| `/dashboard` | Protected | Manage all your resumes |
| `/editor/:id` | Protected | Full-screen resume editor |
| `/settings` | Protected | Account settings |
| `/resume/public/:slug` | Public | Shareable resume view |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout and clear cookies |
| `GET` | `/api/resumes` | Fetch all resumes for current user |
| `POST` | `/api/resumes` | Create a new resume |
| `GET` | `/api/resumes/:id` | Get a single resume |
| `PUT` | `/api/resumes/:id` | Update a resume |
| `DELETE` | `/api/resumes/:id` | Delete a resume |
| `POST` | `/api/resumes/:id/duplicate` | Duplicate a resume |
| `PATCH` | `/api/resumes/:id/public` | Toggle public visibility |
| `GET` | `/api/resume/public/:slug` | View a public resume (no auth) |
| `POST` | `/api/ai/enhance` | AI content enhancement |
| `GET` | `/api/user/me` | Get current user profile |
| `PUT` | `/api/user/me` | Update user profile |

---

## 🎨 Resume Templates

| Template | Description |
|---|---|
| **Modern** | Bold two-column layout with color accents |
| **Classic** | Traditional single-column format |
| **Minimal** | Clean design with generous whitespace |
| **Professional** | Structured layout for corporate applications |
| **Creative** | Stylized design for creative roles |
| **ATS** | Optimized for Applicant Tracking Systems |

---

## 🤖 AI Features

AI features use an OpenAI-compatible API. Set `AI_API_KEY` in `server/.env` to enable:

- ✍️ Rewrite bullet points to be more impactful
- 📈 Improve job description language
- 🔑 Suggest relevant keywords

> **Note:** AI features degrade gracefully if `AI_API_KEY` is not set — the rest of the app works normally.

---

## 🧑‍💻 Development Scripts

### Client

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint with oxlint
```

### Server

```bash
npm run dev       # Start with nodemon (hot-reload)
npm run start     # Start in production mode
npm run seed      # Seed the database with sample data
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ❤️ by <strong>Antigravity</strong></p>
</div>
