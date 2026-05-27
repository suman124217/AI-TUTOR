import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import RoadmapPage from './pages/RoadmapPage'
import useCareerStore from './store/careerStore'

function ProtectedRoute({ children }) {
  const roadmapData = useCareerStore(s => s.roadmapData)
  return roadmapData ? children : <Navigate to="/onboarding" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/roadmap" element={
          <ProtectedRoute>
            <RoadmapPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}