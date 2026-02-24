import { join } from 'node:path'
import { JSONFilePreset } from 'lowdb/node'

export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

export interface DbSchema {
  tickets: Ticket[]
}

const defaultData: DbSchema = { tickets: [] }

const dbPath = process.env.DB_PATH
  ? join(process.cwd(), process.env.DB_PATH)
  : join(process.cwd(), 'data', 'db.json')

export const db = await JSONFilePreset<DbSchema>(dbPath, defaultData)
