# Documentation Reading Order

Read only the documents needed for the current task.

## Always read

1. `AGENTS.md`
2. `docs/PROJECT-CONTEXT.md`
3. `docs/business/00-SOURCE-OF-TRUTH.md`

## Then read by task

| Task | Read next |
|---|---|
| Customer or Proyeksi | Relevant business process, data dictionary, schema, API, invariants |
| Survey or upload | Survey process, Survey feature, schema, API, privacy/infrastructure, invariants |
| Decision or Contract | Decision/Contract process, feature, schema, API, invariants |
| Payment or installment | Contract process, schema, API, testing, related feature |
| Database | Data dictionary, database schema, migration, invariants |
| Backend infrastructure | `architecture/15-arsitektur-teknis.md`, backend infrastructure, API, privacy, relevant feature, invariants |
| Frontend | Relevant business process, feature, API, and invariants |
| Existing project migration | Existing-project prompt, current implementation, schema, migration, Source of Truth |

Use `docs/00-INDEX.md` as the task map. Use audit resolution only when a historical decision is relevant. Do not treat
historical audit discussion as a newer business rule than the Source of Truth.
