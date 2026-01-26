# Task Management API

A simple task management API built with Node.js. This system has been "running in production" and users are reporting issues.

## Exercise

Your production monitoring has flagged some errors. The logs are in the `logs/` folder.

**Your workflow:**
1. Read the log files - identify what's going wrong
2. Create a GitHub issue describing the bug: `gh issue create --title "..." --body "..."`
3. Fix the bug (with AI assistance)
4. Write a test that would have caught this bug
5. Create a PR: `gh pr create`

There are 3 bugs at different difficulty levels. Pick one based on your confidence:
- `error-2024-01-20.log` - Start here if unsure
- `frontend-2024-01-21.log` - Medium difficulty
- `monitoring-2024-01-22.log` - Harder, requires understanding async patterns

**Note:** All tests currently pass. That's why these bugs made it to production!

## Setup

```bash
npm test        # Run tests (53 passing)
npm run dev     # Start server on port 3000
```

No dependencies required - uses Node.js built-in modules only.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user by ID |
| GET | /api/users/:id/tasks | Get user's tasks |
| GET | /api/tasks | List all tasks |
| GET | /api/tasks/:id | Get task by ID |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id/status | Update task status |
| GET | /api/stats | Get statistics |

## Project Structure

```
src/
├── index.js      # HTTP server
├── router.js     # Request routing
├── users.js      # User operations
├── tasks.js      # Task operations
├── stats.js      # Statistics
├── data.js       # Initial data
└── *.test.js     # Tests

logs/             # Application logs
```
