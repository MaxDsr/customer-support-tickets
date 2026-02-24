import { join } from 'node:path'
import { JSONFilePreset } from 'lowdb/node'

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

export interface DbSchema {
  tickets: Ticket[]
}

const defaultData: DbSchema = { tickets: [] }

const dbPath = process.env.DB_PATH
  ? join(process.cwd(), process.env.DB_PATH)
  : join(process.cwd(), 'data', 'db.json')

export const db = await JSONFilePreset<DbSchema>(dbPath, defaultData)
