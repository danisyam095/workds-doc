# PROSES SURVEY

Survey adalah snapshot hasil pekerjaan Survey untuk satu Proyeksi.

Proyeksi berstatus `SURVEY` muncul pada LKO Survey. Saat membuat Survey, Marketing memilih Proyeksi yang sedang/siap disurvey dari daftar tersebut.

Survey memiliki lifecycle:
`DRAFT → SUBMITTED`

`SUBMITTED` immutable.

Saat Survey berhasil `SUBMITTED`, sistem otomatis mengubah status Proyeksi dari `SURVEY` menjadi `SUDAH_SURVEY`.

Satu Proyeksi maksimal memiliki satu Survey `DRAFT` dan satu Survey `SUBMITTED`. Jika data masih dalam proses input, gunakan DRAFT yang sama dan perbaiki sebelum SUBMITTED.
Tidak ada mekanisme Survey Revision atau pembuatan Survey kedua pada Proyeksi yang sudah memiliki Survey.

Survey menyimpan data hasil Survey sesuai kebutuhan, termasuk proposed loan amount dan proposed tenor. Survey date adalah tanggal booking.

Setiap Survey wajib menyimpan snapshot collateral dengan `collateral_type` dan `estimated_value`. Field `brand`, `model`, `manufacture_year`, dan `registration_number` diisi bila relevan dengan jenis collateral; field yang tidak relevan boleh kosong.

Setiap Survey wajib menyimpan Applicant dengan NIK/nomor KTP, nama lengkap,
primary phone, serta domicile terstruktur berupa `address`, `rt`, `rw`, `kel`,
`kec`, dan `kota_kab`. Applicant tidak memiliki relasi ke nasabah lain. Setiap
Survey juga wajib menyimpan tepat satu Penjamin dengan NIK/nomor KTP, nama
lengkap, primary phone, dan domicile terstruktur yang sama.
