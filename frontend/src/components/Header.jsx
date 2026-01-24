import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { MdAssignment } from 'react-icons/md'
import { BsCalendar3 } from 'react-icons/bs'
import { HiOutlineChartBar, HiMenu, HiX } from 'react-icons/hi'
import logo from '../images/littlebuddies.png'

const Header = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        <>
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/student/dashboard" className="flex items-center">
                                <img src={logo} alt="Little Buddies" className="w-8 h-8 sm:w-10 sm:h-10 object-contain mr-2 sm:mr-3" />
                                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Little Buddies</h1>
                            </Link>
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
        </>
    )
}

export default Header
