export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  createdAt: string
  updatedAt: string
}
