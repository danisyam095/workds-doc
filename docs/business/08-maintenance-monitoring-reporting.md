# MAINTENANCE, MONITORING, DAN REPORTING

## Maintenance

Maintenance adalah history aktivitas menjaga hubungan atau menangani kebutuhan
nasabah setelah Contract berjalan.

Maintenance tidak menghapus atau menimpa history. Data minimal:
`maintenance_date`, `result/condition`, `notes`, tanggal berikutnya bila
diperlukan, dan foto opsional.

Maintenance berjalan sesuai kebutuhan selama hubungan atau Contract masih
relevan.

## Monitoring

Monitoring adalah history pengamatan kondisi nasabah/Contract dan kebutuhan
tindakan.

Field inti: `monitoring_date`, `condition`, `notes`, `visit_required`,
`next_monitoring_date`, dan file opsional.

Monitoring berjalan sesuai kebutuhan sampai kewajiban selesai.

## Dashboard dan laporan

Dashboard menampilkan action yang perlu dikerjakan.

Report selalu derived dari data transaksi; tidak ada tabel report untuk agregat
manual.

Laporan mencakup produktivitas Proyeksi/Survey/Decision/Contract, sumber
Proyeksi, produktivitas Mitra, conversion, payment quality, Follow Up,
Maintenance, dan Monitoring.

Filter dapat mencakup periode, source, Mitra, status Proyeksi, hasil Decision,
dan geografi domicile sesuai kebutuhan laporan.
