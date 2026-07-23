# Dunk AI Backend

Node.js/Express API gateway for Dunk AI. The backend owns authentication, projects, chats, files, persistence, and workflow submission.

## Security boundary

Node.js communicates with exactly one AI endpoint: the Supervisor Agent configured by `SUPERVISOR_AGENT_URL` and `SUPERVISOR_AGENT_PATH`. It does not call Requirement, Architecture, Component, PCB, Validation, or Documentation agents directly. The Supervisor is responsible for routing and orchestration. `ai_engine/` is intentionally outside this backend and is not modified by this implementation.

## Run

```powershell
Copy-Item .env.example .env
npm install
npm run check
npm run dev
```

MongoDB must be available at `MONGODB_URI`. API documentation is available at `/docs`; health is `/health`.

## Main API groups

`/api/v1/auth`, `/api/v1/projects`, `/api/v1/chats`, `/api/v1/files`, and `/api/v1/agents/projects/:projectId/run`.
