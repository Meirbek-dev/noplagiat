# ADR-018: Five academic years as the default period

Status: accepted.

The default dashboard period is `5y`, covering the current academic year and
the preceding four academic years. This supersedes the `year` default in
ADR-012; preset boundaries and explicitly selected periods are unchanged.

Public, internal, and embedded dashboards share this default. Reset controls
and incomplete custom-range fallbacks restore it. API requests and exports
without period filters resolve to the same five-year period.

No dependencies or schema changes are required.
