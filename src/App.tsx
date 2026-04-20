import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppShell } from './components/AppShell'
import { AdEntryPage } from './pages/AdEntryPage'
import { DashboardPage } from './pages/DashboardPage'
import { FeedPage } from './pages/FeedPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<AdEntryPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App

