# Task Management API

A simple Node.js API for managing tasks and users.

## Project Structure

```
src/
├── index.js      # HTTP server entry point
├── router.js     # Request routing
├── users.js      # User operations
├── tasks.js      # Task operations
├── stats.js      # Statistics tracking
├── data.js       # Initial data
└── *.test.js     # Tests
```

## Running

```bash
npm run dev       # Start server
npm test          # Run tests
```

## Code Style

- Vanilla Node.js (no external dependencies)
- CommonJS modules
- Built-in test runner (node:test)
