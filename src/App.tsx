import './App.css'
import { adChannels, campaigns, creatives } from './mocks/ads'
import { products } from './mocks/products'

function App() {
  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Commerce Feed Insight</p>
        <h1>电商推荐流转化分析实验台</h1>
        <p className="summary">
          第二阶段已完成项目骨架和 mock 数据，下一阶段会按广告入口、推荐流、虚拟列表、懒加载和骨架屏的顺序实现核心页面。
        </p>
      </section>

      <section className="readiness-grid" aria-label="项目搭建状态">
        <article>
          <span className="metric">{adChannels.length}</span>
          <p>广告渠道</p>
        </article>
        <article>
          <span className="metric">{campaigns.length}</span>
          <p>活动配置</p>
        </article>
        <article>
          <span className="metric">{creatives.length}</span>
          <p>创意版本</p>
        </article>
        <article>
          <span className="metric">{products.length}</span>
          <p>mock 商品</p>
        </article>
      </section>

      <section className="next-stage">
        <h2>下一步</h2>
        <p>
          进入第三阶段后，会先实现广告入口页，再把广告上下文接到推荐流和后续埋点链路中。
        </p>
      </section>
    </main>
  )
}

export default App
