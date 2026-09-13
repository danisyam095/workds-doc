# DATA DAN RELASI

Customer 1:N Prospect/Proyeksi.

Prospect 1:N Follow Up, Survey, Decision. Satu Proyeksi adalah satu pengajuan, tetapi dapat memiliki history Decision lebih dari satu bila hasil sebelumnya PENDING dan kemudian ada keputusan berikutnya.

Proyeksi memiliki status `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`.

Decision memiliki `prospect_id` dan `survey_id`. `survey_id` menunjuk Survey `SUBMITTED` yang menjadi basis Decision dan berasal dari Prospect yang sama.

Decision ACC 0..1 Contract. Contract 1:N Installment, Maintenance, Monitoring.

Mitra 1:N Prospect bila source=MITRA. Follow Up/Survey/Decision/Contract tidak menduplikasi `mitra_id`.

Customer memiliki banyak phone melalui customer_phones; satu primary per Customer dan primary phone unik global.

Identitas minimum Customer adalah `full_name`, `address`, `rt`, `rw`, `kel`,
`kec`, dan `kota_kab`. Semua komponen alamat wajib disimpan terpisah agar dapat
digunakan untuk filter; `address` berisi alamat jalan/detail seperti `Jl.
Kosasih`, sedangkan wilayah dan RT/RW disimpan pada field masing-masing.
