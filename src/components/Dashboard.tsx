'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Plot from 'react-plotly.js'
import MeetBreakdown from './MeetBreakdown'
import PersonalBests from './PersonalBests'

interface DashboardProps {
  analysisData: any
  userSession: any
  onClearSession: () => void
}

const Dashboard = ({ analysisData, userSession, onClearSession }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  // Use real data from analysisData, with fallbacks for missing data
  const swimmerData = analysisData?.swimmer || {
    name: 'Unknown Swimmer',
    age: 0,
    totalMeets: 0,
    totalEvents: 0
  }
  
  const performanceData = analysisData?.performance || {
    bestTimes: [],
    recentTimes: []
  }

  const clubs = analysisData?.clubs || []

  // Create chart data from real performance data with dates
  const performanceChartData = performanceData.recentTimes.length > 0 ? 
    performanceData.recentTimes.map((eventData: any, index: number) => ({
      x: eventData.dates || Array.from({ length: eventData.times.length }, (_, i) => `Meet ${i + 1}`),
      y: eventData.times,
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: eventData.event,
      line: { color: index % 2 === 0 ? '#3b82f6' : '#64748b', width: 3 },
      marker: { size: 8 }
    })) : []

  // Use real event distribution data from analysisData
  const eventDistribution = analysisData?.eventDistribution || {}

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', description: 'Dashboard summary' },
    { id: 'personal-bests', label: 'Personal Bests', icon: '🏆', description: 'Best times & records' }
  ]

  // Determine if Best Times list is extended (more than 5 items)
  const isBestTimesExtended = performanceData.bestTimes.length > 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl sm:text-2xl">🏊</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {swimmerData.name || 'Swimmer Dashboard'}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  {swimmerData.totalMeets ? ` ${swimmerData.totalMeets} meets` : ' No meets'} • 
                  {swimmerData.totalEvents ? ` ${swimmerData.totalEvents} events` : ' No events'}
                </p>
              </div>
            </div>
            
            {/* Navigation and Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200"
              >
                🏠 Home
              </button>
              <button
                onClick={onClearSession}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors duration-200"
              >
                🗑️ Clear Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-3 mb-6 sm:mb-8 shadow-lg border border-white/50">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 text-sm sm:text-base group overflow-hidden ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform scale-105 ring-4 ring-blue-200'
                    : 'bg-white/60 text-slate-700 hover:bg-white/90 hover:text-slate-900 hover:shadow-md'
                }`}
              >
                {/* Active tab background effect */}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 animate-pulse"></div>
                )}
                
                <div className="relative flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">{tab.icon}</span>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-sm sm:text-base">{tab.label}</div>
                    <div className={`text-xs opacity-75 ${activeTab === tab.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      {tab.description}
                    </div>
                  </div>
                </div>
                
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-full shadow-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content with Enhanced Transitions */}
        <div className="relative">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
              
              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Best Times Card - First Column */}
                <div className={`bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 ${isBestTimesExtended ? 'lg:row-span-2' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                      Best Times
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {performanceData.bestTimes.length > 0 ? (
                      performanceData.bestTimes.map((time: any, index: number) => (
                        <div key={index} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-3 sm:p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-800 font-bold text-xs sm:text-sm">{time.event} {time.courseType}</span>
                            <span className="font-mono text-blue-600 font-black text-sm sm:text-base">{time.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <span className="text-3xl sm:text-4xl mb-2 block opacity-50">⏱️</span>
                        <p className="text-slate-500 font-medium text-xs sm:text-sm">No best times available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Distribution - Second Column */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">Event Distribution</h3>
                  </div>
                  
                  {Object.keys(eventDistribution).length > 0 ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Plot
                        data={[{
                          values: Object.values(eventDistribution) as number[],
                          labels: Object.keys(eventDistribution),
                          type: 'pie' as const,
                          hole: 0.3,
                          marker: {
                            colors: ['#3b82f6', '#64748b', '#1e40af', '#475569', '#1e293b', '#0f172a', '#334155']
                          },
                          textinfo: 'percent' as const,
                          textposition: 'inside' as const,
                          textfont: { size: 12, color: 'white' },
                          hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
                        }]}
                        layout={{
                          height: 300,
                          width: undefined,
                          margin: { t: 10, b: 60, l: 10, r: 10 },
                          showlegend: true,
                          legend: {
                            orientation: 'h' as const,
                            x: 0.5,
                            xanchor: 'center',
                            y: -0.15,
                            font: { size: 10 }
                          },
                          title: { text: '' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          font: { size: 11 }
                        }}
                        config={{ displayModeBar: false }}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <span className="text-3xl sm:text-4xl mb-2 block opacity-50">📊</span>
                      <p className="text-slate-500 font-medium text-xs sm:text-sm">No event data available</p>
                    </div>
                  )}
                </div>

                {/* Summary Stats - Third Column */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">Summary Stats</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl font-bold text-slate-600 mb-1 sm:mb-2">
                        {swimmerData.totalMeets || 0}
                      </div>
                      <div className="text-slate-600 font-medium text-xs sm:text-sm">Total Meets</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
                        {swimmerData.totalEvents || 0}
                      </div>
                      <div className="text-slate-600 font-medium text-xs sm:text-sm">Total Events</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl font-bold text-slate-600 mb-1 sm:mb-2">
                        {performanceData.bestTimes.length || 0}
                      </div>
                      <div className="text-slate-600 font-medium text-xs sm:text-sm">Best Times</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl font-bold text-slate-600 mb-1 sm:mb-2">
                        {clubs.length || 0}
                      </div>
                      <div className="text-slate-600 font-medium text-xs sm:text-sm">Clubs</div>
                    </div>
                  </div>
                </div>

                {/* Performance Trends Chart - Positioned conditionally */}
                {isBestTimesExtended && (
                  <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">Performance Trends</h3>
                    </div>
                    
                    {performanceChartData.length > 0 ? (
                      <Plot
                        data={performanceChartData}
                        layout={{
                          height: 400,
                          margin: { t: 20, b: 60, l: 60, r: 20 },
                          xaxis: { 
                            title: { text: 'Meet', font: { size: 14 } },
                            gridcolor: 'rgba(0,0,0,0.1)'
                          },
                          yaxis: { 
                            title: { text: 'Time (seconds)', font: { size: 14 } },
                            autorange: 'reversed',
                            gridcolor: 'rgba(0,0,0,0.1)'
                          },
                          legend: {
                            orientation: 'h',
                            x: 0.5,
                            xanchor: 'center',
                            y: -0.15,
                            font: { size: 11 }
                          },
                          title: { text: '' },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          font: { size: 12 }
                        }}
                        config={{ displayModeBar: false }}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="text-center py-12 sm:py-16">
                        <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block opacity-50">📈</span>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">No performance data available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Performance Trends below when Best Times is not extended */}
              {!isBestTimesExtended && (
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">Performance Trends</h3>
                  </div>
                  
                  {performanceChartData.length > 0 ? (
                    <Plot
                      data={performanceChartData}
                      layout={{
                        height: 400,
                        margin: { t: 20, b: 60, l: 60, r: 20 },
                        xaxis: { 
                          title: { text: 'Meet', font: { size: 14 } },
                          gridcolor: 'rgba(0,0,0,0.1)'
                        },
                        yaxis: { 
                          title: { text: 'Time (seconds)', font: { size: 14 } },
                          autorange: 'reversed',
                          gridcolor: 'rgba(0,0,0,0.1)'
                        },
                        title: { text: '' },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        font: { size: 12 }
                      }}
                      config={{ displayModeBar: false }}
                      useResizeHandler={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block opacity-50">📈</span>
                      <p className="text-slate-500 font-medium text-sm sm:text-base">No performance data available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Personal Bests Tab */}
          {activeTab === 'personal-bests' && (
            <div className="animate-in fade-in duration-500">     
              <PersonalBests analysisData={analysisData} />
            </div>
          )}

          {activeTab === 'meet-breakdown' && (
            <div className="animate-in fade-in duration-500">
              <MeetBreakdown analysisData={analysisData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 