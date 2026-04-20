type ProductCardSkeletonProps = {
  count?: number
}

export function ProductCardSkeleton({ count = 5 }: ProductCardSkeletonProps) {
  return (
    <div className="skeleton-list" aria-label="商品加载中">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-card skeleton-card" key={index}>
          <div className="skeleton-block skeleton-image" />
          <div className="skeleton-content">
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line" />
            <div className="skeleton-footer">
              <div className="skeleton-line price" />
              <div className="skeleton-buttons">
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

