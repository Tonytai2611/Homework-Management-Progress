import express from 'express'
import { body } from 'express-validator'
import {
    getAllAssignments,
    getStudentAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    updateAssignmentStatus,
    getStudentProgress,
    assignToStudents,
    adminUpdateSubmissionStatus
} from '../controllers/assignmentsController.js'
import { authenticateToken, requireAdmin, requireStudent } from '../middleware/auth.js'

const router = express.Router()

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments (Admin) or student's assignments (Student)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *           enum: [Reading, Writing, Listening, Speaking, Grammar & Vocabulary]
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get('/', authenticateToken, async (req, res, next) => {
    if (req.user.role === 'admin') {
        return getAllAssignments(req, res, next)
    } else {
        return getStudentAssignments(req, res, next)
    }
})

/**
 * @swagger
 * /api/assignments/progress:
 *   get:
 *     summary: Get student progress statistics
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student progress data
 */
router.get('/progress', authenticateToken, requireStudent, getStudentProgress)

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get single assignment
 *     tags: [Assignments]
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
 *         description: Assignment details
 */
router.get('/:id', authenticateToken, getAssignment)

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create new assignment (Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subject
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *                 enum: [Reading, Writing, Listening, Speaking, Grammar & Vocabulary]
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Assignment created
 */
router.post(
    '/',
    authenticateToken,
    requireAdmin,
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('subject').isIn(['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar & Vocabulary']),
        body('dueDate').isISO8601().withMessage('Valid due date required'),
        body('priority').optional().isIn(['low', 'medium', 'high'])
    ],
    createAssignment
)

/**
 * @swagger
 * /api/assignments/{id}:
 *   put:
 *     summary: Update assignment (Admin only)
 *     tags: [Assignments]
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
 *         description: Assignment updated
 */
router.put('/:id', authenticateToken, requireAdmin, updateAssignment)

/**
 * @swagger
 * /api/assignments/{id}:
 *   delete:
 *     summary: Delete assignment (Admin only)
 *     tags: [Assignments]
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
 *         description: Assignment deleted
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteAssignment)

/**
 * @swagger
 * /api/assignments/{id}/status:
 *   patch:
 *     summary: Update assignment status (Student)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
    '/:id/status',
    authenticateToken,
    requireStudent,
    [
        body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
    ],
    updateAssignmentStatus
)

/**
 * @swagger
 * /api/assignments/submissions/{id}:
 *   patch:
 *     summary: Admin update submission status (Teacher manual grading)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
    '/submissions/:id',
    authenticateToken,
    requireAdmin,
    [
        body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
    ],
    adminUpdateSubmissionStatus
)

/**
 * @swagger
 * /api/assignments/{id}/assign:
 *   post:
 *     summary: Assign assignment to students (Admin)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentIds
 *             properties:
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Assignment assigned to students
 */
router.post(
    '/:id/assign',
    authenticateToken,
    requireAdmin,
    [
        body('studentIds').isArray().withMessage('Student IDs must be an array')
    ],
    assignToStudents
)

export default router
