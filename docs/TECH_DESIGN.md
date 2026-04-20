# 电商推荐流转化分析实验台 技术设计文档

## 1. 文档定位

本文档回答“这个项目怎么实现”。

项目定位是短周期快速完成的小型学习项目，不做企业级复杂架构，但需要体现清晰的工程拆分、类型设计、状态流转、性能优化和埋点设计意识。

后续写代码前需要先阅读：

1. `docs/PRODUCT_DESIGN.md`
2. `docs/TECH_DESIGN.md`

如果实现过程中修改页面结构、事件模型、指标口径、状态管理方式或关键依赖，需要同步更新本文档。

### 1.1 当前实现状态

当前 MVP 已实现、通过验证并部署：

- 在线预览：https://commerce-feed-insight.vercel.app/
- 部署平台：Vercel。
- SPA 路由兜底：通过 `vercel.json` 将所有路径 rewrite 到 `index.html`，支持 `/feed`、`/dashboard` 直接访问和刷新。
- UI 文案：页面已中文化，mock 商品、广告渠道、活动、创意均使用中文展示。
- UI 风格：已调整为轻量增长实验台风格，入口页强调实验配置，推荐流强调流量承接，看板强调实验结果。
- 验证命令：`npm run lint`、`npm run build`、`npm run test:e2e`。

## 2. 技术目标

MVP 技术目标：

- 使用 React + TypeScript + Vite 完成单页前端应用。
- 使用路由划分广告入口页、推荐流页、看板页。
- 使用本地 mock 数据模拟商品和广告配置。
- 使用统一 track 方法生成行为事件。
- 使用前端本地状态保存广告上下文、事件流和曝光去重集合。
- 使用虚拟列表降低长商品流 DOM 数量。
- 使用图片懒加载和骨架屏优化推荐流体验。
- 使用事件流实时计算漏斗指标和维度对比。

不做：

- 不接后端。
- 不接真实埋点 SDK。
- 不接真实推荐算法。
- 不做复杂可视化平台。

## 3. 技术栈选型

### 3.1 已选技术

- React：页面与组件开发。
- TypeScript：业务模型和事件模型类型约束。
- Vite：本地开发和构建。
- React Router：页面路由。
- Zustand：轻量全局状态管理。
- Playwright：主链路冒烟测试和截图生成。
- Vercel：静态站点部署。

### 3.2 已新增依赖

MVP 已新增：

- `react-router-dom`：页面路由。
- `zustand`：轻量全局状态管理。
- `@playwright/test`：端到端冒烟测试。

暂不建议新增：

- ECharts：MVP 可先用自定义条形图和表格表达指标。
- 大型 UI 组件库：项目体量小，自定义样式更利于体现前端能力。
- 复杂虚拟列表库：可以先自实现固定高度虚拟列表，方便技术交流讲清楚原理。

如果后续时间紧，也可以使用轻量虚拟列表库，但要能解释其核心原理。

## 4. 应用架构

### 4.1 页面架构

```text
App
  -> Router
    -> AdEntryPage
    -> FeedPage
    -> DashboardPage
```

页面职责：

- `AdEntryPage`：作为实验配置台，选择广告上下文并启动推荐流承接。
- `FeedPage`：作为实验推荐流，展示商品推荐流并触发曝光、点击、加购、购买事件。
- `DashboardPage`：作为实验结果看板，消费事件流并展示漏斗指标、维度对比和事件日志。

### 4.2 模块架构

推荐目录：

```text
src/
  pages/
    AdEntryPage/
    FeedPage/
    DashboardPage/
  components/
    AppShell/
    ProductCard/
    ProductCardSkeleton/
    MetricBlock/
    FunnelBars/
  features/
    tracking/
      tracking.types.ts
      trackingStore.ts
      track.ts
    dashboard/
      metrics.ts
    feed/
      useVirtualList.ts
      useExposureTracker.ts
  mocks/
    ads.ts
    products.ts
  stores/
    adContextStore.ts
  types/
    product.ts
    ad.ts
  utils/
    format.ts
    id.ts
```

说明：

- `pages` 只组织页面级布局和页面级副作用。
- `components` 放可复用 UI 组件。
- `features/tracking` 负责事件模型和 track。
- `features/dashboard` 负责指标计算。
- `features/feed` 负责推荐流相关 hooks。
- `mocks` 集中放 mock 数据。
- `stores` 放跨页面状态。
- `types` 放通用业务类型。

## 5. 路由设计

MVP 路由：

```text
/               广告入口页
/feed           商品推荐流页
/dashboard      实时数据看板页
```

路由规则：

- `/` 默认展示广告入口页。
- `/feed` 进入推荐流，如果没有广告上下文，使用默认上下文兜底。
- `/dashboard` 展示当前事件流统计结果。

页面访问埋点：

- 进入每个页面时触发 `page_view`。
- `page_view` 需要带上当前广告上下文；入口页也可以带默认上下文。

## 6. 状态设计

### 6.1 广告上下文状态

建议使用 Zustand：

```ts
type AdContextState = {
  channel: string;
  campaign: string;
  creative: string;
  setAdContext: (context: AdContext) => void;
};
```

持久化策略：

- MVP 可使用 Zustand 内存状态。
- 为了刷新后不丢失演示上下文，可以同步写入 localStorage。
- 如果时间紧，优先内存状态，保证主流程能跑。

### 6.2 事件流状态

```ts
type TrackingState = {
  events: TrackingEvent[];
  exposedProductIds: Set<string>;
  track: (input: TrackInput) => void;
  markProductExposed: (productId: string) => void;
  hasProductExposed: (productId: string) => boolean;
  clearEvents: () => void;
};
```

设计规则：

- `events` 是看板唯一数据源。
- `exposedProductIds` 用于 session 内曝光去重。
- `clearEvents` 同时清空事件流和曝光集合。
- 点击、加购、购买不去重。

### 6.3 sessionId 与 userId

MVP 生成方式：

- `sessionId`：应用启动时生成，保存到 sessionStorage。
- `userId`：应用首次打开时生成，保存到 localStorage。

这样讲解时可以说明：

- session 级曝光去重依赖 sessionId。
- userId 只是模拟匿名用户，不涉及登录系统。

## 7. 类型设计

### 7.1 广告类型

```ts
type AdChannel = {
  id: string;
  name: string;
  type: 'feed' | 'search' | 'mall' | 'creator' | 'external';
};

type Campaign = {
  id: string;
  name: string;
  goal: 'ctr' | 'conversion' | 'new_user';
};

type Creative = {
  id: string;
  name: string;
  type: 'video' | 'image' | 'live_clip';
};

type AdContext = {
  channel: string;
  campaign: string;
  creative: string;
};
```

### 7.2 商品类型

```ts
type Product = {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discountTag: string;
  salesCount: number;
  shopName: string;
  category: string;
  recommendationReason: string;
};
```

### 7.3 埋点类型

详细协议放在 `docs/TRACKING_DESIGN.md`。

技术实现中先使用：

```ts
type EventName =
  | 'page_view'
  | 'product_exposure'
  | 'product_click'
  | 'add_to_cart'
  | 'purchase';

type PageName = 'ad_entry' | 'feed' | 'dashboard';

type TrackingEvent = {
  eventId: string;
  eventName: EventName;
  timestamp: number;
  sessionId: string;
  userId: string;
  page: PageName;
  channel?: string;
  campaign?: string;
  creative?: string;
  productId?: string;
  position?: number;
  payload?: Record<string, unknown>;
};
```

## 8. 数据流设计

### 8.1 广告入口到推荐流

```text
用户选择 channel / campaign / creative
  -> setAdContext
  -> navigate('/feed')
  -> FeedPage 读取 adContext
  -> page_view(feed)
```

### 8.2 推荐流行为到事件流

```text
用户浏览 / 点击 / 加购 / 购买
  -> ProductCard 或曝光 hook 触发行为
  -> 调用 track
  -> track 补齐公共字段
  -> 写入 events
```

### 8.3 事件流到看板

```text
DashboardPage 读取 events
  -> calculateMetrics(events)
  -> calculateBreakdown(events, 'channel')
  -> calculateBreakdown(events, 'creative')
  -> 展示指标、漏斗、维度表、事件日志
```

看板不直接依赖商品卡片状态，避免 UI 状态和业务统计耦合。

## 9. 核心实现方案

### 9.1 track 方法

`track` 的职责：

- 接收事件名称和业务参数。
- 读取当前广告上下文。
- 补齐 eventId、timestamp、sessionId、userId。
- 写入事件流。

调用示例：

```ts
track({
  eventName: 'product_click',
  page: 'feed',
  productId: product.productId,
  position,
  payload: {
    price: product.price,
  },
});
```

### 9.2 有效曝光检测

使用 `IntersectionObserver`：

- threshold 设置为 `[0, 0.5, 1]`。
- 当 `intersectionRatio >= 0.5` 时启动 1000ms 计时。
- 如果 1000ms 内离开视口，取消计时。
- 计时完成后检查是否已曝光。
- 未曝光则触发 `product_exposure` 并写入曝光 Set。

需要注意：

- 组件卸载时清除计时器。
- 虚拟列表重复挂载时，仍通过全局 `exposedProductIds` 去重。

### 9.3 虚拟列表

MVP 使用固定高度虚拟列表，便于快速实现和讲清楚。

核心参数：

- `itemHeight`：商品卡片固定高度。
- `containerHeight`：滚动容器高度。
- `scrollTop`：当前滚动位置。
- `overscan`：上下额外渲染数量。

计算逻辑：

```text
startIndex = floor(scrollTop / itemHeight) - overscan
endIndex = ceil((scrollTop + containerHeight) / itemHeight) + overscan
visibleItems = products.slice(startIndex, endIndex)
```

DOM 结构：

```text
scroll container
  -> total height spacer
    -> translated visible list
```

MVP 约束：

- 商品卡片高度保持固定或近似固定。
- 如果后续改成动态高度，需要额外设计高度缓存，不进入第一版。

### 9.4 图片懒加载

优先使用浏览器原生能力：

```html
<img loading="lazy" />
```

增强体验：

- 图片加载前显示占位背景。
- 图片加载成功后淡入。
- 图片加载失败显示兜底占位。

因为虚拟列表本身只渲染视口附近节点，原生懒加载已经足够支撑 MVP。

### 9.5 骨架屏

触发场景：

- 进入推荐流初始加载。
- 加载更多商品时。

MVP 实现：

- 使用 `setTimeout` 模拟 300ms 到 600ms 的加载状态。
- 骨架结构接近商品卡片：图片占位、标题占位、价格占位、按钮占位。

注意：

- 骨架屏是体验增强，不影响真实事件统计。
- 骨架屏不触发商品曝光。

### 9.6 指标计算

核心函数：

```ts
calculateDashboardMetrics(events: TrackingEvent[]): DashboardMetrics
```

输出：

```ts
type DashboardMetrics = {
  exposures: number;
  clicks: number;
  addToCarts: number;
  purchases: number;
  ctr: number;
  addToCartRate: number;
  purchaseRate: number;
};
```

计算规则：

- `exposures` = product_exposure 数量。
- `clicks` = product_click 数量。
- `addToCarts` = add_to_cart 数量。
- `purchases` = purchase 数量。
- `ctr` = clicks / exposures。
- `addToCartRate` = addToCarts / clicks。
- `purchaseRate` = purchases / clicks。
- 分母为 0 时返回 0。

### 9.7 维度对比

核心函数：

```ts
calculateBreakdown(events, dimension)
```

支持维度：

- `channel`
- `creative`

输出每个维度值下的：

- 曝光数
- 点击数
- 加购数
- 购买数
- CTR
- 购买转化率

MVP 用表格展示即可。

## 10. 页面实现要点

### 10.1 AdEntryPage

实现要点：

- 从 `mocks/ads.ts` 读取 channel、campaign、creative 选项。
- 使用本地 state 维护当前选择。
- 点击进入推荐流时写入全局广告上下文。
- 页面 mount 时触发 `page_view(ad_entry)`。

### 10.2 FeedPage

实现要点：

- 页面 mount 时触发 `page_view(feed)`。
- 读取 `products` mock 数据。
- 初始展示骨架屏。
- 骨架结束后展示虚拟列表。
- 每个商品卡片绑定曝光 ref。
- 商品点击、加购、购买分别调用 track。

### 10.3 DashboardPage

实现要点：

- 页面 mount 时触发 `page_view(dashboard)`。
- 读取事件流。
- 使用指标计算函数生成看板数据。
- 最近事件日志取 events 倒序前 20 条。
- 清空按钮调用 `clearEvents`。

## 11. 样式与体验约束

整体风格：

- 专业、清晰、轻量。
- 更像运营分析工具，不像营销落地页。
- 不做复杂装饰。
- 保证数字和链路信息清楚。

布局建议：

- 页面顶部使用轻量状态栏。
- 核心区域使用清晰分组。
- 看板指标可以使用简洁块状布局。
- 商品流保留足够图片面积，体现电商场景。

交互反馈：

- 加购后给按钮短暂状态反馈。
- 购买后给 toast 或轻量提示。
- 清空数据后指标立即归零。

## 12. 测试与验证

MVP 验证方式：

1. 启动本地项目。
2. 从广告入口选择一组广告上下文。
3. 进入推荐流。
4. 停留等待部分商品曝光。
5. 点击、加购、购买商品。
6. 进入看板。
7. 确认指标和事件日志变化。

需要重点检查：

- page_view 是否产生。
- 曝光是否满足 50% + 1000ms 后才产生。
- 同一商品是否只曝光一次。
- 加购和购买是否不会额外触发商品点击。
- 看板指标是否来自事件流。
- 清空数据是否同时清空曝光去重集合。

## 13. 风险与取舍

### 13.1 虚拟列表与曝光检测冲突

风险：

- 商品组件会随着滚动卸载和挂载，容易重复曝光。

处理：

- 使用全局 `exposedProductIds` 去重。

### 13.2 固定高度虚拟列表不支持复杂卡片高度

风险：

- 商品标题换行可能导致高度不一致。

处理：

- MVP 固定卡片高度，标题限制行数。
- 动态高度虚拟列表作为后续扩展，不进入第一版。

### 13.3 本地事件流刷新丢失

风险：

- 如果事件只存在内存中，刷新页面会丢数据。

处理：

- MVP 可接受。
- 如果演示需要稳定，可将 events 同步到 localStorage。

### 13.4 图表表现不够丰富

风险：

- 自定义图表不如 ECharts 丰富。

处理：

- MVP 优先讲清楚指标口径和事件流。
- 后续有时间再引入图表库。

## 14. 实施顺序

按照当前项目计划，技术实现顺序为：

1. 写技术设计文档。
2. 写埋点事件协议。
3. 设计目录结构。
4. 准备 mock 数据。
5. 实现广告入口页。
6. 实现推荐流页面。
7. 实现虚拟列表。
8. 实现图片懒加载。
9. 实现骨架屏。
10. 实现埋点 SDK。
11. 实现有效曝光检测。
12. 实现广告归因。
13. 实现实时漏斗看板。
14. 完善 README 和项目说明材料。
15. 本地测试和截图。

## 15. 决策记录

### 15.1 2026-04-20

- 技术设计按小型技术交流项目处理，不做企业级复杂架构。
- 推荐使用 `react-router-dom` 做页面边界。
- 推荐使用 `zustand` 做轻量全局状态。
- MVP 自实现固定高度虚拟列表，便于展示原理。
- MVP 图表先用自定义条形图和表格，不强制引入 ECharts。
- 埋点事件流作为看板唯一数据源。



