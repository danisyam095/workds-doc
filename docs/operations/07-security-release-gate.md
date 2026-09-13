# Security Release Gate

Release tidak boleh masuk Production sebelum semua item yang berlaku lulus:

- authentication dan authorization diuji;
- semua `/api/v1` terlindungi kecuali `GET /health`;
- CORS exact-match dan rate limit terverifikasi;
- input validation dan error envelope konsisten;
- log bebas dari secret/token/PII berlebih;
- upload MIME/size validation dan R2 scope terverifikasi;
- file `DELETED` tidak aktif dan tidak dapat diunduh;
- migration dan rollback plan direview;
- dependency dan secret scan lulus;
- audit log mutation penting tersedia;
- OpenAPI, generated types, route, dan test sinkron.

Temuan severity tinggi atau kritis harus diselesaikan atau mendapat keputusan
risiko tertulis sebelum release.
