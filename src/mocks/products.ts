import type { Product } from '../types/product'

const categories = ['美妆个护', '数码家电', '服饰鞋包', '食品生鲜', '家居日用', '运动户外']
const discountTags = ['满减', '限时券', '直播同价', '新客补贴', '大促直降', '买赠']
const shops = ['星选旗舰店', '云仓优选', '城市好物', '超级买手店', '品质严选', '趋势集合店']
const reasons = [
  '同类商品点击率较高',
  '大促活动承接商品',
  '与当前广告创意人群匹配',
  '近期加购增长明显',
  '价格带适合新客转化',
  '内容种草后购买链路较短',
]

const titles = [
  '轻透持妆粉底液',
  '无线降噪蓝牙耳机',
  '夏季防晒冰丝外套',
  '低脂即食鸡胸肉',
  '人体工学办公椅',
  '速干训练跑步鞋',
  '多功能空气炸锅',
  '玻尿酸补水面膜',
  '通勤大容量托特包',
  '露营便携折叠桌',
]

export const products: Product[] = Array.from({ length: 120 }, (_, index) => {
  const title = titles[index % titles.length]
  const category = categories[index % categories.length]
  const price = 39 + ((index * 17) % 460) + 0.9
  const originalPrice = price + 30 + ((index * 11) % 160)

  return {
    productId: `p_${String(index + 1).padStart(3, '0')}`,
    title: `${title} ${index + 1} 号推荐款`,
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

