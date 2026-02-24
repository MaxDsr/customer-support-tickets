export type TicketPriority = 'low' | 'medium' | 'high'
export type TicketStatus = 'open' | 'pending' | 'closed'

export interface TicketCustomer {
  name: string
  email: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  customer: TicketCustomer
  updatedAt: string // ISO 8601, e.g. "2026-02-24T09:15:30.123Z"
}
