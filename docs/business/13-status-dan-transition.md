# STATUS DAN TRANSITION

# Status and Transition Reference

Aturan bisnis canonical berada di
[`00-SOURCE-OF-TRUTH.md`](00-SOURCE-OF-TRUTH.md). Dokumen ini hanya
memvisualisasikan lifecycle dan transisi operasional untuk membantu implementasi
dan testing.

## Prospect / Proyeksi

Status canonical:
- `BELUM_SURVEY`
- `SURVEY`
- `SUDAH_SURVEY`
- `BATAL`

Status ini menggambarkan posisi Proyeksi dalam pengelolaan Survey, bukan hasil Decision.

Perubahan dapat dilakukan langsung oleh Marketing sesuai kondisi aktual saat data dicatat. Sistem tidak memaksa urutan real-time.

Makna:
- `BELUM_SURVEY`: belum masuk pekerjaan Survey.
- `SURVEY`: sudah berminat + sudah ada janji/siap Survey; muncul di LKO.
- `SUDAH_SURVEY`: Survey sudah berhasil SUBMITTED.
- `BATAL`: nasabah membatalkan proses.

Transisi operasional yang umum:
```text
BELUM_SURVEY → SURVEY
SURVEY → SUDAH_SURVEY
BELUM_SURVEY → SUDAH_SURVEY
SURVEY → BATAL
BELUM_SURVEY → BATAL
SUDAH_SURVEY → BATAL
```

`SUDAH_SURVEY` boleh tetap menerima Follow Up dan proses Decision. `BATAL` tidak menerima aktivitas lifecycle baru.

## Survey

Lifecycle:
```text
DRAFT → SUBMITTED
```

Survey SUBMITTED immutable.

Tidak ada mekanisme Survey Revision.

Survey SUBMITTED pada Proyeksi berstatus `SURVEY` menyebabkan status Proyeksi
otomatis menjadi `SUDAH_SURVEY`.
