# commerce-feed-insight

电商推荐流转化分析实验台。项目模拟“广告流量进入电商推荐流后的转化分析链路”，把推荐流渲染、前端性能优化、广告归因、行为埋点和实时漏斗看板串成一条完整的前端业务闭环。

## 在线预览

部署完成后会在这里补充 Live Demo 链接。

## 项目概述

项目围绕一条电商广告转化链路展开：

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

它关注的问题是：当用户从广告入口进入电商推荐流后，前端如何承接流量、追踪行为、保留归因信息，并基于事件流实时计算转化指标。

## 核心能力

- 广告入口：选择 `channel / campaign / creative`，形成广告归因上下文。
- 商品推荐流：展示商品卡片，支持长列表渲染和基础交互。
- 性能优化：虚拟列表、图片懒加载、骨架屏。
- 行为埋点：统一 `track` 方法收敛页面访问、曝光、点击、加购、购买事件。
- 有效曝光：商品卡片进入视口比例大于等于 50%，并停留至少 1000ms。
- 广告归因：后续行为事件自动携带广告上下文字段。
- 实时看板：从本地事件流聚合曝光、点击、加购、购买、CTR、加购率、购买率。

## 页面

- `/`：广告入口页，选择渠道、活动、创意。
- `/feed`：商品推荐流页，展示商品流并触发行为事件。
- `/dashboard`：实时数据看板，展示漏斗指标、维度表现和最近事件日志。

## 技术栈

- React
- TypeScript
- Vite
- React Router
- Zustand
- Playwright

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
  screenshots/
```

## 埋点事件

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

## 看板指标

- Exposures：有效曝光数
- Clicks：商品点击数
- Carts：加购数
- Purchases：购买数
- CTR：点击数 / 曝光数
- Cart Rate：加购数 / 点击数
- Purchase Rate：购买数 / 点击数

看板数据全部从事件流实时聚合，不在 UI 中写死指标。

## 本地运行

```bash
npm install
npm run dev
```

## 检查与构建

```bash
npm run lint
npm run build
npm run test:e2e
```

## 当前范围

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
- Playwright 冒烟测试

未包含：

- 后端服务
- 真实推荐算法
- 真实埋点平台上报
- 完整订单系统
- 复杂 BI 图表平台
