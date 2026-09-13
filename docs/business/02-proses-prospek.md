# PROSES PROSPECT / PROYEKSI

Prospect/Proyeksi adalah satu pengajuan calon nasabah. Satu Customer boleh mempunyai banyak Proyeksi.

## Status Proyeksi

- `BELUM_SURVEY` — belum masuk pekerjaan Survey.
- `SURVEY` — nasabah sudah berminat dan sudah ada janji/siap disurvey; masuk LKO Survey.
- `SUDAH_SURVEY` — Survey sudah selesai dan berhasil disubmit.
- `BATAL` — nasabah membatalkan proses.

Status Proyeksi bukan hasil keputusan kantor. `PENDING`, `ACC`, dan `DITOLAK` hanya milik Decision.

Marketing boleh langsung memilih status aktual saat memasukkan data belakangan. Sistem tidak memaksa urutan perubahan status.

`BATAL` dilakukan melalui operasi eksplisit dengan alasan. Setelah BATAL, Proyeksi tidak menerima aktivitas lifecycle baru. Jika nasabah kembali mengajukan, buat Proyeksi baru.
