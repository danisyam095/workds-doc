# Go-live Checklist

## Documentation and ownership

- [ ] Owner aplikasi, database, R2, dan incident response ditetapkan.
- [ ] Source of Truth, API, schema, invariant, privacy, dan operations docs
      sudah direview.
- [ ] Contact dan escalation path tersedia.

## Technical readiness

- [ ] Source code, migration, build, typecheck, lint, dan test lulus.
- [ ] Staging smoke test lulus untuk LKO, Survey, Decision, Contract,
      installment, upload, dan privacy flow.
- [ ] Production environment tervalidasi tanpa menampilkan secret.
- [ ] Backup dan restore test lulus.
- [ ] Observability dan alert aktif.
- [ ] Rollback/forward-fix plan disetujui.
- [ ] Security release gate lulus.

## Launch

- [ ] Release artifact/commit dicatat.
- [ ] Migration selesai dan diverifikasi.
- [ ] Post-deploy health dan smoke test lulus.
- [ ] Error rate dan latency dipantau setelah release.
- [ ] Keputusan go-live dan waktu release dicatat.
