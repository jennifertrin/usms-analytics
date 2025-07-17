import { useState } from 'react'
import EventProgressionModal from './EventProgressionModal'

interface PersonalBestsProps {
  analysisData: any
}

// Helper function to format time for display
const formatTimeForDisplay = (timeStr: string) => {
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

const PersonalBests = ({ analysisData }: PersonalBestsProps) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all-time')
  const [selectedCourseType, setSelectedCourseType] = useState<string>('all')
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Use real data from analysisData
  const personalBests = analysisData?.personalBests || {}
  const allTimeBests = personalBests?.allTime || []
  const ageGroupBests = personalBests?.byAgeGroup || {}

  // Only show age groups that have data
  const availableAgeGroups = ['all-time']
  Object.keys(ageGroupBests).forEach(ageGroup => {
    if (ageGroupBests[ageGroup] && ageGroupBests[ageGroup].length > 0) {
      availableAgeGroups.push(ageGroup)
    }
  })

  // Get available course types
  const allCourseTypes = new Set<string>()
  allTimeBests.forEach((best: any) => {
    if (best.courseType) {
      allCourseTypes.add(best.courseType)
    }
  })
  const availableCourseTypes = ['all', ...Array.from(allCourseTypes)]

  // Get current data based on selection
  let currentData = selectedAgeGroup === 'all-time' ? allTimeBests : ageGroupBests[selectedAgeGroup as keyof typeof ageGroupBests] || []
  
  // Filter by course type
  if (selectedCourseType !== 'all') {
    currentData = currentData.filter((item: any) => item.courseType === selectedCourseType)
  }

  const handleEventClick = (eventName: string) => {
    setSelectedEvent(eventName)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent('')
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Age Group Selector */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gradient-secondary">Age Group Filter</h3>
          <span className="text-xl sm:text-2xl"></span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {availableAgeGroups.map(ageGroup => (
            <button
              key={ageGroup}
              onClick={() => setSelectedAgeGroup(ageGroup)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedAgeGroup === ageGroup
                  ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                  : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900 transition-all duration-200'
              }`}
            >
              {ageGroup === 'all-time' ? 'All-Time' : ageGroup}
            </button>
          ))}
        </div>
      </div>

      {/* Course Type Selector */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gradient-secondary">Course Type Filter</h3>
          <span className="text-xl sm:text-2xl">🏊</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {availableCourseTypes.map(courseType => (
            <button
              key={courseType}
              onClick={() => setSelectedCourseType(courseType)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedCourseType === courseType
                  ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                  : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900 transition-all duration-200'
              }`}
            >
              {courseType === 'all' ? 'All Courses' : courseType}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Bests Table */}
      <div className="card-hover">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gradient-secondary">
            {selectedAgeGroup === 'all-time' ? 'All-Time Personal Bests' : `${selectedAgeGroup} Age Group Bests`}
          </h3>
          <span className="text-xl sm:text-2xl"></span>
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
                  Course
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Meet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentData.map((best: any, index: number) => (
                <tr 
                  key={index} 
                  className="table-row-hover cursor-pointer"
                  onClick={() => handleEventClick(best.event)}
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center">
                      {best.event}
                      <span className="ml-2 text-blue-600 text-xs">View</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-600 text-sm sm:text-lg">{formatTimeForDisplay(best.time)}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-slate-600 font-medium">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        best.courseType === 'SCY' ? 'bg-blue-100 text-blue-800' :
                        best.courseType === 'SCM' ? 'bg-green-100 text-green-800' :
                        best.courseType === 'LCM' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {best.courseType || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-slate-600 font-medium">{best.date}</div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-slate-600 font-medium">{best.meet}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <EventProgressionModal
        isOpen={isModalOpen}
        eventName={selectedEvent}
        analysisData={analysisData}
        onClose={closeModal}
      />
    </div>
  )
}

export default PersonalBests 