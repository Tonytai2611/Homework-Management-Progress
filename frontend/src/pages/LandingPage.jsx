import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-400 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                <span className="text-xl font-bold text-white">LB</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
                                Little Buddies
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">How it Works</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Testimonials</a>
                            <Link to="/signin" className="text-gray-900 hover:text-purple-600 font-bold transition-colors">Sign In</Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-full font-bold hover:shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-purple-600 focus:outline-none"
                            >
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4">
                        <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>How it Works</a>
                        <Link to="/signin" className="text-gray-900 font-bold" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                        <Link
                            to="/signup"
                            className="text-center px-6 py-3 bg-purple-600 text-white rounded-lg font-bold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="z-10">
                            <div className="inline-block px-4 py-2 bg-purple-50 rounded-full text-purple-700 font-semibold text-sm mb-6 border border-purple-100">
                                🚀 The #1 Homework Platform for Kids
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                                Make Learning <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
                                    Fun & Easy
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                                Manage assignments, track progress, and celebrate achievements. The perfect companion for young learners, parents, and teachers.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-purple-700 transition-all transform hover:-translate-y-1 text-center"
                                >
                                    Get Started Free
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold text-lg hover:border-purple-200 hover:text-purple-600 transition-all transform hover:-translate-y-1 text-center"
                                >
                                    Learn More
                                </a>
                            </div>

                            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <p>Trusted by 100+ schools and parents</p>
                            </div>
                        </div>

                        <div className="relative lg:block">
                            {/* Decorative blobs */}
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                            {/* Abstract Dashboard Illustration */}
                            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 transform rotate-2 hover:rotate-0 transition-all duration-500">
                                {/* Header Mockup */}
                                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="h-2 w-32 bg-gray-100 rounded-full"></div>
                                </div>

                                {/* Content Mockup */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-1/3 h-32 bg-purple-50 rounded-2xl p-4">
                                            <div className="w-8 h-8 rounded-full bg-purple-200 mb-2"></div>
                                            <div className="h-2 w-16 bg-purple-200 rounded-full mb-1"></div>
                                            <div className="h-6 w-8 bg-purple-300 rounded-lg"></div>
                                        </div>
                                        <div className="w-1/3 h-32 bg-teal-50 rounded-2xl p-4">
                                            <div className="w-8 h-8 rounded-full bg-teal-200 mb-2"></div>
                                            <div className="h-2 w-16 bg-teal-200 rounded-full mb-1"></div>
                                            <div className="h-6 w-8 bg-teal-300 rounded-lg"></div>
                                        </div>
                                        <div className="w-1/3 h-32 bg-orange-50 rounded-2xl p-4">
                                            <div className="w-8 h-8 rounded-full bg-orange-200 mb-2"></div>
                                            <div className="h-2 w-16 bg-orange-200 rounded-full mb-1"></div>
                                            <div className="h-6 w-8 bg-orange-300 rounded-lg"></div>
                                        </div>
                                    </div>

                                    <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>

                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">📚</div>
                                            <div>
                                                <div className="h-3 w-24 bg-gray-200 rounded-full mb-1"></div>
                                                <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-10 border-y border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500 font-semibold mb-8 uppercase tracking-wider text-sm">Trusted by Forward-Thinking Schools</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Company Logos */}
                        <div className="text-2xl font-bold text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-sm"></div> DotSquare</div>
                        <div className="text-2xl font-bold text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-sm"></div> Wiggle</div>
                        <div className="text-2xl font-bold text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-sm"></div> SeaLife</div>
                        <div className="text-2xl font-bold text-gray-400 flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-sm"></div> LoopMedia</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-purple-600 font-bold tracking-wide uppercase text-sm mb-3">Why Choose Us</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to <br />manage homework</h3>
                        <p className="text-xl text-gray-500">Simple, intuitive, and fun. Designed for the modern classroom and digital-native students.</p>
                    </div>

                    {/* Feature 1 */}
                    <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                        <div className="lg:w-1/2">
                            <div className="bg-purple-100 rounded-3xl p-8 transform -rotate-2">
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-bold">Tasks</span>
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">3 Pending</span>
                                    </div>
                                    <div className="space-y-3">
                                        {['Read pages 12-15', 'Answer math questions', 'Practice vocabulary'].map((task, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border ${i === 0 ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
                                                    {i === 0 && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className={i === 0 ? 'line-through text-gray-400' : 'text-gray-700'}>{task}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-6">✅</div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-4">Track assignments with ease</h4>
                            <p className="text-lg text-gray-600 mb-6">
                                Never miss a deadline again. Our intuitive checklist system helps students stay organized and parents stay informed about what needs to be done.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2">✓ Smart reminders</li>
                                <li className="flex items-center gap-2">✓ Easy submission</li>
                                <li className="flex items-center gap-2">✓ Teacher feedback</li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="bg-teal-100 rounded-3xl p-8 transform rotate-2">
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Completion Rate</p>
                                            <p className="text-3xl font-bold text-gray-900">92%</p>
                                        </div>
                                        <div className="h-10 w-24 bg-teal-50 rounded-lg flex items-end justify-between px-2 pb-2">
                                            <div className="w-3 bg-teal-300 rounded-t h-4"></div>
                                            <div className="w-3 bg-teal-400 rounded-t h-6"></div>
                                            <div className="w-3 bg-teal-500 rounded-t h-8"></div>
                                            <div className="w-3 bg-teal-600 rounded-t h-5"></div>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[92%] bg-teal-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-4">Visualize Progress</h4>
                            <p className="text-lg text-gray-600 mb-6">
                                See how you're doing at a glance. Visual charts and progress bars make it easy to understand improvement over time in every subject.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2">✓ Weekly reports</li>
                                <li className="flex items-center gap-2">✓ Skill breakdown</li>
                                <li className="flex items-center gap-2">✓ Performance completion stats</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-purple-600 to-teal-500 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pattern-dots"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to start your journey?</h2>
                            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
                                Join thousands of students and teachers who are making homework fun again.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1"
                                >
                                    Sign Up Now
                                </Link>
                                <Link
                                    to="/signin"
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all transform hover:-translate-y-1"
                                >
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-400 rounded-lg flex items-center justify-center mr-2">
                                    <span className="text-lg font-bold text-white">LB</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">Little Buddies</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Making education accessible, fun, and manageable for everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-purple-600">Features</a></li>
                                <li><a href="#" className="hover:text-purple-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-purple-600">Case Studies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-purple-600">About Us</a></li>
                                <li><a href="#" className="hover:text-purple-600">Careers</a></li>
                                <li><a href="#" className="hover:text-purple-600">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                                <li><a href="#" className="hover:text-purple-600">Guides</a></li>
                                <li><a href="#" className="hover:text-purple-600">Help Center</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2026 Little Buddies Learning Hub. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
