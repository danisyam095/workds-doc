# DATABASE MIGRATION

Gunakan Drizzle Kit. Dev dapat menggunakan `drizzle-kit push`; staging/prod menggunakan versioned migrations.

Migration harus menegakkan invariant database yang dapat ditegakkan secara langsung, termasuk:
- customer_phones primary uniqueness global;
- source/mitra consistency pada Prospect;
- contracts.decision_id unique;
- contracts.contract_number unique;
- installments `(contract_id, installment_number)` unique;
- foreign key Customer → Prospect;
- foreign key Decision → Survey;
- foreign key Decision → Prospect;
- Contract immutable secara API/service.

Invariant lintas-record yang membutuhkan pembuktian konteks, seperti `decisions.survey_id` harus milik `decisions.prospect_id` dan Survey harus SUBMITTED, divalidasi di Service dalam transaction.

Tidak ada Survey Revision dalam model final.
