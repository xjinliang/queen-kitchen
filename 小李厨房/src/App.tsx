import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter basename="/queen-kitchen">
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<AppLayout />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
