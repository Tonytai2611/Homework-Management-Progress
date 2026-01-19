import express from 'express'
import {
    getAllStudents,
    getStudentDetails,
    getDashboardStats
} from '../controllers/studentsController.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/', authenticateToken, requireAdmin, getAllStudents)

/**
 * @swagger
 * /api/students/dashboard-stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard-stats', authenticateToken, requireAdmin, getDashboardStats)

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student details with progress (Admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details with progress
 */
router.get('/:id', authenticateToken, requireAdmin, getStudentDetails)

export default router
