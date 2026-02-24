import type { SortOrder, Ticket, TicketPriority, TicketStatus } from '../types'

type StatusFilter = TicketStatus | 'all'

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
    list: (status?: StatusFilter, sort?: SortOrder) => {
      const params = new URLSearchParams()
      if (status && status !== 'all') params.set('status', status)
      if (sort) params.set('sort', sort)
      const qs = params.size ? `?${params}` : ''
      return request<Ticket[]>(`/tickets${qs}`)
    },
    update: (id: string, data: Partial<Pick<Ticket, 'title' | 'description' | 'priority' | 'status' | 'customer'>>) =>
      request<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/tickets/${id}`, { method: 'DELETE' }),
  },
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  pending: 'Pending',
  closed: 'Closed',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
