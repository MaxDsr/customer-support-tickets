import { Router, Request, Response } from 'express'
import { db, Ticket, TicketPriority, TicketStatus } from '../db.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  await db.read()
  const { status } = req.query
  const validStatuses = ['open', 'pending', 'closed']
  const tickets =
    typeof status === 'string' && validStatuses.includes(status)
      ? db.data.tickets.filter((t) => t.status === status)
      : db.data.tickets
  res.json(tickets)
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
