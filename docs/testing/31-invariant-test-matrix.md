# BUSINESS INVARIANT & TEST-CASE MATRIX

## Canonical invariants

| ID | Invariant |
|---|---|
| INV-001 | Customer != Prospect |
| INV-002 | Customer 1:N Prospect |
| INV-003 | Primary phone unique globally |
| INV-004 | source MITRA requires mitra_id |
| INV-005 | non-MITRA with supplied mitra_id is rejected |
| INV-006 | RO lookup only; history is reference |
| INV-007 | Proyeksi status is `BELUM_SURVEY | SURVEY | SUDAH_SURVEY | BATAL` |
| INV-008 | Follow Up result is not Proyeksi status |
| INV-009 | Proyeksi `SURVEY` appears in LKO Survey |
| INV-010 | Submitted Survey automatically changes Proyeksi `SURVEY → SUDAH_SURVEY` |
| INV-011 | Decision status is `PENDING | ACC | DITOLAK` |
| INV-012 | Decision does not change Proyeksi status |
| INV-013 | Decision must reference SUBMITTED Survey from same Prospect |
| INV-014 | ACC does not auto-create Contract |
| INV-015 | one ACC Decision max one Contract |
| INV-016 | Contract immutable |
| INV-017 | Contract status is `BELUM_LUNAS | LUNAS` and LUNAS requires all installments LUNAS |
| INV-018 | installment count = Contract tenor |
| INV-019 | BQ = installments 1-3 |
| INV-020 | payment monitoring != ledger/reconciliation |
| INV-021 | installment amount is scheduled obligation |
| INV-022 | due-date anchor 29/30/31 uses last day of target month when needed |
| INV-023 | payment status and days_late are derived |
| INV-024 | Mitra already used by Prospect cannot be hard-deleted |
| INV-025 | Proyeksi `BATAL` rejects new lifecycle activity |
| INV-026 | Proyeksi `SUDAH_SURVEY` may still receive Follow Up/Decision |
| INV-027 | Survey has no revision lifecycle |
| INV-028 | Contract number is official office number and unique |
| INV-029 | file upload rejects size >10 MB or unsupported MIME |
| INV-030 | A Prospect has at most one Survey DRAFT and one Survey SUBMITTED |
| INV-031 | All `/api/v1` endpoints require a valid session except `GET /health` |
| INV-032 | Privacy deletion is authenticated, audited, scoped, and preserves business history |
| INV-033 | Contract creation atomically creates exactly final tenor installments or creates nothing |
| INV-034 | File upload validates size/MIME before presign and again at completion; failed files are inactive |
| INV-035 | Date calculations use `Asia/Jakarta` business timezone and persist timestamps in UTC |
| INV-036 | Idempotent mutations do not duplicate effects and reject payload conflicts |
| INV-037 | API errors use stable codes, correct HTTP status, and Indonesian user-facing messages |
| INV-038 | CORS, rate limiting, and health status enforce their documented trust/HTTP boundaries |
| INV-039 | OpenAPI, route behavior, generated types, and API tests remain synchronized |
| INV-040 | Delete policy preserves referenced business history and prevents orphan records |
| INV-041 | Important mutations create immutable, traceable, minimized audit records |
| INV-042 | Request correlation is consistent and logs are sanitized |
| INV-043 | Retry policy does not duplicate mutation effects or retry permanent errors |
| INV-044 | List pagination and ordering are bounded, allowlisted, and deterministic |
| INV-045 | Prospect source uses the canonical order-source enum and Mitra consistency rule |
| INV-046 | Follow Up result uses the canonical enum and requires notes for LAINNYA |
| INV-047 | Monetary amounts use non-negative integer IDR without silent rounding |
| INV-048 | Proposed, approved, and final tenor use integer months in the range 1–60 |
| INV-049 | Customer has required structured identity/address and one globally unique primary phone |
| INV-050 | Survey Applicant has required identity, phone, and structured domicile; each Survey has exactly one required Guarantor |
| INV-051 | NIK/KTP is required and globally unique across Customer, Applicant, Guarantor, and Mitra |
| INV-052 | Survey and Contract preserve required conditional collateral snapshot; Contract snapshot is immutable |
| INV-053 | Decision fields are conditional: ACC requires approved amount/tenor/due date; PENDING/DITOLAK require them empty |
| INV-054 | Contract basis NORMAL/BANDING matches an ACC Decision; BANDING requires prior DITOLAK reason and allows at most one photo |
| INV-055 | Contract number is manually entered, trimmed, case-sensitive, 1–50 chars, and globally unique |
| INV-056 | Follow Up next_action and next_action_date are conditional and date-ordered in Asia/Jakarta |
| INV-057 | Deleted R2 binaries retain DELETED metadata, are inactive, and cannot be downloaded |

## Test cases

### Prospect

| Case | Expected |
|---|---|
| Create Proyeksi | Success |
| Set `BELUM_SURVEY` | Success |
| Follow Up result `MAU` + appointment | Proyeksi can be changed to `SURVEY` |
| Proyeksi `SURVEY` | Appears in LKO Survey |
| Survey SUBMITTED for `SURVEY` Proyeksi | Proyeksi automatically becomes `SUDAH_SURVEY` |
| Direct input of `SUDAH_SURVEY` for late/batch entry | Success |
| Proyeksi `SUDAH_SURVEY` + Follow Up | Allowed |
| Proyeksi `SUDAH_SURVEY` + Decision | Allowed |
| Proyeksi `BATAL` + new Follow Up | Reject |
| Proyeksi `BATAL` + new Survey | Reject |
| Proyeksi `BATAL` + new Decision | Reject |
| Proyeksi BATAL without reason | Reject |
| Re-apply after BATAL | Create new Proyeksi |
| Source `NEW`, `RO`, `WALKIN`, `BROSURING`, `SOSIAL_MEDIA`, or `PERSONAL` without `mitra_id` | Success |
| Source `MITRA` with valid `mitra_id` | Success |
| Source `MITRA` without `mitra_id` | Reject |
| Non-`MITRA` source with `mitra_id` | Reject |
| Unknown source value | Reject with `400 VALIDATION_ERROR` |
| Follow Up result `PIKIR_PIKIR`, `BELUM_MINAT`, `MAU`, or `TIDAK_BISA_DIHUBUNGI` | Success |
| Follow Up result `LAINNYA` with notes | Success |
| Follow Up result `LAINNYA` without notes | Reject |
| Unknown Follow Up result | Reject with `400 VALIDATION_ERROR` |
| Follow Up with next_action and next_action_date | Success |
| Follow Up with next_action but no next_action_date | Reject with `400 VALIDATION_ERROR` |
| Follow Up with next_action_date but no next_action | Reject with `400 VALIDATION_ERROR` |
| next_action_date earlier than follow_up_date | Reject with `400 VALIDATION_ERROR` |
| Customer without full_name or any required address field (`address`, `rt`, `rw`, `kel`, `kec`, `kota_kab`) | Reject with `400 VALIDATION_ERROR` |
| Customer without NIK/KTP | Reject with `400 VALIDATION_ERROR` |
| Customer address fields are stored separately and filterable | Success |
| Address `rt=005` and `rw=008` preserves leading zero as string values | Success |
| Address filter by each of `rt`, `rw`, `kel`, `kec`, and `kota_kab` | Success |
| Administrative address fields are placed into one free-text field only | Reject with `400 VALIDATION_ERROR` |
| Customer without exactly one primary phone | Reject with `400 VALIDATION_ERROR` |
| Duplicate primary phone across Customers | Reject with `409 CONFLICT` |
| Proposed/approved/final/installment amount is integer IDR >= 0 | Success |
| Monetary amount is negative | Reject with `400 VALIDATION_ERROR` |
| Monetary amount contains fraction | Reject with `400 VALIDATION_ERROR`; no silent rounding |
| Tenor is an integer from 1 to 60 months | Success |
| Tenor is zero, negative, greater than 60, or fractional | Reject with `400 VALIDATION_ERROR` |
| Survey Applicant lacks full_name, primary_phone, or any required domicile field (`address`, `rt`, `rw`, `kel`, `kec`, `kota_kab`) | Reject with `400 VALIDATION_ERROR` |
| Survey Applicant without NIK/KTP | Reject with `400 VALIDATION_ERROR` |
| Survey Applicant sends relation to another Customer | Reject with `400 VALIDATION_ERROR`; relation is not part of the model |
| Survey Applicant domicile is stored separately and filterable | Success |
| Survey Applicant KTP/identity number is absent | Reject with `400 VALIDATION_ERROR` |
| Survey without exactly one Guarantor | Reject with `400 VALIDATION_ERROR` |
| Guarantor lacks full_name, primary_phone, or any required domicile field (`address`, `rt`, `rw`, `kel`, `kec`, `kota_kab`) | Reject with `400 VALIDATION_ERROR` |
| Guarantor without NIK/KTP | Reject with `400 VALIDATION_ERROR` |
| Mitra without NIK/KTP | Reject with `400 VALIDATION_ERROR` |
| Mitra without any required address field (`address`, `rt`, `rw`, `kel`, `kec`, `kota_kab`) | Reject with `400 VALIDATION_ERROR` |
| Duplicate normalized NIK/KTP across Customer, Applicant, Guarantor, or Mitra | Reject with `409 CONFLICT` |
| Guarantor domicile is stored separately and filterable | Success |
| Guarantor KTP/identity number is absent | Reject with `400 VALIDATION_ERROR` |
| Survey collateral without collateral_type or estimated_value | Reject with `400 VALIDATION_ERROR` |
| Survey collateral with irrelevant optional fields empty | Success |
| Survey collateral missing a field required by its collateral_type | Reject with `400 VALIDATION_ERROR` |

### Decision

| Case | Expected |
|---|---|
| Decision PENDING | Success; Proyeksi status unchanged |
| Decision ACC | Success; Proyeksi status unchanged |
| Decision DITOLAK | Success; Proyeksi status unchanged |
| Decision ACC without approved amount, approved tenor, or final due date | Reject with `400 VALIDATION_ERROR` |
| Decision ACC with valid approved amount, tenor, and final due date | Success; Proyeksi status unchanged |
| Decision PENDING with approved amount, approved tenor, or final due date | Reject with `400 VALIDATION_ERROR` |
| Decision DITOLAK with approved amount, approved tenor, or final due date | Reject with `400 VALIDATION_ERROR` |
| NORMAL Decision with banding reference/reason/photo | Reject with `400 VALIDATION_ERROR` |
| BANDING Decision without prior DITOLAK reference | Reject with `400 VALIDATION_ERROR` |
| BANDING Decision without reason | Reject with `400 VALIDATION_ERROR` |
| BANDING Decision with one optional photo | Success |
| BANDING Decision with more than one photo | Reject with `400 VALIDATION_ERROR` |
| Decision references non-SUBMITTED Survey | Reject |
| Decision survey belongs to another Prospect | Reject |
| ACC approved amount lower than proposed | Still ACC |
| ACC + final amount/tenor | Contract can be created separately |
| ACC tenor is an integer from 1 to 60 months | Success |
| ACC tenor is outside 1–60 or fractional | Reject with `400 VALIDATION_ERROR` |

### Survey

| Case | Expected |
|---|---|
| Survey created from Proyeksi `SURVEY` | Success |
| Survey created from `BELUM_SURVEY` | Not available for LKO selection |
| Survey DRAFT | Proyeksi remains `SURVEY` |
| Survey SUBMITTED | Proyeksi becomes `SUDAH_SURVEY` |
| Second Survey DRAFT for same Proyeksi | Reject |
| Second Survey SUBMITTED for same Proyeksi | Reject |
| Update existing Survey DRAFT | Allowed |
| Edit SUBMITTED Survey | Reject |
| Survey revision endpoint | Not part of final API |

### Contract

| Case | Expected |
|---|---|
| Valid ACC + final data + office contract number | Contract can be created |
| Contract basis NORMAL matching NORMAL ACC Decision | Contract can be created |
| Contract basis BANDING matching BANDING ACC Decision | Contract can be created |
| Contract basis does not match ACC Decision type | Reject with `400 VALIDATION_ERROR` |
| Contract BANDING directly from DITOLAK Decision | Reject with `422 BUSINESS_RULE_VIOLATION` |
| Missing office contract number | Reject |
| Contract number with leading/trailing whitespace | Trim before persistence and validation |
| Contract number empty or longer than 50 characters | Reject with `400 VALIDATION_ERROR` |
| Contract numbers differing only by case | Allowed because comparison is case-sensitive |
| Duplicate contract number | Reject |
| Second Contract for same ACC Decision | Reject |
| Modify Contract after creation | Reject |
| Contract copies final collateral snapshot from Survey | Success |
| Modify Contract collateral snapshot after creation | Reject |
| Contract created | Status `BELUM_LUNAS` |
| Contract creation with tenor=12 | One Contract + exactly 12 installments committed |
| Contract creation with tenor outside 1–60 or fractional | Reject with `400 VALIDATION_ERROR`; no Contract or installment records |
| Failure while creating one installment | Entire Contract transaction rolled back; no partial records |
| Duplicate contract number during creation | Reject; no Contract or installment partial records |
| Duplicate Contract for same ACC Decision | Reject; no additional records |
| All installments LUNAS | Contract `LUNAS` |
| Any installment not LUNAS | Contract remains `BELUM_LUNAS` |

### Installment & payment

| Case | Expected |
|---|---|
| Contract tenor=12 | Create exactly 12 installments |
| Contract tenor=24 | Create exactly 24 installments |
| BQ completed 1–3 | Contract can remain BELUM_LUNAS |
| Before due date, no payment | BELUM_JATUH_TEMPO |
| Due date reached, no payment | JATUH_TEMPO |
| Past due, no payment | TERLAMBAT |
| payment_date <= due_date | LUNAS; days_late=0 |
| payment_date > due_date | LUNAS; days_late derived |
| Payment update | Monitoring only |

### Mitra

| Case | Expected |
|---|---|
| Mitra already used by Prospect + hard delete | Reject / endpoint unavailable |
| Mitra already used + active=false | Success |
| Mitra not used + deactivate | Success |

### Authentication

| Case | Expected |
|---|---|
| Anonymous request to business endpoint | Reject with `401` |
| Anonymous request to dashboard/report/search endpoint | Reject with `401` |
| Anonymous request to file upload/download endpoint | Reject with `401` |
| Request with invalid/expired session | Reject with `401` |
| Authenticated request with valid session | Route may continue to DTO and business validation |
| Anonymous `GET /health` | Allowed; returns dependency status only |

### Privacy & retention

| Case | Expected |
|---|---|
| Anonymous deletion request | Reject with `401` |
| Authenticated deletion request without verified target scope | Reject; no mutation |
| Customer deletion request | PII anonymized; Customer/Prospect/Survey/Contract/Installment rows retained |
| Survey Applicant PII deletion request | PII anonymized; Survey row retained |
| Approved R2 file deletion | Binary removed only after scope verification and audit entry |
| Approved R2 file deletion | Metadata changes to `DELETED`, remains auditable, and file is not active |
| Download request for `DELETED` file | Reject with `404 NOT_FOUND` |
| R2 deletion with partial failure | Request is not reported complete; failure is surfaced and audited |
| Attempt to delete Contract, Installment, or audit log | Reject; history preserved |

### File upload

| Case | Expected |
|---|---|
| File >10 MB at upload URL request | Reject; no active file |
| Unsupported MIME at upload URL request | Reject; no active file |
| Client claims valid MIME but stored object differs | Completion rejects or marks `FAILED`; file is not active |
| Completion succeeds after both validations | Metadata becomes `COMPLETED` and file is active |
| Completion fails after pending metadata | Metadata becomes `FAILED` with auditable reason |
| Upload/network/API error shown to user | Message is in Bahasa Indonesia |

### Timezone & date handling

| Case | Expected |
|---|---|
| Timestamp persistence | Stored as UTC |
| Operational date input | Converted using configured business timezone |
| Due date anchor 29/30/31 across month boundary | Uses business-calendar timezone and last day rule |
| Browser/runtime timezone differs from business timezone | Business result remains unchanged |
| `BUSINESS_TIMEZONE` missing or not `Asia/Jakarta` | Fail-fast; date workflow does not start |

### Idempotency

| Case | Expected |
|---|---|
| Same key and same payload after successful mutation | Returns prior result; no second mutation |
| Same key and different payload | Reject with `409` |
| Same key while first mutation is in-flight | Does not execute a second mutation; returns documented in-flight response |
| First mutation rolls back | No success replay is stored |
| Same key from different authenticated users | Scoped independently |
| Same key on different endpoint/method | Scoped independently |
| Replay response | Does not expose another user's data or secret |

### API error contract

| Case | Expected |
|---|---|
| Invalid request shape | `400 VALIDATION_ERROR`; message Bahasa Indonesia |
| Missing/expired session | `401 UNAUTHENTICATED` |
| Valid session without permission | `403 FORBIDDEN` |
| Resource unavailable in actor scope | `404 NOT_FOUND` |
| Duplicate/business conflict | `409 CONFLICT` |
| Business invariant violation | `422 BUSINESS_RULE_VIOLATION` |
| File too large | `413 FILE_TOO_LARGE` |
| Unsupported MIME | `415 UNSUPPORTED_FILE_TYPE` |
| Rate limit exceeded | `429 RATE_LIMITED` with `Retry-After` |
| Internal error | `500 INTERNAL_ERROR`; no stack/secret exposed |
| Database/R2/provider unavailable | `503 DEPENDENCY_UNAVAILABLE` |
| Client branching | Uses `error.code`, not localized `message` |

### Infrastructure

| Case | Expected |
|---|---|
| Whitelisted origin in configured environment | CORS allowed |
| Non-whitelisted origin | CORS rejected; origin is not reflected |
| `credentials: true` with non-whitelisted origin | Reject; credentials are not enabled |
| Authenticated rate limit | Keyed by authenticated user/session |
| Public/auth rate limit | Keyed by trusted connection IP policy |
| Spoofed forwarding header without trusted proxy | Not used as sole rate-limit identity |
| All health dependencies healthy | `GET /health` returns `200` and `status=ok` |
| Required dependency fails | `GET /health` returns `503` and `status=degraded`; no secret/internal detail |

### OpenAPI synchronization

| Case | Expected |
|---|---|
| New endpoint added | OpenAPI path/schema/auth/error definition and API test added together |
| Endpoint request/response changed | OpenAPI, generated types, implementation, and tests updated together |
| Endpoint omitted from OpenAPI | CI rejects the change |
| Auth requirement differs from OpenAPI | CI/API test rejects the change |
| Error status/code differs from OpenAPI | CI/API test rejects the change |
| Pagination or Idempotency-Key behavior differs from OpenAPI | CI/API test rejects the change |

### Delete, deactivate & foreign keys

| Case | Expected |
|---|---|
| Delete Mitra referenced by Prospect | Reject; Mitra remains, `active` may be set false |
| Delete Customer with business history | Reject; anonymization procedure is used |
| Delete Prospect with Follow Up/Survey/Decision history | Reject; use `BATAL` where applicable |
| Delete submitted Survey/Decision/Contract/Installment | Reject; history immutable |
| Delete unreferenced draft child where explicitly allowed | Only documented cascade/policy may apply |
| Delete parent with referenced child | Reject; no orphan and no history cascade |
| Privacy anonymization | PII changes are audited; relational history remains |
| Delete or mutate audit log | Reject |

### Audit log

| Case | Expected |
|---|---|
| Important mutation succeeds | Append audit record with actor, request ID, entity, action, result `SUCCESS` |
| Important mutation fails | Append auditable failure with safe metadata |
| Mutation with Idempotency-Key | Audit record correlates the key without exposing secret |
| Attempt to update/delete audit log | Reject |
| Audit record without API request ID | Reject for API mutation |
| Secret/over-broad PII in audit payload | Reject or sanitize before persistence |

### Observability & correlation

| Case | Expected |
|---|---|
| Valid `X-Request-Id` supplied | Same ID returned and used in log/audit/dependency context |
| Missing `X-Request-Id` | Server generates ID and returns it |
| Invalid `X-Request-Id` | Server replaces it with safe generated ID |
| Dependency failure | Logs safe dependency/error/timing context; response uses documented error |
| Slow request | Duration logged without sensitive full payload |
| Secret/token/cookie in request | Not present in structured log or audit log |
| Excess PII in log context | Sanitized before persistence |

### Retry & timeout

| Case | Expected |
|---|---|
| Transient GET/dependency failure | Retries with bounded exponential backoff+jitter |
| Validation/auth/business conflict error | No automatic retry |
| Mutation without Idempotency-Key | No automatic retry |
| Idempotent mutation with transient failure | Retry only under endpoint policy; no duplicate effect |
| Contract retry | At most one Contract and exact installment set |
| Decision/payment/upload completion retry | No duplicate history/payment/file completion |
| Audit event after retry | No duplicate success audit for one committed effect |
| Max attempts reached | Returns documented dependency error; no infinite loop |

### Pagination, filter & sort

| Case | Expected |
|---|---|
| `page=0` or non-integer page | Reject with `400 VALIDATION_ERROR` |
| `pageSize` outside `10|25|50` or above max | Reject with `400 VALIDATION_ERROR` |
| Unsupported sort field/direction | Reject with `400 VALIDATION_ERROR` |
| Unsupported filter field/operator | Reject with `400 VALIDATION_ERROR` |
| Equal primary ordering values | Unique tie-breaker produces stable order |
| Client sends raw SQL/column fragment | Never interpolated; request rejected or ignored by allowlist |
| Valid list request | Returns documented page/pageSize/total/totalPages |

## Test execution

Setiap invariant memiliki minimal satu unit/service test. Invariant database/API transition memiliki integration/API test. Critical lifecycle cases masuk regression suite.
