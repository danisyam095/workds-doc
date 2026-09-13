# DATABASE SCHEMA IMPLEMENTATION

Implement schema canonical 21 tabel dari `docs/architecture/17-database-schema.md`.

Relasi memakai Drizzle Relations API v2 dengan `defineRelations`.

Wajib ditegakkan:
- Customer/Prospect split;
- customer_phones primary uniqueness;
- source/mitra consistency;
- Proyeksi status `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`;
- Decision `PENDING | ACC | DITOLAK` tidak mengubah status Proyeksi;
- Decision→Survey same-Prospect + SUBMITTED validation;
- decision-contract uniqueness;
- contract_number uniqueness;
- installment uniqueness;
- Contract immutable;
- Contract status derived dari installment;
- tidak ada Survey Revision;
- Mitra used-by-Prospect tidak hard-delete.
- Foreign key/delete behavior mengikuti delete policy; tidak ada cascade yang menghapus business history.
