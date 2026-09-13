# Existing Project Prompt

Use this prompt together with [`34-PROMPT.md`](34-PROMPT.md).

1. Inspect the existing structure, runtime, schema, routes, services, UI, and
   tests before editing.
2. Compare current behavior with the Source of Truth and invariant matrix.
3. Identify obsolete concepts and valid historical data separately.
4. Make a migration plan before changing schema or business behavior.
5. Preserve valid history; do not delete or rewrite data blindly.
6. Prefer small, reversible changes and add or update focused tests.
7. Verify API, schema, Service, UI, and documentation remain consistent.

Do not preserve obsolete Agent-to-Prospect or Prospect
`ACC/PENDING/DITOLAK` status models merely because they already exist.
