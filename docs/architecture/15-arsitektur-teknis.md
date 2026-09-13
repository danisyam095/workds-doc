# ARSITEKTUR TEKNIS

Backend Hono + TypeScript strict + Bun + Cloudflare Workers, PostgreSQL Neon + @neondatabase/serverless, Drizzle ORM Relations API v2 (defineRelations), Zod, Better Auth, REST, OpenAPI code-first + Scalar, R2, Pino/structured logging yang kompatibel Workers, Bun Test.

Feature-based architecture. Business logic hanya di Service. Cross-feature coordination melalui service contract, bukan repository-to-repository. ULID, UTC timestamps, API /api/v1, standardized response/error envelope, pagination page/pageSize, X-Request-Id, selective Idempotency-Key, safe GET retries only.

Seluruh timestamp disimpan sebagai UTC. Timezone bisnis canonical adalah `Asia/Jakarta` dan dipakai Service untuk konversi input/tampilan serta perhitungan kalender seperti due date; runtime timezone tidak boleh menjadi sumber aturan bisnis.

Retry otomatis dibatasi pada GET/query yang aman. Mutation membutuhkan Idempotency-Key dan policy eksplisit sebelum retry. Semua retry memakai timeout, exponential backoff+jitter, dan max attempts dari configuration.

## Backend architecture

Feature modules: customers, mitras, prospects, follow-ups, surveys, decisions,
contracts, installments, maintenances, monitorings, files, reports, dashboard,
search, dan auth.

Controller/route menerima request dan memvalidasi DTO. Service menjalankan
business rules. Repository hanya persistence. Response mapping berada di
boundary. Cross-feature memakai service contract.

Semua route `/api/v1` memakai session guard Better Auth secara default. Hanya
`GET /health` yang boleh anonymous. Service menerima session/actor context dari
server dan tidak mempercayai user identity dari payload.

Service Contract menjalankan pembuatan Contract dan seluruh Installment dalam
satu transaction boundary. Repository tidak boleh membuka transaction terpisah
untuk bagian workflow ini. Commit hanya dilakukan setelah jumlah installment
sama dengan `final_tenor`.

Idempotency mutation, global error handling, CORS, rate limiting, health
mapping, OpenAPI synchronization, audit logging, request correlation, dan
allowlisted pagination mengikuti aturan yang dikunci di API, backend
infrastructure, dan invariant matrix.
