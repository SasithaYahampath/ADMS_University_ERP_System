const BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:5050/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token is stored in memory — set by AuthContext on login/refresh
let _accessToken: string | null = null;
let _refreshHandler: (() => Promise<string | null>) | null = null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function setRefreshHandler(fn: () => Promise<string | null>) {
  _refreshHandler = fn;
}

function authHeader(): Record<string, string> {
  return _accessToken ? { Authorization: `Bearer ${_accessToken}` } : {};
}

export function qs(params: Record<string, string | number | null | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined && v !== '') p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

async function rawFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    credentials: 'include', // send HttpOnly refresh cookie automatically
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(init.headers as Record<string, string> ?? {}),
    },
    ...init,
  });
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res = await rawFetch(path, init);

  // Auto-refresh on 401, then retry once
  if (res.status === 401 && _refreshHandler && path !== '/auth/refresh') {
    let newToken: string | null = null;

    if (_isRefreshing) {
      // Queue this request until the in-flight refresh resolves
      newToken = await new Promise<string | null>(resolve => {
        _refreshQueue.push(resolve);
      });
    } else {
      _isRefreshing = true;
      try {
        newToken = await _refreshHandler();
        _refreshQueue.forEach(resolve => resolve(newToken));
      } catch {
        _refreshQueue.forEach(resolve => resolve(null));
      } finally {
        _isRefreshing = false;
        _refreshQueue = [];
      }
    }

    if (newToken) {
      res = await rawFetch(path, init); // retry with new token already set via setAccessToken
    } else {
      throw new ApiError(401, 'Session expired. Please log in again.');
    }
  }

  const json = await res.json().catch(() => ({ message: res.statusText }));
  if (!res.ok) throw new ApiError(res.status, json?.message ?? `HTTP ${res.status}`);
  return json as T;
}
