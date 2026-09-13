# Master Coding Prompt

Build Marketing Asisstant from the repository documentation.

## Required context

Read [`AGENTS.md`](../../AGENTS.md) and [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md)
first. Then read only the canonical documents relevant to the task.

## Rules

- Treat [`00-SOURCE-OF-TRUTH.md`](../business/00-SOURCE-OF-TRUTH.md) as the
  highest business authority.
- Do not invent, simplify, or replace business rules with generic CRM behavior.
- Keep business logic in the Service layer; keep routes focused on HTTP concerns.
- Preserve history and avoid destructive changes unless explicitly required.
- Follow the API specification, data dictionary, schema, and invariant matrix
  together.
- Use Indonesian for all user-facing text, errors, validation, and notifications.
- If requirements or documents conflict, stop and ask for a decision.
- Report changed files, reasons, impact, and validation results.
