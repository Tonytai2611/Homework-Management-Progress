import { useState } from 'react'
import Badge from '../components/shared/Badge'
const StudentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // Mock assignments with dates
  const assignments = {
    '2026-01-14': [{ title: 'Story Reading', subject: 'Reading', status: 'completed' }],
    '2026-01-15': [{ title: 'Grammar Practice', subject: 'Grammar', status: 'in-progress' }],
    '2026-01-16': [{ title: 'Past Continuous', subject: 'Grammar', status: 'pending' }],
    '2026-01-18': [{ title: 'Write About Day', subject: 'Writing', status: 'completed' }],
    '2026-01-19': [{ title: 'Picture Story', subject: 'Speaking', status: 'pending' }]
  }
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }
  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }
  const getDateKey = (day) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }
  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear()
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 pb-8">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Assignment Calendar</h1>
          <p className="text-gray-600 mt-1">View your assignments by date</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card bg-white">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <div className="flex space-x-2">
              <button
                onClick={prevMonth}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
            {/* Empty cells for first week */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateKey = getDateKey(day)
              const dayAssignments = assignments[dateKey] || []
              const today = isToday(day)
              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    today ? 'bg-purple-50 border-purple-300' : 'border-gray-200'
                  } hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className={`text-sm font-semibold mb-1 ${
                    today ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayAssignments.slice(0, 2).map((assignment, idx) => (
                      <div
                        key={idx}
                        className="text-xs px-1 py-0.5 bg-teal-100 text-teal-800 rounded truncate"
                      >
                        {assignment.title}
                      </div>
                    ))}
                    {dayAssignments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAssignments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Reading</Badge>
              <Badge variant="success">Grammar</Badge>
              <Badge variant="info">Listening</Badge>
              <Badge variant="warning">Speaking</Badge>
              <Badge variant="danger">Writing</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudentCalendar