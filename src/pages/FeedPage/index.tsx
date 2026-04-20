import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/ProductCard'
import { ProductCardSkeleton } from '../../components/ProductCardSkeleton'
import { useVirtualList } from '../../features/feed/useVirtualList'
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
  const adContext = useAdContextStore((state) => ({
    channel: state.channel,
    campaign: state.campaign,
    creative: state.creative,
  }))
  const [isLoading, setIsLoading] = useState(true)
  const [lastAction, setLastAction] = useState('等待用户行为')
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

  const handleProductClick = (product: Product, position: number) => {
    setLastAction(`点击 ${product.productId} · position ${position + 1}`)
  }

  const handleAddToCart = (product: Product, position: number) => {
    setLastAction(`加购 ${product.productId} · position ${position + 1}`)
  }

  const handlePurchase = (product: Product, position: number) => {
    setLastAction(`购买 ${product.productId} · position ${position + 1}`)
  }

  return (
    <main className="page feed-page">
      <section className="feed-header">
        <div>
          <p className="eyebrow">Recommendation Feed</p>
          <h1>商品推荐流</h1>
          <p>
            当前流量来源：{contextLabel.channel} / {contextLabel.campaign} / {contextLabel.creative}
          </p>
        </div>
        <div className="feed-actions">
          <Link className="secondary-button" to="/">
            返回入口
          </Link>
          <Link className="primary-button" to="/dashboard">
            去看板
          </Link>
        </div>
      </section>

      <section className="feed-status" aria-label="推荐流状态">
        <div>
          <span>商品数</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>渲染区间</span>
          <strong>
            {range.startIndex + 1}-{range.endIndex}
          </strong>
        </div>
        <div>
          <span>最近行为</span>
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
          aria-label="商品推荐流虚拟列表"
        >
          <div className="virtual-spacer" style={{ height: totalHeight }}>
            <div className="virtual-window" style={{ transform: `translateY(${range.offsetY}px)` }}>
              {visibleItems.map(({ item, index }) => (
                <div className="virtual-row" style={{ height: ITEM_HEIGHT }} key={item.productId}>
                  <ProductCard
                    product={item}
                    position={index}
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

