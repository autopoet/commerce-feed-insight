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
const MOBILE_ITEM_HEIGHT = 176
const FEED_HEIGHT = 680
const MOBILE_QUERY = '(max-width: 860px)'

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
  const [lastAction, setLastAction] = useState('等待用户行为')
  const [itemHeight, setItemHeight] = useState(ITEM_HEIGHT)
  const { range, visibleItems, totalHeight, setScrollTop } = useVirtualList({
    items: products,
    itemHeight,
    containerHeight: FEED_HEIGHT,
    overscan: 4,
  })

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const syncItemHeight = () => {
      setItemHeight(mediaQuery.matches ? MOBILE_ITEM_HEIGHT : ITEM_HEIGHT)
    }

    syncItemHeight()
    mediaQuery.addEventListener('change', syncItemHeight)

    return () => mediaQuery.removeEventListener('change', syncItemHeight)
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
    setLastAction(`曝光 ${product.productId} / 第 ${position + 1} 位`)
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
    setLastAction(`点击 ${product.productId} / 第 ${position + 1} 位`)
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
    setLastAction(`加购 ${product.productId} / 第 ${position + 1} 位`)
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
    setLastAction(`购买 ${product.productId} / 第 ${position + 1} 位`)
  }

  return (
    <main className="page feed-page">
      <section className="feed-header experiment-header">
        <div>
          <p className="eyebrow">实验推荐流</p>
          <h1>广告流量承接中的商品推荐流</h1>
          <p>
            当前实验组：{contextLabel.channel} / {contextLabel.campaign} / {contextLabel.creative}
          </p>
        </div>
        <div className="feed-actions">
          <Link className="secondary-button" to="/">
            调整实验参数
          </Link>
          <Link className="primary-button" to="/dashboard">
            查看实验结果
          </Link>
        </div>
      </section>

      <section className="feed-status" aria-label="推荐流状态">
        <div>
          <span>商品总数</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>渲染区间</span>
          <strong>
            {range.startIndex + 1}-{range.endIndex}
          </strong>
        </div>
        <div>
          <span>事件数</span>
          <strong>{events.length}</strong>
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
          aria-label="商品推荐虚拟列表"
        >
          <div className="virtual-spacer" style={{ height: totalHeight }}>
            <div className="virtual-window" style={{ transform: `translateY(${range.offsetY}px)` }}>
              {visibleItems.map(({ item, index }) => (
                <div className="virtual-row" style={{ height: itemHeight }} key={item.productId}>
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
