import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const StudentDashboard = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = () => {
        signout()
        navigate('/signin')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-purple-teal rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl font-bold text-white">LB</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Little Buddies Learning Hub</h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-purple-teal rounded-2xl shadow-xl p-8 mb-8 text-white">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl mr-4">
                            {user?.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.fullName}!</h2>
                            <p className="text-purple-100">Your Learning Progress Overview</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">2</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">8</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">4</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Assignments</p>
                                <p className="text-2xl font-bold text-purple-600">12</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-900">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Role:</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {user?.role}
                            </span>
                        </div>
                        {user?.level && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Level:</span>
                                <span className="font-medium text-gray-900">{user.level}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Member Since:</span>
                            <span className="font-medium text-gray-900">
                                {new Date(user?.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StudentDashboard
