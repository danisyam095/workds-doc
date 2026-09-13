# Deployment

## Environment

Gunakan environment terpisah:

```text
Development -> resource Development
Staging     -> resource Staging
Production  -> resource Production
```

Production tidak boleh memakai credential atau database dari environment lain.

## Release flow

1. Perubahan dibuat pada branch feature.
2. Test, typecheck, lint, dan migration check dijalankan.
3. Pull request direview.
4. Deploy ke Staging.
5. Smoke test workflow utama.
6. Approve release Production.
7. Deploy dengan artifact/commit yang sama dengan Staging.
8. Jalankan post-deploy verification.

## Post-deploy verification

- `GET /health` menunjukkan dependency yang wajib sehat.
- Login dan session guard berfungsi.
- Endpoint utama `/api/v1` menolak request anonymous.
- LKO, Survey SUBMITTED, Decision, Contract, installment, dan upload dapat
  diverifikasi di Staging sebelum Production.
- Tidak ada error rate atau latency abnormal setelah deploy.

Rollback harus mengikuti [`03-migration-and-rollback.md`](03-migration-and-rollback.md).
