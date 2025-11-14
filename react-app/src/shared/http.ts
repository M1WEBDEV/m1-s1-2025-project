const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_API = "http://localhost:3000";

const ensureApiUrl = () => {
  const url = API_URL ?? DEFAULT_API;
  if (!API_URL) {
    
    console.warn(
      `VITE_API_URL not set — defaulting to ${DEFAULT_API}. Set VITE_API_URL to change this.`,
    );
  }
  return String(url).replace(/\/$/, "");
};

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions<TBody> extends RequestInit {
  body?: TBody;
}

async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { body, headers, ...rest } = options;

  const baseUrl = ensureApiUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    ...rest,
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const errorPayload = isJson ? await response.json().catch(() => null) : null;
    const message =
      errorPayload?.message ??
      errorPayload?.error ??
      `${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (!isJson) {
    return (await response.text()) as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const http = {
  get: <TResponse>(path: string, options?: RequestOptions<undefined>) =>
    request<TResponse>("GET", path, options),
  post: <TResponse, TBody = unknown>(path: string, body?: TBody) =>
    request<TResponse, TBody>("POST", path, { body }),
  patch: <TResponse, TBody = unknown>(path: string, body?: TBody) =>
    request<TResponse, TBody>("PATCH", path, { body }),
  delete: <TResponse>(path: string) => request<TResponse>("DELETE", path),
  upload: async (path: string, file: File) => {
    const baseUrl = ensureApiUrl();
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    const fd = new FormData();
    fd.append('file', file, file.name);
    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(text ?? `${res.status} ${res.statusText}`);
    }
    const payload = await res.json().catch(() => null);
    if (payload && typeof payload.url === 'string') {
      return { url: payload.url.startsWith('/') ? `${baseUrl}${payload.url}` : payload.url };
    }
    return payload;
  },
};


