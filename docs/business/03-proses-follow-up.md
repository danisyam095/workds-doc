# PROSES FOLLOW UP

Setiap aktivitas Follow Up dapat disimpan sebagai history. Field inti: `follow_up_date`, `result`, `next_action`, `next_action_date`, `notes`, dan file opsional.

Jika Marketing menetapkan `next_action`, tanggal tindak lanjut wajib diisi. Jika tidak ada `next_action`, `next_action_date` harus kosong. Tanggal tindak lanjut tidak boleh lebih awal dari tanggal Follow Up dan menggunakan kalender `Asia/Jakarta`.

Result Follow Up canonical: `PIKIR_PIKIR`, `BELUM_MINAT`, `MAU`, `TIDAK_BISA_DIHUBUNGI`, dan `LAINNYA`. Jika memilih `LAINNYA`, Marketing wajib mengisi notes.

Jika hasil Follow Up menunjukkan nasabah `MAU` dan sudah ada janji/siap Survey, Marketing mengubah status Proyeksi menjadi `SURVEY`.

Follow Up tetap boleh dilakukan saat Proyeksi berstatus `SURVEY` atau `SUDAH_SURVEY`. `SUDAH_SURVEY` bukan berarti pekerjaan Marketing selesai.

Follow Up tidak mengubah hasil Decision dan tidak membuat status baru pada Proyeksi.

Aplikasi tidak mengharuskan semua Follow Up dicatat real-time. History dicatat ketika memang berguna untuk pekerjaan dan reporting.
