import type { Product } from '../types/product'

const categories = ['Beauty', 'Digital', 'Fashion', 'Food', 'Home', 'Sports']
const discountTags = ['Coupon', 'Flash Deal', 'Live Price', 'New User', 'Sale Drop', 'Gift']
const shops = ['Star Choice', 'Cloud Select', 'City Goods', 'Buyer Picks', 'Quality Lab', 'Trend Store']
const reasons = [
  'High click rate in similar products',
  'Campaign-ready product for sale traffic',
  'Audience match with selected creative',
  'Recent cart growth is above baseline',
  'Price band fits new user conversion',
  'Short path from content interest to purchase',
]

const titles = [
  'Long Wear Foundation',
  'Wireless Noise Canceling Earbuds',
  'Cooling Sun Protection Jacket',
  'Ready-to-eat Chicken Breast',
  'Ergonomic Office Chair',
  'Quick Dry Running Shoes',
  'Multi Function Air Fryer',
  'Hydrating Sheet Mask',
  'Large Commuter Tote Bag',
  'Portable Camping Table',
]

export const products: Product[] = Array.from({ length: 120 }, (_, index) => {
  const title = titles[index % titles.length]
  const category = categories[index % categories.length]
  const price = 39 + ((index * 17) % 460) + 0.9
  const originalPrice = price + 30 + ((index * 11) % 160)

  return {
    productId: `p_${String(index + 1).padStart(3, '0')}`,
    title: `${title} - Recommended ${index + 1}`,
    imageUrl: `https://picsum.photos/seed/commerce-feed-${index + 1}/480/480`,
    price,
    originalPrice,
    discountTag: discountTags[index % discountTags.length],
    salesCount: 900 + index * 137,
    shopName: shops[index % shops.length],
    category,
    recommendationReason: reasons[index % reasons.length],
  }
})

