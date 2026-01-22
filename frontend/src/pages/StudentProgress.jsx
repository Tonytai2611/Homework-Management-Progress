import { useState, useEffect } from 'react'
import ProgressBar from '../components/shared/ProgressBar'
import Badge from '../components/shared/Badge'
import Header from '../components/Header'
import { assignmentsAPI } from '../api/assignments'

const StudentProgress = () => {
    const [progressData, setProgressData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProgress()
    }, [])

    const fetchProgress = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await assignmentsAPI.getProgress()
            setProgressData(response.data)
        } catch (err) {
            console.error('Failed to load progress:', err)
            setError('Failed to load progress data')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600">Loading progress...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    const { overall, bySubject, weekly } = progressData || {}

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 pb-24 md:pb-8">
            <Header />

            {/* Page Title */}
            <div className="bg-white shadow-sm mb-4 sm:mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Progress</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your learning journey</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                {/* Overall Progress */}
                <div className="card bg-gradient-purple-teal text-white p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Overall Progress</h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm">Total Assignments</p>
                            <p className="text-2xl sm:text-3xl font-bold">{overall?.total || 0}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm">Completed</p>
                            <p className="text-2xl sm:text-3xl font-bold">{overall?.completed || 0}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm">In Progress</p>
                            <p className="text-2xl sm:text-3xl font-bold">{overall?.in_progress || 0}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <p className="text-purple-100 text-xs sm:text-sm">Completion Rate</p>
                            <p className="text-2xl sm:text-3xl font-bold">{overall?.completion_rate || 0}%</p>
                        </div>
                    </div>
                </div>

                {/* Progress by Subject */}
                <div className="card bg-white p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Progress by Subject</h3>
                    <div className="space-y-4">
                        {bySubject && bySubject.length > 0 ? (
                            bySubject.map((subject) => {
                                // Map subject to color
                                const getSubjectColor = (subjectName) => {
                                    const colors = {
                                        'Reading': 'blue',
                                        'Writing': 'green',
                                        'Listening': 'purple',
                                        'Speaking': 'orange',
                                        'Grammar': 'teal'
                                    }
                                    return colors[subjectName] || 'purple'
                                }

                                // Get text color class for percentage
                                const getTextColorClass = (color) => {
                                    const textColors = {
                                        'blue': 'text-blue-600',
                                        'green': 'text-green-600',
                                        'purple': 'text-purple-600',
                                        'orange': 'text-orange-600',
                                        'teal': 'text-teal-600'
                                    }
                                    return textColors[color] || 'text-purple-600'
                                }

                                // Calculate percentage
                                const total = subject.total || 1
                                const completed = subject.completed || 0
                                const percentage = Math.round((completed / total) * 100)
                                const subjectColor = getSubjectColor(subject.subject)

                                return (
                                    <div key={subject.subject}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-900">{subject.subject}</span>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-600">{completed}/{total}</span>
                                                <span className={`text-lg font-bold ${getTextColorClass(subjectColor)}`}>
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <ProgressBar
                                            value={completed}
                                            max={total}
                                            color={subjectColor}
                                            height="h-3"
                                            showLabel={false}
                                        />
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-gray-500 text-center py-4">No subject data available</p>
                        )}
                    </div>
                </div>

                {/* Weekly Progress */}
                {weekly && weekly.length > 0 && (
                    <div className="card bg-white p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Weekly Progress</h3>
                        <div className="space-y-3">
                            {weekly.map((week) => (
                                <div key={week.week} className="flex justify-between items-center flex-wrap gap-2">
                                    <span className="text-sm sm:text-base text-gray-700">Week of {new Date(week.week).toLocaleDateString()}</span>
                                    <Badge variant="completed">{week.completed} completed</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Achievements */}
                <div className="card bg-white p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {overall?.completed > 0 ? (
                            <>
                                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-2xl sm:text-3xl">🏆</span>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">First Assignment</p>
                                        <p className="text-xs sm:text-sm text-gray-600">Completed your first assignment!</p>
                                    </div>
                                </div>
                                {overall.completed >= 5 && (
                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <span className="text-2xl sm:text-3xl">⭐</span>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">5 Assignments</p>
                                            <p className="text-xs sm:text-sm text-gray-600">Completed 5 assignments!</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
                                Complete assignments to earn achievements!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentProgress