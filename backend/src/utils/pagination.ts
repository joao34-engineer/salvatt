// src/utils/pagination.ts
// Utility to parse and clamp pagination parameters.

export function parseNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function getPagination(query: Record<string, unknown>) {
  const page = Math.max(1, parseNumber(query.page, 1));
  const limit = Math.min(100, Math.max(1, parseNumber(query.limit, 10)));
  const skip = (page - 1) * limit;
  const take = limit;
  return { page, limit, skip, take };
}
