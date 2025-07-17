import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Dashboard from './components/Dashboard'
import axios from 'axios'

// Configure axios to include credentials for session management
axios.defaults.withCredentials = true

interface UserSession {
  user_id: string
  has_data: boolean
  swimmer_name: string | null
}

function App() {
  const [analysisData, setAnalysisData] = useState(null)
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/session')
        setUserSession(response.data)
        
        // If user has data, fetch it
        if (response.data.has_data) {
          const dataResponse = await axios.get('http://localhost:5000/api/data')
          setAnalysisData(dataResponse.data)
        }
      } catch (error) {
        // No active session, that's fine
        console.log('No active session found')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleNewAnalysis = (data: any) => {
    setAnalysisData(data)
    setUserSession({
      user_id: data.user_session.user_id,
      has_data: true,
      swimmer_name: data.user_session.swimmer_name
    })
  }

  const handleClearSession = async () => {
    try {
      await axios.delete('http://localhost:5000/api/session')
      setAnalysisData(null)
      setUserSession(null)
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-3xl">🏊‍♂️</span>
          </div>
          <div className="text-lg font-semibold text-slate-700">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen">
        <main className="container mx-auto">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  analysisData={analysisData}
                  setAnalysisData={handleNewAnalysis}
                  userSession={userSession}
                  onClearSession={handleClearSession}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  analysisData={analysisData}
                  userSession={userSession}
                  onClearSession={handleClearSession}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
