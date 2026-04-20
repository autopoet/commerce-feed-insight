import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="返回广告入口页">
          <span className="brand-mark">CF</span>
          <span>
            <strong>电商推荐流转化分析实验台</strong>
            <small>Commerce Feed Insight</small>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="主导航">
          <NavLink to="/">广告入口</NavLink>
          <NavLink to="/feed">推荐流</NavLink>
          <NavLink to="/dashboard">实时看板</NavLink>
        </nav>
      </header>

      {children}
    </div>
  )
}
