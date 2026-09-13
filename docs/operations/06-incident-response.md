# Incident Response

## Severity

- **SEV-1:** kehilangan atau korupsi data, akses tidak sah, atau layanan utama
  tidak dapat digunakan.
- **SEV-2:** workflow utama terganggu tetapi ada workaround terbatas.
- **SEV-3:** masalah terbatas dengan dampak operasional kecil.

## Procedure

1. Deteksi dan buat incident record.
2. Tetapkan incident owner dan severity.
3. Batasi dampak tanpa menghapus history atau bukti audit.
4. Simpan `X-Request-Id`, waktu UTC, error code, dan scope terdampak.
5. Komunikasikan status dan workaround.
6. Pulihkan layanan melalui rollback atau forward-fix yang direview.
7. Verifikasi workflow dan data integrity.
8. Tulis post-incident review dengan root cause dan tindakan pencegahan.

Jangan menyalin secret atau PII ke incident record.
