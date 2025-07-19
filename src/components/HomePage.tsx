'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'



interface HomePageProps {
  analysisData: any
  userSession: any
  onClearSession: () => void
  setAnalysisData: (data: any) => void
}

const HomePage = ({ analysisData, userSession, onClearSession, setAnalysisData }: HomePageProps) => {
  const [usmsLink, setUsmsLink] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAnalyze = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usmsLink.trim()) {
      setError('Please enter a USMS link')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usmsLink: usmsLink.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data)
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to analyze USMS results. Please try again.')
      }
    } catch (error: any) {
      console.error('Analysis error:', error)
      setError('Failed to analyze USMS results. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [usmsLink, setAnalysisData, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  USMS Swim Analytics
                </h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100/70 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => router.push('/')}
                className="relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base group bg-white text-slate-800 shadow-md transform scale-105"
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-sm sm:text-base transition-all duration-300 scale-110">🏠</span>
                  <span className="font-semibold">Home</span>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                disabled={!analysisData}
                className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base group ${
                  analysisData
                    ? 'text-slate-600 hover:text-slate-800 hover:bg-white/70'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-sm sm:text-base transition-all duration-300 group-hover:scale-105">📊</span>
                  <span className="font-semibold">Dashboard</span>
                </div>
                
                {/* Tooltip for disabled dashboard */}
                {!analysisData && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Analyze results first
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 sm:p-8 text-center">
            {/* Header Section - More Compact */}
            <div className="mb-6 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-2xl sm:text-3xl">🏊‍♂️</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                Swimming Performance Analytics
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-4 sm:mb-6 px-4">
                Get comprehensive performance insights from your USMS results
              </p>
            </div>

            {/* Main Input Section - Enhanced Focus */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 sm:p-8 mb-6 sm:mb-10 border-2 border-blue-100 shadow-lg">
              <div className="max-w-2xl mx-auto">
                
                <form onSubmit={handleAnalyze} className="space-y-4 sm:space-y-6">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3 mb-3 text-center px-2">
                      📋 Enter your USMS Membership ID or URL from your USMS individual meet results page
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        id="usmsLink"
                        value={usmsLink}
                        onChange={(e) => setUsmsLink(e.target.value)}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAnalyzing}
                        placeholder="Enter USMS link or ID..."
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <span className="text-blue-400 text-lg sm:text-xl">🔍</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 shadow-sm">
                      <p className="text-red-700 font-medium text-sm sm:text-base">❌ {error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAnalyzing || !usmsLink.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base">Analyzing Your Results...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🚀</span>
                        <span className="text-sm sm:text-base">Analyze My Results</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 