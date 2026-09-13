# Observability and Alerting

## Logging

Structured log wajib memiliki environment, timestamp UTC, level,
`X-Request-Id`, route, status, latency, dan error code bila ada. Log tidak boleh
memuat secret, token, credential, upload content, atau PII yang tidak diperlukan.

## Metrics

Pantau minimal:

- request rate, error rate, dan latency;
- HTTP `401`, `403`, `409`, `429`, dan `5xx`;
- database latency/error;
- R2 upload, completion, dan deletion failure;
- migration/deployment result;
- Contract/installment transaction failure;
- queue atau dependency timeout jika ada.

## Alerts

Alert harus memiliki threshold, severity, owner, dan link ke runbook. Health
`503`, lonjakan `5xx`, kegagalan database/R2, dan upload deletion partial
failure harus dapat terlihat tanpa menunggu laporan manual.
