'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 sm:p-8 text-center">
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

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 sm:p-8 mb-6 sm:mb-10 border-2 border-blue-100 shadow-lg">
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-slate-500 mb-4">
                  Next.js conversion successful! 🎉
                </p>
                <p className="text-lg font-semibold text-slate-700">
                  The USMS Analytics app has been successfully converted to Next.js.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 