'use client'

import { useState, useEffect } from 'react'
import HomePage from '@/components/HomePage'
import Dashboard from '@/components/Dashboard'
import { AnalyzeResponse, SessionResponse } from '@/types/api'

export default function App() {
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null)
  const [userSession, setUserSession] = useState<SessionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          // Check if user has data
          const response = await fetch('/api/session', {
            headers: {
              'X-User-ID': userId
            }
          })
          
          if (response.ok) {
            const sessionData = await response.json()
            setUserSession(sessionData)
            
            // If user has data, fetch it
            if (sessionData.hasData) {
              const dataResponse = await fetch('/api/data', {
                headers: {
                  'X-User-ID': userId
                }
              })
              
              if (dataResponse.ok) {
                const data = await dataResponse.json()
                setAnalysisData(data)
              }
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleClearSession = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (userId) {
        await fetch('/api/session', {
          method: 'DELETE',
          headers: {
            'X-User-ID': userId
          }
        })
      }
      
      localStorage.removeItem('userId')
      setAnalysisData(null)
      setUserSession(null)
    } catch (error) {
      console.error('Clear session error:', error)
    }
  }

  const handleSetAnalysisData = (data: AnalyzeResponse) => {
    setAnalysisData(data)
    if (data.userSession) {
      localStorage.setItem('userId', data.userSession.userId)
      setUserSession({
        userId: data.userSession.userId,
        hasData: true,
        swimmerName: data.userSession.swimmerName,
        newSession: false
      })
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

  // Show dashboard if we have analysis data, otherwise show home page
  if (analysisData) {
    return (
      <Dashboard 
        analysisData={analysisData}
        userSession={userSession}
        onClearSession={handleClearSession}
      />
    )
  }

  return (
    <HomePage 
      analysisData={analysisData}
      userSession={userSession}
      onClearSession={handleClearSession}
      setAnalysisData={handleSetAnalysisData}
    />
  )
} 