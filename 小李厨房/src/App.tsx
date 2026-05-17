import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import OrderPage from './pages/OrderPage'
import LibraryPage from './pages/LibraryPage'
import DishDetailPage from './pages/DishDetailPage'
import DishFormPage from './pages/DishFormPage'
import ShowcasePage from './pages/ShowcasePage'
import CookedMealFormPage from './pages/CookedMealFormPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter basename="/queen-kitchen">
      <AuthProvider>
        <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/order" element={<OrderPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/new" element={<DishFormPage />} />
            <Route path="/library/:dishId" element={<DishDetailPage />} />
            <Route path="/library/:dishId/edit" element={<DishFormPage />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/showcase/new" element={<CookedMealFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/order" replace />} />
        </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
