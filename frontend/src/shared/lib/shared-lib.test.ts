jest.mock('./env', () => ({
  env: {
    apiUrl: 'http://localhost:4000/api',
  },
}))

import { apiFetch } from './api'
import { cn } from './cn'
import { env } from './env'
import { queryClient } from './queryClient'

describe('shared lib', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    queryClient.clear()
  })

  it('merges class names with cn', () => {
    expect(cn('a', undefined, 'b')).toBe('a b')
  })

  it('exposes the api url from env', () => {
    expect(env.apiUrl).toBe('http://localhost:4000/api')
  })

  it('returns parsed JSON from apiFetch', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
      status: 200,
    })

    await expect(apiFetch('/todo-lists')).resolves.toEqual({ ok: true })
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/todo-lists', {
      body: undefined,
      headers: {},
    })
  })

  it('stringifies JSON bodies and handles 204 responses', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 204,
      text: async () => '',
    })

    await expect(
      apiFetch<void>('/todo-lists/1', {
        body: { name: 'Updated' },
        method: 'DELETE',
      }),
    ).resolves.toBeUndefined()

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/todo-lists/1', {
      body: '{"name":"Updated"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    })
  })

  it('throws response text when apiFetch fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Boom',
    })

    await expect(apiFetch('/todo-lists')).rejects.toThrow('Boom')
  })

  it('falls back to a default request failure message', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => '',
    })

    await expect(apiFetch('/todo-lists')).rejects.toThrow('Request failed')
  })

  it('creates a query client with retry and stale time defaults', () => {
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(1)
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(30_000)
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(true)
  })
})
