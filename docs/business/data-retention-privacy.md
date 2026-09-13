# DATA RETENTION & PRIVACY

Aplikasi ini single-user (satu Marketing Field). Data Customer/Prospect/Survey/Contract disimpan tanpa batas waktu untuk kebutuhan histori bisnis dan audit, kecuali Customer meminta penghapusan.

Guardrail existing melarang hard-delete pada data yang sudah direferensikan
(mis. Mitra, lihat `00-SOURCE-OF-TRUTH.md`). Prinsip yang sama berlaku untuk
data Customer: permintaan penghapusan diselesaikan dengan **anonymization**
(mengosongkan/mengganti field PII seperti nama, KTP, alamat dengan placeholder)
pada Customer dan Survey Applicant terkait, bukan menghapus baris/record, agar
integritas histori Prospect/Contract/Installment tetap utuh.

File KTP/KK/STNK/BPKB di R2 yang terkait permintaan penghapusan dihapus dari bucket setelah scope file diverifikasi dan operasi dicatat di audit log, karena berkas ini tidak dibutuhkan untuk integritas relational. Metadata file dan audit log tetap dipertahankan sesuai kebutuhan histori dan pembuktian tindakan.

Jika aplikasi ini nanti dipakai lebih dari satu user, kebijakan ini wajib ditinjau ulang sebelum multi-user diaktifkan (access control per user terhadap data Customer belum didesain di versi single-user).

## Prosedur permintaan penghapusan

1. Permintaan hanya dapat diproses melalui user/session yang terautentikasi.
2. Sistem mencatat actor, waktu, Customer, alasan, scope PII, dan scope file yang akan diproses sebelum mutasi.
3. Sistem memverifikasi bahwa target Customer dan file terkait benar-benar berada dalam scope permintaan.
4. PII Customer dan Survey Applicant dianonimkan secara konsisten; row Customer, Prospect, Survey, Contract, Installment, dan audit log tidak dihapus.
5. File binary yang disetujui dihapus dari R2; metadata file dipertahankan dan statusnya diubah menjadi `DELETED`. Metadata tidak lagi dianggap file aktif dan tidak dapat digunakan untuk download, tetapi tetap tersedia untuk history relational dan audit.
6. Sistem mencatat hasil sukses/gagal setiap langkah pada audit log dan tidak menyatakan permintaan selesai bila sebagian operasi gagal.

Audit log, Contract, dan Installment adalah record histori yang tidak boleh dihapus melalui prosedur ini. Jika anonymization tidak dapat dilakukan dengan aman, proses harus berhenti dan error harus ditampilkan kepada user.
