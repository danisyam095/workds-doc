# PROSPECT & FOLLOW UP FEATURE

Prospect/Proyeksi adalah satu pengajuan calon nasabah.

Status:
- `BELUM_SURVEY`
- `SURVEY`
- `SUDAH_SURVEY`
- `BATAL`

Saat Follow Up menghasilkan `MAU` dan nasabah sudah mengatur janji/siap Survey, Marketing mengubah Proyeksi menjadi `SURVEY`. Proyeksi `SURVEY` muncul di LKO Survey.

Jika Follow Up memiliki `next_action`, `next_action_date` wajib diisi dan tidak boleh lebih awal dari `follow_up_date`. Jika `next_action` kosong, `next_action_date` harus kosong.

Follow Up tetap dapat dilakukan setelah status `SURVEY` maupun `SUDAH_SURVEY`.

Input boleh dilakukan belakangan. Form tidak boleh memaksa Marketing membuat seluruh history sebelumnya.

RO memasukkan nomor contract sebelumnya untuk lookup history. Hasil lookup hanya referensi.
