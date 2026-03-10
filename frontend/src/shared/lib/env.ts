function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

const rawApiUrl = import.meta.env?.VITE_API_URL ?? 'http://localhost:4000/api'

export const env = {
  apiUrl: trimTrailingSlash(rawApiUrl),
}
