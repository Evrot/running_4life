import { Routes, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import PageContainer from './components/layout/PageContainer'
import ProtectedRoute from './components/auth/ProtectedRoute'

import HomePage from './pages/HomePage'
import RunsPage from './pages/RunsPage'
import NewRunPage from './pages/NewRunPage'
import RunDetailsPage from './pages/RunDetailsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <>
      <Header />
      <Navigation />

      <PageContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/runs"
            element={
              <ProtectedRoute>
                <RunsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/runs/new"
            element={
              <ProtectedRoute>
                <NewRunPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/runs/:id"
            element={
              <ProtectedRoute>
                <RunDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageContainer>
    </>
  )
}

export default App