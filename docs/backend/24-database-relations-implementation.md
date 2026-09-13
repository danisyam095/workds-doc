# DATABASE RELATIONS IMPLEMENTATION

Relasi utama:
- Customer → Prospects
- Customer → CustomerPhones
- Mitra → Prospects
- Prospect → FollowUps/Surveys/Decisions
- Survey → Applicant/Guarantor/Motorcycle/Loan
- Decision → Survey
- Decision → Contract 0..1
- Contract → Installments/Maintenances/Monitorings

Gunakan `defineRelations` untuk seluruh relasi dan query relational API secara konsisten.

Decision→Survey wajib divalidasi bahwa Survey SUBMITTED dan berasal dari Prospect yang sama.
