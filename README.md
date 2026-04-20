# commerce-feed-insight

电商推荐流转化分析实验台。这个项目用于模拟“广告流量进入电商推荐流后的转化分析链路”，重点不是做一个普通商品列表，而是把推荐流渲染、前端性能优化、广告归因、行为埋点和实时漏斗看板串成一条可以讲清楚的业务闭环。

## 项目定位

面向前端面试展示的小型 React 项目，用最小但完整的工程结构表达以下能力：

- 电商推荐流页面承接广告流量。
- 虚拟列表、图片懒加载、骨架屏优化长列表体验。
- 统一 `track` 方法收敛曝光、点击、加购、购买事件。
- 通过 `channel / campaign / creative` 贯穿广告归因。
- 由事件流实时聚合 CTR、加购率、购买率和维度表现。

## 核心链路

```text
广告入口选择
  -> 商品推荐流
  -> 有效曝光
  -> 点击商品
  -> 加购
  -> 模拟购买
  -> 实时数据看板
  -> 转化漏斗分析
```

## 页面

- `/`：广告入口页，选择渠道、活动、创意，进入推荐流。
- `/feed`：商品推荐流页，展示虚拟列表、懒加载图片、骨架屏，并触发用户行为埋点。
- `/dashboard`：实时数据看板，展示漏斗指标、渠道/创意表现和最近事件日志。

## 技术栈

- React
- TypeScript
- Vite
- React Router
- Zustand

## 工程结构

```text
src/
  components/          # 复用 UI 组件
  features/
    dashboard/         # 指标聚合
    feed/              # 虚拟列表、曝光检测
    tracking/          # 事件模型、track、事件 store
  mocks/               # 广告与商品 mock 数据
  pages/               # 页面级组件
  stores/              # 跨页面业务状态
  types/               # 通用业务类型
  utils/               # 格式化与 ID 工具
docs/
  PRD.md
  PRODUCT_DESIGN.md
  TECH_DESIGN.md
  TRACKING_DESIGN.md
  INTERVIEW_NOTES.md
```

## 埋点口径

事件统一通过 `track` 写入本地事件流。公共字段包括：

- `eventId`
- `eventName`
- `timestamp`
- `sessionId`
- `userId`
- `page`
- `channel`
- `campaign`
- `creative`
- `productId`
- `position`
- `payload`

事件类型：

- `page_view`
- `product_exposure`
- `product_click`
- `add_to_cart`
- `purchase`

有效曝光定义：商品卡片进入视口比例大于等于 50%，并停留至少 1000ms。同一 session 内同一商品只上报一次有效曝光。

## 运行

```bash
npm install
npm run dev
```

构建与检查：

```bash
npm run lint
npm run build
```

## 面试讲述主线

1. 我先把项目定义为“广告流量进入电商推荐流后的转化分析链路”，而不是普通虚拟列表 demo。
2. 推荐流里复用了虚拟列表、懒加载和骨架屏，解决长商品流的渲染成本和首屏体验问题。
3. 我设计了统一埋点协议，把曝光、点击、加购、购买全部收敛为事件流。
4. 广告入口选择的 `channel / campaign / creative` 会贯穿后续事件，用于做归因分析。
5. 看板不写死数据，而是从事件流实时聚合漏斗指标和维度表现。

## 当前 MVP

已完成：

- 广告入口页
- 推荐流页
- 虚拟列表
- 图片懒加载
- 骨架屏
- 埋点 SDK 雏形
- 有效曝光检测
- 广告归因
- 实时漏斗看板
- 项目文档与面试讲稿

未做：

- 后端服务
- 真实推荐算法
- 真实埋点平台上报
- 复杂图表库
- 完整订单系统
