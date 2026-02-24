import './styles.css'

export default function SkeletonCard() {
  return (
    <article className="SkeletonCard" aria-hidden="true">
      <div className="SkeletonCard-body">
        <div className="SkeletonCard-meta">
          <span className="skeleton skeleton--badge" />
          <span className="skeleton skeleton--badge" />
          <span className="skeleton skeleton--date" />
        </div>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--line-short" />
        <div className="SkeletonCard-customer">
          <span className="skeleton skeleton--name" />
          <span className="skeleton skeleton--name skeleton--name-short" />
        </div>
      </div>
      <div className="SkeletonCard-actions">
        <div className="skeleton skeleton--select" />
        <div className="skeleton skeleton--btn" />
      </div>
    </article>
  )
}
