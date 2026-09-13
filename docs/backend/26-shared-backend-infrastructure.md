# SHARED BACKEND INFRASTRUCTURE

Central config + Zod, AppError, error envelope, X-Request-Id, security headers, CORS, rate limiting targeted, Pino/structured console logging yang aman untuk Workers, OpenAPI/Scalar, R2 presigned upload, image optimization, audit log, transactions, idempotency pada mutation berisiko, Neon PITR/backup, health check.

## CORS

Whitelist origin frontend per environment secara eksplisit (Development/Staging/Production masing-masing satu origin). Tidak ada wildcard `*` di Staging/Production. `credentials: true` hanya untuk origin yang di-whitelist. Origin dibandingkan dengan nilai konfigurasi exact-match; origin dari request tidak boleh dipantulkan kembali tanpa validasi.

## Security headers (baseline, semua environment)

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` minimal: `default-src 'self'` + origin R2/Scalar yang memang dipakai.

## Rate limiting (nilai awal, sesuaikan setelah observasi traffic nyata)

- Endpoint publik/auth (login, request OTP bila ada): 20 request/menit per IP.
- Endpoint mutation umum (POST/PATCH/DELETE): 60 request/menit per user.
- Endpoint GET/list: 300 request/menit per user.
- Response 429 memakai error envelope standar + header `Retry-After`.
- Rate-limit key memakai user/session untuk endpoint authenticated dan alamat IP yang ditentukan dari koneksi request untuk endpoint public/auth. Header forwarding hanya boleh dipakai bila proxy tepercaya dikonfigurasi; header spoofable tidak boleh menjadi identitas tunggal.

## Health check

`GET /health` (tanpa auth) mengembalikan status tiap dependency, bukan sekadar 200 statis:

```json
{
  "status": "ok | degraded",
  "checks": {
    "database": "ok | error",
    "r2": "ok | error"
  },
  "timestamp": "..."
}
```

Database check = query ringan (`SELECT 1`). R2 check = HEAD ke bucket, dijalankan dengan timeout pendek agar tidak memperlambat health check saat R2 lambat.

HTTP semantics:
- `200` bila seluruh dependency wajib berstatus `ok`.
- `503` bila satu atau lebih dependency wajib berstatus `error`; body tetap memakai bentuk health response dan tidak membocorkan credential, query, atau detail internal.
- `degraded` digunakan hanya bila status aplikasi masih ditentukan siap menerima traffic sesuai policy deployment; readiness check wajib memakai hasil dependency yang sama.

## Monitoring & alerting

Structured log (Pino) dikirim ke Cloudflare Logpush/Tail. Tambahkan external uptime check (mis. UptimeRobot/Cloudflare Health Check) yang memanggil `GET /health` setiap beberapa menit dan mengirim notifikasi (email/Telegram) bila `status != ok`. Tanpa ini, downtime tidak diketahui sampai user melapor manual.

Audit log mutation penting wajib append-only, immutable, memiliki actor/session context, request ID, entity/action, result, dan metadata minimum. Secret tidak boleh masuk structured log maupun audit log; PII diminimalkan.

## Request correlation & logging safety

- Server menerima `X-Request-Id` hanya bila formatnya valid; jika tidak, server membuat ID baru yang aman.
- ID yang dipakai untuk response, structured log, audit log, dan dependency context harus sama dalam satu request.
- Structured log wajib disanitasi dari credential, token, cookie, upload content, dan PII yang tidak diperlukan.
- Slow request dan dependency failure boleh mencatat duration, dependency name, error code, dan retry context yang aman; jangan mencatat query secret, credential, atau full payload sensitif.
- Log level/error context tidak boleh mengubah response menjadi success-shaped fallback.

## Retry and timeout safety

- Client/service hanya retry GET/query yang aman atau mutation yang secara eksplisit dilindungi Idempotency-Key.
- Timeout dan max attempts wajib dikonfigurasi; backoff memakai jitter untuk menghindari retry storm.
- Retryable hanya transient network/dependency failure; validation, auth, authorization, business conflict, dan permanent dependency error tidak diulang.
- Setiap retry membawa request correlation yang sama dan tidak membuat audit success baru untuk efek yang sama.

## Upload constraint (R2 presigned)

- Maksimum ukuran file: 10 MB per file.
- MIME type diizinkan: `image/jpeg`, `image/png`, `application/pdf`.
- Validasi ukuran & MIME type dilakukan sebelum presigned URL diterbitkan, dan divalidasi ulang saat file completion (bukan hanya percaya `Content-Type` dari client).
