import { useState } from 'react'
import type { Ticket, TicketStatus } from '../../types'
import { PRIORITY_LABELS, STATUS_LABELS } from '../../api/client'
import './styles.css'

interface TicketCardProps {
  ticket: Ticket
  onStatusChange: (id: string, status: TicketStatus) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TicketCard({ ticket, onStatusChange, onDelete }: TicketCardProps) {
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
    <article className="TicketCard">
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
