import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import { testConnection } from './db.js'
import authRoutes from './routes/auth.js'
import assignmentsRoutes from './routes/assignments.js'
import studentsRoutes from './routes/students.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Little Buddies Learning Hub API',
        version: '1.0.0',
        documentation: '/api-docs'
    })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/assignments', assignmentsRoutes)
app.use('/api/students', studentsRoutes)

// Keep-alive endpoint to prevent Render and Supabase from sleeping
app.get('/api/health/keep-alive', async (req, res) => {
    const isConnected = await testConnection()
    res.json({
        success: true,
        database: isConnected ? 'connected' : 'failed',
        timestamp: new Date().toISOString()
    })
})

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Little Buddies API Docs'
}))

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

// Error Handler
app.use((err, req, res, next) => {

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    })
})

// Start server
async function startServer() {
    try {
        // Test database connection
        const isConnected = await testConnection()

        if (!isConnected) {

            process.exit(1)
        }

        // Start listening
        app.listen(PORT, () => {


        })
    } catch (error) {

        process.exit(1)
    }
}

// Start server if not running on Vercel
if (process.env.VERCEL) {
    // Serverless mode
} else {
    // Start local server
    startServer()
}

// Export app for Vercel
export default app

// Graceful shutdown
process.on('SIGINT', async () => {
    process.exit(0)
})
