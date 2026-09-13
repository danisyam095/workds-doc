# Implementation Workflow

Use this workflow for every implementation task:

```text
READ -> UNDERSTAND -> PLAN -> IMPLEMENT -> TEST -> REVIEW -> REPORT
```

## READ

- Read `AGENTS.md` and `docs/PROJECT-CONTEXT.md`.
- Read the Source of Truth and documents relevant to the task.
- Inspect existing code before proposing a change.

## UNDERSTAND

- Identify the business rule, API contract, schema, and invariants involved.
- Identify files in scope and files that must remain unchanged.
- Stop and ask if the requirement is ambiguous or documents conflict.

## PLAN

- Choose the smallest complete change.
- Consider database, Service, route, UI, tests, and documentation together.
- State migrations or compatibility risks before implementation.

## IMPLEMENT

- Follow repository conventions.
- Validate at the API and Service boundaries.
- Preserve history and use explicit errors; do not silently ignore invalid input.

## TEST

- Run the smallest relevant existing test, typecheck, and lint commands.
- Test both the expected path and important rejection/guardrail paths.
- If no executable test exists, report that limitation clearly.

## REVIEW

- Check business rule and invariant coverage.
- Check stale documentation, links, and unintended scope changes.
- Confirm user-facing text is Indonesian.

## REPORT

Report:

- files changed;
- what changed and why;
- behavior and migration impact;
- validation commands and results;
- remaining risks or decisions needed.
