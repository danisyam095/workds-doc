# Definition of Done

A task is complete only when all applicable items below are satisfied:

- Business behavior follows the Source of Truth.
- Relevant invariant cases are covered by tests or documented as unavailable.
- API, schema, Service, and UI behavior are consistent.
- Database migrations and constraints are safe and documented.
- Invalid input produces explicit errors; no silent fallback is added.
- User-facing text is Indonesian.
- Existing history is preserved.
- Relevant documentation is updated.
- Existing targeted validation passes: tests, typecheck, and lint when available.
- Internal documentation links remain valid.
- The final report lists files changed, reasons, impact, and validation results.

If an item cannot be completed, report it as a remaining risk instead of
claiming the task is complete.
