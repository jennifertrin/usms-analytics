'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard'
import { SessionResponse, AnalyzeResponse } from '@/types/api'

// Force dynamic rendering to avoid SSR issues with localStorage
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null)
  const [userSession, setUserSession] = useState<SessionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          router.push('/')
          return
        }

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
          } else {
            // No data, redirect to home
            router.push('/')
          }
        } else {
          // No active session, redirect to home
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
  }, [router])

  const handleClearSession = useCallback(async () => {
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
      router.push('/')
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }, [router])

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