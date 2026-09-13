# Backup and Restore

## Backup

- Database Production memakai backup dan point-in-time recovery sesuai
  kemampuan provider.
- Retention, owner, dan jadwal backup harus ditetapkan sebelum go-live.
- R2 binary dan metadata database memiliki kebijakan retention yang terdokumentasi.
- Backup tidak boleh dianggap valid sebelum restore test berhasil.

## Restore test

Restore test dilakukan berkala pada environment terisolasi dan memverifikasi:

- database dapat dibuka;
- migration/schema sesuai;
- relasi dan constraint penting tetap tersedia;
- metadata file tidak kehilangan referensi;
- aplikasi dapat membaca data hasil restore tanpa mengarah ke Production.

Hasil restore test mencatat waktu restore, data loss window, owner, kegagalan,
dan tindakan perbaikan.
