# AUTHENTICATION BETTER AUTH

Better Auth hanya untuk User/session/account/verification. User bukan Customer, Mitra, atau business Agent. Backend tetap memvalidasi session. Frontend memakai Better Auth client + route guard. Audit actor dapat berupa USER atau SYSTEM.

Semua endpoint `/api/v1` wajib melalui session guard, kecuali `GET /health`. Request tanpa session valid menghasilkan HTTP `401` dengan error envelope standar. Guard diterapkan di route boundary sebelum handler feature; Service tetap memvalidasi actor/session context untuk mutation dan tidak menerima identitas actor dari payload.

Endpoint file upload URL, file completion, file metadata/URL, dashboard, reports, search, dan seluruh endpoint data bisnis tidak boleh anonymous.
