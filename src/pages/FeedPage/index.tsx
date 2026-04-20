import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/ProductCard'
import { ProductCardSkeleton } from '../../components/ProductCardSkeleton'
import { useVirtualList } from '../../features/feed/useVirtualList'
import { track } from '../../features/tracking/track'
import { usePageView } from '../../features/tracking/usePageView'
import { useTrackingStore } from '../../features/tracking/trackingStore'
import { adChannels, campaigns, creatives } from '../../mocks/ads'
import { products } from '../../mocks/products'
import { useAdContextStore } from '../../stores/adContextStore'
import type { Product } from '../../types/product'

export const FEED_PAGE_ROUTE = '/feed'

const ITEM_HEIGHT = 244
const FEED_HEIGHT = 680

const getName = (items: { id: string; name: string }[], id: string) =>
  items.find((item) => item.id === id)?.name ?? id

export function FeedPage() {
  usePageView('feed')

  const channel = useAdContextStore((state) => state.channel)
  const campaign = useAdContextStore((state) => state.campaign)
  const creative = useAdContextStore((state) => state.creative)
  const events = useTrackingStore((state) => state.events)
  const hasProductExposed = useTrackingStore((state) => state.hasProductExposed)
  const markProductExposed = useTrackingStore((state) => state.markProductExposed)
  const adContext = useMemo(
    () => ({
      channel,
      campaign,
      creative,
    }),
    [campaign, channel, creative],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [lastAction, setLastAction] = useState('Waiting for behavior')
  const { range, visibleItems, totalHeight, setScrollTop } = useVirtualList({
    items: products,
    itemHeight: ITEM_HEIGHT,
    containerHeight: FEED_HEIGHT,
    overscan: 4,
  })

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  const contextLabel = useMemo(
    () => ({
      channel: getName(adChannels, adContext.channel),
      campaign: getName(campaigns, adContext.campaign),
      creative: getName(creatives, adContext.creative),
    }),
    [adContext],
  )

  const handleExposure = (
    product: Product,
    position: number,
    visibleRatio: number,
    stayDuration: number,
  ) => {
    if (hasProductExposed(product.productId)) {
      return
    }

    markProductExposed(product.productId)
    track({
      eventName: 'product_exposure',
      page: 'feed',
      productId: product.productId,
      position,
      payload: {
        visibleRatio,
        stayDuration,
        category: product.category,
      },
    })
    setLastAction(`Exposure ${product.productId} · position ${position + 1}`)
  }

  const handleProductClick = (product: Product, position: number) => {
    track({
      eventName: 'product_click',
      page: 'feed',
      productId: product.productId,
      position,
      payload: {
        price: product.price,
        category: product.category,
      },
    })
    setLastAction(`Click ${product.productId} · position ${position + 1}`)
  }

  const handleAddToCart = (product: Product, position: number) => {
    track({
      eventName: 'add_to_cart',
      page: 'feed',
      productId: product.productId,
      position,
      payload: {
        price: product.price,
        category: product.category,
      },
    })
    setLastAction(`Cart ${product.productId} · position ${position + 1}`)
  }

  const handlePurchase = (product: Product, position: number) => {
    track({
      eventName: 'purchase',
      page: 'feed',
      productId: product.productId,
      position,
      payload: {
        price: product.price,
        orderAmount: product.price,
        category: product.category,
      },
    })
    setLastAction(`Purchase ${product.productId} · position ${position + 1}`)
  }

  return (
    <main className="page feed-page">
      <section className="feed-header">
        <div>
          <p className="eyebrow">Recommendation Feed</p>
          <h1>Product Feed</h1>
          <p>
            Traffic source: {contextLabel.channel} / {contextLabel.campaign} / {contextLabel.creative}
          </p>
        </div>
        <div className="feed-actions">
          <Link className="secondary-button" to="/">
            Back to Entry
          </Link>
          <Link className="primary-button" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>

      <section className="feed-status" aria-label="Feed status">
        <div>
          <span>Products</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Render range</span>
          <strong>
            {range.startIndex + 1}-{range.endIndex}
          </strong>
        </div>
        <div>
          <span>Events</span>
          <strong>{events.length}</strong>
        </div>
        <div>
          <span>Last action</span>
          <strong>{lastAction}</strong>
        </div>
      </section>

      {isLoading ? (
        <ProductCardSkeleton count={5} />
      ) : (
        <section
          className="virtual-feed"
          style={{ height: FEED_HEIGHT }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          aria-label="Product feed virtual list"
        >
          <div className="virtual-spacer" style={{ height: totalHeight }}>
            <div className="virtual-window" style={{ transform: `translateY(${range.offsetY}px)` }}>
              {visibleItems.map(({ item, index }) => (
                <div className="virtual-row" style={{ height: ITEM_HEIGHT }} key={item.productId}>
                  <ProductCard
                    product={item}
                    position={index}
                    onExposure={handleExposure}
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onPurchase={handlePurchase}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

