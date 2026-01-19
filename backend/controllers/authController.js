import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import sql from '../db.js'

/**
 * Generate JWT token with 24 hour expiration
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.full_name
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
    )
}

/**
 * Format user object (remove sensitive data)
 */
const formatUser = (user) => {
    return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        level: user.level,
        createdAt: user.created_at
    }
}

/**
 * Sign Up - Register new user
 */
export const signup = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            })
        }

        const { email, password, fullName, role, level } = req.body

        // Check if user already exists
        const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            })
        }

        // Validate role
        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either "student" or "admin"'
            })
        }

        // For students, level is required
        if (role === 'student' && !level) {
            return res.status(400).json({
                success: false,
                message: 'Level is required for students'
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // Insert new user
        const newUser = await sql`
      INSERT INTO users (email, password_hash, full_name, role, level)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${role}, ${level || null})
      RETURNING id, email, full_name, role, level, created_at
    `

        // Generate token
        const token = generateToken(newUser[0])

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: formatUser(newUser[0])
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        })
    }
}

/**
 * Sign In - Login user
 */
export const signin = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            })
        }

        const { email, password } = req.body

        // Find user by email
        const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const user = users[0]

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash)

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Generate token
        const token = generateToken(user)

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: formatUser(user)
        })
    } catch (error) {
        console.error('Signin error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        })
    }
}

/**
 * Get Current User - Get authenticated user's data
 */
export const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        const userId = req.user.id

        const users = await sql`
      SELECT id, email, full_name, role, level, created_at
      FROM users
      WHERE id = ${userId}
    `

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            user: formatUser(users[0])
        })
    } catch (error) {
        console.error('Get current user error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}
