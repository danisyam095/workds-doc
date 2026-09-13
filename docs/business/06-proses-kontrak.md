# PROSES CONTRACT

Contract dibuat setelah hasil Decision `ACC` dan data final siap dicatat.

ACC tidak otomatis membuat Contract.

Saat membuat Contract, Marketing memilih basis `NORMAL` atau `BANDING`. Basis Contract wajib sama dengan `decision_type` dari Decision `ACC` yang dirujuk. Basis `BANDING` tidak boleh langsung memakai Decision `DITOLAK`; harus ada Decision banding baru yang sudah `ACC`, menunjuk Decision `DITOLAK` sebelumnya, memiliki alasan banding, dan dapat memiliki maksimal satu foto bukti.

Contract menggunakan nomor kontrak resmi yang dikeluarkan kantor dan diinput manual oleh Marketing. `contract_number` di-trim, wajib 1–50 karakter, case-sensitive, dan harus unik global; sistem tidak menghasilkan nomor otomatis.

Contract adalah snapshot final dan immutable.

Data final Contract mencakup minimal:
- nomor Contract resmi;
- basis Contract (`NORMAL` atau `BANDING`);
- tanggal Survey/Booking;
- nominal final;
- tenor final;
- tanggal jatuh tempo pertama sesuai aturan due-date;
- snapshot collateral final: `collateral_type`, `brand`, `model`, `manufacture_year`, `registration_number`, dan `estimated_value` sesuai field yang relevan.

Tenor final menggunakan bilangan bulat dalam satuan bulan dan harus berada dalam rentang 1–60 bulan.

Satu Decision ACC maksimal menghasilkan satu Contract.

Saat Contract dibuat, seluruh installment sepanjang tenor final dibuat secara atomic.

Pembuatan Contract dan seluruh installment harus berada dalam satu transaksi database. Transaksi hanya boleh dianggap berhasil setelah Contract dan tepat sejumlah `final_tenor` installment committed. Jika validasi, pembuatan Contract, atau pembuatan salah satu installment gagal, seluruh transaksi di-rollback dan tidak boleh ada Contract atau installment parsial.

Status Contract:
- `BELUM_LUNAS`
- `LUNAS`

Contract menjadi `LUNAS` hanya ketika seluruh installment LUNAS.
