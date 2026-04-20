import { useState } from 'react'
import type { Product } from '../../types/product'
import { formatCompactNumber, formatCurrency } from '../../utils/format'

type ProductCardProps = {
  product: Product
  position: number
  onProductClick?: (product: Product, position: number) => void
  onAddToCart?: (product: Product, position: number) => void
  onPurchase?: (product: Product, position: number) => void
}

export function ProductCard({
  product,
  position,
  onProductClick,
  onAddToCart,
  onPurchase,
}: ProductCardProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [feedback, setFeedback] = useState<'cart' | 'purchase' | null>(null)

  const flashFeedback = (type: 'cart' | 'purchase') => {
    setFeedback(type)
    window.setTimeout(() => setFeedback(null), 900)
  }

  return (
    <article className="product-card" onClick={() => onProductClick?.(product, position)}>
      <div className={`product-image ${imageState}`}>
        {imageState === 'error' ? (
          <span>Image unavailable</span>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
          />
        )}
      </div>

      <div className="product-content">
        <div className="product-main">
          <div>
            <div className="product-meta">
              <span>{product.discountTag}</span>
              <span>#{position + 1}</span>
            </div>
            <h3>{product.title}</h3>
          </div>
          <p className="recommend-reason">{product.recommendationReason}</p>
        </div>

        <div className="product-footer">
          <div>
            <strong>{formatCurrency(product.price)}</strong>
            <del>{formatCurrency(product.originalPrice)}</del>
            <p>
              {product.shopName} · sold {formatCompactNumber(product.salesCount)}
            </p>
          </div>
          <div className="product-actions">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onAddToCart?.(product, position)
                flashFeedback('cart')
              }}
            >
              {feedback === 'cart' ? '已加购' : '加购'}
            </button>
            <button
              className="buy-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onPurchase?.(product, position)
                flashFeedback('purchase')
              }}
            >
              {feedback === 'purchase' ? '已购买' : '购买'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

