import supabase from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            fullName: user.full_name,
            role: user.role,
            fullName: user.full_name
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
}

/**
 * Format user object (remove sensitive data)
 */
const formatUser = (user) => {
    const { password_hash, ...userWithoutPassword } = user
    return {
        ...userWithoutPassword,
        fullName: user.full_name,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    }
}

/**
 * User signup
 */
export const signup = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const { password, fullName, role, level } = req.body



        // Check if user already exists by fullName (treating it as unique for this flow)
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('full_name', fullName)
            .single()

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                password_hash: passwordHash,
                full_name: fullName,
                role,
                level: role === 'student' ? level : null
            }])
            .select()
            .single()

        if (error) {

            throw error
        }

        // Generate token
        const token = generateToken(newUser)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: formatUser(newUser)
        })
    } catch (error) {
        console.error('Registration error details:', error)
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message // Optional: only for debugging, might want to remove for prod
        })
    }
}

/**
 * User signin
 */
export const signin = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const { fullName, password } = req.body

        // Find user by Full Name
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('full_name', fullName)
            .single()

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash)

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // Generate token
        const token = generateToken(user)

        res.json({
            success: true,
            token,
            user: formatUser(user)
        })
    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Login failed'
        })
    }
}

/**
 * Get current user
 */
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (error || !user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            user: formatUser(user)
        })
    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        })
    }
}
