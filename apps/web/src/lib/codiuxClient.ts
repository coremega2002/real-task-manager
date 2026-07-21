/** Vendored @codiux/client — talks to same-origin /api (Codiux hosted backend). */

export type CodiuxClientOptions = {
  url?: string;
  anonKey?: string;
  credentials?: RequestCredentials;
};

function env(key: string): string | undefined {
  const v = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[key];
  return v?.trim() || undefined;
}

function resolveApiBase(options: CodiuxClientOptions): string {
  const fromOpt = options.url?.trim();
  if (fromOpt) return fromOpt.replace(/\/$/, '');
  const viteUrl = env('VITE_CODIUX_URL') || env('VITE_API_BASE_URL') || env('VITE_API_PREFIX');
  if (viteUrl) return viteUrl.replace(/\/$/, '');
  const cfg = (window as unknown as { __CODIUX_API_CONFIG__?: { apiPrefix?: string } })
    .__CODIUX_API_CONFIG__;
  return (cfg?.apiPrefix ?? '/api').replace(/\/$/, '') || '/api';
}

export function createCodiuxClient(options: CodiuxClientOptions = {}) {
  const base = resolveApiBase(options);
  const anonKey = options.anonKey?.trim() || env('VITE_CODIUX_ANON_KEY');
  const creds = options.credentials ?? 'include';

  async function request<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
    const headers = new Headers(init?.headers);
    if (anonKey) headers.set('X-Codiux-Anon-Key', anonKey);
    let body = init?.body;
    if (init?.json !== undefined) {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(init.json);
    }
    const res = await fetch(`${base}${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      headers,
      body,
      credentials: creds,
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const err =
        typeof data === 'object' && data && 'error' in data
          ? String((data as { error: string }).error)
          : `HTTP ${res.status}`;
      throw new Error(err);
    }
    return data as T;
  }

  function from(table: string) {
    const tableName = table.replace(/[^a-zA-Z0-9_]/g, '');
    return {
      select: async (columns = '*') => {
        const result = await request<{ rows?: Record<string, unknown>[] }>(
          `/db/${encodeURIComponent(tableName)}?select=${encodeURIComponent(columns)}`
        );
        return { data: result.rows ?? [] };
      },
      insert: async (row: Record<string, unknown>) =>
        request<{ row?: Record<string, unknown> }>(`/db/${encodeURIComponent(tableName)}`, {
          method: 'POST',
          json: { row },
        }),
      update: async (row: Record<string, unknown>, match: Record<string, unknown>) =>
        request(`/db/${encodeURIComponent(tableName)}`, { method: 'PATCH', json: { row, match } }),
      delete: async (match: Record<string, unknown>) =>
        request(`/db/${encodeURIComponent(tableName)}`, { method: 'DELETE', json: { match } }),
    };
  }

  return {
    apiBase: base,
    health: () => request<{ ok?: boolean }>('/health'),
    auth: {
      signInWithPassword: (body: { email: string; password: string }) =>
        request('/auth/sign-in', { method: 'POST', json: body }),
      signUp: (body: { email: string; password: string }) =>
        request('/auth/sign-up', { method: 'POST', json: body }),
      me: () => request<{ user?: { id: string; email?: string } | null }>('/auth/me'),
      logout: () => request('/auth/logout', { method: 'POST' }),
    },
    db: { from },
    storage: {
      upload: async (path: string, file: Blob | File, opts?: { bucket?: string }) => {
        const form = new FormData();
        form.append('file', file);
        form.append('path', path);
        if (opts?.bucket) form.append('bucket', opts.bucket);
        return request<{ ok: boolean; path?: string }>('/storage/upload', { method: 'POST', body: form });
      },
      list: (bucket: string, prefix?: string) =>
        request<{ objects?: Array<{ name: string }> }>(
          `/storage/list?bucket=${encodeURIComponent(bucket)}${prefix ? `&prefix=${encodeURIComponent(prefix)}` : ''}`
        ),
    },
  };
}

export const codiux = createCodiuxClient();
