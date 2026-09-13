# Marketing Asisstant — Documentation

Repository: `marketing-asisstant`.

- `AGENTS.md` — satu-satunya aturan OpenCode/AI agent canonical
- `docs/PROJECT-CONTEXT.md` — ringkasan project untuk AI ringan dan developer baru
- `docs/` — seluruh dokumentasi aplikasi

## Struktur dokumentasi

```text
docs/
├── 00-INDEX.md       # peta utama dokumentasi
├── PROJECT-CONTEXT.md # ringkasan konteks project
├── business/       # aturan dan proses bisnis
├── architecture/   # arsitektur, schema, data dictionary, migration, policy
├── api/            # API specification
├── backend/        # implementasi backend dan infrastructure
├── features/       # feature specifications
├── testing/        # invariant dan test matrix
├── planning/       # implementation order
├── operations/     # production operations guide
├── agent/          # prompt dan workflow agent
└── archive/audit/  # audit documents historis

docs/agent/         # 34–39 prompt dan workflow agent
AGENTS.md           # canonical agent instructions
```

Nomor 33 tidak digunakan sebagai salinan AGENTS. `AGENTS.md` di root adalah satu-satunya source of truth untuk instruksi agent. Semua dokumentasi project berada di `docs/`.

Dokumentasi business yang terbaru menegaskan bahwa Proyeksi adalah satu pengajuan calon nasabah, bukan status Decision. Aplikasi mendukung input batch/belakangan dan tidak memaksa workflow real-time.
