import { useState } from 'react'
import Plot from 'react-plotly.js'

interface MeetBreakdownProps {
  analysisData: any
}

const MeetBreakdown = ({ analysisData }: MeetBreakdownProps) => {
  const [selectedMeet, setSelectedMeet] = useState<string>('all')
  
  // Use real data from analysisData
  const meetBreakdown = analysisData?.meetBreakdown || {}
  const meetResults = meetBreakdown?.currentMeet?.results || []

  // Group results by meet (for now, using the current meet data structure)
  // In a real implementation, this would come from the backend with multiple meets
  const meets = [
    {
      name: meetBreakdown?.currentMeet?.name || "Current Meet",
      date: meetBreakdown?.currentMeet?.date || "2024-01-01",
      results: meetResults,
      totalEvents: meetResults.length,
      averagePlace: meetResults.length > 0 ? meetResults.reduce((sum: number, result: any) => sum + result.place, 0) / meetResults.length : 0
    }
  ]

  const selectedMeetData = selectedMeet === 'all' ? meets : meets.filter(meet => meet.name === selectedMeet)

  // Chart data for meet performance comparison
  const meetPerformanceData = [
    {
      x: meets.map(meet => meet.name),
      y: meets.map(meet => meet.totalEvents),
      type: 'bar' as const,
      name: 'Total Events',
      marker: { color: '#3b82f6' }
    }
  ]

  // Chart data for average place by meet
  const averagePlaceData = [
    {
      x: meets.map(meet => meet.name),
      y: meets.map(meet => meet.averagePlace),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'Average Place',
      marker: { 
        color: '#64748b',
        size: 12
      },
      line: { color: '#64748b', width: 3 }
    }
  ]

  const getPlaceBadge = (place: number) => {
    if (place === 1) return 'badge-gold'
    if (place === 2) return 'badge-silver'
    if (place === 3) return 'badge-bronze'
    return 'badge-other'
  }

  const calculateImprovement = (currentTime: string, previousTime: string) => {
    const currentSeconds = timeToSeconds(currentTime)
    const previousSeconds = timeToSeconds(previousTime)
    const improvement = previousSeconds - currentSeconds
    const percentage = (improvement / previousSeconds) * 100
    
    return {
      seconds: improvement,
      percentage: percentage,
      formatted: `${improvement >= 0 ? '-' : '+'}${Math.abs(improvement).toFixed(2)}s (${improvement >= 0 ? '-' : '+'}${Math.abs(percentage).toFixed(1)}%)`
    }
  }

  const timeToSeconds = (timeStr: string) => {
    if (timeStr.includes(':')) {
      const [minutes, seconds] = timeStr.split(':')
      return parseInt(minutes) * 60 + parseFloat(seconds)
    }
    return parseFloat(timeStr)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Meet Selector */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gradient-secondary">Meet Selection</h3>
          <span className="text-xl sm:text-2xl"></span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedMeet('all')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              selectedMeet === 'all'
                ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900 transition-all duration-200'
            }`}
          >
            All Meets
          </button>
          {meets.map(meet => (
            <button
              key={meet.name}
              onClick={() => setSelectedMeet(meet.name)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedMeet === meet.name
                  ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                  : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900 transition-all duration-200'
              }`}
            >
              {meet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Meet Performance Overview */}
      <div className="card-hover">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gradient-secondary">Meet Performance Overview</h3>
          <span className="text-xl sm:text-2xl"></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Plot
            data={meetPerformanceData}
            layout={{
              height: 350,
              margin: { t: 20, b: 50, l: 60, r: 20 },
              xaxis: { 
                title: { text: 'Meet', font: { size: 14 } },
                gridcolor: 'rgba(0,0,0,0.1)'
              },
              yaxis: { 
                title: { text: 'Count', font: { size: 14 } },
                gridcolor: 'rgba(0,0,0,0.1)'
              },
              barmode: 'group',
              title: { text: '' },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { size: 12 }
            }}
            config={{ displayModeBar: false }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
          <Plot
            data={averagePlaceData}
            layout={{
              height: 350,
              margin: { t: 20, b: 50, l: 60, r: 20 },
              xaxis: { 
                title: { text: 'Meet', font: { size: 14 } },
                gridcolor: 'rgba(0,0,0,0.1)'
              },
              yaxis: { 
                title: { text: 'Average Place', font: { size: 14 } },
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
        </div>
      </div>

      {/* Selected Meet Results */}
      {selectedMeetData.map(meet => (
        <div key={meet.name} className="card-hover">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gradient-secondary">{meet.name}</h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">{meet.date}</p>
            </div>
            <span className="text-xl sm:text-2xl"></span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="stat-card text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-1 sm:mb-2">
                {meet.totalEvents}
              </div>
              <div className="text-slate-600 font-medium text-xs sm:text-sm">Total Events</div>
            </div>
            
            <div className="stat-card text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-1 sm:mb-2">
                {meet.averagePlace.toFixed(1)}
              </div>
              <div className="text-slate-600 font-medium text-xs sm:text-sm">Average Place</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Improvement
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {meet.results.map((result: any, index: number) => (
                  <tr key={index} className="table-row-hover">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900">{result.event}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-600 text-sm sm:text-base">{result.time}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getPlaceBadge(result.place)}`}>
                        {result.place}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          result.courseType === 'SCY' ? 'bg-blue-100 text-blue-800' :
                          result.courseType === 'SCM' ? 'bg-green-100 text-green-800' :
                          result.courseType === 'LCM' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.courseType || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">
                        {result.previousTime ? (
                          <span className={result.time < result.previousTime ? 'text-green-600' : 'text-red-600'}>
                            {calculateImprovement(result.time, result.previousTime).formatted}
                          </span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MeetBreakdown 