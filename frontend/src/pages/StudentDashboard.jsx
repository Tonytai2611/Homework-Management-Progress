import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { studentsAPI } from '../api/assignments'
import { RxDashboard } from 'react-icons/rx'
import { MdAssignment } from 'react-icons/md'
import { BsCalendar3 } from 'react-icons/bs'
import { HiOutlineChartBar, HiMenu, HiX } from 'react-icons/hi'
import ProgressBar from '../components/shared/ProgressBar'
import { SubjectIcon } from '../utils/subjectIcons'

const StudentDashboard = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        completionRate: 0,
        weeklyStreak: 0
    })
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log('Fetching dashboard data...')
                // Use getMe() which returns user data, stats, and recentAssignments
                const response = await studentsAPI.getMe()
                const data = response.data || {}
                console.log('Dashboard data from getMe:', data)

                const stats = data.stats || {}
                setStats({
                    total: stats.total || 0,
                    completed: stats.completed || 0,
                    pending: stats.pending || 0,
                    inProgress: stats.inProgress || 0,
                    completionRate: stats.completionRate || 0,
                    weeklyStreak: stats.weeklyStreak || 0
                })

                // Get assignments from the same response (recentAssignments)
                console.log('Recent assignments:', data.recentAssignments)
                setAssignments(data.recentAssignments || [])
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
                console.error('Error details:', error.response?.data)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchDashboardData()
        }
    }, [user])

    const handleSignOut = () => {
        signout()
        navigate('/signin')
    }

    const navItems = [
        { name: 'Overview', path: '/student/dashboard', icon: <RxDashboard className="w-5 h-5" /> },
        { name: 'Assignments', path: '/student/assignments', icon: <MdAssignment className="w-5 h-5" /> },
        { name: 'Calendar', path: '/student/calendar', icon: <BsCalendar3 className="w-5 h-5" /> },
        { name: 'Progress', path: '/student/progress', icon: <HiOutlineChartBar className="w-5 h-5" /> }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
            {/* Header with Navigation */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-purple-teal rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                                <span className="text-lg sm:text-xl font-bold text-white">LB</span>
                            </div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Little Buddies</h1>
                        </div>

                        {/* Desktop Navigation Menu */}
                        <nav className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${location.pathname === item.path
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleSignOut}
                                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
                            <div className="flex flex-col space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3 ${location.pathname === item.path
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-purple-teal rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-0 sm:mr-4">
                                    {user?.fullName?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-3xl font-bold mb-1">Welcome back, {user?.fullName}!</h2>
                                    <p className="text-purple-100 text-sm sm:text-base">Keep up the great work!</p>
                                </div>
                            </div>
                            <div className="text-center bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm w-full sm:w-auto">
                                <p className="text-xs sm:text-sm text-purple-100 mb-1">Current Streak</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-2xl sm:text-3xl">🔥</span>
                                    <span className="text-2xl sm:text-4xl font-bold">{stats.weeklyStreak}</span>
                                    <span className="text-sm sm:text-xl">weeks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
                    <div className="card p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-gray-600">Total Assignments</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>

                    <div className="card p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                    </div>

                    <div className="card p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                        <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
                    </div>

                    <div className="card p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-gray-600">Progress</p>
                        <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{stats.completionRate}%</p>
                    </div>
                </div>

                {/* Your Performance Section */}
                <div className="card p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Your Performance</h3>

                    {/* User Info Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-purple-teal rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xl sm:text-2xl font-bold text-white">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-gray-900">{user?.fullName || 'Student'}</h4>
                                <p className="text-xs sm:text-sm text-gray-600">{user?.level || 'FLYERS'} Level</p>
                                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-1">
                                    <span className="text-xs text-orange-600 flex items-center">
                                        🔥 {stats.weeklyStreak}-day streak
                                    </span>
                                    <span className="text-xs text-blue-600 flex items-center">
                                        ⭐ {stats.total * 100} pts
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/student/progress"
                            className="w-full sm:w-auto text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            View Details
                        </Link>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-green-50 rounded-lg p-2 sm:p-4 text-center">
                            <p className="text-xl sm:text-3xl font-bold text-green-600">{stats.completed}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Completed</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-2 sm:p-4 text-center">
                            <p className="text-xl sm:text-3xl font-bold text-orange-600">{stats.pending}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Pending</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 sm:p-4 text-center">
                            <p className="text-xl sm:text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Rate</p>
                        </div>
                    </div>

                    {/* Skills Progress */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Skills Progress</h4>
                        {(() => {
                            // Group assignments by subject and calculate progress
                            const subjectProgress = {}

                            console.log('All assignments for skills:', assignments)

                            assignments.forEach(assignment => {
                                const subject = assignment.subject || 'Other'
                                console.log('Processing assignment:', assignment.title, 'Subject:', subject, 'Status:', assignment.status)
                                if (!subjectProgress[subject]) {
                                    subjectProgress[subject] = { total: 0, completed: 0 }
                                }
                                subjectProgress[subject].total++
                                if (assignment.status === 'completed') {
                                    subjectProgress[subject].completed++
                                }
                            })

                            console.log('Subject progress:', subjectProgress)

                            // Define skills with colors
                            const skillsConfig = [
                                { name: 'Reading', color: 'blue' },
                                { name: 'Writing', color: 'green' },
                                { name: 'Grammar', color: 'green' },
                                { name: 'Listening', color: 'purple' },
                                { name: 'Speaking', color: 'orange' }
                            ]

                            // Map skills to their data (show all skills, even with 0%)
                            const skills = skillsConfig.map(skill => {
                                const data = subjectProgress[skill.name] || { total: 0, completed: 0 }
                                return {
                                    name: skill.name,
                                    value: data.completed,
                                    max: data.total > 0 ? data.total : 1, // Use 1 as max if no assignments
                                    color: skill.color,
                                    hasData: data.total > 0
                                }
                            })

                            console.log('Skills to display:', skills)

                            return skills.map((skill) => {
                                const percentage = skill.hasData ? Math.round((skill.value / skill.max) * 100) : 0
                                const textColorClass = {
                                    'blue': 'text-blue-600',
                                    'green': 'text-green-600',
                                    'purple': 'text-purple-600',
                                    'orange': 'text-orange-600'
                                }[skill.color]

                                return (
                                    <div key={skill.name}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                            <span className={`text-lg font-bold ${textColorClass}`}>
                                                {percentage}%
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={skill.value}
                                            max={skill.max}
                                            color={skill.color}
                                            height="h-2"
                                            showLabel={false}
                                        />
                                    </div>
                                )
                            })
                        })()}
                    </div>

                    {/* Recent Assignments */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Recent Assignments:</h4>
                        <div className="space-y-2">
                            {assignments.slice(0, 3).map((assignment, index) => (
                                <div key={assignment.id} className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                                    <SubjectIcon subject={assignment.subject} className="text-lg text-blue-600" />
                                    <span className="flex-1 truncate">{assignment.title}</span>
                                </div>
                            ))}
                            {assignments.length === 0 && (
                                <p className="text-xs sm:text-sm text-gray-500 italic">No assignments yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg ${location.pathname === item.path
                                ? 'text-purple-600'
                                : 'text-gray-500'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom padding for mobile nav */}
            <div className="md:hidden h-20"></div>
        </div>
    )
}

export default StudentDashboard
