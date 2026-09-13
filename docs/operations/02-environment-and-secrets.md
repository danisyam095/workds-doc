# Environment and Secrets

## Rules

- Secret tidak disimpan di repository, Markdown, log, atau response API.
- Development, Staging, dan Production memakai resource dan credential terpisah.
- Nilai environment divalidasi saat startup; konfigurasi wajib yang invalid
  menyebabkan fail-fast.
- `BUSINESS_TIMEZONE` wajib `Asia/Jakarta`; timestamp disimpan dalam UTC.
- Credential R2, database, Better Auth, dan provider eksternal memakai secret
  manager/platform secret.
- Perubahan secret harus dapat diaudit dan memiliki prosedur rotasi.

## Minimum configuration categories

- runtime/environment identifier;
- database connection;
- Better Auth secret dan origin;
- R2 account, bucket, dan credential;
- CORS allowed origins;
- rate-limit configuration;
- `BUSINESS_TIMEZONE`;
- observability destination dan level.

Jangan menuliskan nilai asli secret dalam checklist, issue, atau log.
