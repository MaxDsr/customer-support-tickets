import type { Ticket, TicketStatus } from '../types'

const BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `${res.status} ${res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  tickets: {
    list: () => request<Ticket[]>('/tickets'),
    create: (data: Pick<Ticket, 'title' | 'description'>) =>
      request<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Pick<Ticket, 'title' | 'description' | 'status'>>) =>
      request<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/tickets/${id}`, { method: 'DELETE' }),
  },
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}
