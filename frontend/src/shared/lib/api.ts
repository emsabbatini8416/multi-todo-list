import { env } from './env'

type ApiRequestOptions = RequestInit & {
  body?: never
}

type ApiBody = BodyInit | Record<string, unknown> | null | undefined

export async function apiFetch<T>(
  path: string,
  options: Omit<ApiRequestOptions, 'body'> & { body?: ApiBody } = {},
): Promise<T> {
  const { body, headers, ...rest } = options
  const isJsonBody =
    body !== null && body !== undefined && !(body instanceof FormData)

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(body) : body,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
