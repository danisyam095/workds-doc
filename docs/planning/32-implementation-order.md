# IMPLEMENTATION ORDER

1. Customer + customer_phones + Mitra
2. Prospect + source/RO lookup/cancel + Proyeksi status
3. Follow Up + Next Action + transition to `SURVEY`
4. Survey + LKO + files + automatic `SURVEY → SUDAH_SURVEY`
5. Decision + final-result input
6. Contract + official contract number
7. Installments + payment monitoring + Contract `BELUM_LUNAS/LUNAS`
8. Maintenance + Monitoring
9. Dashboard + Reports + Search
10. Auth/security/infrastructure hardening
11. E2E Playwright rollout

Tidak ada Survey Revision feature pada final model.

Setiap tahap harus mengikuti `docs/business/00-SOURCE-OF-TRUTH.md` dan
`docs/testing/31-invariant-test-matrix.md`.

## Definition of Done — step 10

Step 10 tidak dianggap selesai hanya karena kode ditulis. Sebelum traffic Production pertama:

- [ ] CORS whitelist per environment sudah aktif.
- [ ] Security headers baseline sudah terpasang.
- [ ] Rate limiting aktif dan diuji.
- [ ] `GET /health` mengembalikan status database + R2.
- [ ] External uptime check terpasang dan diuji.
- [ ] Restore Neon PITR sudah dicoba minimal sekali ke branch terpisah.
- [ ] Rollback di Staging sudah pernah dicoba.
- [ ] Upload constraint ukuran/MIME sudah aktif pada presigned URL dan completion.
