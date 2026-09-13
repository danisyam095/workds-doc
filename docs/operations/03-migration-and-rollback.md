# Migration and Rollback

## Migration rules

- Production migration memakai versioned migration, bukan perubahan manual
  tanpa catatan.
- Setiap migration memiliki review, backup/restore consideration, dan rencana
  rollback atau forward-fix.
- Perubahan destructive harus dipisah dari deploy aplikasi bila diperlukan.
- Migration diuji pada database Staging dengan data representatif yang aman.
- Constraint business yang ditetapkan schema harus diverifikasi setelah migration.

## Rollback

1. Hentikan promotion release berikutnya.
2. Identifikasi apakah masalah berada pada artifact aplikasi, migration, atau
   dependency.
3. Rollback artifact jika schema tetap backward-compatible.
4. Jika schema sudah berubah, gunakan migration forward-fix yang direview;
   jangan menghapus data production secara manual.
5. Verifikasi health, error rate, dan workflow utama.
6. Catat timeline, keputusan, dan dampak pada incident record.

Contract dan installment tidak boleh dipulihkan dengan cara yang menghilangkan
history atau melanggar atomicity.
