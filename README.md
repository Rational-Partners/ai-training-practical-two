# Task Management API

A simple task management API built with Node.js. This system has been "running in production" and users are reporting issues.

## The Scenario

You are a developer who has just been paged. Your production monitoring has flagged some errors and users are complaining. The error logs are in the `logs/` folder.

There are 3 bugs at different difficulty levels. **Start with the first one:**

| Log file | Difficulty | Description |
|----------|-----------|-------------|
| `logs/error-2024-01-20.log` | Easiest - start here | A clear error in the application |
| `logs/frontend-2024-01-21.log` | Medium | A bug reported by the frontend team |
| `logs/monitoring-2024-01-22.log` | Harder | A subtle async/timing bug |

## Exercise 1 - Application Error (easiest)

**Log file:** `logs/error-2024-01-20.log`

### Try it manually first

Open the log file and try to work out what went wrong yourself. Have a look through the code in the `src/` folder and see if you can spot the bug.

This is deliberately a bit painful - that's the point!

### Now let Claude do it

Ask Claude something like:

> Read the file logs/error-2024-01-20.log and tell me what went wrong. Then find the bug in the code and fix it.

See how the experience compares to doing it yourself.

---

## Exercise 2 - Frontend Integration Bug (medium)

**Log file:** `logs/frontend-2024-01-21.log`

A bug has been reported by the frontend team who are consuming the API. Open the log file and see if you can work out what they're complaining about, then ask Claude to investigate and fix it.

**Hint:** The frontend code isn't in this repo - the bug is in how the API responds, not in the frontend code.

Claude will say it's fixed - but how do you know? All the existing tests still pass (that's how the bug got to production in the first place). Ask Claude something like:

> Write a test that proves this bug exists, then fix the bug so the test passes. Run the tests to prove it.

---

## Exercise 3 - Async/Monitoring Bug (harder)

**Log file:** `logs/monitoring-2024-01-22.log`

The production monitoring system has detected something odd. This one is more subtle and involves timing/async issues. See what you can find in the log, then ask Claude to dig into it.

Again, don't just take Claude's word for it. Ask it to write a test that would have caught this bug before it reached production, fix the code, and run the tests to prove everything works.

## Tips

- You don't need to understand the code to do this exercise - that's what Claude is for
- Talk to Claude like you would talk to a colleague: plain English is fine
- If Claude's explanation is too technical, ask it to explain more simply
- All the tests currently pass - that's why these bugs made it to production!
