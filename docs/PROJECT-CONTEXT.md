# Marketing Asisstant — Project Context

Dokumen ringkas ini adalah titik mulai untuk AI atau developer yang baru masuk
ke project. Baca [AGENTS.md](../AGENTS.md) terlebih dahulu untuk aturan kerja.
Untuk aturan bisnis lengkap, gunakan
[Source of Truth](business/00-SOURCE-OF-TRUTH.md).

## Tujuan aplikasi

Marketing Asisstant adalah aplikasi pribadi untuk membantu Marketing Field
mencatat dan memantau pekerjaan. Aplikasi bukan sistem multi-user bisnis.
Marketing boleh memasukkan data setelah pekerjaan terjadi; sistem tidak boleh
memaksa input real-time atau membuat history palsu demi memenuhi urutan
workflow.

## Istilah utama

- **Customer** adalah nasabah.
- **Proyeksi/Prospect** adalah satu pengajuan calon nasabah dan dapat dimiliki
  satu Customer.
- **Survey** adalah pekerjaan survey untuk satu Proyeksi.
- **Applicant** adalah calon nasabah dalam Survey.
- **Penjamin** adalah tepat satu penjamin yang wajib ada pada setiap Survey.
- **Mitra** adalah sumber order, bukan user aplikasi.
- **Decision** adalah hasil keputusan kantor.
- **Contract** adalah kontrak immutable yang dibuat melalui aksi terpisah.

## Aturan bisnis paling penting

- Status Proyeksi:
  `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`.
- `SURVEY` tampil di LKO. Survey `SUBMITTED` otomatis mengubah Proyeksi
  `SURVEY` menjadi `SUDAH_SURVEY`.
- Satu Proyeksi memiliki maksimal satu Survey `DRAFT` dan satu `SUBMITTED`;
  tidak ada Survey Revision.
- Proyeksi `SUDAH_SURVEY` masih boleh menerima Follow Up dan Decision.
- Hanya Proyeksi `BATAL` yang menolak aktivitas lifecycle baru.
- Status Decision:
  `PENDING | ACC | DITOLAK`. Decision tidak mengubah status Proyeksi.
- Decision `ACC` wajib memiliki nominal, tenor, dan tanggal jatuh tempo final.
  Decision `PENDING` dan `DITOLAK` tidak memiliki ketiganya.
- Decision BANDING wajib menunjuk Decision `DITOLAK` sebelumnya pada Proyeksi
  yang sama, memiliki alasan, dan boleh memiliki maksimal satu foto bukti.
- Contract tidak dibuat otomatis dari Decision `ACC`. Basis Contract harus
  `NORMAL` atau `BANDING` dan cocok dengan Decision `ACC` yang dirujuk.
- Contract memakai nomor resmi kantor yang diinput manual, di-trim, panjang
  1–50 karakter, case-sensitive, dan unique global. Contract immutable.
- Contract dan seluruh installment harus dibuat atomic. Status Contract
  `LUNAS` hanya jika seluruh installment `LUNAS`.
- Nominal adalah integer IDR non-negative. Tenor adalah integer bulan 1–60.
- Customer, Applicant, Penjamin, dan Mitra wajib memiliki NIK/KTP yang
  dinormalisasi dan unique global.
- Setiap Survey wajib memiliki Applicant dan tepat satu Penjamin dengan
  identitas, phone, serta alamat terstruktur `address`, `rt`, `rw`, `kel`,
  `kec`, dan `kota_kab`.
- File aktif memakai lifecycle `PENDING | COMPLETED | FAILED`. Setelah binary
  R2 dihapus, metadata menjadi `DELETED`, tetap diaudit, tidak aktif, dan tidak
  dapat diunduh.

## Arsitektur ringkas

- Frontend: SvelteKit, shadcn-svelte, Tailwind, TanStack Query, Svelte runes.
- Backend: Hono di Cloudflare Workers.
- Data: Neon PostgreSQL dan Drizzle Relations API v2.
- Validasi/auth/storage: Zod, Better Auth, dan R2.
- API: REST `/api/v1` dengan OpenAPI.
- Business logic berada di Service; Route menangani HTTP concerns.

## Dokumen berdasarkan task

| Task | Dokumen utama |
|---|---|
| Aturan bisnis | `docs/business/00-SOURCE-OF-TRUTH.md` dan proses terkait |
| Schema/data | `docs/architecture/17-data-dictionary.md`, `17-database-schema.md` |
| API | `docs/api/20-api-specification.md` |
| Feature | `docs/features/` dan proses bisnis terkait |
| Backend/infrastructure | `docs/backend/` |
| Testing | `docs/testing/31-invariant-test-matrix.md` |
| Keputusan audit | `docs/archive/audit/37-audit-resolution.md` |
| Production operations | `docs/operations/` |

## Aturan saat ada ketidakjelasan

Jangan menebak business rule. Jika dokumen tampak bertentangan, gunakan
[Source of Truth](business/00-SOURCE-OF-TRUTH.md), periksa keputusan audit yang
relevan, lalu berhenti dan minta keputusan sebelum mengubah perilaku.
