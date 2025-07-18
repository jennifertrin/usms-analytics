'use client'

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
      
      // Sort by date and then by time (faster times first for same date)
      allTimes.sort((a, b) => {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime()
        }
        
        return a.seconds - b.seconds
      })
      
      setProgressionData(allTimes)
    }
  }, [isOpen, eventName, analysisData])

  // Helper functions
  const formatTimeFromSeconds = (seconds: number): string => {
    if (seconds < 60) {
      return seconds.toFixed(2)
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`
    }
  }

  const formatTimeForDisplay = (timeStr: string): string => {
    if (!timeStr) return ''
    
    // If it's already in MM:SS.ss format, return as is
    if (timeStr.includes(':')) {
      return timeStr
    }
    
    // If it's in seconds format, convert to MM:SS.ss
    const seconds = parseFloat(timeStr)
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
      return parseInt(minutes) * 60 + parseFloat(seconds)
    }
    return parseFloat(timeStr)
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Unknown Date'
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return dateStr // Return original if parsing fails
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return dateStr
    }
  }

  // Chart data
  const chartData = progressionData.length > 0 ? [
    {
      x: progressionData.map(entry => formatDate(entry.date)),
      y: progressionData.map(entry => entry.seconds),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: eventName,
      line: { color: '#3b82f6', width: 3 },
      marker: { 
        size: 8,
        color: '#3b82f6',
        line: { color: '#1e40af', width: 2 }
      },
      hovertemplate: 
        '<b>%{text}</b><br>' +
        'Date: %{x}<br>' +
        'Time: %{y:.2f}s<br>' +
        '<extra></extra>',
      text: progressionData.map(entry => `${entry.time}<br>${entry.meet}`)
    }
  ] : []

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{eventName} Progression</h2>
            <p className="text-slate-600 mt-1">Performance over time</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {progressionData.length > 0 ? (
            <div className="space-y-6">
              {/* Chart */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <Plot
                  data={chartData}
                  layout={{
                    height: 400,
                    margin: { t: 20, b: 60, l: 80, r: 20 },
                    xaxis: { 
                      title: { text: 'Date', font: { size: 14 } },
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
                    font: { size: 12 },
                    hovermode: 'closest'
                  }}
                  config={{ displayModeBar: false }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">All Times</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Meet
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {progressionData.map((entry, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-800 text-lg">
                              {entry.time}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {entry.meet}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-50">📊</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Data Available</h3>
              <p className="text-slate-600">No progression data found for this event.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventProgressionModal 