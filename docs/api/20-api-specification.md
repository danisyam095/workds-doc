# API SPECIFICATION

Base: `/api/v1`.

Success: `{success:true,data:{...}}`.
Error: `{success:false,error:{code,message}}`.
Pagination canonical: `page=1&pageSize=25`; allowed pageSize `10|25|50`, dengan max `50`.

List/query rules:

- `page` harus integer >= 1; `pageSize` harus salah satu nilai allowlist dan tidak boleh melebihi max.
- Ordering default harus deterministik dan selalu memiliki tie-breaker unique, misalnya `created_at DESC, id DESC`.
- Sort field, direction, dan filter hanya boleh berasal dari allowlist endpoint; field/order mentah dari client tidak boleh dirangkai langsung menjadi SQL.
- Endpoint list menggunakan offset pagination canonical ini sampai cursor pagination diputuskan secara eksplisit.
- Response pagination minimal memuat `page`, `pageSize`, `total`, dan `totalPages`; query count/total boleh dioptimalkan hanya bila kontrak response tetap jelas.
- Input pagination/filter/sort invalid mendapat `400 VALIDATION_ERROR`.

## OpenAPI contract

Dokumen ini adalah source contract API yang harus diwujudkan sebagai OpenAPI code-first dan divalidasi pada CI. Setiap endpoint wajib mendefinisikan method/path, auth requirement, request/query shape, success response, error responses, pagination bila berlaku, dan idempotency requirement bila mutation berisiko.

Perubahan route atau response wajib memperbarui OpenAPI dan invariant/API test pada perubahan yang sama. Generated client types harus berasal dari OpenAPI; client tidak boleh mengandalkan endpoint atau field yang tidak terdaftar.

## Error catalog

Error response tetap memakai `{success:false,error:{code,message}}`. `code` adalah identifier stabil untuk client/logging; `message` wajib Bahasa Indonesia dan tidak boleh memuat secret atau detail internal.

| HTTP | Code minimum | Penggunaan |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | Shape, format, atau field request tidak valid. |
| 401 | `UNAUTHENTICATED` | Session tidak ada, invalid, atau expired. |
| 403 | `FORBIDDEN` | Session valid tetapi tidak berhak melakukan operasi. |
| 404 | `NOT_FOUND` | Resource tidak ditemukan atau tidak berada dalam scope actor. |
| 409 | `CONFLICT` | Business conflict, duplicate, atau idempotency payload berbeda. |
| 413 | `FILE_TOO_LARGE` | File melebihi 10 MB. |
| 415 | `UNSUPPORTED_FILE_TYPE` | MIME file tidak didukung. |
| 422 | `BUSINESS_RULE_VIOLATION` | Shape valid tetapi melanggar invariant/business rule. |
| 429 | `RATE_LIMITED` | Rate limit terlampaui; response menyertakan `Retry-After`. |
| 500 | `INTERNAL_ERROR` | Error internal yang tidak aman untuk diekspos detailnya. |
| 503 | `DEPENDENCY_UNAVAILABLE` | Dependency database/R2/provider yang diperlukan tidak tersedia. |

Error tambahan boleh ditambahkan bila memiliki definisi, status HTTP, dan test yang jelas. Client tidak boleh bergantung pada teks `message` untuk branching.

Infrastructure contract:

- CORS hanya menerima origin exact-match dari environment configuration; wildcard tidak digunakan pada Staging/Production.
- `credentials: true` hanya aktif untuk origin yang berhasil di-whitelist.
- Rate limit memakai user/session untuk endpoint authenticated dan IP koneksi untuk endpoint public/auth; header forwarding hanya dipakai dengan proxy tepercaya.
- `GET /health` anonymous mengembalikan `200` bila dependency wajib sehat dan `503` bila dependency wajib gagal. Body health tidak mengandung credential atau detail internal.
- Server membuat `X-Request-Id` baru bila header tidak ada atau formatnya tidak valid, lalu mengembalikan ID tersebut pada response.
- `X-Request-Id` yang valid dikorelasikan ke structured log, audit log, dan dependency timing/error context.
- Request ID tidak boleh menjadi tempat menyimpan secret atau data sensitif.

## Retry policy

- Retry otomatis hanya berlaku untuk GET/query yang aman dan error dependency/network yang diklasifikasikan retryable.
- Mutation tidak boleh retry otomatis tanpa `Idempotency-Key` dan policy endpoint yang eksplisit.
- Retry memakai timeout, exponential backoff dengan jitter, dan batas percobaan dari configuration; tidak boleh loop tanpa batas.
- Error validation, authentication, authorization, not-found, conflict payload, business rule, unsupported file, dan permanent dependency failure tidak retryable.
- Contract, Decision, payment, upload completion, dan audit mutation tidak boleh menghasilkan efek ganda karena retry.

Tanggal dan waktu pada API:

- Timestamp disimpan dan dikembalikan dalam format UTC yang konsisten.
- Input tanggal operasional dikonversi menggunakan timezone bisnis `Asia/Jakarta`.
- Timezone bisnis wajib tersedia melalui server configuration sebelum workflow tanggal digunakan; server tidak boleh mengambilnya dari timezone client.

## Authentication

- Semua endpoint `/api/v1` wajib memiliki session Better Auth yang valid, kecuali `GET /health`.
- Request tanpa session yang valid ditolak dengan HTTP `401` dan error envelope standar.
- Route guard memeriksa session sebelum handler feature berjalan; Service tetap tidak boleh mempercayai identitas dari payload.
- Endpoint data bisnis, dashboard, reports, search, dan file upload/download tidak memiliki akses anonymous.
- `GET /health` adalah satu-satunya endpoint unauthenticated dan hanya mengembalikan status dependency, tanpa data bisnis.

## Core endpoints

GET/POST `/customers`; GET/PATCH `/customers/:id`
GET/POST `/customers/:id/phones`; PATCH `/customers/:id/phones/:phoneId`; POST `/customers/:id/phones/:phoneId/set-primary`

Customer rules:

- Customer wajib memiliki `full_name`, `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab`.
- Alamat dikirim sebagai field terstruktur dan dapat digunakan sebagai filter list/search; `address` berisi alamat jalan/detail, sedangkan `rt`, `rw`, `kel`, `kec`, dan `kota_kab` dikirim sebagai field terpisah.
- `rt` dan `rw` bertipe string agar nilai seperti `005` dan `008` tidak kehilangan leading zero. Filter administratif tersedia secara terpisah untuk `rt`, `rw`, `kel`, `kec`, dan `kota_kab`.
- Customer wajib memiliki tepat satu primary phone melalui resource `customer_phones`.
- `phone_normalized` menjadi nilai uniqueness; primary phone yang sudah dipakai Customer lain ditolak dengan `409 CONFLICT`.
- `nik` wajib dikirim, dinormalisasi menjadi `nik_normalized`, dan harus unik global lintas Customer, Applicant, Penjamin, dan Mitra.
- Field identitas tambahan seperti email dan tanggal lahir tetap nullable sampai keputusan bisnis khusus ditetapkan.

Survey Applicant rules:

- Setiap Survey wajib memiliki Applicant dengan `full_name`, `primary_phone`, `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab`; Applicant tidak memiliki field relasi ke Customer lain.
- Domicile dikirim sebagai field terstruktur dan dapat digunakan sebagai filter laporan/search; `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab` tidak boleh digabung menjadi satu field.
- `nik`/nomor KTP Applicant wajib dikirim dan harus unik global; field identitas tambahan tetap nullable.
- Field wajib yang kosong atau tidak valid ditolak dengan `400 VALIDATION_ERROR`.

Survey Guarantor rules:

- Setiap Survey wajib memiliki tepat satu Penjamin.
- Penjamin wajib memiliki `full_name`, `primary_phone`, `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab`.
- `nik`/nomor KTP Penjamin wajib dikirim dan harus unik global; field identitas tambahan tetap nullable.
- Field wajib yang kosong atau jumlah Penjamin bukan tepat satu ditolak dengan `400 VALIDATION_ERROR`.

Mitra rules:

- Mitra wajib memiliki `nik`, `address`, `rt`, `rw`, `kel`, `kec`, dan
  `kota_kab`.
- `address`, `rt`, `rw`, `kel`, `kec`, dan `kota_kab` dikirim sebagai field
  terpisah dan dapat digunakan sebagai filter Mitra.
- NIK/nomor KTP dinormalisasi menjadi `nik_normalized` dan uniqueness berlaku global lintas Customer, Applicant, Penjamin, dan Mitra.
- NIK yang sudah dipakai entity lain ditolak dengan `409 CONFLICT`.

GET/POST `/mitras`; GET/PATCH `/mitras/:id`
- `PATCH` dapat mengubah `active=false`.
- Tidak ada `DELETE /mitras/:id`.

GET/POST `/prospects`; GET/PATCH `/prospects/:id`; GET `/prospects/ro-lookup?contractNumber=...`; POST `/prospects/:id/cancel`

GET `/prospects/:id/follow-ups`; POST `/prospects/:id/follow-ups`; GET `/follow-ups`

GET/POST `/surveys`; GET `/surveys/:id`; PUT `/surveys/:id/draft`; POST `/surveys/:id/submit`

GET `/decisions`; POST `/prospects/:id/decisions`

GET/POST `/contracts`; GET `/contracts/:id`

GET `/installments`; GET `/contracts/:id/installments`; GET `/installments/:id`; PATCH `/installments/:id/payment`

GET/POST `/maintenances`; GET `/contracts/:id/maintenances`; POST `/contracts/:id/maintenances`
GET/POST `/monitorings`; GET `/contracts/:id/monitorings`; POST `/contracts/:id/monitorings`

POST `/files/upload-url`; GET `/files/:id`; GET `/files/:id/url`; POST `/files/:id/complete`

GET `/search`; GET `/dashboard/actions`; GET `/dashboard/summary`; GET `/dashboard/statistics`
GET `/reports/prospects`, `/follow-ups`, `/surveys`, `/contracts`, `/maintenances`, `/monitorings`, `/:type/export`

## Proyeksi rules

- Status canonical: `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL`.
- Source order canonical: `NEW | RO | MITRA | WALKIN | BROSURING | SOSIAL_MEDIA | PERSONAL`.
- `source=MITRA` wajib memiliki `mitra_id`; source selain `MITRA` wajib `mitra_id=NULL`.
- Source order di luar enum canonical ditolak dengan `400 VALIDATION_ERROR`.
- Status boleh diubah manual sesuai kondisi aktual saat input.
- `SURVEY` menjadi sumber daftar LKO Survey.
- Survey SUBMITTED memicu `SURVEY → SUDAH_SURVEY`.
- Proyeksi BATAL menolak aktivitas lifecycle baru.
- `SUDAH_SURVEY` tetap boleh menerima Follow Up dan Decision.

Follow Up result canonical: `PIKIR_PIKIR | BELUM_MINAT | MAU | TIDAK_BISA_DIHUBUNGI | LAINNYA`. Result di luar enum ditolak dengan `400 VALIDATION_ERROR`; `LAINNYA` wajib memiliki `notes`.

Follow Up next-action rules:

- Jika `next_action` diisi, `next_action_date` wajib diisi.
- Jika `next_action` kosong, `next_action_date` wajib kosong.
- `next_action_date` tidak boleh lebih awal dari `follow_up_date`.
- Perbandingan tanggal operasional menggunakan kalender `Asia/Jakarta`; timestamp tetap disimpan dalam UTC.
- Pelanggaran aturan ini ditolak dengan `400 VALIDATION_ERROR`.

Nominal `proposed_amount`, `approved_amount`, `final_amount`, dan installment `amount` menggunakan IDR integer rupiah tanpa pecahan. Nilai negatif atau pecahan ditolak dengan `400 VALIDATION_ERROR`; sistem tidak melakukan pembulatan diam-diam.

Tenor `proposed_tenor`, `approved_tenor`, dan `final_tenor` menggunakan bilangan bulat dalam satuan bulan dengan rentang 1–60. Nilai di luar rentang atau bukan bilangan bulat ditolak dengan `400 VALIDATION_ERROR`.

Collateral Survey wajib memuat `collateral_type` dan `estimated_value`, serta field `brand`, `model`, `manufacture_year`, dan `registration_number` bila relevan dengan jenis collateral. Contract menyalin snapshot collateral final tersebut dan tidak menyediakan mutation untuk mengubahnya setelah dibuat. Nilai `estimated_value` menggunakan integer IDR non-negative.

## Survey rules

- Satu Proyeksi maksimal memiliki satu Survey `DRAFT` dan satu Survey `SUBMITTED`.
- Membuat Survey baru saat Proyeksi tersebut sudah memiliki DRAFT atau SUBMITTED ditolak dengan `409`.
- DRAFT yang sama dapat diperbarui melalui `PUT /surveys/:id/draft`.
- Survey `SUBMITTED` immutable dan tidak memiliki endpoint revision.

## Decision rules

- Decision status: `PENDING | ACC | DITOLAK`.
- Decision tidak mengubah status Proyeksi.
- Decision wajib menunjuk Survey SUBMITTED pada Prospect yang sama.
- `ACC` wajib memiliki `approved_amount`, `approved_tenor`, dan `final_due_date`; amount harus integer IDR non-negative dan tenor integer 1–60 bulan.
- `PENDING` dan `DITOLAK` tidak boleh mengirim `approved_amount`, `approved_tenor`, atau `final_due_date`; field tersebut harus NULL.
- `decision_type=NORMAL` tidak memiliki `based_on_decision_id` atau `banding_reason`.
- `decision_type=BANDING` wajib memiliki `based_on_decision_id` yang menunjuk Decision `DITOLAK` pada Prospect yang sama dan `banding_reason`; boleh memiliki maksimal satu `BUKTI_BANDING` photo.
- Pelanggaran aturan conditional Decision ditolak dengan `400 VALIDATION_ERROR`.
- ACC tidak otomatis membuat Contract.

## Contract rules

- Contract dibuat terpisah setelah Decision `ACC`.
- Saat `POST /contracts`, request wajib memilih `contract_basis=NORMAL|BANDING`; nilainya harus sama dengan `decision_type` Decision ACC yang dirujuk.
- `contract_basis=BANDING` hanya valid bila Decision ACC tersebut adalah Decision banding yang merujuk Decision `DITOLAK`, memiliki `banding_reason`, dan maksimal satu foto bukti.
- Contract basis `BANDING` tidak boleh dibuat langsung dari Decision `DITOLAK`; harus melalui Decision banding baru yang berstatus `ACC`.
- `contract_number` berasal dari kantor dan diinput manual; server melakukan trim whitespace sebelum validasi dan persistence.
- `contract_number` wajib 1–50 karakter, case-sensitive, unique global, dan tidak boleh dihasilkan atau diubah otomatis oleh sistem.
- Contract number kosong atau di luar panjang valid ditolak dengan `400 VALIDATION_ERROR`; nomor duplikat ditolak dengan `409 CONFLICT`.
- Contract immutable.
- Status Contract `BELUM_LUNAS | LUNAS` derived dari installment.
- `final_tenor` wajib berupa bilangan bulat 1–60 bulan.
- `POST /contracts` membuat Contract dan tepat `final_tenor` installment dalam satu transaksi database.
- Response sukses hanya dikirim setelah seluruh transaksi committed.
- Kegagalan validasi, duplicate `contract_number`, duplicate Contract untuk Decision yang sama, atau kegagalan pembuatan installment me-rollback seluruh transaksi; tidak boleh ada record parsial.

## Idempotency-Key

Wajib digunakan pada:
- `POST /prospects/:id/decisions`
- `POST /contracts`
- `PATCH /installments/:id/payment`

- Key harus berupa opaque non-empty string dengan panjang maksimum yang ditetapkan config.
- Scope key adalah kombinasi authenticated user, HTTP method, dan endpoint; key yang sama pada scope berbeda tidak saling bertabrakan.
- Server menyimpan fingerprint payload dan hasil mutation untuk masa retensi idempotency yang dikonfigurasi.
- Request key sama dengan payload yang sama dapat mengembalikan hasil mutation sebelumnya tanpa menjalankan mutation kedua.
- Request key sama dengan payload berbeda ditolak dengan `409`.
- Request yang sama saat mutation pertama masih berjalan tidak menjalankan mutation kedua dan mengembalikan status in-flight yang terdokumentasi.
- Jika mutation pertama gagal dan di-rollback, key tidak boleh diperlakukan sebagai success replay.
- Idempotency record dan response replay tidak boleh membocorkan secret atau data milik user lain.

## Payment boundary

`PATCH /installments/:id/payment` records Marketing payment-monitoring data. It is not a financial ledger, reconciliation, or partial-payment accounting system.

## File upload rules

- `POST /files/upload-url` memvalidasi ukuran maksimum 10 MB dan MIME yang diizinkan sebelum URL diterbitkan.
- `POST /files/:id/complete` memverifikasi ulang ukuran dan MIME dari object yang tersimpan; informasi client tidak cukup sebagai bukti.
- Metadata file menggunakan lifecycle `PENDING | COMPLETED | FAILED | DELETED`.
- File `FAILED` tidak boleh dikembalikan sebagai file aktif dan harus memiliki alasan kegagalan yang dapat diaudit.
- File `DELETED` tetap dapat ditampilkan sebagai metadata historis terbatas, tidak muncul sebagai file aktif, dan endpoint download/URL menolaknya dengan `404 NOT_FOUND`.
- Penghapusan binary R2 harus mengubah metadata menjadi `DELETED` secara tercatat; metadata tidak boleh dihapus hanya karena binary sudah dihapus.
- Error upload, network, dan API yang ditampilkan ke user menggunakan Bahasa Indonesia.
