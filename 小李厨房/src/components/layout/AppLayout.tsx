import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-warm-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-dvh bg-warm-50">
      <InstallPrompt />
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-center h-12 max-w-lg mx-auto px-4">
          <h1 className="text-lg font-semibold text-gray-800">女王厨房</h1>
        </div>
      </header>
      <main className="max-w-lg mx-auto pb-20 pt-2 px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
