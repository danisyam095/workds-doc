# Cross-domain business reference

Aturan bisnis canonical berada di
[`00-SOURCE-OF-TRUTH.md`](00-SOURCE-OF-TRUTH.md). Dokumen ini hanya menyimpan
enum dan aturan lintas-domain yang praktis untuk dipakai sebagai referensi
implementasi; jangan menambahkan aturan bisnis baru di sini.

## Enum lintas-domain

- Source order Proyeksi:
  `NEW | RO | MITRA | WALKIN | BROSURING | SOSIAL_MEDIA | PERSONAL`.
- Follow Up result:
  `PIKIR_PIKIR | BELUM_MINAT | MAU | TIDAK_BISA_DIHUBUNGI | LAINNYA`.
- `LAINNYA` wajib memiliki `notes`.

## Aturan integrasi lintas-domain

- Source `MITRA` membutuhkan `mitra_id`.
- Source non-`MITRA` wajib memiliki `mitra_id=NULL`; payload yang mengirim
  `mitra_id` harus ditolak.
- RO hanya melakukan lookup nomor contract sebelumnya; hasilnya referensi dan
  tidak menyalin data lama otomatis.
- Payment monitoring bukan payment ledger/reconciliation.
