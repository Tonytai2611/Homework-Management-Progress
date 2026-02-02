import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const signin = async (fullName, password) => {
        try {
            const response = await api.post('/auth/signin', { fullName, password })
            const { token, user: userData } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)

            return { success: true, user: userData }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const signup = async (password, fullName, role, level) => {
        try {
            const response = await api.post('/auth/signup', {
                // email is generated on backend
                password,
                fullName,
                role,
                level
            })
            const { token, user: userData } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)

            return { success: true, user: userData }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                errors: error.response?.data?.errors
            }
        }
    }

    const signout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const value = {
        user,
        loading,
        signin,
        signup,
        signout,
        isAuthenticated: !!user
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
