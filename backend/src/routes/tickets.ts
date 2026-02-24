import { Router, Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import { db, Ticket, TicketStatus } from '../db.js'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  await db.read()
  res.json(db.data.tickets)
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

router.post('/', async (req: Request, res: Response) => {
  const { title, description } = req.body as Pick<Ticket, 'title' | 'description'>
  if (!title || !description) {
    res.status(400).json({ message: 'title and description are required' })
    return
  }
  const now = new Date().toISOString()
  const ticket: Ticket = {
    id: randomUUID(),
    title: String(title),
    description: String(description),
    status: 'open',
    createdAt: now,
    updatedAt: now,
  }
  await db.update((data) => data.tickets.push(ticket))
  res.status(201).json(ticket)
})

router.patch('/:id', async (req: Request, res: Response) => {
  await db.read()
  const index = db.data.tickets.findIndex((t) => t.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ message: 'Ticket not found' })
    return
  }
  const { title, description, status } = req.body as Partial<Pick<Ticket, 'title' | 'description' | 'status'>>
  const validStatuses: TicketStatus[] = ['open', 'in_progress', 'resolved']
  if (status && !validStatuses.includes(status)) {
    res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` })
    return
  }
  const updated: Ticket = {
    ...db.data.tickets[index],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
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
