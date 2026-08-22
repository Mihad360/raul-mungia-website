/**
 * Normalize paginated API payloads.
 * Backend sometimes returns `data: T[]` and sometimes `data: { result: T[], meta }`.
 */
export function normalizeListResponse<T = unknown>(response: unknown): {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
} {
  const body = response as {
    data?: unknown;
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPage?: number;
    };
  };

  const raw = body?.data;
  let list: T[] = [];
  let nestedMeta: typeof body.meta | undefined;

  if (Array.isArray(raw)) {
    list = raw as T[];
  } else if (raw && typeof raw === "object") {
    const obj = raw as {
      result?: unknown;
      data?: unknown;
      meta?: typeof body.meta;
    };
    if (Array.isArray(obj.result)) {
      list = obj.result as T[];
      nestedMeta = obj.meta;
    } else if (Array.isArray(obj.data)) {
      list = obj.data as T[];
      nestedMeta = obj.meta;
    }
  }

  const meta = nestedMeta || body?.meta;

  return {
    data: list,
    meta: {
      page: meta?.page ?? 1,
      limit: meta?.limit ?? list.length,
      total: meta?.total ?? list.length,
      totalPage: meta?.totalPage ?? 1,
    },
  };
}
