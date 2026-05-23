import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'
import KeepAlive from './KeepAlive'
import LoadingSpinner from '../ui/LoadingSpinner'
import OrderPage from '../../pages/OrderPage'
import LibraryPage from '../../pages/LibraryPage'
import DishDetailPage from '../../pages/DishDetailPage'
import DishFormPage from '../../pages/DishFormPage'
import ShowcasePage from '../../pages/ShowcasePage'
import CookedMealFormPage from '../../pages/CookedMealFormPage'
import ProfilePage from '../../pages/ProfilePage'

export default function AppLayout() {
  const { user, loading } = useAuth()
  const { pathname } = useLocation()

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

  const isOrder = pathname.startsWith('/order')
  const isLibrary = pathname === '/library'
  const isShowcase = pathname === '/showcase'
  const isProfile = pathname.startsWith('/profile')

  return (
    <div className="min-h-dvh bg-warm-50">
      <InstallPrompt />
      <header className="sticky top-0 z-40 bg-warm-50 border-b border-gray-100">
        <div className="flex items-center justify-center h-12 max-w-lg mx-auto px-4">
          <h1 className="text-lg font-semibold text-gray-800">女王厨房</h1>
        </div>
      </header>
      <main className="max-w-lg mx-auto pb-20 pt-2 px-4">
        {/* Tab pages — kept alive across tab switches */}
        <KeepAlive show={isOrder}>
          <OrderPage />
        </KeepAlive>
        <KeepAlive show={isLibrary}>
          <LibraryPage />
        </KeepAlive>
        <KeepAlive show={isShowcase}>
          <ShowcasePage />
        </KeepAlive>
        <KeepAlive show={isProfile}>
          <ProfilePage />
        </KeepAlive>

        {/* Sub-routes (detail, form pages) — not kept alive */}
        <Routes>
          <Route path="/library/new" element={<DishFormPage />} />
          <Route path="/library/:dishId/edit" element={<DishFormPage />} />
          <Route path="/library/:dishId" element={<DishDetailPage />} />
          <Route path="/showcase/new" element={<CookedMealFormPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
