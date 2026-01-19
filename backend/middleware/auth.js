import jwt from 'jsonwebtoken'

/**
 * Authentication middleware to verify JWT tokens
 * Adds user data to req.user if token is valid
 */
export const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        })
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            })
        }

        return res.status(403).json({
            success: false,
            message: 'Invalid token.'
        })
    }
}

/**
 * Middleware to check if user has admin role
 * Must be used after authenticateToken middleware
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        })
    }

    next()
}

/**
 * Middleware to check if user has student role
 * Must be used after authenticateToken middleware
 */
export const requireStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        })
    }

    if (req.user.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Student access only.'
        })
    }

    next()
}
