# 电商推荐流转化分析实验台 埋点事件协议

## 1. 文档定位

本文档定义项目中的埋点事件协议，回答“数据如何采集、如何归因、如何计算指标”。

本项目是技术交流学习项目，不接真实埋点平台，但需要模拟真实业务中的事件设计思路。后续实现 `track` 方法、有效曝光检测、广告归因和实时看板时，都以本文档为准。

当以下内容变化时，必须更新本文档：

- 事件名称。
- 事件字段。
- 事件触发时机。
- 有效曝光规则。
- 广告归因字段。
- 看板指标计算口径。

### 1.1 当前实现状态

当前埋点协议已在 MVP 中落地：

- `track` 统一补齐 `eventId`、`timestamp`、`sessionId`、`userId`、`channel`、`campaign`、`creative`。
- `page_view`、`product_exposure`、`product_click`、`add_to_cart`、`purchase` 均已接入。
- 有效曝光使用 IntersectionObserver：可见比例大于等于 50%，并停留至少 1000ms。
- 同一 session 内同一商品只上报一次有效曝光。
- 看板指标全部从本地事件流聚合得到。
- 当前事件只保存在前端运行时状态中，刷新页面后事件流会重置。

## 2. 埋点目标

埋点系统服务于一条核心链路：

```text
广告入口 -> 推荐流曝光 -> 商品点击 -> 加购 -> 购买 -> 看板分析
```

需要回答的问题：

- 用户是从哪个广告渠道、活动、创意进入推荐流的？
- 哪些商品被有效曝光了？
- 曝光后有多少点击？
- 点击后有多少加购？
- 点击后有多少购买？
- 不同 channel / creative 的转化表现有什么差异？

## 3. 事件流原则

### 3.1 统一入口

所有行为事件必须通过统一 `track` 方法生成。

组件不直接创建完整事件对象，只传递必要业务参数。

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

`track` 负责补齐：

- eventId
- timestamp
- sessionId
- userId
- channel
- campaign
- creative

### 3.2 事件流是看板唯一数据源

看板中的曝光、点击、加购、购买、CTR、加购率、购买率都必须从事件流聚合得到。

禁止在看板中手写假指标。

### 3.3 MVP 不上报服务端

MVP 阶段事件只写入前端本地状态。

后续可扩展为：

- 批量上报。
- 失败重试。
- 页面卸载前 flush。
- 采样。
- 服务端清洗与去重。

## 4. 事件公共字段

所有事件都必须包含以下字段：

```ts
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

### 4.1 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| eventId | string | 是 | 事件唯一 ID，本地生成 |
| eventName | EventName | 是 | 事件名称 |
| timestamp | number | 是 | 事件发生时间，毫秒时间戳 |
| sessionId | string | 是 | 当前会话 ID |
| userId | string | 是 | 模拟匿名用户 ID |
| page | PageName | 是 | 事件发生页面 |
| channel | string | 否 | 广告渠道 |
| campaign | string | 否 | 广告活动 |
| creative | string | 否 | 广告创意 |
| productId | string | 否 | 商品 ID，商品相关事件必填 |
| position | number | 否 | 商品在推荐流中的位置，商品相关事件必填 |
| payload | object | 否 | 事件扩展字段 |

### 4.2 枚举类型

```ts
type EventName =
  | 'page_view'
  | 'product_exposure'
  | 'product_click'
  | 'add_to_cart'
  | 'purchase';

type PageName = 'ad_entry' | 'feed' | 'dashboard';
```

## 5. 身份与会话

### 5.1 sessionId

生成规则：

- 应用启动时读取 `sessionStorage`。
- 如果不存在，则生成一个新的 sessionId。
- 当前浏览器标签页会话内保持不变。

用途：

- 标识一次实验会话。
- 支撑“同一 session 内同一商品只曝光一次”的规则。

### 5.2 userId

生成规则：

- 应用启动时读取 `localStorage`。
- 如果不存在，则生成一个匿名 userId。
- 后续访问保持不变。

用途：

- 模拟匿名用户。
- 不涉及真实登录和用户隐私。

## 6. 广告归因规则

### 6.1 归因字段

广告入口页产生三个归因字段：

```ts
type AdContext = {
  channel: string;
  campaign: string;
  creative: string;
};
```

### 6.2 归因策略

MVP 采用 session 内当前广告上下文归因。

规则：

- 用户在广告入口页选择 channel、campaign、creative。
- 进入推荐流后，后续事件都携带当前广告上下文。
- 如果用户重新选择广告入口，后续新事件使用新的广告上下文。
- 历史事件不回写，不修改。

### 6.3 归因字段适用事件

以下事件都需要携带广告归因字段：

- page_view
- product_exposure
- product_click
- add_to_cart
- purchase

说明：

- 入口页 page_view 可以携带默认广告上下文。
- 推荐流和看板页 page_view 必须携带当前广告上下文。

## 7. 事件协议

### 7.1 page_view

页面访问事件。

触发时机：

- 进入广告入口页。
- 进入推荐流页。
- 进入实时看板页。

必填字段：

- eventId
- eventName
- timestamp
- sessionId
- userId
- page

建议 payload：

```ts
payload: {
  path: string;
}
```

示例：

```json
{
  "eventName": "page_view",
  "page": "feed",
  "channel": "douyin_feed",
  "campaign": "618_preheat",
  "creative": "video_a",
  "payload": {
    "path": "/feed"
  }
}
```

### 7.2 product_exposure

商品有效曝光事件。

触发时机：

```text
商品卡片进入视口比例 >= 50%，并连续停留 >= 1000ms。
```

去重规则：

- 同一 session 内，同一 productId 只上报一次。
- 虚拟列表导致组件卸载再挂载时，也不能重复上报。

必填字段：

- productId
- position
- channel
- campaign
- creative

建议 payload：

```ts
payload: {
  visibleRatio: number;
  stayDuration: number;
  category: string;
}
```

示例：

```json
{
  "eventName": "product_exposure",
  "page": "feed",
  "productId": "p_001",
  "position": 1,
  "channel": "douyin_feed",
  "campaign": "618_preheat",
  "creative": "video_a",
  "payload": {
    "visibleRatio": 0.5,
    "stayDuration": 1000,
    "category": "beauty"
  }
}
```

### 7.3 product_click

商品点击事件。

触发时机：

- 用户点击商品卡片主体区域。

去重规则：

- 不去重。
- 同一商品多次点击，需要记录多次。

必填字段：

- productId
- position
- channel
- campaign
- creative

建议 payload：

```ts
payload: {
  price: number;
  category: string;
}
```

注意：

- 点击加购按钮和购买按钮不应触发 product_click。
- 按钮需要阻止事件冒泡。

### 7.4 add_to_cart

加购事件。

触发时机：

- 用户点击商品卡片上的加购按钮。

去重规则：

- 不去重。
- 同一商品可以多次加购，MVP 均记录。

必填字段：

- productId
- position
- channel
- campaign
- creative

建议 payload：

```ts
payload: {
  price: number;
  category: string;
}
```

业务含义：

- 表示用户从点击兴趣进入交易意图。
- 用于计算加购转化率。

### 7.5 purchase

模拟购买事件。

触发时机：

- 用户点击商品卡片上的购买按钮。

去重规则：

- 不去重。
- MVP 不校验库存、不校验支付状态。

必填字段：

- productId
- position
- channel
- campaign
- creative

建议 payload：

```ts
payload: {
  price: number;
  orderAmount: number;
  category: string;
}
```

业务含义：

- 表示模拟交易完成。
- 用于计算购买转化率。

## 8. 有效曝光详细规则

### 8.1 判定条件

商品曝光必须同时满足：

```text
intersectionRatio >= 0.5
stayDuration >= 1000ms
not exposed in current session
```

### 8.2 状态流转

```text
商品进入视口 >= 50%
  -> 启动 1000ms 计时器
  -> 期间一直满足 >= 50%
  -> 检查 exposedProductIds
  -> 未曝光则 track(product_exposure)
  -> 写入 exposedProductIds
```

如果中途离开视口：

```text
商品进入视口 >= 50%
  -> 启动计时器
  -> 1000ms 内低于 50% 或卸载
  -> 清除计时器
  -> 不上报曝光
```

### 8.3 边界情况

- 骨架屏不参与曝光。
- 图片是否加载完成不影响曝光判定。
- 商品快速滑过不曝光。
- 商品曝光后再次进入视口不重复曝光。
- 清空数据后，曝光去重集合也清空，可以重新曝光。

## 9. 看板指标口径

### 9.1 基础指标

```ts
exposures = count(eventName === 'product_exposure')
clicks = count(eventName === 'product_click')
addToCarts = count(eventName === 'add_to_cart')
purchases = count(eventName === 'purchase')
```

### 9.2 转化率

```text
CTR = clicks / exposures
加购转化率 = addToCarts / clicks
购买转化率 = purchases / clicks
```

规则：

- 分母为 0 时返回 0。
- UI 展示时转为百分比。
- 百分比保留 1 位小数。

### 9.3 漏斗层级

```text
曝光 -> 点击 -> 加购 -> 购买
```

每层展示：

- 数量。
- 相对上一层的转化率。

特殊规则：

- 点击相对曝光。
- 加购相对点击。
- 购买相对点击。MVP 中购买率主要表达“点击后的购买转化”。

## 10. 维度统计口径

MVP 支持两个维度：

- channel
- creative

每个维度值统计：

- exposures
- clicks
- addToCarts
- purchases
- ctr
- purchaseRate

计算规则与全局指标一致，只是先按维度字段分组。

如果事件缺少维度字段：

- 归为 `unknown`。

## 11. 最近事件日志

展示规则：

- 展示最新 20 条事件。
- 最新事件排在最上方。
- 使用中文事件名。
- 时间展示为本地时间。

事件中文名：

| eventName | 展示文案 |
| --- | --- |
| page_view | 页面访问 |
| product_exposure | 商品曝光 |
| product_click | 商品点击 |
| add_to_cart | 加购 |
| purchase | 购买 |

日志建议展示字段：

- 时间
- 事件
- 页面
- 商品 ID
- channel
- campaign
- creative

## 12. 验证清单

实现后需要验证：

- 进入三个页面都会产生 page_view。
- 从广告入口进入推荐流后，事件携带正确 channel、campaign、creative。
- 商品卡片停留不足 1000ms 不产生曝光。
- 商品卡片可见比例不足 50% 不产生曝光。
- 同一商品在同一 session 内只曝光一次。
- 点击商品卡片产生 product_click。
- 点击加购只产生 add_to_cart，不额外产生 product_click。
- 点击购买只产生 purchase，不额外产生 product_click。
- 看板曝光、点击、加购、购买数量和事件日志一致。
- CTR、加购率、购买率分母为 0 时展示 0%。
- 清空数据后，事件流和曝光去重集合都被清空。

## 13. 项目讲述重点

可以这样讲：

```text
我没有把埋点写成零散的 console.log，而是设计了统一事件模型。所有事件都通过 track 进入事件流，track 负责补齐 sessionId、userId、广告归因字段和时间戳。曝光事件没有在组件渲染时上报，而是用 IntersectionObserver 判断 50% 可见，再结合 1000ms 停留时间，最后用 session 级 Set 做去重。看板中的 CTR、加购率和购买率都从事件流实时聚合，这样前端页面、埋点采集和业务分析之间形成了一个完整闭环。
```

重点强调：

- 曝光不等于渲染。
- 广告归因字段要贯穿后续事件。
- 事件流是看板唯一数据源。
- 虚拟列表会带来重复挂载问题，所以曝光必须做 session 级去重。

## 14. 决策记录

### 14.1 2026-04-20

- MVP 只模拟本地埋点，不接真实服务端。
- 事件流作为实时看板唯一数据源。
- 有效曝光规则固定为 50% 可见 + 1000ms 停留。
- 同一 session 内同一商品只上报一次曝光。
- 点击、加购、购买不去重。
- 维度对比先支持 channel 和 creative。


