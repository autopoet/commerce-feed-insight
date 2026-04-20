import type { Product } from '../types/product'

const categories = ['美妆个护', '数码家电', '服饰穿搭', '食品生鲜', '家居日用', '运动户外']
const discountTags = ['优惠券', '限时秒杀', '直播价', '新客专享', '直降', '赠品']
const shops = ['星选好物', '云选旗舰店', '城市优品', '买手精选', '品质研究所', '潮流商店']
const reasons = [
  '同类商品点击率较高',
  '适合当前活动流量承接',
  '与所选创意人群匹配',
  '近期加购增长高于基线',
  '价格带适合新客转化',
  '从内容兴趣到购买路径较短',
]

const titles = [
  '持妆粉底液',
  '无线降噪耳机',
  '防晒冰感外套',
  '即食鸡胸肉',
  '人体工学办公椅',
  '轻便跑步鞋',
  '多功能空气炸锅',
  '补水面膜套装',
  '大容量通勤托特包',
  '便携露营折叠桌',
]

export const products: Product[] = Array.from({ length: 120 }, (_, index) => {
  const title = titles[index % titles.length]
  const category = categories[index % categories.length]
  const price = 39 + ((index * 17) % 460) + 0.9
  const originalPrice = price + 30 + ((index * 11) % 160)

  return {
    productId: `p_${String(index + 1).padStart(3, '0')}`,
    title: `${title} · 推荐 ${index + 1}`,
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
