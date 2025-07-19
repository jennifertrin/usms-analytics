import { useState } from 'react'
import Plot from 'react-plotly.js'

interface Club {
  name: string
  location: string
  years: string
  meets: number
  events: number
  bestTimes: number
  logo: string
}

interface ClubsListProps {
  analysisData: any
}

const ClubsList = ({ analysisData }: ClubsListProps) => {
  const [selectedClub, setSelectedClub] = useState<string>('all')
  
  // Use real data from analysisData
  const clubs = analysisData?.clubs || []
  
  // Generate club performance data from clubs
  const clubPerformance = clubs.map((club: Club) => ({
    club: club.name,
    events: club.events,
    bestTimes: club.bestTimes,
    averagePlace: 3.5, // Default value since we don't have this in the data
    improvement: `+${Math.round((club.bestTimes / club.events) * 100)}%`
  }))

  const selectedClubData = selectedClub === 'all' ? clubs : clubs.filter((club: Club) => club.name === selectedClub)

  // Chart data for club performance
  const performanceChartData = [
    {
      x: clubPerformance.map((club: any) => club.club),
      y: clubPerformance.map((club: any) => club.events),
      type: 'bar' as const,
      name: 'Events',
      marker: { color: '#3b82f6' }
    },
    {
      x: clubPerformance.map((club: any) => club.club),
      y: clubPerformance.map((club: any) => club.bestTimes),
      type: 'bar' as const,
      name: 'Best Times',
      marker: { color: '#64748b' }
    }
  ]

  // Chart data for average place by club
  const placeChartData = [
    {
      x: clubPerformance.map((club: any) => club.club),
      y: clubPerformance.map((club: any) => club.averagePlace),
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

  if (clubs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-4xl">🏊‍♂️</span>
            </div>
            <h2 className="text-3xl font-bold text-gradient-primary mb-4">Club History</h2>
            <p className="text-lg text-slate-600 mb-8">No club data available. Please analyze a USMS link first.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/50 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏊‍♂️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">
                  Club History
                </h1>
                <p className="text-slate-600 font-medium">
                  {clubs.length} clubs • {clubs.reduce((sum: number, club: Club) => sum + club.events, 0)} total events
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Club Filter */}
        <div className="mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedClub('all')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedClub === 'all'
                  ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                  : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900'
              }`}
            >
              All Clubs
            </button>
            {clubs.map((club: Club) => (
              <button
                key={club.name}
                onClick={() => setSelectedClub(club.name)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedClub === club.name
                    ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                    : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                {club.name}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Club Performance Chart */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-black text-gradient-secondary mb-6">Club Performance</h3>
            <Plot
              data={performanceChartData}
              layout={{
                height: 400,
                margin: { t: 40, b: 60, l: 60, r: 40 },
                showlegend: true,
                title: { text: 'Events vs Best Times by Club' as any, font: { size: 16 } },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { size: 12 }
              }}
              config={{ displayModeBar: false }}
            />
          </div>

          {/* Average Place Chart */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-black text-gradient-secondary mb-6">Average Place by Club</h3>
            <Plot
              data={placeChartData}
              layout={{
                height: 400,
                margin: { t: 40, b: 60, l: 60, r: 40 },
                showlegend: false,
                title: { text: 'Average Placement' as any, font: { size: 16 } },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { size: 12 },
                yaxis: { 
                  title: 'Average Place' as any,
                  autorange: 'reversed' // Lower numbers (better places) at top
                }
              }}
              config={{ displayModeBar: false }}
            />
          </div>
        </div>

        {/* Club Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedClubData.map((club: Club) => (
            <div key={club.name} className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                  <span className="text-2xl">{club.logo}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{club.name}</h3>
                  <p className="text-slate-600 text-sm">{club.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{club.meets}</div>
                  <div className="text-sm text-slate-600">Meets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600">{club.events}</div>
                  <div className="text-sm text-slate-600">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{club.bestTimes}</div>
                  <div className="text-sm text-slate-600">Best Times</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {club.events > 0 ? Math.round((club.bestTimes / club.events) * 100) : 0}%
                  </div>
                  <div className="text-sm text-slate-600">Success Rate</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 text-lg">Club Statistics</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">Events per Meet:</span>
                    <span className="font-bold text-slate-900">{club.meets > 0 ? (club.events / club.meets).toFixed(1) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">Best Times Rate:</span>
                    <span className="font-bold text-blue-600">{club.events > 0 ? Math.round((club.bestTimes / club.events) * 100) : 0}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">Years Active:</span>
                    <span className="font-bold text-slate-900">{club.years || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Club Comparison Summary */}
        <div className="mt-8 bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-black text-gradient-secondary mb-6">Club Comparison Summary</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {clubs.reduce((sum: number, club: Club) => sum + club.meets, 0)}
              </div>
              <div className="text-slate-600 font-medium">Total Meets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600 mb-2">
                {clubs.reduce((sum: number, club: Club) => sum + club.events, 0)}
              </div>
              <div className="text-slate-600 font-medium">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {clubs.reduce((sum: number, club: Club) => sum + club.bestTimes, 0)}
              </div>
              <div className="text-slate-600 font-medium">Total Best Times</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {clubs.length}
              </div>
              <div className="text-slate-600 font-medium">Clubs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubsList 