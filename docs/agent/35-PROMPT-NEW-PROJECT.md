# New Project Prompt

Use this prompt together with [`34-PROMPT.md`](34-PROMPT.md).

1. Read the project context and Source of Truth.
2. Create the foundation in the documented implementation order.
3. Use the documented stack: SvelteKit, Hono, Cloudflare Workers, Neon,
   Drizzle Relations API v2, Zod, Better Auth, R2, and REST `/api/v1`.
4. Before each feature, read its business process, API contract, schema, and
   relevant invariants.
5. Implement database constraints and Service validation; do not rely only on
   frontend validation.
6. Add tests for the relevant invariants before calling the feature complete.
7. Keep migrations, API documentation, and implementation synchronized.

Do not turn Proyeksi into a forced real-time CRM workflow.
