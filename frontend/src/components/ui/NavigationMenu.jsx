import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const NavigationMenu = ({ children, className = '' }) => {
    return (
        <nav className={`relative z-10 flex max-w-max flex-1 items-center justify-center ${className}`}>
            <div className="group flex flex-1 list-none items-center justify-center space-x-1">
                {children}
            </div>
        </nav>
    )
}

export const NavigationMenuItem = ({ children, className = '' }) => {
    return <div className={`relative ${className}`}>{children}</div>
}

export const NavigationMenuTrigger = ({ children, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <button
            className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 ${className}`}
            onClick={() => setIsOpen(!isOpen)}
            data-state={isOpen ? 'open' : 'closed'}
        >
            {children}
            <svg
                className={`relative top-[1px] ml-1 h-3 w-3 transition duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    )
}

export const NavigationMenuContent = ({ children, className = '' }) => {
    return (
        <div
            className={`absolute left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ${className}`}
        >
            <div className="absolute left-0 top-full mt-1.5 w-full md:w-auto">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    )
}

export const NavigationMenuLink = ({ to, children, className = '', asChild = false }) => {
    const location = useLocation()
    const isActive = location.pathname === to

    if (asChild) {
        return children
    }

    return (
        <Link
            to={to}
            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 ${isActive ? 'bg-gray-100 text-gray-900' : ''
                } ${className}`}
        >
            {children}
        </Link>
    )
}

export const NavigationMenuList = ({ children, className = '' }) => {
    return (
        <div className={`group flex flex-1 list-none items-center justify-center space-x-1 ${className}`}>
            {children}
        </div>
    )
}
