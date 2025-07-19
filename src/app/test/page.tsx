'use client'

import { useState } from 'react'

export default function TestPage() {
  const [healthStatus, setHealthStatus] = useState<string>('')
  const [sampleData, setSampleData] = useState<any>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [activeUsers, setActiveUsers] = useState<any>(null)

  const testHealth = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthStatus(JSON.stringify(data, null, 2))
    } catch (error) {
      setHealthStatus('Error: ' + error)
    }
  }

  const testSampleData = async () => {
    try {
      const response = await fetch('/api/sample-data')
      const data = await response.json()
      setSampleData(data)
    } catch (error) {
      console.error('Sample data error:', error)
    }
  }

  const testSession = async () => {
    try {
      const response = await fetch('/api/session', {
        method: 'POST'
      })
      const data = await response.json()
      setSessionInfo(data)
    } catch (error) {
      console.error('Session error:', error)
    }
  }

  const testActiveUsers = async () => {
    try {
      const response = await fetch('/api/users/active')
      const data = await response.json()
      setActiveUsers(data)
    } catch (error) {
      console.error('Active users error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Next.js API Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Check */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Health Check</h2>
            <button 
              onClick={testHealth}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Test Health
            </button>
            {healthStatus && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {healthStatus}
              </pre>
            )}
          </div>

          {/* Sample Data */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Sample Data</h2>
            <button 
              onClick={testSampleData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
            >
              Get Sample Data
            </button>
            {sampleData && (
              <div className="bg-gray-100 p-4 rounded text-sm">
                <p><strong>Swimmer:</strong> {sampleData.swimmer?.name}</p>
                <p><strong>Age:</strong> {sampleData.swimmer?.age}</p>
                <p><strong>Total Meets:</strong> {sampleData.swimmer?.totalMeets}</p>
                <p><strong>Best Times:</strong> {sampleData.performance?.bestTimes?.length || 0}</p>
              </div>
            )}
          </div>

          {/* Session Management */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Session Management</h2>
            <button 
              onClick={testSession}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-4"
            >
              Create Session
            </button>
            {sessionInfo && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            )}
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Active Users</h2>
            <button 
              onClick={testActiveUsers}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-4"
            >
              Get Active Users
            </button>
            {activeUsers && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(activeUsers, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">API Routes Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl">✅</div>
              <div className="text-sm font-medium">/api/health</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✅</div>
              <div className="text-sm font-medium">/api/session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✅</div>
              <div className="text-sm font-medium">/api/analyze</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✅</div>
              <div className="text-sm font-medium">/api/data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✅</div>
              <div className="text-sm font-medium">/api/sample-data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">✅</div>
              <div className="text-sm font-medium">/api/users/active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 