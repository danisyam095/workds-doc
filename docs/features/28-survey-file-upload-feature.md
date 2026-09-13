# SURVEY & FILE UPLOAD FEATURE

Survey dibuat dengan memilih Proyeksi yang berstatus `SURVEY` dari LKO Survey.

Survey lifecycle:
`DRAFT → SUBMITTED`

Saat SUBMITTED berhasil, status Proyeksi otomatis berubah menjadi `SUDAH_SURVEY`.

Satu Proyeksi maksimal memiliki satu Survey DRAFT dan satu Survey SUBMITTED. DRAFT yang sama dapat diperbarui sampai submit; tidak ada Survey Revision atau Survey kedua.

Applicant wajib menyimpan NIK/nomor KTP, nama lengkap, primary phone, dan
domicile terstruktur: `address`, `rt`, `rw`, `kel`, `kec`, `kota_kab`. Applicant
tidak memiliki relasi ke nasabah lain. Setiap Survey wajib memiliki tepat satu
Penjamin dengan NIK/nomor KTP, nama lengkap, primary phone, dan domicile
terstruktur yang sama.

Survey wajib menyimpan snapshot collateral dengan `collateral_type` dan `estimated_value`; field `brand`, `model`, `manufacture_year`, dan `registration_number` mengikuti relevansi jenis collateral. Snapshot tersebut disalin ke Contract saat Contract dibuat dan immutable.

File metadata memakai enum canonical:
- `entity_type`: `MITRA | PROSPECT | FOLLOW_UP | SURVEY | CONTRACT | INSTALLMENT | MAINTENANCE | MONITORING`
- `file_type`: `KTP | KK | STNK | BPKB | FOTO_RUMAH | FOTO_PENGHASILAN | FOTO_KENDARAAN | FOTO_FOLLOW_UP | FOTO_MAINTENANCE | FOTO_MONITORING | BUKTI_PEMBAYARAN | BUKTI_BANDING | LAINNYA`

Batas upload: maksimum 10 MB per file, MIME `image/jpeg | image/png | application/pdf`. Validasi dilakukan saat presigned URL diterbitkan dan saat completion.

Upload lifecycle metadata:
`PENDING → COMPLETED`, `PENDING → FAILED`, atau `COMPLETED → DELETED`.

Server tidak boleh mempercayai ukuran atau `Content-Type` dari client. Ukuran dan MIME harus divalidasi sebelum presigned URL diterbitkan dan diverifikasi ulang saat completion. File yang gagal completion tidak boleh diperlakukan sebagai file aktif.
File `DELETED` mempertahankan metadata audit, tidak aktif, dan tidak dapat diunduh.

Error upload, network, dan API yang tampil ke user wajib menggunakan Bahasa Indonesia dan menjelaskan tindakan yang dapat dicoba.
