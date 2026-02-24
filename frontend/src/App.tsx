import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { SortOrder, TicketStatus } from './types'
import { api, STATUS_LABELS } from './api/client'
import './App.css'
import TicketCard from './components/TicketCard/index.tsx'

type StatusFilter = TicketStatus | 'all'

function SkeletonCard() {
  return (
    <article className="TicketCard TicketCard--skeleton" aria-hidden="true">
      <div className="ticket-card-body">
        <div className="ticket-meta">
          <span className="skeleton skeleton--badge" />
          <span className="skeleton skeleton--badge" />
          <span className="skeleton skeleton--date" />
        </div>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--line-short" />
        <div className="ticket-customer">
          <span className="skeleton skeleton--name" />
          <span className="skeleton skeleton--name skeleton--name-short" />
        </div>
      </div>
      <div className="ticket-card-actions">
        <div className="skeleton skeleton--select" />
        <div className="skeleton skeleton--btn" />
      </div>
    </article>
  )
}

export default function App() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, sortOrder])

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['tickets', debouncedSearch, statusFilter, sortOrder, page],
    queryFn: () => api.tickets.list(statusFilter, sortOrder, debouncedSearch, page),
  })

  const tickets = data?.tickets ?? []
  const pagination = data?.pagination ?? null

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    try {
      await api.tickets.update(id, { status })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    } catch (e) {
      console.error('Failed to update ticket:', e)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.tickets.delete(id)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    } catch (e) {
      console.error('Failed to delete ticket:', e)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-brand-icon" aria-hidden="true">🎫</span>
            <h1 className="app-title">Customer Support Tickets</h1>
          </div>
          {!isLoading && !isError && pagination && (
            <span className="app-ticket-count">
              {pagination.total} ticket{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      <main className="app-main">
        <section className="tickets-section">
          <div className="search-bar">
            <input
              type="search"
              className="search-input"
              placeholder="Search by title…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search tickets by title"
            />
          </div>

          <div className="tickets-section-header">
            <h2 className="section-title">
              {statusFilter === 'all' ? 'All Tickets' : STATUS_LABELS[statusFilter]}
            </h2>
            <div className="controls-right">
              <div className="filter-bar" role="group" aria-label="Filter by status">
                {(['all', 'open', 'pending', 'closed'] as const).map((s) => (
                  <button
                    key={s}
                    className={`filter-btn${statusFilter === s ? ' filter-btn--active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === 'all' ? 'All' : STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              <div className="sort-bar" role="group" aria-label="Sort by date">
                <span className="sort-label">Sort by:</span>
                {(['desc', 'asc'] as const).map((order) => (
                  <button
                    key={order}
                    className={`filter-btn${sortOrder === order ? ' filter-btn--active' : ''}`}
                    onClick={() => setSortOrder(order)}
                  >
                    {order === 'desc' ? 'Newest' : 'Oldest'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="tickets-list" role="status" aria-label="Loading tickets" aria-busy="true">
              {Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {isError && (
            <div className="state-message state-message--error" role="alert">
              <span>Could not load tickets. Please check your connection and try again.</span>
              <button
                className="btn btn--danger"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? 'Retrying…' : 'Retry'}
              </button>
            </div>
          )}

          {!isLoading && !isError && tickets.length === 0 && (
            <div className="state-message state-message--empty">
              {debouncedSearch
                ? `No tickets matching "${debouncedSearch}".`
                : statusFilter === 'all'
                  ? 'No tickets yet.'
                  : `No ${STATUS_LABELS[statusFilter].toLowerCase()} tickets.`}
            </div>
          )}

          {!isLoading && !isError && tickets.length > 0 && (
            <div className="tickets-list">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {!isLoading && !isError && pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </main>

    </div>
  )
}
