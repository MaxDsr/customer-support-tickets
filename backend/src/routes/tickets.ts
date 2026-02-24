import { Router, Request, Response } from 'express'
import { db, Ticket, TicketPriority, TicketStatus } from '../db.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  await db.read()
  const { status, sort, search, page } = req.query

  const PAGE_SIZE = 7

  // 1. Search by title
  let tickets = db.data.tickets
  if (typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase()
    tickets = tickets.filter((t) => t.title.toLowerCase().includes(q))
  }

  // 2. Filter by status
  const validStatuses = ['open', 'pending', 'closed']
  if (typeof status === 'string' && validStatuses.includes(status)) {
    tickets = tickets.filter((t) => t.status === status)
  }

  // 3. Sort by date
  const sortOrder = sort === 'asc' ? 'asc' : 'desc'
  tickets = [...tickets].sort((a, b) => {
    const cmp = a.updatedAt.localeCompare(b.updatedAt)
    return sortOrder === 'asc' ? cmp : -cmp
  })

  // 4. Paginate
  const total = tickets.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageNum = Math.min(Math.max(1, parseInt(typeof page === 'string' ? page : '1', 10) || 1), totalPages)
  const start = (pageNum - 1) * PAGE_SIZE
  const paginated = tickets.slice(start, start + PAGE_SIZE)

  res.json({
    tickets: paginated,
    pagination: { total, page: pageNum, limit: PAGE_SIZE, totalPages },
  })
})

router.get('/:id', async (req: Request, res: Response) => {
  await db.read()
  const ticket = db.data.tickets.find((t) => t.id === req.params.id)
  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' })
    return
  }
  res.json(ticket)
})

router.patch('/:id', async (req: Request, res: Response) => {
  await db.read()
  const index = db.data.tickets.findIndex((t) => t.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ message: 'Ticket not found' })
    return
  }

  const { title, description, priority, status, customer } = req.body as Partial<Pick<Ticket, 'title' | 'description' | 'priority' | 'status' | 'customer'>>

  const validStatuses: TicketStatus[] = ['open', 'pending', 'closed']
  if (status && !validStatuses.includes(status)) {
    res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` })
    return
  }

  const validPriorities: TicketPriority[] = ['low', 'medium', 'high']
  if (priority && !validPriorities.includes(priority)) {
    res.status(400).json({ message: `priority must be one of: ${validPriorities.join(', ')}` })
    return
  }

  const updated: Ticket = {
    ...db.data.tickets[index],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(priority !== undefined && { priority }),
    ...(status !== undefined && { status }),
    ...(customer !== undefined && { customer }),
    updatedAt: new Date().toISOString(),
  }
  await db.update((data) => {
    data.tickets[index] = updated
  })
  res.json(updated)
})

router.delete('/:id', async (req: Request, res: Response) => {
  await db.read()
  const index = db.data.tickets.findIndex((t) => t.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ message: 'Ticket not found' })
    return
  }
  await db.update((data) => data.tickets.splice(index, 1))
  res.status(204).send()
})

export default router
