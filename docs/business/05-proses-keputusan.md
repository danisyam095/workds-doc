# PROSES DECISION

Decision adalah history keputusan kantor dan tidak dioverwrite.

Status Decision:
- `PENDING`
- `ACC`
- `DITOLAK`

Decision type:
- `NORMAL`
- `BANDING`

Decision `BANDING` wajib menunjuk Decision `DITOLAK` sebelumnya pada Proyeksi yang sama dan mencatat alasan banding. Satu foto bukti `BUKTI_BANDING` boleh dilampirkan, tetapi tidak wajib. Decision `NORMAL` tidak memiliki referensi/alasan banding.

Approved amount dapat lebih rendah dari nominal proposed dan tetap merupakan `ACC`.

Decision tidak mengubah status Proyeksi. Proyeksi tetap mengikuti status Proyeksi:
`BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`.

Jika hasil akhir sudah diketahui ketika Marketing melakukan input malam hari, hasil Decision dapat dicatat langsung tanpa harus mensimulasikan proses kantor secara real-time.

Jika ACC, nominal akhir, tenor akhir, dan tanggal jatuh tempo dicatat sesuai hasil aktual. ACC tidak otomatis membuat Contract.

Tenor yang dicatat menggunakan bilangan bulat dalam satuan bulan dan harus berada dalam rentang 1–60 bulan.

Decision `PENDING` dan `DITOLAK` tidak menyimpan nominal approved, tenor approved, atau tanggal jatuh tempo final. Ketiga field tersebut wajib kosong pada status tersebut.
