# Documentation Index

Dokumen ini adalah peta utama dokumentasi. AI atau developer tidak perlu
membaca seluruh folder untuk setiap task.

## Mulai di sini

1. [`../AGENTS.md`](../AGENTS.md) — aturan kerja universal.
2. [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md) — ringkasan project.
3. [`business/00-SOURCE-OF-TRUTH.md`](business/00-SOURCE-OF-TRUTH.md) — aturan
   bisnis tertinggi.
4. Dokumen sesuai area task pada tabel di bawah.

## Peta berdasarkan task

| Task | Baca dokumen |
|---|---|
| Customer/Proyeksi | `business/02-proses-prospek.md`, `business/11-data-dan-relasi.md`, data dictionary, schema, API, invariant |
| Follow Up | `business/03-proses-follow-up.md`, `features/27-prospect-follow-up-feature.md`, API, invariant |
| Survey/upload | `business/04-proses-survey.md`, `features/28-survey-file-upload-feature.md`, schema, API, privacy, infrastructure, invariant |
| Decision/Contract | `business/05-proses-keputusan.md`, `business/06-proses-kontrak.md`, `features/29-decision-contract-installment-feature.md`, schema, API, invariant |
| Angsuran/payment | `business/07-proses-angsuran.md`, Contract feature, schema, API, invariant |
| Maintenance/Monitoring/Laporan | `business/08-maintenance-monitoring-reporting.md` |
| Database | `architecture/17-data-dictionary.md`, `architecture/17-database-schema.md`, `architecture/18-database-migration.md`, invariant |
| Backend | `architecture/15-arsitektur-teknis.md`, `backend/`, API, invariant |
| Frontend | `architecture/16-arsitektur-frontend.md`, feature terkait, business process, API, invariant |
| Full project setup | `planning/32-implementation-order.md`, architecture, backend, API, testing |
| Production operations | `operations/` |

## Dokumen canonical lintas layer

- Business: `business/00-SOURCE-OF-TRUTH.md`
- Data: `architecture/17-data-dictionary.md`
- Schema: `architecture/17-database-schema.md`
- API: `api/20-api-specification.md`
- Invariants: `testing/31-invariant-test-matrix.md`
- Agent workflow: `agent/`
- Production operations: `operations/`

## Arsip

`archive/audit/` berisi riwayat audit dan keputusan. Arsip dipertahankan untuk
traceability, tetapi bukan bacaan wajib untuk setiap task. Gunakan jika perlu
memahami alasan historis suatu keputusan.

## Aturan konflik

Jika dokumen tampak bertentangan, jangan memilih sendiri. Gunakan Source of
Truth, periksa keputusan audit yang relevan, dan minta keputusan sebelum
mengubah business behavior.
