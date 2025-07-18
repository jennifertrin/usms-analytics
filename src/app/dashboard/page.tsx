'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard'
import axios from 'axios'

// Configure axios to include credentials for session management
axios.defaults.withCredentials = true

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

interface UserSession {
  user_id: string
  has_data: boolean
  swimmer_name: string | null
}

export default function DashboardPage() {
  const [analysisData, setAnalysisData] = useState(null)
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/session`)
        setUserSession(response.data)
        
        // If user has data, fetch it
        if (response.data.has_data) {
          const dataResponse = await axios.get(`${API_BASE_URL}/api/data`)
          setAnalysisData(dataResponse.data)
        } else {
          // No data, redirect to home
          router.push('/')
        }
      } catch (error) {
        // No active session, redirect to home
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [API_BASE_URL, router])

  const handleClearSession = useCallback(async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/session`)
      setAnalysisData(null)
      setUserSession(null)
      router.push('/')
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }, [API_BASE_URL, router])

  const loadingScreen = useMemo(() => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-3xl">🏊‍♂️</span>
        </div>
        <div className="text-lg font-semibold text-slate-700">Loading...</div>
      </div>
    </div>
  ), [])

  if (isLoading) {
    return loadingScreen
  }

  if (!analysisData || !userSession) {
    return null // Will redirect to home
  }

  return (
    <Dashboard 
      analysisData={analysisData}
      userSession={userSession}
      onClearSession={handleClearSession}
    />
  )
} 