# BACKEND PROJECT STRUCTURE & CODING CONVENTION

# BACKEND PROJECT STRUCTURE & CODING CONVENTION

Gunakan feature-based folders dengan route/controller, schemas, service,
repository, mapper, types/test sesuai kebutuhan. TypeScript strict.
snake_case di DB, camelCase di TypeScript DTO bila konvensi proyek
mengharuskan; mapping eksplisit. Business rule tidak diletakkan di repository.

## Bootstrap

Setup Hono, Bun, Drizzle, Neon serverless driver, Zod config, Better Auth,
CORS, security headers, global error handler/AppError, request id, OpenAPI/
Scalar, logging, health check, test setup, dan environment fail-fast.

OpenAPI menjadi kontrak machine-readable untuk route, auth requirement,
request/response, error catalog, pagination, Idempotency-Key, dan health
status. CI harus memvalidasi spec dan memastikan generated client types tetap
sinkron dengan API.
