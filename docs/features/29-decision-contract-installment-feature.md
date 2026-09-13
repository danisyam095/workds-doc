# DECISION, CONTRACT & INSTALLMENT FEATURE

Decision:
- `PENDING | ACC | DITOLAK`
- `NORMAL | BANDING`
- Decision tidak mengubah status Proyeksi.
- Decision `BANDING` menunjuk Decision `DITOLAK` sebelumnya, wajib memiliki alasan banding, dan boleh memiliki maksimal satu foto bukti `BUKTI_BANDING`.

Setelah Survey, hasil akhir yang sudah diketahui dapat dicatat dalam satu alur input. Jika ACC, catat nominal akhir, tenor akhir, dan tanggal jatuh tempo.

Tenor menggunakan bilangan bulat dalam satuan bulan dengan rentang 1–60 bulan.

Jika status Decision `PENDING` atau `DITOLAK`, nominal approved, tenor approved, dan tanggal jatuh tempo final tidak boleh diisi.

ACC tidak otomatis membuat Contract.

Contract:
- dibuat melalui aksi terpisah;
- saat dibuat memilih basis `NORMAL` atau `BANDING`;
- basis harus sama dengan Decision ACC yang dirujuk; BANDING wajib berasal dari Decision banding baru berstatus ACC, bukan langsung dari DITOLAK;
- menggunakan nomor Contract resmi dari kantor;
- nomor Contract diinput manual, di-trim, 1–50 karakter, case-sensitive, dan unique global;
- immutable;
- status `BELUM_LUNAS | LUNAS`.

Saat Contract dibuat, seluruh installment sesuai final tenor dibuat secara atomic.

Payment update mencatat `payment_date`, payment note, dan proof; status serta `days_late` derived.

BQ hanya installment 1–3.

## Contract completion

Contract `LUNAS` hanya jika seluruh installment LUNAS.
