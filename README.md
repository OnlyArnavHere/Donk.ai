# Dunk AI

Dunk AI is an AI-powered hardware copilot that turns a natural-language hardware idea into a structured engineering design package.

The platform combines a web workspace, a Node.js API backend, and a Python AI engine. Users describe what they want to build, collaborate through project chat, and receive engineering outputs such as requirements, architecture, component recommendations, circuit and PCB guidance, validation results, and documentation.

## Architecture

![Dunk AI system architecture](docs/dunk-ai-architecture.png)

The supplied architecture diagram is preserved in [`docs/dunk-ai-architecture.png`](docs/dunk-ai-architecture.png).

### Request flow

1. A user submits a hardware idea through the web frontend.
2. The frontend calls the Dunk AI Node.js/Express backend.
3. The backend authenticates the user and manages projects, chats, files, and persistence.
4. The backend sends AI workflow requests to the Supervisor Agent.
5. The Supervisor plans the workflow and routes work to the downstream Python agents.
6. Agent outputs are validated, persisted, and assembled into an Engineering Design Package.

## Important service boundary

The Node.js backend has access to the Supervisor Agent only. It must not call the Requirement, Architecture, Component Intelligence, Circuit & PCB, Validation, or Documentation agents directly. Those agents are internal to the Python AI engine and are coordinated by the Supervisor.

The `ai_engine/` directory is an independent Python/LangGraph/LangChain system. The Node.js backend communicates with it through the configured Supervisor HTTP endpoint. This separation keeps API concerns and AI orchestration concerns independent.

## Repository structure

```text
.
├── ai_engine/             # Python AI agents and AI orchestration
├── backend/               # Dunk AI Node.js/Express API
│   ├── src/config/        # Environment and database configuration
│   ├── src/controllers/   # HTTP request handlers
│   ├── src/middleware/    # Auth, validation, uploads, and errors
│   ├── src/models/        # Mongoose data models
│   ├── src/repositories/  # Persistence abstraction
│   ├── src/routes/        # Versioned API routes
│   ├── src/services/      # Business logic and Supervisor client
│   └── src/server.js      # Application entry point
└── docs/                  # Project documentation and diagrams
```

## Backend capabilities

- JWT authentication, refresh sessions, roles, and user identity
- Project creation, editing, sharing, archiving, duplication, and ownership
- Project chat sessions and persisted conversation history
- Multipart file uploads for project assets and datasheets
- Supervisor-only workflow execution and chat orchestration
- MongoDB persistence with Mongoose models for users, projects, chats, messages, files, sessions, and artifacts
- Standard API responses, request validation, rate limiting, security headers, CORS, logging, and global error handling
- Swagger UI at `/docs` and a health endpoint at `/health`

## Getting started

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run check
npm run dev
```

Configure these services before using the API:

- MongoDB through `MONGODB_URI`
- The Supervisor Agent through `SUPERVISOR_AGENT_URL` and `SUPERVISOR_AGENT_PATH`
- JWT secrets through `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`

The backend listens on the port configured by `PORT` (the current local environment uses `3000`). Never commit `.env`; secrets and runtime uploads are excluded by the repository `.gitignore`.

## Main API groups

| Group | Purpose |
| --- | --- |
| `/api/v1/auth` | Registration, login, refresh, logout, and current user |
| `/api/v1/projects` | Project lifecycle and collaboration |
| `/api/v1/chats` | Chat sessions and messages |
| `/api/v1/files` | Project file uploads and listings |
| `/api/v1/agents/projects/:projectId/run` | Submit a workflow to the Supervisor Agent |

## Engineering principles

- Keep controllers thin and place business logic in services.
- Keep database access behind repositories/models.
- Keep AI communication behind the Supervisor client.
- Validate all client input and use environment variables for secrets.
- Build modules incrementally and verify them with `npm run check`.

## Project status

The backend foundation and core API modules are implemented. The Python AI engine remains separate and unchanged. Future work can add background jobs, Redis, real-time collaboration, cloud file storage, provider abstraction, engineering-package exports, and expanded automated tests without breaking the service boundary.
