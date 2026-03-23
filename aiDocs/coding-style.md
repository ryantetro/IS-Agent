# Coding Style — DesignMind

## General Principles
- Keep code simple, readable, and modular.
- Prefer small focused files over large multi-purpose files.
- Avoid clever abstractions unless they clearly reduce complexity.
- Match existing patterns before introducing new conventions.

## JavaScript Style
- Use modern ES modules where setup supports them.
- Prefer async/await over nested promise chains.
- Prefer explicit names over abbreviations.
- Avoid deeply nested logic.
- Add comments only where intent is non-obvious.

## Express
- Keep route handlers thin.
- Move business logic into dedicated modules.
- Never use synchronous file I/O inside request handlers.
- Return structured JSON responses consistently.

## LangChain Tools
Each tool file should:
- export one well-named tool
- include a clear description for tool routing
- validate inputs
- return deterministic, parseable output where possible
- log execution via shared logger

## Logging
Use shared logger rather than `console.log` in app logic.
Allowed levels:
- error
- warn
- info
- debug

## Error Handling
- Fail with useful structured error messages.
- Send machine-readable details where possible.
- Avoid vague messages.

## Frontend
- Keep components mostly presentational.
- Put request/session orchestration in hooks.
- Render artifacts only when response shape matches schema.
- Keep UI clean and minimal.

## Tests
- Add focused unit tests for tools/utilities.
- Add integration tests for chat routes and orchestration.
- Prefer stable, deterministic tests over brittle snapshots.

## Security
- Never hardcode secrets.
- Use environment variables only.
- Keep `.env`, `.testEnvVars`, logs, and vector DB out of git.
