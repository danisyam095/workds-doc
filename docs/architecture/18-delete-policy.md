# DELETE, DEACTIVATE & FOREIGN-KEY POLICY

Policy ini melengkapi schema canonical. Default untuk record yang sudah direferensikan adalah mempertahankan row dan menolak hard-delete.

## Policy matrix

| Entity | Hard-delete | Alternative | FK behavior |
|---|---|---|---|
| Customer | Dilarang bila memiliki Prospect/Survey/Contract history | Anonymization PII melalui prosedur privacy | Parent row dipertahankan; child history tidak cascade-delete. |
| Customer phone | Dilarang bila primary/history dibutuhkan | Ganti primary secara eksplisit atau tandai non-primary sesuai aturan | `customer_id` wajib valid; tidak boleh orphan. |
| Mitra | Tidak ada endpoint delete; dilarang bila sudah direferensikan Prospect | `active=false` | Prospect mempertahankan `mitra_id`; tidak cascade-delete. |
| Prospect/Proyeksi | Dilarang hard-delete setelah dibuat | Status `BATAL` dengan alasan | Customer dan child history dipertahankan; tidak cascade-delete lifecycle history. |
| Survey DRAFT | Dapat dihapus hanya bila policy lifecycle final mengizinkan dan belum direferensikan Decision/file aktif | Utamakan mempertahankan DRAFT atau tandai FAILED sesuai lifecycle | Tidak boleh menghapus Prospect. |
| Survey SUBMITTED | Dilarang | Immutable; anonymization PII bila prosedur privacy berlaku | Tidak cascade-delete Prospect atau Decision. |
| Decision | Dilarang setelah tercatat | Append-only history | Tidak cascade-delete Survey/Prospect. |
| Contract | Dilarang | Immutable | Tidak cascade-delete Decision atau Installment. |
| Installment | Dilarang setelah Contract dibuat | Koreksi melalui policy payment yang sah; tidak menghapus history | Tidak cascade-delete Contract. |
| Maintenance/Monitoring/Follow Up | Dilarang setelah tercatat | Pertahankan sebagai history | Tidak cascade-delete parent business record. |
| File metadata | Dilarang bila dibutuhkan untuk audit/history | Tandai `FAILED` atau status penghapusan sesuai policy; binary R2 dapat dihapus terverifikasi | Entity reference harus tetap dapat ditelusuri. |
| Audit log | Dilarang | Tidak ada | Tidak cascade-delete. |

## General rules

- Foreign key wajib mencegah orphan business record.
- `ON DELETE CASCADE` tidak digunakan pada parent business entity yang memiliki history.
- Cascade hanya boleh dipertimbangkan untuk child draft/orphan yang belum direferensikan, harus didokumentasikan per relasi, dan tidak boleh menghapus audit/history.
- Service menolak delete sebelum database constraint menjadi last line.
- Semua deactivate, anonymization, status deletion, dan penolakan delete dicatat di audit log.
