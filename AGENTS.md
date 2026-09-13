# AGENTS.md — Marketing Asisstant

## Project

Aplikasi pribadi untuk membantu seluruh pekerjaan Marketing Field. Bukan multi-user. Mitra bukan user/agent aplikasi.

## Source of Truth

`docs/business/00-SOURCE-OF-TRUTH.md` dan keputusan bisnis yang sudah dikunci adalah acuan utama.

Baca docs yang relevan sebelum coding. Jika ada konflik dokumentasi, jangan memilih sendiri; laporkan dan minta keputusan. Jangan mengarang business rule.

## Prinsip kerja paling penting

Aplikasi adalah alat bantu pencatatan pribadi. Marketing tidak wajib menginput aktivitas secara real-time. Data boleh dimasukkan belakangan sesuai kondisi aktual.

Jangan membuat workflow yang memaksa Marketing membuat history/aktivitas hanya demi memenuhi urutan aplikasi.

## Business Rules

- Customer dan Prospect berbeda.
- Satu Customer dapat memiliki banyak Proyeksi.
- Proyeksi = satu pengajuan calon nasabah.
- Proyeksi status: `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`.
- `SURVEY` = sudah berminat + sudah ada janji/siap Survey; tampil di LKO.
- `SUDAH_SURVEY` = Survey sudah SUBMITTED.
- Survey SUBMITTED otomatis mengubah Proyeksi `SURVEY → SUDAH_SURVEY`.
- Follow Up result bukan status Proyeksi.
- Proyeksi `SUDAH_SURVEY` masih boleh menerima Follow Up dan Decision.
- Hanya Proyeksi `BATAL` yang menolak aktivitas lifecycle baru.
- Decision status: `PENDING | ACC | DITOLAK`.
- Decision tidak mengubah status Proyeksi.
- Tidak ada Survey Revision.
- ACC tidak otomatis membuat Contract.
- Contract memakai nomor resmi kantor yang diinput manual dan unique.
- Contract immutable.
- Contract status: `BELUM_LUNAS | LUNAS`.
- Contract LUNAS hanya jika seluruh installment LUNAS.
- Contract + seluruh installment dibuat atomic.
- BQ Marketing hanya installment 1–3.
- Payment monitoring bukan financial ledger.
- source non-MITRA dengan `mitra_id` diisi harus ditolak.
- Mitra yang sudah digunakan Prospect tidak boleh hard-delete; gunakan `active=false`.
- RO hanya lookup history dan tidak auto-copy.

## Architecture

SvelteKit + shadcn-svelte + Tailwind; Hono; Cloudflare Workers; Neon PostgreSQL; Drizzle; Zod; Better Auth; R2; REST `/api/v1`; OpenAPI. Business logic di Service. Hindari abstraction berlebihan.

## Frontend

Mobile-first. TanStack Query untuk server state, Svelte runes untuk UI state, URL state untuk filter/search/sort/pagination. Semua user-facing UI wajib Bahasa Indonesia; internal code/API tetap English.

## Backend

Route untuk HTTP concerns; Zod untuk shape validation; Service untuk business rules; DB constraints sebagai last line. AppError + global handler, DTO mapping, X-Request-Id, selective idempotency. Retry otomatis hanya GET/query yang aman.

## Database

Drizzle Relations API v2 dengan `defineRelations`. Gunakan constraint/index berdasarkan kebutuhan. Contract + seluruh installment atomic.

## Testing

Bun Test; Vitest; Testing Library; Playwright setelah workflow utama stabil. Prioritaskan invariant dan workflow utama, terutama LKO, Survey SUBMITTED, Decision, Contract, payment, dan BATAL guardrail.

## Git

`main` stabil. Gunakan `feature/...`. Test/lint/typecheck sebelum merge. Jangan commit secret.

## Workflow

READ → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → REPORT.

Jika requirement tidak jelas: STOP → jelaskan ketidakpastian → minta keputusan.

## User-facing language

Semua UI, error, validation, toast, confirmation, notification, empty/loading/success, upload/network/API error menggunakan Bahasa Indonesia.
