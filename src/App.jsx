import { Routes, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import PageContainer from './components/layout/PageContainer'

import HomePage from './pages/HomePage'
import RunsPage from './pages/RunsPage'
import NewRunPage from './pages/NewRunPage'
import RunDetailsPage from './pages/RunDetailsPage'
import NotFoundPage from './pages/NotFoundPage'



function App() {
  return (
    <>
      <Header />
      <Navigation />

      <PageContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/runs" element={<RunsPage />} />
          <Route path="/runs/new" element={<NewRunPage />} />
          <Route path="/runs/:id" element={<RunDetailsPage />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageContainer>
    </>
  )
}

export default App