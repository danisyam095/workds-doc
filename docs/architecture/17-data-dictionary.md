# DATA DICTIONARY & OPEN DECISIONS

Dokumen ini melengkapi schema canonical dan menjadi referensi field, tipe,
requiredness, nullable, enum, serta validasi minimum. Jika field baru belum
memiliki keputusan bisnis eksplisit, tandai sebagai open decision secara
eksplisit dan jangan menebak aturannya saat implementasi.

## Canonical enums

| Field | Nilai | Aturan |
|---|---|---|
| `prospects.status` | `BELUM_SURVEY`, `SURVEY`, `SUDAH_SURVEY`, `BATAL` | `BATAL` wajib memiliki `cancel_reason`. |
| `surveys.status` | `DRAFT`, `SUBMITTED` | `SUBMITTED` immutable. Satu Proyeksi maksimal memiliki satu DRAFT dan satu SUBMITTED. |
| `decisions.decision_status` | `PENDING`, `ACC`, `DITOLAK` | Tidak mengubah status Proyeksi. |
| `decisions.decision_type` | `NORMAL`, `BANDING` | Decision append-only/history. |
| `contracts.status` | `BELUM_LUNAS`, `LUNAS` | Derived dari seluruh installment. |
| `files.status` | `PENDING`, `COMPLETED`, `FAILED`, `DELETED` | `DELETED` mempertahankan metadata audit tetapi bukan file aktif dan tidak dapat diunduh. |
| `files.entity_type` | `MITRA`, `PROSPECT`, `FOLLOW_UP`, `SURVEY`, `CONTRACT`, `INSTALLMENT`, `MAINTENANCE`, `MONITORING` | Hanya entity yang terdaftar yang boleh direferensikan. |
| `files.file_type` | `KTP`, `KK`, `STNK`, `BPKB`, `FOTO_RUMAH`, `FOTO_PENGHASILAN`, `FOTO_KENDARAAN`, `FOTO_FOLLOW_UP`, `FOTO_MAINTENANCE`, `FOTO_MONITORING`, `BUKTI_PEMBAYARAN`, `BUKTI_BANDING`, `LAINNYA` | MIME dan ukuran mengikuti upload constraint. |

## Field dengan aturan yang sudah diketahui

| Field | Tipe/format minimum | Wajib/nullable | Validasi |
|---|---|---|---|
| `customers.full_name` | non-empty string | wajib | Nama Customer tidak boleh kosong. |
| `customers.nik_normalized` | normalized NIK/KTP string | wajib | Identitas unik global lintas Customer, Applicant, Penjamin, dan Mitra. |
| `customers.address` | non-empty string | wajib | Alamat jalan/detail, dapat difilter sebagai komponen alamat. |
| `customers.rt` | non-empty string | wajib | RT, disimpan terpisah dan dapat difilter; leading zero seperti `005` harus dipertahankan. |
| `customers.rw` | non-empty string | wajib | RW, disimpan terpisah dan dapat difilter; leading zero seperti `008` harus dipertahankan. |
| `customers.kel` | non-empty string | wajib | Kelurahan, disimpan terpisah dan dapat difilter. |
| `customers.kec` | non-empty string | wajib | Kecamatan, disimpan terpisah dan dapat difilter. |
| `customers.kota_kab` | non-empty string | wajib | Kota/Kabupaten, disimpan terpisah dan dapat difilter. |
| `customer_phones.phone_normalized` | normalized phone string | wajib | Tepat satu primary phone per Customer; primary phone unique global. |
| `survey_applicants.full_name` | non-empty string | wajib | Nama applicant tidak boleh kosong. |
| `survey_applicants.nik_normalized` | normalized NIK/KTP string | wajib | Identitas unik global lintas Customer, Applicant, Penjamin, dan Mitra. |
| `survey_applicants.primary_phone_normalized` | normalized phone string | wajib | Nomor utama applicant wajib tersedia dan dinormalisasi. |
| `survey_applicants.address` | non-empty string | wajib | Alamat domicile/detail, disimpan terpisah dan dapat difilter. |
| `survey_applicants.rt` | non-empty string | wajib | RT domicile, disimpan terpisah dan dapat difilter. |
| `survey_applicants.rw` | non-empty string | wajib | RW domicile, disimpan terpisah dan dapat difilter. |
| `survey_applicants.kel` | non-empty string | wajib | Kelurahan domicile, disimpan terpisah dan dapat difilter. |
| `survey_applicants.kec` | non-empty string | wajib | Kecamatan domicile, disimpan terpisah dan dapat difilter. |
| `survey_applicants.kota_kab` | non-empty string | wajib | Kota/Kabupaten domicile, disimpan terpisah dan dapat difilter. |
| `survey_guarantors.full_name` | non-empty string | wajib | Tepat satu Penjamin wajib ada pada setiap Survey. |
| `survey_guarantors.nik_normalized` | normalized NIK/KTP string | wajib | Identitas unik global lintas Customer, Applicant, Penjamin, dan Mitra. |
| `survey_guarantors.primary_phone_normalized` | normalized phone string | wajib | Nomor utama Penjamin wajib tersedia dan dinormalisasi. |
| `survey_guarantors.address` | non-empty string | wajib | Alamat Penjamin/detail, disimpan terpisah dan dapat difilter. |
| `survey_guarantors.rt` | non-empty string | wajib | RT Penjamin, disimpan terpisah dan dapat difilter. |
| `survey_guarantors.rw` | non-empty string | wajib | RW Penjamin, disimpan terpisah dan dapat difilter. |
| `survey_guarantors.kel` | non-empty string | wajib | Kelurahan Penjamin, disimpan terpisah dan dapat difilter. |
| `survey_guarantors.kec` | non-empty string | wajib | Kecamatan Penjamin, disimpan terpisah dan dapat difilter. |
| `survey_guarantors.kota_kab` | non-empty string | wajib | Kota/Kabupaten Penjamin, disimpan terpisah dan dapat difilter. |
| `survey_collaterals.collateral_type` | non-empty string | wajib | Jenis collateral; menentukan field collateral kondisional. |
| `survey_collaterals.brand` | non-empty string | conditional | Wajib bila relevan dengan `collateral_type`. |
| `survey_collaterals.model` | non-empty string | conditional | Wajib bila relevan dengan `collateral_type`. |
| `survey_collaterals.manufacture_year` | positive integer | conditional | Wajib bila relevan dengan `collateral_type`; tahun valid. |
| `survey_collaterals.registration_number` | non-empty string | conditional | Wajib bila collateral memiliki nomor registrasi. |
| `survey_collaterals.estimated_value` | non-negative integer IDR | wajib | Estimasi nilai collateral tanpa pecahan. |
| `contracts.collateral_type` | non-empty string | wajib | Salinan final collateral dari Survey. |
| `contracts.collateral_snapshot` | immutable structured snapshot | wajib | Menyimpan field collateral final sesuai jenisnya. |
| `prospects.source` | `NEW`, `RO`, `MITRA`, `WALKIN`, `BROSURING`, `SOSIAL_MEDIA`, `PERSONAL` | wajib | `MITRA` wajib memiliki `mitra_id`; source selain `MITRA` wajib `mitra_id IS NULL`. |
| `prospects.mitra_id` | ULID | nullable | Hanya boleh terisi saat `source=MITRA`. |
| `prospects.ro_reference_number` | string | nullable | Lookup-only; tidak menyalin data otomatis. |
| `prospects.cancel_reason` | non-empty string | nullable | Wajib saat status `BATAL`. |
| `mitras.nik_normalized` | normalized NIK/KTP string | wajib | Identitas unik global lintas Customer, Applicant, Penjamin, dan Mitra. |
| `mitras.address` | non-empty string | wajib | Alamat jalan/detail, dapat difilter sebagai komponen alamat. |
| `mitras.rt` | non-empty string | wajib | RT, disimpan terpisah dan dapat difilter. |
| `mitras.rw` | non-empty string | wajib | RW, disimpan terpisah dan dapat difilter. |
| `mitras.kel` | non-empty string | wajib | Kelurahan, disimpan terpisah dan dapat difilter. |
| `mitras.kec` | non-empty string | wajib | Kecamatan, disimpan terpisah dan dapat difilter. |
| `mitras.kota_kab` | non-empty string | wajib | Kota/Kabupaten, disimpan terpisah dan dapat difilter. |
| `follow_ups.follow_up_date` | UTC date/time | wajib | Tidak boleh kehilangan history; calendar input memakai `Asia/Jakarta`. |
| `follow_ups.result` | `PIKIR_PIKIR`, `BELUM_MINAT`, `MAU`, `TIDAK_BISA_DIHUBUNGI`, `LAINNYA` | wajib | `LAINNYA` wajib memiliki `notes`. |
| `follow_ups.next_action` | non-empty string | conditional | Jika diisi, `next_action_date` wajib diisi. |
| `follow_ups.next_action_date` | UTC date/time | conditional | Wajib bila `next_action` diisi, harus kosong bila `next_action` kosong, dan tidak boleh lebih awal dari `follow_up_date`. |

Aturan alamat berlaku konsisten untuk Customer, Mitra, Applicant, dan Penjamin:
`rt` dan `rw` adalah string, bukan integer, agar nilai dengan leading zero tetap
terjaga. Filter administratif harus dapat dilakukan secara terpisah pada
`rt`, `rw`, `kel`, `kec`, dan `kota_kab`; `address` hanya menyimpan alamat
jalan/detail dan tidak menjadi pengganti field administratif.
| `survey_loans.proposed_amount` | non-negative integer IDR | wajib | Nilai dalam rupiah tanpa pecahan; nilai negatif atau pecahan ditolak. |
| `survey_loans.proposed_tenor` | integer bulan | wajib | Bilangan bulat dalam rentang 1–60 bulan. |
| `decisions.approved_amount` | non-negative integer IDR | conditional | Wajib saat `decision_status=ACC`; harus kosong saat `PENDING` atau `DITOLAK`. |
| `decisions.approved_tenor` | integer bulan | conditional | Wajib saat `decision_status=ACC`; bilangan bulat 1–60 bulan dan harus kosong saat `PENDING` atau `DITOLAK`. |
| `decisions.final_due_date` | UTC date | conditional | Wajib saat `decision_status=ACC`; harus kosong saat `PENDING` atau `DITOLAK`. |
| `decisions.based_on_decision_id` | ULID | conditional | Wajib untuk `decision_type=BANDING`; harus menunjuk Decision `DITOLAK` pada Prospect yang sama. |
| `decisions.banding_reason` | non-empty string | conditional | Wajib untuk `decision_type=BANDING`; menjelaskan alasan pengajuan banding. |
| `decisions.banding_photo_file_id` | ULID | nullable | Maksimal satu foto bukti untuk Decision banding; boleh kosong. |
| `contracts.contract_number` | trimmed case-sensitive string, 1–50 chars | wajib | Nomor resmi kantor, diinput manual, tidak diubah sistem, dan unique global. |
| `contracts.contract_basis` | `NORMAL`, `BANDING` | wajib | Pilihan saat membuat Contract dan harus sama dengan `decision_type` Decision ACC yang dirujuk. |
| `contracts.final_amount` | non-negative integer IDR | wajib | Nilai dalam rupiah tanpa pecahan; nilai negatif atau pecahan ditolak. |
| `contracts.final_tenor` | integer bulan | wajib | Bilangan bulat dalam rentang 1–60 bulan; jumlah installment harus sama dengan tenor. |
| `installments.amount` | non-negative integer IDR | wajib | Scheduled obligation, bukan partial-payment ledger; nilai negatif atau pecahan ditolak. |
| `audit_logs` mutation record | structured actor/entity/action context | wajib | Tidak boleh dihapus melalui prosedur privacy/retention. |

## Date and time policy

- Timestamp disimpan dalam UTC.
- Timezone bisnis untuk input, tampilan, tanggal operasional, dan perhitungan due date adalah `Asia/Jakarta`.
- Konversi timezone dilakukan di boundary; Service menghitung aturan kalender menggunakan timezone bisnis, bukan timezone mesin/worker.
- Nilai timezone bisnis tidak boleh ditebak dari lokasi browser atau runtime.

Implementasi wajib menggunakan placeholder type/validation yang jelas atau menghentikan bagian terkait sampai keputusan tersedia; jangan membuat enum atau field wajib baru berdasarkan asumsi.
