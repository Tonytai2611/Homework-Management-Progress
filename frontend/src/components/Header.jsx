import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { MdAssignment } from 'react-icons/md'
import { BsCalendar3 } from 'react-icons/bs'
import { HiOutlineChartBar } from 'react-icons/hi'

const Header = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

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
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/student/dashboard" className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-purple-teal rounded-lg flex items-center justify-center mr-3">
                                <span className="text-xl font-bold text-white">LB</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Little Buddies</h1>
                        </Link>

                        {/* Navigation Menu */}
                        <nav className="hidden md:flex space-x-2">
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
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
