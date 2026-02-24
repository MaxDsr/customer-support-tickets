import './styles.css'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ← Prev
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next →
      </button>
    </div>
  )
}
