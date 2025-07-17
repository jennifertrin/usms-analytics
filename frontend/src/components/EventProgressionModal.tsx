import { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'

interface EventProgressionModalProps {
  isOpen: boolean
  onClose: () => void
  eventName: string
  analysisData: any
}

interface TimeEntry {
  time: string
  date: string
  meet: string
  seconds: number
}

const EventProgressionModal = ({ isOpen, onClose, eventName, analysisData }: EventProgressionModalProps) => {
  const [progressionData, setProgressionData] = useState<TimeEntry[]>([])

  console.log('analysisData', analysisData);
  console.log('progressionData', progressionData)

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen && eventName && analysisData) {
      // Extract all times for this specific event from the data
      const allTimes: TimeEntry[] = []
      
      // Helper function to safely parse date
      const parseDate = (dateStr: string): Date => {
        if (!dateStr) return new Date()
        
        // Try different date formats
        const formats = [
          // ISO format
          /^\d{4}-\d{2}-\d{2}$/,
          // MM/DD/YYYY format
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,
          // DD/MM/YYYY format
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,
          // Other formats...
        ]
        
        const date = new Date(dateStr)
        return isNaN(date.getTime()) ? new Date() : date
      }

      // Helper function to add unique time entry
      const addTimeEntry = (time: string, date: string, meet: string) => {
        if (!time || !date) return
        
        const timeSeconds = timeToSeconds(time)
        if (isNaN(timeSeconds)) return
        
        // Check if this exact time, date, and meet combination already exists
        // This allows multiple different times on the same date from the same meet
        const exists = allTimes.some(entry => 
          Math.abs(entry.seconds - timeSeconds) < 0.01 && 
          entry.date === date &&
          entry.meet === meet
        )
        
        if (!exists) {
          allTimes.push({
            time: formatTimeForDisplay(time),
            date: date,
            meet: meet || 'Unknown Meet',
            seconds: timeSeconds
          })
        }
      }
      
      // Get the course type for this event from personal bests
      const personalBests = analysisData?.personalBests || {}
      const allTimeBests = personalBests.allTime || []
      const eventBestTimes = allTimeBests.filter((best: any) => best.event === eventName)
      
      // If we have course type info, filter by the most common course type for this event
      let targetCourseType = null
      if (eventBestTimes.length > 0) {
        const courseTypeCounts = eventBestTimes.reduce((acc: any, best: any) => {
          acc[best.courseType] = (acc[best.courseType] || 0) + 1
          return acc
        }, {})
        targetCourseType = Object.keys(courseTypeCounts).reduce((a, b) => 
          courseTypeCounts[a] > courseTypeCounts[b] ? a : b
        )
      }
      
      // 1. Get all results from all meets (filtered by course type if available)
      const meetBreakdown = analysisData?.meetBreakdown || {}
      
      // Use the new meets array if available, otherwise fall back to currentMeet
      if (meetBreakdown.meets && meetBreakdown.meets.length > 0) {
        // Process all meets
        meetBreakdown.meets.forEach((meet: any) => {
          const meetResults = meet.results || []
          const meetDate = meet.date
          const meetName = meet.name || 'Meet'
          
          meetResults.forEach((result: any) => {
            if (result.event === eventName) {
              // Only include if course type matches or if we don't have course type info
              if (!targetCourseType || !result.courseType || result.courseType === targetCourseType) {
                addTimeEntry(result.time, meetDate, meetName)
              }
            }
          })
        })
      } else if (meetBreakdown.currentMeet) {
        // Fallback to current meet for backward compatibility
        const currentMeet = meetBreakdown.currentMeet
        const meetResults = currentMeet.results || []
        const meetDate = currentMeet.date || new Date().toISOString().split('T')[0]
        const meetName = currentMeet.name || 'Current Meet'
        
        meetResults.forEach((result: any) => {
          if (result.event === eventName) {
            addTimeEntry(result.time, meetDate, meetName)
          }
        })
      }
      
      // 2. Get all historical results from the full data structure
      // Check if there's a historical results section
      if (analysisData?.historicalResults) {
        analysisData.historicalResults.forEach((historicalResult: any) => {
          if (historicalResult.event === eventName) {
            if (!targetCourseType || !historicalResult.courseType || historicalResult.courseType === targetCourseType) {
              addTimeEntry(
                historicalResult.time,
                historicalResult.date,
                historicalResult.meet || 'Historical Meet'
              )
            }
          }
        })
      }
      
      // 3. Get times from personal bests - all time (filtered by course type)
      allTimeBests.forEach((best: any) => {
        if (best.event === eventName) {
          if (!targetCourseType || !best.courseType || best.courseType === targetCourseType) {
            addTimeEntry(
              best.time,
              best.date,
              best.meet || 'Personal Best Meet'
            )
          }
        }
      })
      
      // 4. Get times from age group bests for historical progression (filtered by course type)
      const ageGroupBests = personalBests.byAgeGroup || {}
      Object.keys(ageGroupBests).forEach(ageGroup => {
        const ageGroupResults = ageGroupBests[ageGroup] || []
        ageGroupResults.forEach((ageGroupEvent: any) => {
          if (ageGroupEvent.event === eventName) {
            if (!targetCourseType || !ageGroupEvent.courseType || ageGroupEvent.courseType === targetCourseType) {
              addTimeEntry(
                ageGroupEvent.time,
                ageGroupEvent.date,
                `${ageGroup} - ${ageGroupEvent.meet || 'Age Group Meet'}`
              )
            }
          }
        })
      })
      
      // 5. Check for any other data structures that might contain times
      // Look for a general results array
      if (analysisData?.results) {
        analysisData.results.forEach((result: any) => {
          if (result.event === eventName) {
            if (!targetCourseType || !result.courseType || result.courseType === targetCourseType) {
              addTimeEntry(
                result.time,
                result.date,
                result.meet || 'Meet Result'
              )
            }
          }
        })
      }
      
      // 6. Check for meets array with results
      if (analysisData?.meets) {
        analysisData.meets.forEach((meet: any) => {
          const meetResults = meet.results || []
          const meetDate = meet.date
          const meetName = meet.name || 'Meet'
          
          meetResults.forEach((result: any) => {
            if (result.event === eventName) {
              if (!targetCourseType || !result.courseType || result.courseType === targetCourseType) {
                // Use result's specific date if available, otherwise use meet date
                const resultDate = result.date || meetDate
                if (resultDate) {
                  addTimeEntry(result.time, resultDate, meetName)
                }
              }
            }
          })
        })
      }
      
      // Sort by date (oldest to newest) with proper date parsing
      allTimes.sort((a, b) => {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      
      // Remove any duplicate entries that might have slipped through
      const uniqueTimes = allTimes.filter((entry, index, arr) => 
        arr.findIndex(e => 
          Math.abs(e.seconds - entry.seconds) < 0.01 && 
          e.date === entry.date
        ) === index
      )
      
      setProgressionData(uniqueTimes)
    }
  }, [isOpen, eventName, analysisData])

  const formatTimeFromSeconds = (seconds: number): string => {
    if (isNaN(seconds)) return 'N/A'
    
    if (seconds < 60) {
      return seconds.toFixed(2)
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`
    }
  }

  const formatTimeForDisplay = (timeStr: string): string => {
    if (!timeStr) return 'N/A'
    
    // If it's already in MM:SS.ss format, return as is
    if (timeStr.includes(':')) {
      return timeStr
    }
    
    // If it's in seconds format, convert to MM:SS.ss
    const seconds = parseFloat(timeStr)
    if (isNaN(seconds)) return timeStr
    
    if (seconds < 60) {
      return seconds.toFixed(2)
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`
    }
  }

  const timeToSeconds = (timeStr: string): number => {
    if (!timeStr) return NaN
    
    if (timeStr.includes(':')) {
      const [minutes, seconds] = timeStr.split(':')
      const min = parseInt(minutes) || 0
      const sec = parseFloat(seconds) || 0
      return min * 60 + sec
    }
    return parseFloat(timeStr) || NaN
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Unknown Date'
    
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isOpen) return null

  // Chart data for progression - use seconds for proper y-axis ordering
  const chartData = progressionData.length > 0 ? [
    {
      x: progressionData.map(entry => formatDate(entry.date)),
      y: progressionData.map(entry => entry.seconds),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: eventName,
      line: { color: '#3b82f6', width: 3 },
      marker: { 
        color: '#3b82f6',
        size: 8,
        line: { color: '#ffffff', width: 2 }
      },
      text: progressionData.map(entry => entry.time),
      textposition: 'top center' as const,
      textfont: { size: 10 },
      hovertemplate: '<b>%{text}</b><br>Date: %{x}<br><extra></extra>'
    }
  ] : []

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gradient-primary">{eventName} Progression</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">Time progression over your swimming career</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-slate-600 text-lg sm:text-xl">×</span>
            </button>
          </div>

          {progressionData.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-slate-500 text-base sm:text-lg">No time data found for {eventName}</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">Make sure your data includes times for this event</p>
            </div>
          ) : (
            <>
              {/* Progression Chart */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gradient-secondary">Time Progression Chart</h3>
                  <span className="text-xl sm:text-2xl">📈</span>
                </div>
                <Plot
                  data={chartData}
                  layout={{
                    height: 350,
                    margin: { t: 30, b: 50, l: 60, r: 20 },
                    xaxis: { 
                      title: { text: 'Date', font: { size: 14 } },
                      gridcolor: 'rgba(0,0,0,0.1)'
                    },
                    yaxis: { 
                      title: { text: 'Time (seconds)', font: { size: 14 } },
                      autorange: 'reversed', // Faster times (lower seconds) at top
                      gridcolor: 'rgba(0,0,0,0.1)',
                      tickformat: '.2f'
                    },
                    showlegend: false,
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

              {/* All Times Table */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gradient-secondary">All Times for {eventName}</h3>
                  <span className="text-xl sm:text-2xl">🏊</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Meet
                        </th>
                        <th className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Improvement
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[...progressionData].reverse().map((entry, index) => {
                        const validTimes = progressionData.filter(e => !isNaN(e.seconds))
                        const isBest = validTimes.length > 0 && entry.seconds === Math.min(...validTimes.map(e => e.seconds))
                        const improvement = index < progressionData.length - 1 ? 
                          entry.seconds - [...progressionData].reverse()[index + 1].seconds : 0
                        
                        return (
                          <tr key={index} className={`table-row-hover ${isBest ? 'bg-blue-50' : ''}`}>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-semibold text-slate-900">{formatDate(entry.date)}</div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className={`font-mono font-bold text-sm sm:text-lg ${isBest ? 'text-blue-600' : 'text-slate-600'}`}>
                                {entry.time}
                                {isBest && <span className="ml-2 text-xs sm:text-sm text-blue-600">🏆 Best</span>}
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-slate-600 font-medium">{entry.meet}</div>
                            </td>
                            <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              {index < progressionData.length - 1 && !isNaN(improvement) ? (
                                <span className={`font-bold text-xs sm:text-sm ${
                                  improvement < 0 ? 'text-green-600' : improvement > 0 ? 'text-red-600' : 'text-slate-600'
                                }`}>
                                  {improvement < 0 ? '⬇️ Faster' : improvement > 0 ? '⬆️ Slower' : '➖ Same'} {Math.abs(improvement).toFixed(2)}s
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs sm:text-sm">🚀 First time</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div className="stat-card text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-1 sm:mb-2">
                    {progressionData.length}
                  </div>
                  <div className="text-slate-600 font-medium text-xs sm:text-sm">Total Times</div>
                </div>
                
                <div className="stat-card text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                    {progressionData.length > 0 ? 
                      formatTimeFromSeconds(Math.min(...progressionData.filter(e => !isNaN(e.seconds)).map(e => e.seconds))) : 
                      'N/A'
                    }
                  </div>
                  <div className="text-slate-600 font-medium text-xs sm:text-sm">Best Time</div>
                </div>
                
                <div className="stat-card text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-1 sm:mb-2">
                    {progressionData.length > 1 ? 
                      formatTimeFromSeconds(
                        Math.max(...progressionData.filter(e => !isNaN(e.seconds)).map(e => e.seconds)) - 
                        Math.min(...progressionData.filter(e => !isNaN(e.seconds)).map(e => e.seconds))
                      ) : 
                      'N/A'
                    }
                  </div>
                  <div className="text-slate-600 font-medium text-xs sm:text-sm">Time Range</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventProgressionModal