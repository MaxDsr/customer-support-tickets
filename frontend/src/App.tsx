import { useState, useEffect } from 'react'
import type { Ticket, TicketStatus } from './types'
import { api, PRIORITY_LABELS, STATUS_LABELS } from './api/client'
import './App.css'

type StatusFilter = TicketStatus | 'all'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface TicketCardProps {
  ticket: Ticket
  onStatusChange: (id: string, status: TicketStatus) => void
  onDelete: (id: string) => void
}

function TicketCard({ ticket, onStatusChange, onDelete }: TicketCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (status: TicketStatus) => {
    setUpdating(true)
    await onStatusChange(ticket.id, status)
    setUpdating(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(ticket.id)
  }

  return (
    <article className="ticket-card">
      <div className="ticket-card-body">
        <div className="ticket-meta">
          <span className={`badge badge--${ticket.status}`}>{STATUS_LABELS[ticket.status]}</span>
          <span className={`badge badge--priority-${ticket.priority}`}>{PRIORITY_LABELS[ticket.priority]}</span>
          <span className="ticket-date">Updated {formatDate(ticket.updatedAt)}</span>
        </div>
        <h3 className="ticket-title">{ticket.title}</h3>
        <p className="ticket-description">{ticket.description}</p>
        <div className="ticket-customer">
          <span className="ticket-customer-name">{ticket.customer.name}</span>
          <span className="ticket-customer-email">{ticket.customer.email}</span>
        </div>
      </div>
      <div className="ticket-card-actions">
        <select
          value={ticket.status}
          disabled={updating}
          onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
          className="status-select"
          aria-label="Change status"
        >
          {(Object.entries(STATUS_LABELS) as [TicketStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn--danger"
          aria-label="Delete ticket"
        >
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    api.tickets
      .list()
      .then((data) => setTickets(data))
      .catch((e: Error) => setFetchError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    try {
      const updated = await api.tickets.update(id, { status })
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      console.error('Failed to update ticket:', e)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.tickets.delete(id)
      setTickets((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      console.error('Failed to delete ticket:', e)
    }
  }

  const filteredTickets =
    statusFilter === 'all' ? tickets : tickets.filter((t) => t.status === statusFilter)

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-brand-icon" aria-hidden="true">🎫</span>
            <h1 className="app-title">Customer Support Tickets</h1>
          </div>
          <span className="app-ticket-count">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <section className="card stats-card">
            <h2 className="section-title">Overview</h2>
            <ul className="stats-list">
              <li className="stats-item">
                <span className="badge badge--open">Open</span>
                <span className="stats-count">{counts.open}</span>
              </li>
              <li className="stats-item">
                <span className="badge badge--pending">Pending</span>
                <span className="stats-count">{counts.pending}</span>
              </li>
              <li className="stats-item">
                <span className="badge badge--closed">Closed</span>
                <span className="stats-count">{counts.closed}</span>
              </li>
            </ul>
          </section>
        </aside>

        <section className="tickets-section">
          <div className="tickets-section-header">
            <h2 className="section-title">
              {statusFilter === 'all' ? 'All Tickets' : STATUS_LABELS[statusFilter]}
            </h2>
            <div className="filter-bar" role="group" aria-label="Filter by status">
              {(['all', 'open', 'pending', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  className={`filter-btn${statusFilter === s ? ' filter-btn--active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'all' ? 'All' : STATUS_LABELS[s]}
                  <span className="filter-btn-count">{counts[s]}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="state-message">
              <span className="spinner" aria-hidden="true" />
              Loading tickets…
            </div>
          )}

          {fetchError && (
            <div className="state-message state-message--error" role="alert">
              Could not load tickets: {fetchError}
            </div>
          )}

          {!loading && !fetchError && filteredTickets.length === 0 && (
            <div className="state-message state-message--empty">
              {statusFilter === 'all' ? 'No tickets yet.' : `No ${STATUS_LABELS[statusFilter].toLowerCase()} tickets.`}
            </div>
          )}

          <div className="tickets-list">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
