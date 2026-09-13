# AUDIT RESOLUTION

## Temuan #1 — jumlah Survey per Proyeksi

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Schema mendefinisikan relasi Proyeksi ke Survey sebagai 1:N, tetapi belum membatasi jumlah Survey berdasarkan status. Karena model final tidak memiliki Survey Revision, kondisi tersebut dapat menghasilkan beberapa Survey `SUBMITTED` untuk satu Proyeksi dan membuat snapshot Survey menjadi ambigu.

### Keputusan dan rekomendasi yang disetujui

Satu Proyeksi maksimal memiliki:

- satu Survey `DRAFT`; dan
- satu Survey `SUBMITTED`.

Survey `DRAFT` yang sama boleh diperbarui sampai siap disubmit. Survey `SUBMITTED` immutable. Tidak ada Survey Revision dan tidak boleh membuat Survey kedua untuk Proyeksi yang sama.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/00-SOURCE-OF-TRUTH.md` | Menambahkan aturan maksimal satu DRAFT dan satu SUBMITTED per Proyeksi. | Menjadikan keputusan ini business rule canonical. |
| `docs/business/04-proses-survey.md` | Menjelaskan penggunaan DRAFT yang sama dan penolakan Survey kedua. | Menyamakan proses operasional dengan aturan canonical. |
| `docs/architecture/17-database-schema.md` | Menambahkan constraint maksimal satu DRAFT dan satu SUBMITTED, ditegakkan dengan unique partial index per `prospect_id` dan `status`. | Mencegah duplikasi pada database. |
| `docs/api/20-api-specification.md` | Menambahkan aturan endpoint Survey dan response `409` untuk Survey kedua. | Menentukan perilaku API secara eksplisit. |
| `docs/features/28-survey-file-upload-feature.md` | Menambahkan batas jumlah Survey dan aturan update DRAFT. | Menyamakan feature specification dengan model final. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan invariant INV-030 serta test case untuk DRAFT kedua, SUBMITTED kedua, dan update DRAFT. | Memastikan aturan diuji pada implementasi nanti. |

### Dampak implementasi

Implementasi database perlu membuat dua unique partial index pada tabel `surveys`: satu untuk `status = 'DRAFT'` dan satu untuk `status = 'SUBMITTED'`. Service/API tetap harus memvalidasi aturan dan memetakan konflik constraint menjadi error `409`, bukan mengandalkan database constraint saja.

## Temuan #2 — autentikasi endpoint API

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

API specification belum menjelaskan endpoint mana yang memerlukan autentikasi. Better Auth hanya menyebut backend memvalidasi session, sehingga implementasi dapat berbeda antar-route dan endpoint data berisiko terbuka anonymous.

### Keputusan dan rekomendasi yang disetujui

Semua endpoint `/api/v1` wajib memiliki session Better Auth yang valid, kecuali `GET /health`. Request tanpa session atau dengan session invalid/expired ditolak dengan HTTP `401` dan error envelope standar. Session guard berjalan di route boundary sebelum handler feature; Service tetap menerima actor/session context dari server dan tidak mempercayai identitas dari payload.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menambahkan default authentication policy, pengecualian `/health`, perilaku `401`, dan cakupan endpoint. | Menetapkan kontrak API yang seragam. |
| `docs/backend/25-authentication-better-auth.md` | Menentukan session guard route boundary dan validasi actor context di Service. | Menghindari autentikasi yang hanya diterapkan di frontend atau sebagian route. |
| `docs/architecture/19-backend-architecture.md` | Menambahkan session guard sebagai aturan arsitektur route. | Mengikat aturan keamanan ke struktur backend. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan invariant INV-031 dan test cases anonymous, invalid session, authenticated session, dan health check. | Memastikan policy diuji lintas endpoint. |
| `docs/audit/37-audit-resolution.md` | Mencatat temuan, keputusan, file, dan alasan perubahan. | Menjaga audit trail keputusan pengguna. |

### Dampak implementasi

Implementasi harus menyediakan guard terpusat yang dapat dipasang pada router `/api/v1`, dengan pengecualian eksplisit hanya untuk `GET /health`. Error `401` harus menggunakan error envelope standar dan tidak membocorkan detail session.

## Temuan #3 — folder audit yang dirujuk tetapi belum tersedia

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

README dan bootstrap manual merujuk struktur `docs/audit/` serta dokumen audit bernomor 37–39, tetapi folder tersebut belum ada pada workspace saat audit awal.

### Keputusan dan rekomendasi yang disetujui

Menambahkan indeks `docs/audit/README.md` sebagai entry point folder audit. Indeks menjelaskan tujuan folder, dokumen aktif, dan aturan pencatatan perubahan. Resolution log yang sudah ada tetap menjadi dokumen utama untuk keputusan audit.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/audit/README.md` | Menambahkan indeks folder audit, daftar dokumen, dan aturan audit trail. | Menyamakan struktur aktual dengan rujukan pada README/bootstrap manual dan memudahkan penelusuran audit. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #3, keputusan, dan dampak. | Menjaga audit trail lengkap untuk perubahan ini. |

### Dampak implementasi

Tidak ada dampak pada business rule atau runtime. Folder audit sekarang memiliki entry point yang jelas dan dapat diperluas dengan dokumen audit berikutnya.

## Temuan #4 — field dan enum belum cukup terdefinisi

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Schema menggunakan deskripsi abstrak seperti `identity fields required by business`, `source`, `result`, dan nominal/tenor tanpa data dictionary yang membedakan aturan canonical dari keputusan yang belum dibuat. Kondisi ini memungkinkan implementasi berbeda antar-layer atau mendorong agent mengarang business rule.

### Keputusan dan rekomendasi yang disetujui

Menambahkan data dictionary yang:

- mencatat enum yang sudah canonical;
- mencatat tipe/format minimum dan aturan wajib/nullable yang sudah diketahui;
- mencatat field yang masih open decision;
- melarang implementasi menebak nilai bisnis yang belum dikunci.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan data dictionary, canonical enum, validasi minimum, dan daftar open decision. | Menjadi referensi implementasi yang eksplisit tanpa mengarang business rule. |
| `docs/architecture/17-database-schema.md` | Menautkan schema ke data dictionary. | Menjaga schema dan definisi field tetap sinkron. |
| `docs/README.md` | Memperjelas bahwa folder architecture juga memuat data dictionary. | Memudahkan discovery dokumentasi. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #4, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Schema/API yang bergantung pada open decision belum boleh diklaim final. Implementasi dapat melanjutkan invariant yang sudah canonical, tetapi harus meminta keputusan sebelum mengunci enum, precision/currency, rentang tenor, field identitas, atau field snapshot yang belum ditentukan.

## Temuan #5 — prosedur privacy dan retention belum operasional

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Kebijakan privacy menyebut anonymization Customer dan penghapusan file R2, tetapi belum mendefinisikan autentikasi permintaan, verifikasi scope, audit setiap langkah, perilaku partial failure, atau record yang wajib dipertahankan.

### Keputusan dan rekomendasi yang disetujui

Permintaan penghapusan harus:

- dilakukan oleh user/session terautentikasi;
- diverifikasi target dan scope-nya;
- mencatat actor, waktu, alasan, target, dan hasil pada audit log;
- menganonimkan PII tanpa menghapus row histori;
- menghapus binary R2 hanya setelah verifikasi;
- mempertahankan metadata file sesuai kebutuhan penelusuran;
- menolak penghapusan Contract, Installment, dan audit log;
- menampilkan kegagalan partial dan tidak menyatakan proses selesai bila belum lengkap.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/data-retention-privacy.md` | Menambahkan prosedur autentikasi, verifikasi scope, anonymization, penghapusan R2, partial failure, dan record yang dipertahankan. | Membuat kebijakan privacy dapat diimplementasikan secara konsisten. |
| `docs/architecture/17-data-dictionary.md` | Menambahkan audit log sebagai record wajib dan status metadata file sebagai open decision. | Menyelaraskan data contract dengan prosedur privacy. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-032 dan test cases privacy/retention. | Memastikan guardrail privacy dapat diverifikasi. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #5, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Implementasi membutuhkan operasi privacy yang terautentikasi, audit sebelum dan sesudah mutasi, verifikasi scope file, dan pelaporan partial failure. Tidak ada hard-delete untuk row Customer, Prospect, Survey, Contract, Installment, atau audit log.

## Temuan #6 — atomicity Contract dan Installment belum cukup operasional

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Dokumen menyebut Contract dan seluruh installment dibuat atomic, tetapi belum menetapkan transaction boundary, jumlah installment yang harus committed, perilaku duplicate/conflict, atau larangan response sukses sebelum commit.

### Keputusan dan rekomendasi yang disetujui

`POST /contracts` harus:

- membuat Contract dan tepat `final_tenor` installment dalam satu transaksi database;
- commit hanya setelah semua record berhasil dibuat;
- rollback seluruh transaksi jika validasi, duplicate `contract_number`, duplicate Decision Contract, atau pembuatan installment gagal;
- tidak meninggalkan Contract/installment parsial;
- mengirim response sukses hanya setelah commit.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/06-proses-kontrak.md` | Menjelaskan transaction boundary, exact installment count, rollback total, dan larangan partial record. | Menjadikan atomicity sebagai aturan operasional. |
| `docs/api/20-api-specification.md` | Menentukan perilaku `POST /contracts` sebelum dan sesudah commit serta conflict handling. | Menjadikan atomicity bagian dari API contract. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan satu transaction boundary pada Service Contract dan larangan repository transaction terpisah. | Mencegah implementasi memecah workflow atomic. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-033 dan test cases sukses, installment failure, duplicate number, dan duplicate Decision. | Memastikan tidak ada partial record. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #6, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Implementasi Contract wajib menggunakan transaction API Neon/Drizzle yang mencakup insert Contract dan bulk insert installment. Constraint conflict harus dipetakan ke error standar tanpa mengirim response sukses atau menyisakan record parsial.

## Temuan #7 — strategi Cloud LLM belum operasional

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Dokumen Cloud LLM hanya menyatakan kriteria pemilihan provider/model, tetapi belum menentukan cara konfigurasi, validasi, penyimpanan secret, atau perilaku ketika cloud provider tidak tersedia.

### Keputusan dan rekomendasi yang disetujui

- Provider dan model dikonfigurasi melalui environment tervalidasi.
- Identifier konfigurasi menggunakan `LLM_CLOUD_PROVIDER` dan `LLM_CLOUD_MODEL`.
- API key dan secret hanya berada di secret manager/environment deployment.
- Konfigurasi fail-fast jika provider diaktifkan tetapi credential/model wajib tidak tersedia.
- Tidak ada fallback diam-diam atau success-shaped response jika LLM gagal.
- Provider tidak dikunci di `AGENTS.md`; evaluasi dicatat di dokumen provider.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `llms/cloud/providers.md` | Menambahkan policy konfigurasi, secret, fail-fast, fallback, dan evaluasi provider. | Menjadikan strategi cloud dapat dioperasikan tanpa mengunci provider. |
| `llms/README.md` | Menambahkan rujukan konfigurasi environment dan secret policy. | Menyamakan overview LLM dengan policy operasional. |
| `env-setup.md` | Menambahkan identifier environment cloud LLM dan aturan validasi/secret. | Menempatkan konfigurasi pada setup environment yang tepat. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #7, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Implementasi config harus memvalidasi provider/model dan credential yang dibutuhkan sebelum client cloud dibuat. Secret tidak boleh ditulis ke log, prompt, audit trail, atau repository. Bila provider tidak tersedia, sistem harus memilih jalur local yang memang didukung atau menghentikan task secara eksplisit.

## Temuan #8 — inkonsistensi penamaan bootstrap dan referensi audit

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Nama `bootstraping-manual.md` menggunakan typo, sementara beberapa dokumentasi merujuk rentang dokumen audit 37–39 walaupun hanya resolution log 37 yang tersedia. Kondisi ini dapat membingungkan discovery dan membuat pembaca mengira dokumen audit 38–39 sudah ada.

### Keputusan dan rekomendasi yang disetujui

- `bootstrapping-manual.md` menjadi satu-satunya file panduan bootstrap.
- File typo `bootstraping-manual.md` tidak dipertahankan.
- README menyatakan bahwa dokumen audit hanya dirujuk setelah file tersedia.
- Folder audit mencatat dokumen yang benar-benar tersedia.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `bootstrapping-manual.md` | Menjadi satu-satunya panduan bootstrap dan memuat isi panduan lengkap. | Menghilangkan typo tanpa menyisakan dua sumber isi. |
| `bootstraping-manual.md` | Dihapus karena nama file typo tidak dipertahankan. | Mengikuti keputusan pengguna dan mencegah penggunaan file lama. |
| `README.md` | Menampilkan hanya nama canonical bootstrap dan menghapus klaim audit 37–39 sebagai struktur yang sudah tersedia. | Menghindari referensi dokumen yang belum ada. |
| `docs/README.md` | Mengganti rentang audit 37–39 menjadi dokumen audit yang tersedia. | Menjaga struktur dokumentasi tetap faktual. |
| `docs/audit/README.md` | Menjelaskan bahwa hanya dokumen audit yang tersedia boleh dirujuk dan saat ini resolution log 37 tersedia. | Membuat status folder audit eksplisit. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #8, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Tidak ada dampak runtime atau business rule. Referensi lama tetap valid, sedangkan pengguna baru memiliki entry point dengan ejaan yang benar. Audit 38–39 belum dianggap tersedia sampai file masing-masing dibuat.

### Koreksi keputusan

Atas instruksi pengguna pada 2026-09-13, kompatibilitas dengan nama typo tidak dipertahankan. `bootstraping-manual.md` dihapus dan seluruh isi panduan dipusatkan di `bootstrapping-manual.md`. Pernyataan dampak di atas tentang referensi lama digantikan oleh keputusan ini.

## Temuan #9 — klaim rentang nomor dokumentasi tidak faktual

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

`bootstrapping-manual.md` masih menyatakan bahwa dokumentasi bernomor 00–39 berada di `docs/`, padahal nomor 33 tidak digunakan dan sebagian dokumen audit 38–39 belum tersedia.

### Keputusan dan rekomendasi yang disetujui

Catatan manual bootstrap diubah menjadi pernyataan faktual: dokumentasi yang tersedia berada di subfolder topikal, nomor 33 tidak digunakan, dan daftar dokumen audit aktual dirujuk melalui `docs/audit/README.md`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `bootstrapping-manual.md` | Menghapus klaim 00–39 dan merujuk struktur serta daftar audit aktual. | Mencegah pembaca mengira semua nomor dokumentasi sudah tersedia. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #9, keputusan, file, dan alasan. | Menjaga audit trail perubahan. |

### Dampak implementasi

Tidak ada dampak runtime atau business rule. Perubahan hanya memperbaiki akurasi navigasi dokumentasi.

## Temuan #10 — kontrak upload file tersebar

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Aturan upload sudah menyebut batas ukuran/MIME dan validasi dua tahap, tetapi lifecycle metadata, perilaku file gagal, dan bahasa error user-facing belum dikunci secara konsisten di feature, API, schema, dan test matrix.

### Keputusan dan rekomendasi yang disetujui

- Lifecycle metadata file adalah `PENDING → COMPLETED` atau `PENDING → FAILED`.
- Ukuran dan MIME divalidasi sebelum presigned URL diterbitkan dan saat completion.
- Server tidak mempercayai klaim client.
- File `FAILED` tidak aktif dan menyimpan alasan kegagalan yang dapat diaudit.
- Error upload, network, dan API user-facing menggunakan Bahasa Indonesia.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/features/28-survey-file-upload-feature.md` | Menambahkan lifecycle metadata, validasi server dua tahap, dan aturan bahasa error. | Menjadikan feature behavior eksplisit. |
| `docs/api/20-api-specification.md` | Menambahkan kontrak endpoint upload, status metadata, dan error behavior. | Menyamakan API contract. |
| `docs/architecture/17-database-schema.md` | Mengunci status metadata dan failure reason. | Memastikan schema dapat merepresentasikan lifecycle gagal. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-034 dan test cases upload. | Memastikan validasi tidak hanya mempercayai client. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #10, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Completion harus membaca metadata object dari storage/provider dan memvalidasi ulang ukuran serta MIME sebelum mengubah status menjadi `COMPLETED`. Semua kegagalan harus menjadi `FAILED` atau error eksplisit, bukan success-shaped response.

## Temuan #11 — timezone bisnis belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Dokumen menyebut timestamp UTC dan due-date anchor, tetapi belum menentukan timezone bisnis yang dipakai untuk input/tampilan tanggal operasional dan perhitungan kalender. Tanpa aturan ini, hasil dapat berbeda berdasarkan timezone browser, Worker, atau server.

### Keputusan dan rekomendasi yang disetujui

- Timestamp tetap disimpan sebagai UTC.
- Timezone bisnis harus dikonfigurasi eksplisit sebelum production.
- Konversi input/tampilan dilakukan di boundary.
- Service memakai timezone bisnis untuk perhitungan kalender dan due date.
- Timezone client/runtime tidak boleh menjadi sumber business rule.
- Nilai timezone bisnis belum dipilih dalam temuan ini dan tetap menjadi open decision.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan policy tanggal/waktu dan open decision timezone bisnis. | Menjelaskan pemisahan UTC storage dan business calendar. |
| `docs/architecture/15-arsitektur-teknis.md` | Menetapkan timezone conversion dan Service calendar rule. | Mengikat aturan pada arsitektur backend. |
| `docs/business/07-proses-angsuran.md` | Menetapkan due date memakai timezone bisnis lalu disimpan UTC. | Mencegah pergeseran due date. |
| `docs/api/20-api-specification.md` | Menetapkan format UTC dan konversi input operasional. | Menjadikan API date behavior eksplisit. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-035 dan test cases lintas timezone. | Memastikan hasil tidak bergantung runtime timezone. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #11, keputusan, file, alasan, dan open decision. | Menjaga audit trail perubahan. |

### Dampak implementasi

Production configuration belum boleh dianggap lengkap sebelum nilai timezone bisnis dipilih dan divalidasi. Setelah dipilih, config harus fail-fast bila timezone invalid/missing dan test due-date wajib memakai fixed timezone yang sama.

## Temuan #21 — timezone bisnis belum memiliki nilai final

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan

Timezone bisnis canonical ditetapkan menjadi `Asia/Jakarta`. Seluruh timestamp tetap disimpan UTC; `Asia/Jakarta` dipakai untuk input/tampilan tanggal operasional dan perhitungan kalender/due date.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengganti open decision timezone dengan nilai canonical `Asia/Jakarta`. | Mengunci aturan tanggal bisnis agar implementasi tidak menebak. |
| `docs/architecture/15-arsitektur-teknis.md` | Menetapkan `Asia/Jakarta` pada arsitektur Service. | Menyamakan timezone lintas layer. |
| `docs/business/07-proses-angsuran.md` | Menetapkan kalender `Asia/Jakarta` untuk due date. | Mencegah pergeseran tanggal jatuh tempo. |
| `docs/api/20-api-specification.md` | Menetapkan konversi input tanggal dengan `Asia/Jakarta`. | Menjadikan API behavior eksplisit. |
| `env-setup.md` | Menambahkan `BUSINESS_TIMEZONE=Asia/Jakarta` dan validasinya. | Memastikan deployment memakai konfigurasi yang benar. |
| `docs/testing/31-invariant-test-matrix.md` | Mengubah test timezone menjadi assertion `Asia/Jakarta`. | Memastikan nilai final diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan temuan #21. | Menjaga audit trail keputusan bisnis. |

### Dampak implementasi

Config validation harus menolak nilai selain `Asia/Jakarta`. Runtime timezone tetap tidak relevan; semua kalkulasi tanggal bisnis harus memakai timezone canonical tersebut.

## Temuan #22 — enum source order belum final

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Klarifikasi bisnis

`prospects.source` adalah sumber order Proyeksi, yaitu asal pengajuan calon nasabah. Enum canonical yang disetujui:

`NEW | RO | MITRA | WALKIN | BROSURING | SOSIAL_MEDIA | PERSONAL`

Aturan relasi:

- `source=MITRA` wajib memiliki `mitra_id`;
- source selain `MITRA` wajib memiliki `mitra_id = NULL`;
- source di luar enum ditolak.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengunci enum source order dan aturan nullable `mitra_id`. | Menjadikan field siap diimplementasikan tanpa asumsi. |
| `docs/architecture/17-database-schema.md` | Menambahkan enum dan constraint source pada schema Prospect. | Menjaga invariant di database. |
| `docs/api/20-api-specification.md` | Menambahkan enum source order dan validation behavior. | Menjadikan kontrak API eksplisit. |
| `docs/business/12-business-rules-global.md` | Menambahkan enum source order ke global business rules. | Menyamakan aturan bisnis canonical. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-045 dan test cases seluruh source/Mitra consistency. | Memastikan validasi enum dan relasi berjalan konsisten. |
| `docs/audit/37-audit-resolution.md` | Menambahkan klarifikasi sumber order, keputusan, file, dan alasan. | Menjaga audit trail keputusan bisnis. |

### Dampak implementasi

Schema, Zod, dan API hanya boleh menerima tujuh nilai source order tersebut. `RO` diperlakukan sebagai source order karena dipilih pengguna dalam enum, sedangkan aturan RO lookup history tetap terpisah dan tidak menyalin data lama otomatis.

## Temuan #23 — enum Follow Up result belum final

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan

Enum Follow Up result canonical:

`PIKIR_PIKIR | BELUM_MINAT | MAU | TIDAK_BISA_DIHUBUNGI | LAINNYA`

`LAINNYA` wajib memiliki `notes`. Result Follow Up tetap bukan status Proyeksi.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengunci enum result dan conditional notes. | Menghilangkan enum operasional yang ambigu. |
| `docs/architecture/17-database-schema.md` | Menambahkan enum Follow Up dan aturan `LAINNYA`. | Menjaga constraint schema. |
| `docs/api/20-api-specification.md` | Menambahkan enum dan validation behavior. | Menjadikan API contract eksplisit. |
| `docs/business/03-proses-follow-up.md` | Mengganti hasil operasional terbuka dengan enum final. | Menyamakan proses bisnis canonical. |
| `docs/business/12-business-rules-global.md` | Menambahkan enum ke global rules. | Menjaga konsistensi lintas business docs. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-046 dan test cases result/notes. | Memastikan conditional validation diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan temuan #23. | Menjaga audit trail keputusan bisnis. |

### Dampak implementasi

Zod/API/database hanya menerima lima result tersebut. Service harus menolak `LAINNYA` tanpa notes dan tidak boleh mengubah result menjadi status Proyeksi.

## Temuan #24 — currency, precision, dan pembulatan nominal belum final

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan

- Currency canonical: IDR.
- `proposed_amount`, `approved_amount`, `final_amount`, dan installment `amount` disimpan sebagai integer rupiah tanpa pecahan.
- Nilai wajib non-negatif.
- Pecahan ditolak dengan `400 VALIDATION_ERROR`.
- Tidak ada pembulatan diam-diam.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengunci tipe nominal integer IDR dan menghapus open decision currency/precision. | Menyamakan validasi nominal lintas entity. |
| `docs/architecture/17-database-schema.md` | Menjelaskan penyimpanan nominal sebagai integer rupiah. | Mencegah precision/rounding ambiguity. |
| `docs/api/20-api-specification.md` | Menetapkan input validation dan penolakan pecahan/negatif. | Menjadikan API behavior eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Menambahkan aturan nominal canonical ke source of truth. | Mengunci keputusan bisnis di acuan tertinggi. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-047 dan test cases nominal. | Memastikan tidak ada silent rounding. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan temuan #24. | Menjaga audit trail keputusan bisnis. |

### Dampak implementasi

Database dapat memakai integer/bigint sesuai kapasitas nominal yang dipilih implementasi. DTO dan Service wajib menolak decimal/negative sebelum persistence; tidak boleh memakai floating-point untuk nominal.

## Temuan #25 — satuan dan rentang tenor belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Tenor menggunakan satuan bulan.
- Tenor wajib berupa bilangan bulat.
- Nilai tenor yang valid adalah 1–60 bulan, termasuk batas minimum dan maksimum.
- Nilai nol, negatif, lebih dari 60, atau pecahan ditolak dengan `400 VALIDATION_ERROR`.
- Aturan berlaku untuk `proposed_tenor`, `approved_tenor`, dan `final_tenor`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengunci tipe tenor sebagai integer bulan 1–60 dan menghapus open decision tenor. | Mencegah interpretasi satuan/rentang yang berbeda antar-layer. |
| `docs/architecture/17-database-schema.md` | Menambahkan batas validasi tenor pada field pembiayaan dan Contract. | Menetapkan constraint data yang dapat diuji sebelum persistence. |
| `docs/api/20-api-specification.md` | Menetapkan format tenor dan error validation untuk nilai invalid. | Menjadikan behavior API eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Menambahkan aturan tenor canonical. | Mengunci keputusan pada acuan bisnis tertinggi. |
| `docs/business/05-proses-keputusan.md` | Menjelaskan aturan tenor pada pencatatan Decision. | Menyamakan proses input hasil keputusan. |
| `docs/business/06-proses-kontrak.md` | Menjelaskan aturan tenor final Contract. | Mencegah jumlah installment ambigu. |
| `docs/business/07-proses-angsuran.md` | Menghubungkan jumlah installment dengan tenor bulan 1–60. | Menjaga konsistensi jadwal angsuran. |
| `docs/features/29-decision-contract-installment-feature.md` | Menambahkan validasi tenor pada feature flow. | Menyamakan ekspektasi feature dengan business/API contract. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-048` dan skenario batas/rentang tenor. | Memastikan nilai invalid ditolak dan tidak menghasilkan data parsial. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #25. | Menjaga audit trail keputusan bisnis. |

### Dampak implementasi

Zod/API/Service/database harus memperlakukan tenor sebagai integer bulan dalam rentang 1–60. Perhitungan jadwal menggunakan nilai bulan tersebut; implementasi tidak boleh menebak satuan atau menerima pembulatan pecahan.

## Temuan #26 — field identitas Customer dan struktur alamat belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Customer wajib memiliki `full_name`.
- Customer wajib memiliki tepat satu primary phone melalui `customer_phones`; `phone_normalized` unique secara global.
- Alamat Customer wajib terstruktur dalam field `province`, `city`, `district`, `village`, dan `address_detail`.
- Komponen alamat disimpan terpisah agar dapat difilter; alamat tidak boleh hanya berupa free-text gabungan.
- Email, nomor identitas, dan tanggal lahir tetap nullable sampai ada keputusan bisnis khusus.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan field wajib Customer, aturan alamat terstruktur, dan primary phone canonical. | Mencegah implementasi menebak identitas minimum atau menyimpan alamat tanpa struktur filter. |
| `docs/architecture/17-database-schema.md` | Mengganti placeholder identity fields dengan field Customer konkret dan constraint alamat/phone. | Menjadikan struktur persistence eksplisit. |
| `docs/api/20-api-specification.md` | Menambahkan Customer rules, filterability alamat, dan conflict primary phone. | Menyamakan request validation dan behavior API. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci identitas minimum dan alamat terstruktur Customer. | Menempatkan keputusan pada acuan bisnis tertinggi. |
| `docs/business/11-data-dan-relasi.md` | Menjelaskan field alamat dan relasi phone Customer. | Menjaga konsistensi model bisnis dan pencarian wilayah. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-049` dan skenario validasi Customer/address/phone. | Memastikan field wajib, filterability, dan uniqueness diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #26. | Menjaga audit trail perubahan. |

### Dampak implementasi

DTO/Zod/API dan database wajib menolak Customer tanpa field identitas/alamat minimum atau tanpa tepat satu primary phone. Query Customer boleh memfilter komponen alamat secara langsung; implementasi tidak perlu melakukan parsing alamat free-text.

## Temuan #27 — field wajib Survey Applicant belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Applicant tidak memiliki relasi ke Customer atau nasabah lain.
- Setiap Survey wajib memiliki Applicant dengan `full_name`, `primary_phone`, dan domicile terstruktur dalam `province`, `city`, `district`, `village`, dan `address_detail`.
- Setiap Survey wajib memiliki tepat satu Penjamin dengan `full_name`, `primary_phone`, dan domicile terstruktur yang sama.
- Setelah revisi Temuan #28, NIK/nomor KTP Applicant dan Penjamin wajib serta unique global.
- Domicile terstruktur dapat digunakan untuk filter; tidak boleh hanya disimpan sebagai alamat free-text gabungan.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan field wajib Applicant/Penjamin, domicile terstruktur, dan aturan NIK/KTP unique global. | Mencegah implementasi menebak data minimum dan identitas ganda. |
| `docs/architecture/17-database-schema.md` | Mengganti placeholder Applicant/Penjamin dengan field konkret dan constraint wajib. | Menjadikan snapshot Applicant/Penjamin dapat diimplementasikan dan difilter. |
| `docs/api/20-api-specification.md` | Menambahkan validasi Applicant tanpa relasi dan tepat satu Penjamin. | Menetapkan behavior API secara eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci Applicant tanpa relasi dan Penjamin wajib. | Menempatkan keputusan pada acuan bisnis tertinggi. |
| `docs/business/04-proses-survey.md` | Menjelaskan Applicant dan Penjamin yang wajib pada Survey. | Menyamakan proses Survey dengan data contract. |
| `docs/features/28-survey-file-upload-feature.md` | Menyelaraskan struktur Applicant/Penjamin dengan field domicile canonical. | Menghapus struktur alamat lama yang tidak lagi menjadi acuan. |
| `docs/testing/31-invariant-test-matrix.md` | Memperbarui `INV-050` dan menambahkan skenario Penjamin wajib. | Memastikan relasi yang tidak berlaku ditolak dan Penjamin diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #27. | Menjaga audit trail perubahan. |

### Dampak implementasi

DTO/Zod/API dan database wajib menolak Survey Applicant tanpa field minimum identitas, phone, domicile, atau NIK, serta Survey tanpa tepat satu Penjamin dengan field minimum yang sama. Payload Applicant tidak boleh menerima relasi ke Customer lain. Setelah Temuan #28, NIK Applicant dan Penjamin wajib serta unique global; query laporan/search dapat memakai komponen domicile secara langsung.

## Temuan #29 — field collateral wajib dan snapshot Contract belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Setiap Survey wajib memiliki `collateral_type` dan `estimated_value`.
- Field `brand`, `model`, `manufacture_year`, dan `registration_number` wajib bila relevan dengan jenis collateral; field yang tidak relevan boleh nullable.
- Contract menyalin snapshot collateral final dari Survey.
- Snapshot collateral Contract immutable setelah Contract dibuat.
- `estimated_value` menggunakan integer IDR non-negative tanpa pecahan.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan field collateral Survey/Contract dan aturan conditional. | Menetapkan data minimum tanpa memaksa field yang tidak relevan. |
| `docs/architecture/17-database-schema.md` | Menambahkan struktur snapshot collateral dan constraint immutable Contract. | Menjaga histori kondisi collateral saat pengajuan dan kontrak. |
| `docs/api/20-api-specification.md` | Menetapkan validasi collateral dan penyalinan snapshot Contract. | Menjadikan API behavior eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci collateral minimum dan snapshot immutable Contract. | Menempatkan keputusan pada acuan bisnis tertinggi. |
| `docs/business/04-proses-survey.md` | Menjelaskan collateral minimum pada Survey. | Menyamakan proses Survey dengan schema/API. |
| `docs/business/06-proses-kontrak.md` | Menetapkan snapshot collateral final pada Contract. | Mencegah perubahan histori setelah Contract dibuat. |
| `docs/features/28-survey-file-upload-feature.md` | Menambahkan alur snapshot collateral ke Contract. | Menjaga konsistensi feature flow. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-052` dan test cases conditional/immutable collateral. | Memastikan validasi relevansi dan immutability diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #29. | Menjaga audit trail perubahan. |

### Dampak implementasi

Service harus memvalidasi relevansi field berdasarkan `collateral_type` sebelum persistence. Pembuatan Contract harus mengambil snapshot final dalam transaction boundary yang sama dengan Contract dan installment; endpoint update Contract tidak boleh mengubah collateral snapshot.

## Temuan #30 — aturan conditional field Decision belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- `ACC` wajib memiliki `approved_amount`, `approved_tenor`, dan `final_due_date`.
- `approved_amount` harus integer IDR non-negative.
- `approved_tenor` harus integer dalam rentang 1–60 bulan.
- `PENDING` dan `DITOLAK` tidak boleh memiliki `approved_amount`, `approved_tenor`, atau `final_due_date`.
- Pelanggaran conditional field ditolak dengan `400 VALIDATION_ERROR`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengubah field Decision menjadi conditional per status dan menghapus open decision terkait. | Mencegah state Decision yang tidak lengkap atau kontradiktif. |
| `docs/architecture/17-database-schema.md` | Menambahkan constraint conditional pada status Decision. | Memperkuat business invariant di persistence. |
| `docs/api/20-api-specification.md` | Menetapkan payload wajib/kosong per status dan error validation. | Menjadikan API behavior eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci aturan field Decision pada acuan bisnis tertinggi. | Menyamakan arti `PENDING`, `ACC`, dan `DITOLAK`. |
| `docs/business/05-proses-keputusan.md` | Menjelaskan input field berdasarkan status Decision. | Menyamakan proses operasional dengan schema/API. |
| `docs/features/29-decision-contract-installment-feature.md` | Menambahkan validasi conditional pada feature flow. | Mencegah input hasil Decision yang tidak valid. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-053` dan skenario conditional Decision. | Memastikan semua kombinasi status diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #30. | Menjaga audit trail perubahan. |

### Dampak implementasi

Zod/API/Service harus menerapkan validasi conditional sebelum persistence. Constraint database atau trigger yang setara harus mencegah status Decision menyimpan field hasil yang tidak sesuai; error validasi tidak boleh menghasilkan record parsial.

## Temuan #33 — aturan `next_action` dan `next_action_date` belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Jika `next_action` diisi, `next_action_date` wajib diisi.
- Jika `next_action` kosong, `next_action_date` wajib kosong.
- `next_action_date` tidak boleh lebih awal dari `follow_up_date`.
- Perbandingan tanggal operasional menggunakan kalender `Asia/Jakarta`; timestamp tetap disimpan dalam UTC.
- Pelanggaran aturan ditolak dengan `400 VALIDATION_ERROR`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengunci conditional field dan urutan tanggal Follow Up. | Mencegah reminder tanpa tindakan atau tanggal yang tidak logis. |
| `docs/architecture/17-database-schema.md` | Menambahkan constraint relasi field dan perbandingan tanggal. | Menjaga integritas data pada persistence. |
| `docs/api/20-api-specification.md` | Menetapkan validasi request dan kalender Asia/Jakarta. | Menjadikan behavior API eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci aturan Follow Up pada acuan bisnis tertinggi. | Menyamakan arti next action lintas layer. |
| `docs/business/03-proses-follow-up.md` | Menjelaskan aturan input operasional Follow Up. | Menyamakan proses Marketing dengan schema/API. |
| `docs/features/27-prospect-follow-up-feature.md` | Menambahkan validation behavior pada feature flow. | Menjaga UX dan feature contract konsisten. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-056` dan skenario conditional/date ordering. | Memastikan semua kombinasi invalid diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #33. | Menjaga audit trail perubahan. |

### Dampak implementasi

Zod/API/Service harus memvalidasi pasangan field dan membandingkan tanggal dalam timezone bisnis sebelum persistence. Sistem tidak boleh membuat due/reminder date dari `next_action` yang kosong atau menerima tanggal historis yang lebih awal dari Follow Up.

## Temuan #34 — status metadata file setelah binary R2 dihapus

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Lifecycle file menjadi `PENDING | COMPLETED | FAILED | DELETED`.
- Setelah binary R2 berhasil dihapus, metadata file dipertahankan dan status diubah menjadi `DELETED`.
- File `DELETED` tidak dianggap aktif dan tidak dapat diunduh.
- Object/storage key dikosongkan atau ditandai tidak aktif setelah penghapusan binary.
- Penghapusan dan perubahan status dicatat pada audit log.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan status metadata `DELETED`. | Membedakan file historis yang binary-nya sudah dihapus dari file aktif. |
| `docs/architecture/17-database-schema.md` | Menambahkan lifecycle dan aturan key/status `DELETED`. | Menjaga metadata tetap dapat diaudit tanpa memberi akses file. |
| `docs/api/20-api-specification.md` | Menetapkan response metadata dan larangan download file `DELETED`. | Mencegah akses ke object yang sudah tidak ada. |
| `docs/features/28-survey-file-upload-feature.md` | Menambahkan transisi `COMPLETED → DELETED`. | Menyamakan lifecycle feature dengan privacy workflow. |
| `docs/business/data-retention-privacy.md` | Mengunci metadata tetap ada dengan status `DELETED`. | Mempertahankan jejak histori setelah penghapusan binary. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-057` dan skenario metadata/download. | Memastikan file inactive dan tidak dapat diakses. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #34. | Menjaga audit trail perubahan. |

### Dampak implementasi

Service privacy wajib menghapus binary secara scoped, mencatat hasil, lalu menandai metadata `DELETED`. Endpoint list/download harus mengecualikan atau menolak file `DELETED`; metadata tidak boleh dihapus untuk menggantikan status lifecycle.

## Temuan #31 — basis Contract NORMAL/BANDING dan bukti banding belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Saat membuat Contract, Marketing memilih `contract_basis=NORMAL|BANDING`.
- `contract_basis` harus sama dengan `decision_type` Decision `ACC` yang dirujuk.
- Decision `BANDING` wajib merupakan Decision baru yang menunjuk Decision `DITOLAK` sebelumnya pada Prospect yang sama.
- Decision `BANDING` wajib memiliki `banding_reason` yang menjelaskan alasan pengajuan banding.
- Decision `BANDING` boleh memiliki maksimal satu foto bukti `BUKTI_BANDING`.
- Contract BANDING tidak boleh dibuat langsung dari Decision `DITOLAK`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan field referensi/alasan/foto banding dan basis Contract. | Menjadikan data banding eksplisit dan terbatas. |
| `docs/architecture/17-database-schema.md` | Menambahkan constraint referensi Decision banding dan kesesuaian basis Contract. | Mencegah Contract banding tanpa proses Decision yang sah. |
| `docs/api/20-api-specification.md` | Menetapkan pilihan basis Contract, alur banding, dan batas satu foto. | Menjadikan behavior API dapat divalidasi. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci alur banding dan pilihan basis Contract. | Menempatkan keputusan pada acuan bisnis tertinggi. |
| `docs/business/05-proses-keputusan.md` | Menjelaskan referensi Decision ditolak, alasan, dan foto opsional. | Menyamakan proses pengajuan banding. |
| `docs/business/06-proses-kontrak.md` | Menjelaskan pilihan basis Contract dan guardrail Decision ACC. | Mencegah Contract dibuat dari penolakan langsung. |
| `docs/features/29-decision-contract-installment-feature.md` | Menambahkan alur NORMAL/BANDING pada Decision dan Contract. | Menjaga feature flow konsisten. |
| `docs/features/28-survey-file-upload-feature.md` | Menambahkan `BUKTI_BANDING` ke enum file. | Membedakan bukti banding dari file umum. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-054` dan test cases banding. | Memastikan alasan, referensi, jumlah foto, dan basis Contract diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #31. | Menjaga audit trail perubahan. |

### Dampak implementasi

Service harus memastikan Decision banding menunjuk Decision ditolak yang sama Prospect-nya, alasan tidak kosong, dan jumlah foto maksimal satu. `POST /contracts` hanya menerima basis yang cocok dengan Decision ACC; pembuatan Contract dari Decision DITOLAK langsung harus ditolak.

## Temuan #32 — format dan panjang `contract_number` belum dikunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- `contract_number` berasal dari nomor resmi kantor dan selalu diinput manual.
- Server melakukan trim whitespace sebelum validasi dan persistence.
- Nilai valid adalah string 1–50 karakter.
- Perbandingan bersifat case-sensitive.
- Nomor kontrak unique global.
- Sistem tidak menghasilkan atau mengubah nomor kontrak secara otomatis.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Mengunci format, panjang, trim, case sensitivity, dan uniqueness `contract_number`. | Mencegah interpretasi format nomor kontrak berbeda. |
| `docs/architecture/17-database-schema.md` | Menambahkan constraint persistence untuk nomor kontrak 1–50 karakter dan unique global. | Memperkuat integritas nomor resmi kantor. |
| `docs/api/20-api-specification.md` | Menetapkan normalisasi whitespace, validation error, dan conflict behavior. | Menjadikan API contract eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci nomor manual dan tidak auto-generated. | Menempatkan aturan di acuan bisnis tertinggi. |
| `docs/business/06-proses-kontrak.md` | Menjelaskan format nomor pada proses Contract. | Menyamakan proses input operasional. |
| `docs/features/29-decision-contract-installment-feature.md` | Menyelaraskan validasi nomor pada feature flow. | Menjaga ekspektasi UI/feature konsisten. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-055` dan skenario trim/panjang/case/duplicate. | Memastikan batas nomor kontrak dapat diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #32. | Menjaga audit trail perubahan. |

### Dampak implementasi

DTO/Zod/API harus trim dan memvalidasi panjang sebelum persistence. Database harus mempertahankan uniqueness case-sensitive sesuai collation yang dipilih; sistem tidak boleh mengganti nomor kantor dengan generator internal.

## Temuan #28 — NIK/KTP sebagai identitas unik Customer, Applicant, Penjamin, dan Mitra

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Customer wajib memiliki NIK/nomor KTP.
- Survey Applicant wajib memiliki NIK/nomor KTP.
- Penjamin wajib memiliki NIK/nomor KTP.
- Mitra wajib memiliki NIK/nomor KTP.
- Nilai dinormalisasi menjadi `nik_normalized`.
- `nik_normalized` unique secara global lintas Customer, Survey Applicant, Survey Guarantor, dan Mitra.
- NIK/KTP duplikat ditolak dengan `409 CONFLICT`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Menambahkan `nik_normalized` wajib pada Customer, Applicant, Penjamin, dan Mitra. | Menetapkan identitas unik yang konsisten. |
| `docs/architecture/17-database-schema.md` | Menambahkan field NIK dan constraint uniqueness global lintas entity. | Mencegah identitas ganda pada persistence. |
| `docs/api/20-api-specification.md` | Menetapkan NIK wajib, normalisasi, dan response conflict. | Menjadikan validasi identitas API eksplisit. |
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengunci NIK/KTP sebagai identitas unik semua pihak terkait. | Menempatkan keputusan pada acuan bisnis tertinggi. |
| `docs/business/04-proses-survey.md` | Menambahkan NIK Applicant dan Penjamin sebagai data wajib Survey. | Menyamakan proses Survey dengan identitas canonical. |
| `docs/features/28-survey-file-upload-feature.md` | Menambahkan NIK wajib pada Applicant dan Penjamin. | Menjaga konsistensi feature flow. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan `INV-051` dan skenario missing/duplicate NIK. | Memastikan uniqueness dan required validation diuji. |
| `docs/audit/37-audit-resolution.md` | Menambahkan keputusan Temuan #28. | Menjaga audit trail perubahan. |

### Dampak implementasi

Service wajib menormalisasi NIK sebelum validasi dan persistence. Database membutuhkan uniqueness boundary lintas entity, bukan hanya unique index terpisah per tabel. Privacy anonymization harus mempertahankan constraint uniqueness dengan placeholder NIK yang tidak dapat dipakai sebagai identitas valid.

## Temuan #36 — penggabungan dokumen arsitektur/backend yang terlalu pendek

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Dokumen yang pendek digabung hanya jika topiknya sama.
- Arsitektur teknis umum dan backend architecture digabung ke
  `15-arsitektur-teknis.md`.
- Backend project structure/coding convention dan bootstrap project setup
  digabung ke `21-backend-project-structure-coding-convention.md`.
- Frontend architecture dan Better Auth tetap terpisah karena boundary dan
  tanggung jawabnya berbeda.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/15-arsitektur-teknis.md` | Menambahkan bagian backend architecture. | Menghindari dokumen backend architecture yang hanya berisi satu blok kecil. |
| `docs/architecture/19-backend-architecture.md` | Dihapus setelah isinya dikonsolidasikan. | Mengurangi fragmentasi tanpa kehilangan aturan. |
| `docs/backend/21-backend-project-structure-coding-convention.md` | Menambahkan bagian bootstrap. | Structure dan bootstrap adalah fondasi backend yang sama. |
| `docs/backend/22-backend-bootstrap-project-setup.md` | Dihapus setelah isinya dikonsolidasikan. | Mengurangi dokumen pendek yang berdiri sendiri. |
| `docs/00-INDEX.md` | Memperbarui rujukan backend architecture. | Menjaga peta dokumen tetap akurat. |
| `docs/agent/38-DOCUMENTATION-READING-ORDER.md` | Memperbarui urutan baca backend. | Mengarahkan AI ke dokumen canonical baru. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat keputusan konsolidasi. | Menjaga audit trail perubahan. |

## Temuan #38 — penghapusan deskripsi pekerjaan yang duplikatif

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

Dokumen `docs/business/01-deskripsi-pekerjaan.md` dihapus karena isinya hanya
meringkas tujuan dan ruang lingkup aplikasi yang sudah tercakup di
`docs/PROJECT-CONTEXT.md` dan Source of Truth. Dokumen frontend dan
authentication tetap dipertahankan karena mewakili boundary teknis yang
berbeda.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/01-deskripsi-pekerjaan.md` | Dihapus karena duplikatif. | Mengurangi sumber konteks yang berulang. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat keputusan penghapusan. | Menjaga audit trail perubahan. |

## Temuan #39 — penambahan panduan production operations

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

Ditambahkan folder `docs/operations/` sebagai panduan operasional production.
Folder ini mencakup deployment, environment/secret, migration/rollback,
backup/restore, observability/alerting, incident response, security release
gate, dan go-live checklist.

Panduan tidak menyimpan secret dan tidak mengklaim aplikasi siap production
sebelum source code, test runtime, deployment, dan checklist go-live benar-benar
terverifikasi.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/operations/README.md` | Menambahkan indeks operations. | Menjadi entry point panduan production. |
| `docs/operations/01-deployment.md` | Menambahkan release flow dan post-deploy verification. | Menstandarkan proses deployment. |
| `docs/operations/02-environment-and-secrets.md` | Menambahkan aturan environment dan secret. | Mencegah credential leakage dan cross-environment error. |
| `docs/operations/03-migration-and-rollback.md` | Menambahkan migration, rollback, dan forward-fix policy. | Menjaga perubahan database dapat dipulihkan. |
| `docs/operations/04-backup-and-restore.md` | Menambahkan backup dan restore test policy. | Memastikan pemulihan dapat dibuktikan. |
| `docs/operations/05-observability-and-alerting.md` | Menambahkan logging, metrics, dan alert minimum. | Membuat kegagalan production terdeteksi. |
| `docs/operations/06-incident-response.md` | Menambahkan severity dan incident procedure. | Menstandarkan respons gangguan. |
| `docs/operations/07-security-release-gate.md` | Menambahkan security gate sebelum release. | Mencegah release tanpa kontrol keamanan minimum. |
| `docs/operations/08-go-live-checklist.md` | Menambahkan checklist kesiapan launch. | Menjadi gate eksplisit sebelum go-live. |
| `docs/00-INDEX.md`, `docs/README.md`, `docs/PROJECT-CONTEXT.md` | Menambahkan jalur ke operations docs. | Memudahkan AI/developer menemukan panduan production. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat keputusan penambahan operations docs. | Menjaga audit trail perubahan. |

## Temuan #40 — schema alamat Mitra berbeda dari canonical address

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

Pada keputusan saat Temuan #40, field alamat Mitra sempat disamakan dengan
struktur `province`, `city`, `district`, `village`, dan `address_detail`.
Keputusan tersebut **kemudian digantikan** oleh koreksi pengguna pada Temuan
#44. Untuk aturan aktif, gunakan format alamat pada Temuan #44.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-database-schema.md` | Mengganti field alamat Mitra ke struktur canonical pada saat keputusan Temuan #40. | Keputusan ini kemudian digantikan oleh Temuan #44 berdasarkan koreksi format operasional pengguna. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat temuan dan keputusan. | Menjaga audit trail perubahan. |

## Temuan #43 — nama tabel collateral terlalu spesifik

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

Nama tabel dokumentatif `survey_motorcycles` diganti menjadi
`survey_collaterals`. Field dan validasi tetap sama; `collateral_type` tetap
menentukan field kondisional yang relevan.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-database-schema.md` | Mengganti nama tabel menjadi `survey_collaterals` dan purpose menjadi snapshot collateral. | Menyamakan nama persistence dengan business rule collateral generic. |
| `docs/architecture/17-data-dictionary.md` | Mengganti prefix field menjadi `survey_collaterals`. | Menjaga data dictionary dan schema konsisten. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat temuan dan keputusan rename. | Menjaga audit trail perubahan. |

### Dampak implementasi

Migration, relation, DTO, query, dan generated types harus menggunakan nama
`survey_collaterals`; tidak ada perubahan pada field atau aturan validasi.

## Temuan #44 — format alamat operasional perlu RT/RW dan wilayah terpisah

### Status

Selesai berdasarkan koreksi pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

Format alamat canonical untuk Customer, Mitra, Applicant, dan Penjamin adalah:

- `address` — alamat jalan/detail;
- `rt`;
- `rw`;
- `kel` — kelurahan;
- `kec` — kecamatan;
- `kota_kab` — kota/kabupaten.

Semua field disimpan terpisah dan dapat digunakan untuk filter. Contoh input
`Jl Kosasih RT005 RW008 Cikaret Bogor Selatan Kota Bogor` dipecah menjadi field
tersebut, bukan disimpan sebagai satu free-text saja. Label UI menggunakan
Bahasa Indonesia: Alamat, RT, RW, Kelurahan, Kecamatan, Kota/Kabupaten.

Keputusan Temuan #44 menggantikan format alamat yang dicatat pada Temuan #40;
Temuan #40 tetap dipertahankan sebagai riwayat keputusan sebelumnya.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/00-SOURCE-OF-TRUTH.md` | Mengganti struktur alamat canonical. | Menetapkan format bisnis yang sesuai kebutuhan filter lapangan. |
| `docs/business/04-proses-survey.md` | Menyamakan domicile Applicant/Penjamin. | Menjaga proses Survey mengikuti format alamat baru. |
| `docs/business/11-data-dan-relasi.md` | Menjelaskan fungsi `address` dan field wilayah/RT/RW. | Mencegah alamat disimpan sebagai free-text gabungan. |
| `docs/PROJECT-CONTEXT.md` | Memperbarui ringkasan alamat. | Memberi konteks yang benar untuk AI ringan. |
| `docs/architecture/17-data-dictionary.md` | Mengganti field alamat Customer, Mitra, Applicant, dan Penjamin. | Menyamakan field canonical lintas entity. |
| `docs/architecture/17-database-schema.md` | Mengganti field schema alamat seluruh entity terkait. | Menjadi blueprint persistence yang dapat difilter. |
| `docs/api/20-api-specification.md` | Mengganti request/validation/filter field alamat. | Menyamakan kontrak API dengan schema. |
| `docs/features/28-survey-file-upload-feature.md` | Memperbarui domicile Survey. | Menyamakan feature contract dengan business rule. |
| `docs/testing/31-invariant-test-matrix.md` | Memperjelas field wajib, preservation leading zero, dan filter administratif. | Memastikan field RT/RW/wilayah diuji sesuai kebutuhan operasional. |
| `docs/architecture/17-data-dictionary.md` | Menetapkan RT/RW sebagai string dan memisahkan filter administratif dari alamat jalan/detail. | Mencegah leading zero hilang dan mencegah parsing free-text. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat koreksi format alamat. | Menjaga audit trail perubahan. |

## Temuan #42 — indeks folder masih memakai rentang nomor lama

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

README root dan README docs menggunakan deskripsi domain folder aktual, bukan
rentang nomor yang dapat menjadi tidak akurat setelah konsolidasi.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `README.md` | Mengganti rentang nomor dengan fungsi folder aktual dan menambahkan operations/agent. | Mencegah AI mencari file yang sudah dihapus. |
| `docs/README.md` | Menyamakan indeks domain dengan struktur aktual. | Menjaga navigasi dokumentasi tetap akurat. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat temuan dan keputusan. | Menjaga audit trail perubahan. |

### Dampak implementasi

API, DTO, migration, dan filter/search Mitra harus menggunakan lima field alamat
canonical yang sama.

## Temuan #41 — data dictionary masih menyiratkan open decision aktif

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

Pembuka data dictionary diubah agar menjelaskan fungsi canonical document tanpa
menyiratkan bahwa terdapat open decision aktif. Mekanisme penandaan open
decision tetap dipertahankan untuk field baru yang memang belum diputuskan.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-data-dictionary.md` | Memperjelas status keputusan aktif dan aturan field baru. | Mencegah AI mengira schema saat ini belum final. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat temuan dan keputusan. | Menjaga audit trail perubahan. |

### Dampak implementasi

AI membaca lebih sedikit file untuk memahami fondasi backend, sementara frontend,
authentication, database, API, dan invariant tetap memiliki boundary yang jelas.

## Temuan #37 — konsolidasi Maintenance, Monitoring, dan Reporting

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- Maintenance, Monitoring, Dashboard, dan Reporting yang ringkas digabung
  menjadi satu dokumen domain operasional.
- Dokumen baru menjadi `docs/business/08-maintenance-monitoring-reporting.md`.
- Dokumen lama yang hanya berisi potongan isi dihapus setelah isinya
  dikonsolidasikan.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/08-maintenance-monitoring-reporting.md` | Menjadi dokumen gabungan Maintenance, Monitoring, Dashboard, dan Reporting. | Menyatukan domain operasional yang saling terkait. |
| `docs/business/08-proses-maintenance.md` | Dihapus setelah isinya dipindahkan. | Mengurangi fragmentasi. |
| `docs/business/09-proses-monitoring.md` | Dihapus setelah isinya dipindahkan. | Mengurangi fragmentasi. |
| `docs/business/10-proses-laporan.md` | Dihapus setelah isinya dipindahkan. | Mengurangi fragmentasi. |
| `docs/features/30-maintenance-monitoring-report.md` | Dihapus karena hanya mengulang ringkasan business. | Mencegah dua dokumen ringkas dengan isi sama. |
| `docs/00-INDEX.md` | Memperbarui peta domain operasional. | Menjaga reading path tetap jelas. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat keputusan konsolidasi. | Menjaga audit trail perubahan. |

## Temuan #12 — kontrak Idempotency-Key belum lengkap

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

API hanya menyatakan endpoint mutation yang wajib memakai `Idempotency-Key` dan perilaku payload berbeda, tetapi belum mengunci scope key, fingerprint payload, masa retensi, request in-flight, rollback, dan keamanan response replay.

### Keputusan dan rekomendasi yang disetujui

- Key opaque, tidak kosong, dan memiliki batas panjang dari config.
- Scope key adalah authenticated user + HTTP method + endpoint.
- Fingerprint payload dan hasil mutation disimpan selama retention yang dikonfigurasi.
- Key/payload sama me-replay hasil sebelumnya tanpa mutation kedua.
- Key sama dengan payload berbeda mendapat `409`.
- Request in-flight tidak menjalankan mutation kedua dan memiliki response terdokumentasi.
- Mutation rollback tidak membuat success replay.
- Replay tidak membocorkan secret atau data user lain.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menambahkan format, scope, retention, fingerprint, replay, in-flight, rollback, dan privacy rules. | Menjadikan Idempotency-Key kontrak API yang dapat diimplementasikan. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan idempotency boundary dan atomicity record terhadap transaction commit. | Mencegah duplikasi dan success replay palsu. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-036 dan skenario key/payload, in-flight, scope, rollback, dan replay. | Memastikan mutation aman terhadap retry. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #12, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Implementasi memerlukan storage idempotency yang memiliki unique scope key, payload fingerprint, status in-flight/success/failure, hasil response tersanitasi, dan retention yang dikonfigurasi. Penulisan success record harus terjadi dalam alur commit yang sama atau mekanisme atomic yang setara.

## Temuan #13 — katalog error API belum ditetapkan

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

API hanya mendefinisikan envelope `{success:false,error:{code,message}}`, tanpa katalog minimum HTTP status/code. Akibatnya client dapat bergantung pada pesan lokal dan error dari route berbeda dapat tidak konsisten.

### Keputusan dan rekomendasi yang disetujui

- `error.code` menjadi identifier stabil untuk client dan logging.
- `error.message` selalu Bahasa Indonesia dan tidak membocorkan secret/detail internal.
- Ditambahkan mapping minimum untuk validation, authentication, authorization, not-found, conflict, business rule, upload, rate limit, internal error, dan dependency failure.
- Client branching wajib memakai `error.code`, bukan teks message.
- Detail stack trace/query/credential hanya berada di logging terproteksi.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menambahkan error catalog HTTP status/code dan aturan message. | Menjadikan response contract konsisten. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan global error handler dan sanitasi detail internal. | Mencegah kebocoran dan mapping error yang berbeda-beda. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-037 dan test cases seluruh kategori error. | Memastikan status/code/message dapat diverifikasi. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #13, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

AppError perlu memiliki code/status yang terstruktur dan global handler harus menjadi satu-satunya boundary response error. Message dapat dilokalkan, tetapi code/status tetap stabil untuk client dan observability.

## Temuan #14 — kontrak CORS, rate limit, dan health belum cukup tegas

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Infrastructure document sudah mencantumkan whitelist CORS, rate-limit threshold, dan health dependency checks, tetapi belum menetapkan exact-match origin, trust boundary untuk IP/proxy header, atau HTTP status health saat dependency gagal.

### Keputusan dan rekomendasi yang disetujui

- CORS memakai exact-match origin per environment.
- Origin request tidak dipantulkan tanpa validasi.
- `credentials: true` hanya untuk origin whitelist.
- Rate limit authenticated memakai user/session; public/auth memakai IP sesuai trust policy.
- Forwarding header tidak dipercaya tanpa proxy tepercaya.
- Health `200` hanya saat dependency wajib sehat.
- Health `503` saat dependency wajib gagal, tanpa membocorkan detail internal.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/backend/26-shared-backend-infrastructure.md` | Menambahkan exact-match CORS, trust boundary rate limit, dan HTTP semantics health. | Mencegah origin reflection, spoofing, dan status health yang menyesatkan. |
| `docs/api/20-api-specification.md` | Menambahkan infrastructure contract untuk CORS, rate limit, dan health. | Menjadikan behavior infrastructure bagian dari API contract. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan boundary validasi CORS, rate-limit identity, dan health `503`. | Mengikat policy ke arsitektur backend. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-038 dan test cases infrastructure. | Memastikan trust/HTTP boundary dapat diverifikasi. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #14, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Environment configuration harus menyediakan origin whitelist dan trust proxy policy secara eksplisit. Health check deployment dan external uptime monitor harus memperlakukan HTTP `503` sebagai unhealthy.

## Temuan #15 — OpenAPI belum ditetapkan sebagai kontrak sinkronisasi

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Dokumen menyebut OpenAPI/Scalar dan generated types, tetapi belum menetapkan OpenAPI sebagai machine-readable contract yang wajib sinkron dengan route, auth, error, pagination, idempotency, health, dan test.

### Keputusan dan rekomendasi yang disetujui

- OpenAPI code-first menjadi kontrak machine-readable API.
- Setiap endpoint mendefinisikan method/path, auth, request, response, error, pagination, dan idempotency bila relevan.
- Generated client types berasal dari OpenAPI.
- Perubahan route/response wajib memperbarui OpenAPI dan API/invariant test bersama-sama.
- CI menolak endpoint atau behavior yang tidak sinkron dengan OpenAPI.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menetapkan OpenAPI contract dan aturan sinkronisasi route/generated types/test. | Mengurangi drift antara dokumentasi dan implementasi. |
| `docs/backend/22-backend-bootstrap-project-setup.md` | Menambahkan OpenAPI sebagai machine-readable contract yang divalidasi CI. | Memastikan bootstrap menyiapkan validation yang benar. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan perubahan route secara atomik dengan spec, types, dan test. | Mengikat kontrak ke arsitektur. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-039 dan test cases synchronization. | Memastikan drift API terdeteksi. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #15, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

CI membutuhkan validasi OpenAPI dan generated types yang tersedia di project. Pull request yang mengubah route atau response tanpa memperbarui contract dan test harus gagal sebelum merge.

## Temuan #16 — delete policy dan foreign-key behavior belum terkunci

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Dokumen memiliki larangan hard-delete untuk beberapa entity, tetapi belum memiliki matriks lintas entity yang menjelaskan delete/deactivate/anonymization, cascade yang aman, dan perilaku foreign key saat parent telah direferensikan.

### Keputusan dan rekomendasi yang disetujui

- Record business yang sudah direferensikan tidak boleh hard-delete.
- Mitra dideactivate dengan `active=false`.
- Customer dianonymisasi melalui prosedur privacy.
- Prospect menggunakan status `BATAL`, bukan delete.
- Contract, Installment, Decision, Survey SUBMITTED, history, dan audit log dipertahankan.
- Foreign key mencegah orphan.
- `ON DELETE CASCADE` tidak digunakan pada parent business yang memiliki history.
- Cascade hanya mungkin untuk draft/orphan aman yang telah didokumentasikan.
- Setiap delete/deactivate/anonymization/penolakan dicatat di audit log.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/18-delete-policy.md` | Menambahkan matriks delete/deactivate/anonymization dan FK behavior seluruh entity. | Menyatukan policy history dan referential integrity. |
| `docs/architecture/17-database-schema.md` | Merujuk schema ke delete policy. | Menjaga schema dan lifecycle policy sinkron. |
| `docs/backend/23-database-schema-implementation.md` | Menambahkan constraint implementasi delete/FK. | Mencegah implementasi cascade yang merusak history. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-040 dan test cases delete/FK. | Memastikan orphan dan history loss ditolak. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #16, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Migration harus meninjau setiap FK dan menghindari cascade destruktif. Service harus menolak operasi yang tidak sesuai policy sebelum database constraint, sementara setiap operasi lifecycle dicatat sebagai audit mutation.

## Temuan #17 — audit log belum memiliki kontrak immutable yang lengkap

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Schema hanya menyebut actor/session, entity, action, before/after atau metadata, dan timestamp secara umum. Belum ada field minimum request correlation, hasil sukses/gagal, idempotency correlation, immutability, dan minimisasi secret/PII.

### Keputusan dan rekomendasi yang disetujui

Audit log mutation penting wajib memiliki:

- actor type/id dan session context;
- `request_id`;
- entity type/id dan action;
- result `SUCCESS | FAILURE`;
- before/after atau metadata minimum;
- `idempotency_key` bila ada;
- timestamp UTC.

Audit log append-only/immutable. Secret dilarang; PII diminimalkan. Mutation gagal juga harus dapat ditelusuri dengan metadata aman.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/architecture/17-database-schema.md` | Menambahkan field minimum, enum result, constraint append-only, request ID, dan secret/PII policy. | Menjadikan audit log dapat ditelusuri dan aman. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan audit write untuk mutation penting dan correlation context. | Mengikat audit behavior ke Service/API boundary. |
| `docs/backend/26-shared-backend-infrastructure.md` | Menambahkan audit log ke structured logging policy. | Menyatukan observability dan audit safety. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-041 dan test cases success/failure, immutability, correlation, dan sanitization. | Memastikan audit trail tidak hilang atau membocorkan data. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #17, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Service mutation harus membentuk audit context dari session/request server, bukan payload client. Audit failure handling harus dirancang agar tidak menelan error utama dan tidak membuat response sukses palsu.

## Temuan #18 — observability dan request correlation belum end-to-end

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

Dokumen menyebut `X-Request-Id`, structured logging, dan audit log, tetapi belum menjelaskan normalisasi request ID, konsistensi correlation antar-layer, sanitasi log, atau context dependency/slow request.

### Keputusan dan rekomendasi yang disetujui

- Server menerima request ID hanya bila format valid; selain itu membuat ID baru.
- Satu request memakai ID yang sama pada response, structured log, audit log, dan dependency context.
- Log dan audit disanitasi dari credential, token, cookie, upload content, dan PII berlebih.
- Slow request/dependency failure dicatat dengan context aman.
- Observability tidak boleh membuat success-shaped fallback.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menambahkan response dan correlation policy `X-Request-Id`. | Menjadikan request tracing bagian dari API contract. |
| `docs/backend/26-shared-backend-infrastructure.md` | Menambahkan request correlation dan logging safety. | Mencegah log leakage dan correlation terputus. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan request context middleware end-to-end. | Mengikat correlation pada route/Service/dependency. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-042 dan test cases request ID/sanitization. | Memastikan tracing konsisten dan aman. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #18, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Request context harus dibuat sekali di middleware dan di-inject ke seluruh boundary. Sanitizer harus diuji dengan token/cookie/PII/upload payload, dan dependency failure harus tetap dipetakan melalui error catalog.

## Temuan #19 — retry policy belum operasional

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

AGENTS dan arsitektur menyebut retry otomatis hanya untuk GET/query aman, tetapi belum menetapkan timeout, backoff, max attempts, klasifikasi error, dan guard mutation agar retry tidak menggandakan efek.

### Keputusan dan rekomendasi yang disetujui

- Retry otomatis hanya untuk GET/query aman atau mutation yang secara eksplisit dilindungi Idempotency-Key.
- Retry memakai timeout, exponential backoff+jitter, dan max attempts terkonfigurasi.
- Hanya transient network/dependency error yang retryable.
- Validation, auth, authorization, conflict, business rule, upload type/size, dan permanent dependency error tidak retryable.
- Contract, Decision, payment, upload completion, dan audit mutation tidak boleh menghasilkan efek ganda.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menambahkan retryable/non-retryable classification dan mutation safety. | Menjadikan retry bagian dari API behavior. |
| `docs/architecture/15-arsitektur-teknis.md` | Menetapkan batas retry dan konfigurasi backoff/timeout. | Menjaga aturan lintas service. |
| `docs/backend/26-shared-backend-infrastructure.md` | Menambahkan retry storm, correlation, dan audit safety policy. | Mencegah loop dan duplicate observability. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-043 dan test cases retry/timeout. | Memastikan retry bounded dan tidak menggandakan mutation. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #19, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Retry helper wajib memiliki klasifikasi error dan max attempts. Mutation tanpa Idempotency-Key harus gagal atau diteruskan tanpa retry otomatis; mutation ber-idempotency harus mengandalkan replay/scope policy yang sudah dikunci.

## Temuan #20 — pagination dan query list belum memiliki batas aman

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Temuan awal

API hanya menyebut `page=1&pageSize=25` dan allowlist ukuran, tetapi belum menetapkan max eksplisit, validasi page, ordering deterministik, tie-breaker, allowlist filter/sort, dan kebijakan offset/cursor.

### Keputusan dan rekomendasi yang disetujui

- `page` integer >= 1.
- `pageSize` hanya `10|25|50`, max `50`.
- Ordering default deterministik dengan unique tie-breaker.
- Filter, sort field, dan direction memakai allowlist per endpoint.
- Tidak ada interpolasi field/operator/SQL mentah dari client.
- Offset pagination menjadi canonical sampai cursor diputuskan eksplisit.
- Response memuat `page`, `pageSize`, `total`, dan `totalPages`.
- Input invalid mendapat `400 VALIDATION_ERROR`.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/api/20-api-specification.md` | Menambahkan pagination/query rules, max, ordering, allowlist, dan response shape. | Menyatukan behavior list API dan mencegah query tak terkendali. |
| `docs/architecture/19-backend-architecture.md` | Menetapkan normalisasi sebelum query builder dan larangan raw SQL fragment. | Menjaga query safety di boundary Service/repository. |
| `docs/testing/31-invariant-test-matrix.md` | Menambahkan INV-044 dan test cases page/pageSize, allowlist, tie-breaker, dan injection safety. | Memastikan pagination aman dan deterministik. |
| `docs/audit/37-audit-resolution.md` | Menambahkan catatan temuan #20, keputusan, file, alasan, dan dampak. | Menjaga audit trail perubahan. |

### Dampak implementasi

Setiap endpoint list perlu mendefinisikan allowlist filter/sort sendiri. Schema harus menormalisasi input sebelum query dibangun dan test harus memverifikasi tidak ada nama kolom/operator mentah yang diteruskan ke database.

## Temuan #35 — konsolidasi dokumen business yang tumpang tindih

### Status

Selesai berdasarkan persetujuan pengguna pada 2026-09-13.

### Keputusan dan rekomendasi yang disetujui

- `docs/business/00-SOURCE-OF-TRUTH.md` menjadi satu-satunya sumber aturan
  business canonical.
- Dokumen business lain hanya boleh berisi detail proses, enum referensi, atau
  lifecycle/transisi yang membantu implementasi; tidak boleh menjadi sumber
  aturan alternatif.
- Dokumen `00-BUSINESS-MODEL-MASTER.md` yang isinya tumpang tindih dihapus.
- `12-business-rules-global.md` dipersempit menjadi enum dan aturan integrasi
  lintas-domain yang tidak mengulang seluruh business rule.
- `13-status-dan-transition.md` dipersempit menjadi referensi lifecycle dan
  transisi untuk implementasi/testing.

### File yang diubah

| File | Perubahan | Alasan |
|---|---|---|
| `docs/business/00-SOURCE-OF-TRUTH.md` | Menegaskan status sebagai satu-satunya canonical business source. | Menghilangkan hierarki business yang ambigu. |
| `docs/business/00-BUSINESS-MODEL-MASTER.md` | Dihapus karena duplikatif. | Mencegah AI membaca dua master business yang berbeda nama. |
| `docs/business/12-business-rules-global.md` | Menyisakan enum dan aturan integrasi lintas-domain. | Mengurangi pengulangan tanpa menghilangkan referensi implementasi. |
| `docs/business/13-status-dan-transition.md` | Menyisakan lifecycle dan transisi operasional. | Memisahkan visualisasi transition dari aturan canonical. |
| `docs/business/data-retention-privacy.md` | Referensi canonical diarahkan ke Source of Truth. | Menghindari ketergantungan pada dokumen global sekunder. |
| `docs/planning/32-implementation-order.md` | Referensi Business Model Master diarahkan ke Source of Truth dan invariant matrix. | Menghilangkan referensi ke dokumen yang sudah dihapus. |
| `docs/archive/audit/37-audit-resolution.md` | Mencatat keputusan konsolidasi. | Menjaga audit trail perubahan. |

### Dampak implementasi

AI dan developer membaca Source of Truth untuk arti business rule, lalu
menggunakan dokumen proses/status hanya sebagai detail implementasi. Perubahan
business rule berikutnya harus dimulai dari Source of Truth.
