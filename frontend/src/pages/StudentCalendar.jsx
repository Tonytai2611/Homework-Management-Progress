import { useState, useEffect } from 'react'
import Badge from '../components/shared/Badge'
import Header from '../components/Header'
import { assignmentsAPI } from '../api/assignments'
import AssignmentDetailModal from '../components/AssignmentDetailModal'

const StudentCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedAssignment, setSelectedAssignment] = useState(null)

    useEffect(() => {
        fetchAssignments()
    }, [])

    const fetchAssignments = async () => {
        try {
            setLoading(true)
            const response = await assignmentsAPI.getAll()
            setAssignments(response.data || [])
        } catch (err) {

            setError('Failed to load assignments')
        } finally {
            setLoading(false)
        }
    }

    // Group assignments by date
    const getAssignmentsByDate = () => {
        const grouped = {}
        assignments.forEach(assignment => {
            if (assignment.due_date) {
                // Extract YYYY-MM-DD from ISO date
                const dateKey = assignment.due_date.split('T')[0]
                if (!grouped[dateKey]) {
                    grouped[dateKey] = []
                }
                grouped[dateKey].push(assignment)
            }
        })
        return grouped
    }

    const assignmentsByDate = getAssignmentsByDate()

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

    const getSubjectColor = (subject) => {
        const colors = {
            'Reading': 'bg-blue-100 text-blue-800 border-blue-200',
            'Writing': 'bg-green-100 text-green-800 border-green-200',
            'Listening': 'bg-purple-100 text-purple-800 border-purple-200',
            'Speaking': 'bg-orange-100 text-orange-800 border-orange-200',
            'Grammar': 'bg-teal-100 text-teal-800 border-teal-200'
        }
        return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const getStatusDot = (status) => {
        const colors = {
            'completed': 'bg-green-500',
            'pending': 'bg-gray-400'
        }
        return colors[status] || 'bg-gray-400'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 pb-24 md:pb-8">
            <Header />

            {/* Page Title */}
            <div className="bg-white shadow-sm mb-4 sm:mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assignment Calendar</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">View your assignments by date</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card bg-white p-3 sm:p-6">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{monthName}</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={prevMonth}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                            >
                                ←
                            </button>
                            <button
                                onClick={nextMonth}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            <p className="mt-4 text-gray-600">Loading assignments...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {/* Day headers */}
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                    <div key={`${day}-${index}`} className="text-center font-semibold text-gray-700 py-1 sm:py-2 text-xs sm:text-sm">
                                        <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</span>
                                        <span className="sm:hidden">{day}</span>
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
                                    const dayAssignments = assignmentsByDate[dateKey] || []
                                    const today = isToday(day)

                                    return (
                                        <div
                                            key={day}
                                            className={`min-h-[60px] sm:min-h-[80px] md:aspect-square border rounded-lg p-1 sm:p-2 ${today ? 'bg-purple-50 border-purple-300' : 'border-gray-200'
                                                } hover:shadow-md transition-shadow`}
                                        >
                                            <div className={`text-xs sm:text-sm font-semibold mb-1 ${today ? 'text-purple-600' : 'text-gray-700'
                                                }`}>
                                                {day}
                                            </div>
                                            <div className="space-y-0.5 sm:space-y-1">
                                                {dayAssignments.slice(0, 1).map((assignment, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSelectedAssignment(assignment)}
                                                        className={`text-xs px-1 py-0.5 sm:px-1.5 sm:py-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getSubjectColor(assignment.subject)}`}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 ${getStatusDot(assignment.status)}`}></span>
                                                            <span className="truncate flex-1 text-[10px] sm:text-xs">{assignment.title}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Show second assignment only on larger screens */}
                                                {dayAssignments.length > 1 && (
                                                    <div
                                                        onClick={() => setSelectedAssignment(dayAssignments[1])}
                                                        className={`hidden sm:block text-xs px-1.5 py-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getSubjectColor(dayAssignments[1].subject)}`}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(dayAssignments[1].status)}`}></span>
                                                            <span className="truncate flex-1">{dayAssignments[1].title}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {dayAssignments.length > 2 && (
                                                    <div className="hidden sm:block text-xs text-gray-500 px-1">
                                                        +{dayAssignments.length - 2} more
                                                    </div>
                                                )}
                                                {dayAssignments.length > 1 && (
                                                    <div className="sm:hidden text-[10px] text-gray-500 px-0.5">
                                                        +{dayAssignments.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Subjects</h3>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    <Badge variant="primary"><span className="hidden sm:inline">📖 </span>Reading</Badge>
                                    <Badge variant="success"><span className="hidden sm:inline">✍️ </span>Writing</Badge>
                                    <Badge variant="info"><span className="hidden sm:inline">👂 </span>Listening</Badge>
                                    <Badge variant="warning"><span className="hidden sm:inline">🗣️ </span>Speaking</Badge>
                                    <Badge variant="danger"><span className="hidden sm:inline">📝 </span>Grammar</Badge>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Status</h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400"></span>
                                        <span className="text-xs sm:text-sm text-gray-700">Pending</span>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></span>
                                        <span className="text-xs sm:text-sm text-gray-700">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Assignment Detail Modal */}
            {selectedAssignment && (
                <AssignmentDetailModal
                    assignment={selectedAssignment}
                    onClose={() => setSelectedAssignment(null)}
                />
            )}
        </div>
    )
}

export default StudentCalendar