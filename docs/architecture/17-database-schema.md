# DATABASE SCHEMA CANONICAL

Canonical 21 tabel:

Auth:
- users
- sessions
- accounts
- verifications

Business/support:
- customers
- customer_phones
- mitras
- prospects
- follow_ups
- surveys
- survey_applicants
- survey_guarantors
- survey_collaterals
- survey_loans
- decisions
- contracts
- installments
- maintenances
- monitorings
- files
- audit_logs

## Common conventions

- Primary keys use ULID.
- Timestamps use UTC.
- Column names use snake_case.
- `created_at` and `updated_at` apply where relevant.
- Business invariants are validated in Service and reinforced by DB constraints where practical.
- Field type, required/nullable state, canonical enum, and unresolved business decisions are tracked in `17-data-dictionary.md`.
- Delete, deactivate, anonymization, dan foreign-key behavior mengikuti `18-delete-policy.md`.

## customers

Purpose: identity nasabah.

Fields:
- `id`
- `full_name`
- `nik_normalized`
- `address`
- `rt`
- `rw`
- `kel`
- `kec`
- `kota_kab`
- `created_at`
- `updated_at`

Constraints:
- `full_name`, `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab` wajib non-empty.
- `nik_normalized` wajib terisi, dinormalisasi, dan unique global terhadap Customer, Survey Applicant, Survey Guarantor, dan Mitra.
- Alamat wilayah disimpan terstruktur agar dapat difilter tanpa parsing free-text.
- `rt` dan `rw` disimpan sebagai string agar leading zero seperti `005` dan `008` tetap terjaga.
- Nomor telepon utama Customer disimpan melalui `customer_phones`, bukan duplikasi kolom pada `customers`.

Relations:
- 1:N `customer_phones`
- 1:N `prospects`

## customer_phones

Purpose: multiple phone numbers for one Customer.

Fields:
- `id`
- `customer_id`
- `phone`
- `phone_normalized`
- `is_primary`
- timestamps

Constraints:
- FK `customer_id → customers.id`
- exactly one primary per Customer
- primary `phone_normalized` unique globally
- `phone_normalized` wajib terisi dan menjadi canonical value untuk uniqueness/filtering.

## mitras

Purpose: master sumber order.

Fields:
- `id`
- `nik`
- `nik_normalized`
- `name`
- KTP/file references as applicable
- structured address: `address`, `rt`, `rw`, `kel`, `kec`, `kota_kab`
- `phone`
- `bank_name`
- `account_number`
- `account_holder`
- `notes`
- `active`
- timestamps

Constraints:
- `nik_normalized` wajib terisi dan unique global terhadap Customer, Survey Applicant, Survey Guarantor, dan Mitra.
- `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab` wajib non-empty; `rt` dan `rw` bertipe string.
- Mitra yang sudah direferensikan Prospect tidak boleh hard-delete.
- Deactivation menggunakan `active=false`.

## prospects

Purpose: satu Proyeksi/pengajuan calon nasabah.

Fields:
- `id`
- `customer_id`
- `source`: `NEW | RO | MITRA | WALKIN | BROSURING | SOSIAL_MEDIA | PERSONAL`
- `mitra_id` nullable
- `ro_reference_number` nullable
- `status`
- `cancel_reason` nullable
- timestamps

Status:
- `BELUM_SURVEY`
- `SURVEY`
- `SUDAH_SURVEY`
- `BATAL`

Constraints:
- FK `customer_id → customers.id`
- `source` hanya menerima nilai canonical yang ditetapkan.
- `source=MITRA` membutuhkan `mitra_id`
- `source!=MITRA` membutuhkan `mitra_id IS NULL`
- `BATAL` membutuhkan `cancel_reason`

## follow_ups

Purpose: history Follow Up.

Fields:
- `id`
- `prospect_id`
- `follow_up_date`
- `result`: `PIKIR_PIKIR | BELUM_MINAT | MAU | TIDAK_BISA_DIHUBUNGI | LAINNYA`
- `next_action`
- `next_action_date` nullable
- `notes`
- timestamps

`result` bukan status Proyeksi.
Jika `result=LAINNYA`, `notes` wajib terisi.
Jika `next_action` terisi, `next_action_date` wajib terisi.
Jika `next_action` kosong, `next_action_date` wajib NULL.
`next_action_date` tidak boleh lebih awal dari `follow_up_date`; perbandingan kalender memakai `Asia/Jakarta`.

## surveys

Purpose: snapshot Survey untuk satu Proyeksi.

Fields:
- `id`
- `prospect_id`
- `survey_date`
- `status`
- timestamps

Status:
- `DRAFT`
- `SUBMITTED`

Constraints:
- FK `prospect_id → prospects.id`
- maksimal satu Survey `DRAFT` per `prospect_id`
- maksimal satu Survey `SUBMITTED` per `prospect_id`
- SUBMITTED immutable

Aturan maksimal satu DRAFT dan satu SUBMITTED ditegakkan dengan unique partial index berdasarkan `prospect_id` dan `status`.
Tidak ada `revised_from_survey_id` dan `revision_reason` karena tidak ada Survey Revision.

## survey_applicants

Purpose: snapshot data applicant.

Fields:
- `id`
- `survey_id`
- `full_name`
- `nik_normalized`
- `primary_phone_normalized`
- `address`
- `rt`
- `rw`
- `kel`
- `kec`
- `kota_kab`
- required `nik_normalized`; other identity fields optional
- timestamps

Constraints:
- `full_name`, `nik_normalized`, `primary_phone_normalized`, `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab` wajib non-empty.
- Domicile disimpan terstruktur agar dapat difilter tanpa parsing free-text.
- `rt` dan `rw` bertipe string agar leading zero tetap terjaga.
- NIK/KTP adalah identitas wajib; field identitas tambahan tetap nullable.

## survey_guarantors

Purpose: snapshot data guarantor.

Fields:
- `id`
- `survey_id`
- `full_name`
- `nik_normalized`
- `primary_phone_normalized`
- `address`
- `rt`
- `rw`
- `kel`
- `kec`
- `kota_kab`
- required `nik_normalized`; other identity fields optional
- timestamps

Constraints:
- Tepat satu Penjamin wajib ada untuk setiap Survey.
- `full_name`, `nik_normalized`, `primary_phone_normalized`, `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab` wajib non-empty.
- Alamat Penjamin disimpan terstruktur agar dapat difilter tanpa parsing free-text.
- `rt` dan `rw` bertipe string agar leading zero tetap terjaga.
- NIK/KTP adalah identitas wajib; field identitas tambahan tetap nullable.

## survey_collaterals

Purpose: snapshot collateral Survey.

Fields:
- `id`
- `survey_id`
- `collateral_type`
- `brand` nullable when not relevant
- `model` nullable when not relevant
- `manufacture_year` nullable when not relevant
- `registration_number` nullable when not relevant
- `estimated_value`
- timestamps

Constraints:
- `collateral_type` dan `estimated_value` wajib.
- `brand`, `model`, `manufacture_year`, dan `registration_number` wajib atau nullable mengikuti jenis `collateral_type`; field yang tidak relevan tidak dipaksakan.
- `estimated_value` adalah integer IDR non-negative tanpa pecahan.

## survey_loans

Purpose: snapshot usulan pembiayaan.

Fields:
- `id`
- `survey_id`
- `proposed_amount`
- nominal amount disimpan sebagai integer rupiah (IDR), tanpa pecahan
- `proposed_tenor`
- tenor disimpan sebagai bilangan bulat dalam satuan bulan, dengan nilai 1–60
- other loan snapshot fields as required
- timestamps

## decisions

Purpose: history keputusan kantor.

Fields:
- `id`
- `prospect_id`
- `survey_id`
- `decision_date`
- `decision_type`
- `decision_status`
- `based_on_decision_id` nullable
- `banding_reason` nullable
- `banding_photo_file_id` nullable
- `approved_amount` nullable
- nominal amount disimpan sebagai integer rupiah (IDR), tanpa pecahan
- `approved_tenor` nullable
- bila terisi, tenor adalah bilangan bulat 1–60 dalam satuan bulan
- `final_due_date` nullable when known
- timestamps

Constraints:
- `survey_id` wajib menunjuk Survey SUBMITTED milik Prospect yang sama
- Decision history immutable/append-only
- Decision tidak mengubah status Proyeksi
- Saat `decision_status=ACC`, `approved_amount`, `approved_tenor`, dan `final_due_date` wajib terisi dan tervalidasi.
- Saat `decision_status=PENDING` atau `DITOLAK`, ketiga field tersebut wajib NULL.
- `decision_type=NORMAL` wajib memiliki `based_on_decision_id`, `banding_reason`, dan `banding_photo_file_id` NULL.
- `decision_type=BANDING` wajib menunjuk `based_on_decision_id` yang merupakan Decision `DITOLAK` pada Prospect yang sama dan wajib memiliki `banding_reason`; `banding_photo_file_id` nullable dan maksimal satu file foto.

## contracts

Purpose: snapshot final kontrak resmi dari kantor.

Fields:
- `id`
- `decision_id`
- `contract_basis`
- `contract_number`
- `survey_date`
- `final_amount`
- nominal amount disimpan sebagai integer rupiah (IDR), tanpa pecahan
- `final_tenor`
- bilangan bulat 1–60 dalam satuan bulan
- `first_due_date`
- `collateral_type`
- `collateral_snapshot` terstruktur dan immutable
- timestamps

Constraints:
- `decision_id` unique untuk membatasi satu ACC Decision → maksimal satu Contract
- `contract_basis` wajib sama dengan `decision_type` dari Decision ACC yang dirujuk.
- `contract_number` unique
- `contract_number` disimpan setelah trim whitespace, case-sensitive, panjang 1–50 karakter, dan unique global.
- Contract immutable; tidak ada update/delete yang mengubah snapshot
- `collateral_snapshot` menyalin snapshot final Survey dan tidak dapat diubah setelah Contract dibuat.

Derived:
- Contract status `BELUM_LUNAS | LUNAS`

## installments

Purpose: seluruh kewajiban angsuran Contract.

Fields:
- `id`
- `contract_id`
- `installment_number`
- `due_date`
- `amount`
- nominal amount disimpan sebagai integer rupiah (IDR), tanpa pecahan
- `payment_date` nullable
- `payment_note` nullable
- timestamps

Constraints:
- unique `(contract_id, installment_number)`
- jumlah installment = final tenor Contract
- `proposed_tenor`, `approved_tenor`, dan `final_tenor` di luar rentang 1–60 atau bukan bilangan bulat ditolak

Derived:
- status: `BELUM_JATUH_TEMPO | JATUH_TEMPO | TERLAMBAT | LUNAS`
- `days_late`

## maintenances

Purpose: history maintenance.

Fields:
- `id`
- `contract_id`
- `maintenance_date`
- `result/condition`
- `notes`
- `next_date` nullable
- timestamps

## monitorings

Purpose: history monitoring.

Fields:
- `id`
- `contract_id`
- `monitoring_date`
- `condition`
- `notes`
- `visit_required`
- `next_monitoring_date` nullable
- timestamps

## files

Purpose: metadata file; binary di R2.

Fields:
- `id`
- `entity_type`
- `entity_id`
- `file_type`
- object/storage key
- upload lifecycle/status metadata: `PENDING | COMPLETED | FAILED | DELETED`
- failure reason nullable, wajib saat status `FAILED`
- `DELETED` dipakai setelah binary R2 dihapus; metadata tetap dipertahankan, object/storage key dikosongkan atau ditandai tidak aktif, dan file tidak dapat diunduh.
- size/MIME metadata
- timestamps

Canonical `entity_type`:
`MITRA | PROSPECT | FOLLOW_UP | SURVEY | CONTRACT | INSTALLMENT | MAINTENANCE | MONITORING`

Canonical `file_type`:
`KTP | KK | STNK | BPKB | FOTO_RUMAH | FOTO_PENGHASILAN | FOTO_KENDARAAN | FOTO_FOLLOW_UP | FOTO_MAINTENANCE | FOTO_MONITORING | BUKTI_PEMBAYARAN | BUKTI_BANDING | LAINNYA`

## audit_logs

Purpose: audit mutation penting.

Fields:
- `id`
- `actor_type` (`USER | SYSTEM`)
- `actor_id` nullable bila `SYSTEM`
- `session_id` nullable
- `request_id`
- entity reference (`entity_type`, `entity_id`)
- action
- result (`SUCCESS | FAILURE`)
- before/after atau metadata as applicable
- `idempotency_key` nullable
- timestamp UTC

Constraints:
- append-only dan immutable; tidak ada update/delete melalui aplikasi.
- `request_id` wajib untuk mutation yang melewati API.
- Secret tidak boleh disimpan.
- PII hanya disimpan bila minimum dan memang diperlukan untuk audit.
## Auth tables

`users`, `sessions`, `accounts`, `verifications` mengikuti kebutuhan Better Auth.

## Derived rules

- Proyeksi status bukan derived dari Decision.
- Survey SUBMITTED memicu perubahan Proyeksi `SURVEY → SUDAH_SURVEY`.
- Contract status derived dari seluruh installment.
- Installment status dan `days_late` derived dari `due_date` dan `payment_date`.
- File `FAILED` bukan file aktif.
