# MCP Setup Notes

## Purpose
This project includes a tracked example MCP configuration so the AI-development workflow is visible in the repository without committing personal editor settings or secrets.

## Included Example
- Example config file: `.mcp.example.json`
- Example servers:
  - `filesystem` for workspace file access
  - `playwright` for browser automation and UI checks

## How To Use It
1. Copy `.mcp.example.json` into the MCP config location used by your editor or agent host.
2. Adjust workspace paths if your clone lives somewhere other than `/Users/ryantetro/IS-Agent`.
3. Install any required MCP server packages locally if your editor does not auto-install them.

## Reviewer Smoke Check
- Confirm the example file parses as JSON.
- Confirm at least one MCP server entry is present.
- Start your editor/agent host and verify the configured server names appear.
- Use `filesystem` to read a repo file as a basic connectivity check.

## Notes
- The committed file is an example, not a personal machine-specific secret config.
- Real local overrides should stay outside git.
- The project verification script (`npm run verify:process`) checks that the example file exists and declares at least one server.
