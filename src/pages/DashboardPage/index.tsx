import { Link } from 'react-router-dom'

export const DASHBOARD_PAGE_ROUTE = '/dashboard'

export function DashboardPage() {
  return (
    <main className="page">
      <section className="empty-state">
        <p className="eyebrow">Dashboard</p>
        <h1>实时漏斗看板将在第四阶段接入</h1>
        <p>
          当前第三阶段先完成广告入口、推荐流、虚拟列表、图片懒加载和骨架屏。下一阶段会把事件流和转化指标接进这里。
        </p>
        <div className="actions-row">
          <Link className="primary-button" to="/feed">
            回到推荐流
          </Link>
          <Link className="secondary-button" to="/">
            重新选择广告入口
          </Link>
        </div>
      </section>
    </main>
  )
}

