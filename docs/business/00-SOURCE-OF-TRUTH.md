# SOURCE OF TRUTH

Dokumen ini adalah satu-satunya acuan bisnis canonical seluruh proyek. Dokumen
teknis dan dokumen proses tidak boleh mengubah arti pekerjaan Marketing Field.
Jika dokumen lain berbeda, gunakan dokumen ini dan keputusan bisnis yang sudah
dikunci.

## Prinsip utama

- Aplikasi adalah asisten kerja pribadi Marketing Field, bukan sistem multi-user bisnis.
- User = identitas login aplikasi; Customer = nasabah; Mitra = sumber order.
- Customer 1:N Prospect/Proyeksi.
- Customer wajib memiliki nama lengkap, tepat satu primary phone unik global, dan alamat terstruktur: `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab`.
- Customer wajib memiliki NIK/nomor KTP sebagai identitas unik global.
- Survey Applicant wajib memiliki NIK/nomor KTP unik global, nama lengkap, primary phone, dan domicile terstruktur: `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab`; Applicant tidak memiliki relasi ke nasabah lain. Setiap Survey wajib memiliki tepat satu Penjamin dengan NIK/nomor KTP unik global, nama lengkap, primary phone, dan domicile terstruktur yang sama.
- Mitra wajib memiliki NIK/nomor KTP unik global dan alamat terstruktur:
  `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab`.
- `rt` dan `rw` adalah string agar nilai seperti `005` dan `008` tetap utuh;
  seluruh komponen administratif dapat difilter secara terpisah.
- Survey wajib memiliki snapshot collateral dengan `collateral_type` dan `estimated_value`; field `brand`, `model`, `manufacture_year`, dan `registration_number` diisi bila relevan. Contract menyalin snapshot collateral final tersebut dan immutable.
- **Prospect/Proyeksi adalah wadah untuk mengelola calon nasabah dan satu pengajuan.**
- Aplikasi tidak mengharuskan Marketing menginput aktivitas secara real-time. Data boleh dicatat belakangan setelah pekerjaan selesai.
- Workflow aplikasi harus membantu pekerjaan, bukan memaksa Marketing membuat aktivitas tambahan hanya agar urutan sistem terlihat lengkap.
- Status Proyeksi menggambarkan posisi pengelolaan Proyeksi di aplikasi, bukan hasil Decision kantor.
- Status Proyeksi canonical: `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`.
- `PIKIR_PIKIR`, `BELUM_MINAT`, dan hasil Follow Up lainnya adalah Follow Up result, bukan status Proyeksi.
- `SURVEY` berarti Proyeksi sudah berminat dan sudah ada janji/siap diproses Survey; Proyeksi berstatus `SURVEY` muncul pada LKO Survey.
- `SUDAH_SURVEY` berarti pekerjaan Survey untuk Proyeksi sudah selesai dan Survey sudah berhasil disubmit.
- Survey `SUBMITTED` mengubah status Proyeksi dari `SURVEY` menjadi `SUDAH_SURVEY` secara otomatis.
- Satu Proyeksi maksimal memiliki satu Survey `DRAFT` dan satu Survey `SUBMITTED`; DRAFT yang sama diperbaiki sampai siap disubmit, tanpa Survey Revision.
- `BATAL` berarti nasabah membatalkan proses. Batal membutuhkan alasan dan tidak menerima aktivitas lifecycle baru.
- Decision adalah hasil keputusan kantor: `PENDING | ACC | DITOLAK`. Decision tidak mengubah status Proyeksi.
- Decision `ACC` wajib memiliki nominal approved, tenor approved, dan tanggal jatuh tempo final; Decision `PENDING` atau `DITOLAK` tidak memiliki ketiga field tersebut.
- Decision `BANDING` wajib menunjuk Decision `DITOLAK` sebelumnya pada Proyeksi yang sama dan memiliki alasan banding; boleh memiliki maksimal satu foto bukti. Contract BANDING hanya boleh dibuat setelah Decision banding baru berstatus `ACC`.
- Decision adalah history dan tidak dioverwrite.
- Setelah Survey, hasil akhir dapat dicatat dalam satu alur input: `ACC/DITOLAK`, nominal akhir bila ACC, tenor akhir bila ACC, dan tanggal jatuh tempo bila ACC.
- ACC tidak otomatis membuat Contract. Contract dibuat melalui aksi terpisah setelah data Contract siap.
- Contract menggunakan nomor kontrak resmi yang dikeluarkan kantor dan diinput manual ke aplikasi; nomor di-trim, panjang 1–50 karakter, case-sensitive, unique global, dan tidak dihasilkan otomatis.
- Saat membuat Contract, Marketing memilih basis `NORMAL` atau `BANDING`; basis harus sama dengan jenis Decision `ACC` yang dirujuk.
- Contract immutable setelah dibuat.
- Contract memiliki seluruh installment sepanjang final tenor.
- Seluruh nominal pembiayaan dan installment menggunakan IDR integer rupiah tanpa pecahan; nilai negatif atau pecahan ditolak.
- Seluruh tenor pembiayaan menggunakan bilangan bulat dalam satuan bulan, dengan rentang 1–60 bulan.
- Status Contract: `BELUM_LUNAS | LUNAS`.
- Contract menjadi `LUNAS` hanya ketika seluruh installment LUNAS.
- BQ Marketing hanya installment 1–3; BQ bukan status Contract.
- Payment pada aplikasi adalah monitoring Marketing, bukan financial ledger/reconciliation.
- Follow Up, Survey, Decision, Contract, Installment, Maintenance, Monitoring menjaga history sesuai kebutuhan dan tidak boleh kehilangan jejak.
- Jika Follow Up memiliki `next_action`, maka `next_action_date` wajib diisi; jika `next_action` kosong, `next_action_date` wajib kosong. `next_action_date` tidak boleh lebih awal dari `follow_up_date`.
- Primary phone Customer unik global.
- Mitra yang sudah digunakan oleh Prospect tidak boleh hard-delete; gunakan `active=false`.
- Jika source bukan `MITRA`, `mitra_id` harus NULL; bila payload mengirim `mitra_id`, request ditolak.
- RO memakai nomor contract sebelumnya untuk lookup history. Hasil lookup hanya referensi dan tidak meng-copy data lama otomatis.

## Hierarki

1. Source of Truth dan keputusan bisnis yang sudah dikunci
2. Business rules/invariants
3. Database model
4. API contract
5. Backend implementation
6. Frontend implementation
7. Tests/prompts
