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
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Single effect to handle all data loading
  useEffect(() => {
    if (!isClient) return

    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check for userId in localStorage
        const userId = localStorage.getItem('userId')
        if (!userId) {
          console.log('No userId found, redirecting to home')
          router.push('/')
          return
        }

        // Check session and get data in parallel
        const [sessionResponse, dataResponse] = await Promise.all([
          fetch('/api/session', {
            headers: { 'X-User-ID': userId }
          }),
          fetch('/api/data', {
            headers: { 'X-User-ID': userId }
          })
        ])

        // Handle session response
        if (!sessionResponse.ok) {
          console.log('Session not found, redirecting to home')
          localStorage.removeItem('userId')
          router.push('/')
          return
        }

        const sessionData = await sessionResponse.json()
        
        // Handle data response
        if (!dataResponse.ok) {
          console.log('No data found, redirecting to home')
          router.push('/')
          return
        }

        const data = await dataResponse.json()
        
        // Set both states at once to minimize re-renders
        setUserSession(sessionData)
        setAnalysisData(data)
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setError('Failed to load dashboard data')
        // Clear invalid session and redirect
        localStorage.removeItem('userId')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [isClient, router])

  const handleClearSession = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (userId) {
        await fetch('/api/session', {
          method: 'DELETE',
          headers: { 'X-User-ID': userId }
        })
      }
      
      localStorage.removeItem('userId')
      setAnalysisData(null)
      setUserSession(null)
      router.push('/')
    } catch (error) {
      console.error('Error clearing session:', error)
      // Still redirect even if API call fails
      localStorage.removeItem('userId')
      router.push('/')
    }
  }, [router])

  const loadingScreen = useMemo(() => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-3xl">🏊‍♂️</span>
        </div>
        <div className="text-lg font-semibold text-slate-700">Loading dashboard...</div>
        {error && (
          <div className="text-red-600 mt-2 text-sm">{error}</div>
        )}
      </div>
    </div>
  ), [error])

  // Show loading screen while not on client or while loading
  if (!isClient || isLoading) {
    return loadingScreen
  }

  // Show loading if data is missing (will redirect)
  if (!analysisData || !userSession) {
    return loadingScreen
  }

  return (
    <Dashboard 
      analysisData={analysisData}
      userSession={userSession}
      onClearSession={handleClearSession}
    />
  )
} 