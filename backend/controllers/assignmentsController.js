import supabase from '../db.js'
import { validationResult } from 'express-validator'

/**
 * Get all assignments (Admin)
 */
export const getAllAssignments = async (req, res) => {
    try {
        const { subject, status } = req.query

        let query = supabase
            .from('assignments')
            .select(`
        *,
        created_by_user:users!assignments_created_by_fkey(id, full_name, email),
        student_assignments(student_id)
      `)

        if (subject) {
            query = query.eq('subject', subject)
        }

        const { data, error } = await query.order('due_date', { ascending: true })

        if (error) throw error

        res.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Get all assignments error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assignments'
        })
    }
}

/**
 * Get student assignments
 */
export const getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user.id
        const { status, subject } = req.query

        // 1. Get student assignments
        let query = supabase
            .from('student_assignments')
            .select('*')
            .eq('student_id', studentId)

        if (status) {
            query = query.eq('status', status)
        }

        const { data: studentAssignments, error: saError } = await query

        if (saError) throw saError

        if (!studentAssignments || studentAssignments.length === 0) {
            return res.json({
                success: true,
                data: []
            })
        }

        // 2. Get assignment details
        const assignmentIds = studentAssignments.map(sa => sa.assignment_id)

        // Fetch assignments
        let assignmentsQuery = supabase
            .from('assignments')
            .select('*, created_by_user:users!assignments_created_by_fkey(id, full_name, email)')
            .in('id', assignmentIds)

        // Filter by subject if provided
        if (subject) {
            assignmentsQuery = assignmentsQuery.eq('subject', subject)
        }

        const { data: assignmentsData, error: aError } = await assignmentsQuery

        if (aError) throw aError

        // 3. Map/Merge data
        // Create a map for faster lookup
        const assignmentsMap = (assignmentsData || []).reduce((acc, curr) => {
            acc[curr.id] = curr
            return acc
        }, {})

        // Combine data
        const combinedAssignments = studentAssignments
            .map(sa => {
                const assignment = assignmentsMap[sa.assignment_id]
                // Skip if assignment not found (filtered out by subject or deleted)
                if (!assignment) return null

                return {
                    ...assignment,
                    student_assignment_id: sa.id,
                    status: sa.status,
                    started_at: sa.started_at,
                    completed_at: sa.completed_at,
                    notes: sa.notes
                }
            })
            .filter(item => item !== null) // Remove nulls
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // Sort by due date

        res.json({
            success: true,
            data: combinedAssignments
        })
    } catch (error) {
        console.error('Get student assignments error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assignments'
        })
    }
}

/**
 * Get single assignment
 */
export const getAssignment = async (req, res) => {
    try {
        const { id } = req.params

        const { data: assignment, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            })
        }

        res.json({
            success: true,
            data: assignment
        })
    } catch (error) {
        console.error('Get assignment error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assignment'
        })
    }
}

/**
 * Create assignment (Admin)
 */
export const createAssignment = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const { title, subject, description, link, dueDate, priority, studentIds, tasks } = req.body
        const createdBy = req.user.id

        // Create assignment
        const { data: newAssignment, error: assignmentError } = await supabase
            .from('assignments')
            .insert([{
                title,
                subject,
                description: description || null,
                link: link || null,
                due_date: dueDate,
                priority: priority || 'medium',
                created_by: createdBy,
                tasks: tasks || []
            }])
            .select()
            .single()

        if (assignmentError) throw assignmentError

        // Assign to students if provided
        if (studentIds && studentIds.length > 0) {
            const studentAssignments = studentIds.map(studentId => ({
                assignment_id: newAssignment.id,
                student_id: studentId,
                status: 'pending'
            }))

            const { error: saError } = await supabase
                .from('student_assignments')
                .insert(studentAssignments)

            if (saError) throw saError
        }

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: newAssignment
        })
    } catch (error) {
        console.error('Create assignment error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to create assignment'
        })
    }
}

/**
 * Update assignment (Admin)
 */
export const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params
        const { title, subject, description, link, dueDate, priority, tasks } = req.body

        const updates = {}
        if (title) updates.title = title
        if (subject) updates.subject = subject
        if (description !== undefined) updates.description = description
        if (link !== undefined) updates.link = link
        if (dueDate) updates.due_date = dueDate
        if (priority) updates.priority = priority
        if (tasks !== undefined) updates.tasks = tasks

        const { data, error } = await supabase
            .from('assignments')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        res.json({
            success: true,
            message: 'Assignment updated successfully',
            data
        })
    } catch (error) {
        console.error('Update assignment error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to update assignment'
        })
    }
}

/**
 * Delete assignment (Admin)
 */
export const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabase
            .from('assignments')
            .delete()
            .eq('id', id)

        if (error) throw error

        res.json({
            success: true,
            message: 'Assignment deleted successfully'
        })
    } catch (error) {
        console.error('Delete assignment error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to delete assignment'
        })
    }
}

/**
 * Update assignment status (Student)
 */
export const updateAssignmentStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status, notes } = req.body
        const studentId = req.user.id

        // Check if student_assignment exists
        const { data: existing } = await supabase
            .from('student_assignments')
            .select('*')
            .eq('assignment_id', id)
            .eq('student_id', studentId)
            .single()

        let result
        if (!existing) {
            // Create new
            const { data, error } = await supabase
                .from('student_assignments')
                .insert([{
                    assignment_id: id,
                    student_id: studentId,
                    status,
                    notes: notes || null,
                    started_at: status === 'in-progress' ? new Date().toISOString() : null
                }])
                .select()
                .single()

            if (error) throw error
            result = data
        } else {
            // Update existing
            const updates = { status }
            if (notes !== undefined) updates.notes = notes
            if (status === 'in-progress' && !existing.started_at) {
                updates.started_at = new Date().toISOString()
            }
            if (status === 'completed') {
                updates.completed_at = new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('student_assignments')
                .update(updates)
                .eq('id', existing.id)
                .select()
                .single()

            if (error) throw error
            result = data
        }

        // --- NEW: Add 50 points if Completed ---
        if (status === 'completed' && (!existing || existing.status !== 'completed')) {
            const { data: user } = await supabase
                .from('users')
                .select('points')
                .eq('id', studentId)
                .single()

            if (user) {
                await supabase
                    .from('users')
                    .update({ points: (user.points || 0) + 50 })
                    .eq('id', studentId)
            }
        }
        // ---------------------------------------

        res.json({
            success: true,
            message: 'Assignment status updated',
            data: result
        })
    } catch (error) {
        console.error('Update assignment status error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to update assignment status'
        })
    }
}

/**
 * Admin Update submission status (for Teacher manual grading)
 */
export const adminUpdateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params // student_assignment_id
        const { status, note } = req.body

        const updates = { status }
        if (note !== undefined) updates.notes = note

        if (status === 'started' || status === 'in-progress') {
            updates.started_at = new Date().toISOString()
        }
        if (status === 'completed') {
            updates.completed_at = new Date().toISOString()
        }

        // Get current status to check for transition
        const { data: existingSA } = await supabase
            .from('student_assignments')
            .select('status, student_id')
            .eq('id', id)
            .single()

        const existingStatus = existingSA?.status

        const { data, error } = await supabase
            .from('student_assignments')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        // --- NEW: Add 50 points if Completed ---
        if (status === 'completed' && data.status === 'completed' && existingStatus !== 'completed') {
            const studentId = data.student_id

            const { data: user } = await supabase
                .from('users')
                .select('points')
                .eq('id', studentId)
                .single()

            if (user) {
                await supabase
                    .from('users')
                    .update({ points: (user.points || 0) + 50 })
                    .eq('id', studentId)
            }
        }
        // ---------------------------------------

        res.json({
            success: true,
            message: 'Submission status updated',
            data
        })
    } catch (error) {
        console.error('Admin update submission error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to update submission status'
        })
    }
}

/**
 * Get student progress
 */
export const getStudentProgress = async (req, res) => {
    try {
        const studentId = req.user.id

        // Get all student assignments
        const { data: studentAssignments, error } = await supabase
            .from('student_assignments')
            .select(`
        *,
        assignment:assignments(subject)
      `)
            .eq('student_id', studentId)

        if (error) throw error

        // Calculate overall stats
        const total = studentAssignments.length
        const completed = studentAssignments.filter(sa => sa.status === 'completed').length
        const inProgress = studentAssignments.filter(sa => sa.status === 'in-progress').length
        const pending = studentAssignments.filter(sa => sa.status === 'pending').length

        // Calculate by subject
        const subjectStats = {}
        studentAssignments.forEach(sa => {
            const subject = sa.assignment.subject
            if (!subjectStats[subject]) {
                subjectStats[subject] = { total: 0, completed: 0 }
            }
            subjectStats[subject].total++
            if (sa.status === 'completed') {
                subjectStats[subject].completed++
            }
        })

        const bySubject = Object.entries(subjectStats).map(([subject, stats]) => ({
            subject,
            total: stats.total,
            completed: stats.completed,
            progress: Math.round((stats.completed / stats.total) * 100)
        }))

        // Calculate weekly progress (last 4 weeks)
        const fourWeeksAgo = new Date()
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

        const recentCompleted = studentAssignments.filter(sa =>
            sa.status === 'completed' &&
            sa.completed_at &&
            new Date(sa.completed_at) >= fourWeeksAgo
        )

        // Group by week
        const weeklyStats = {}
        recentCompleted.forEach(sa => {
            const date = new Date(sa.completed_at)
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            const weekKey = weekStart.toISOString().split('T')[0]

            weeklyStats[weekKey] = (weeklyStats[weekKey] || 0) + 1
        })

        const weekly = Object.entries(weeklyStats).map(([week, completed]) => ({
            week,
            completed
        }))

        res.json({
            success: true,
            data: {
                overall: {
                    total,
                    completed,
                    in_progress: inProgress,
                    pending,
                    completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0
                },
                bySubject,
                weekly
            }
        })
    } catch (error) {
        console.error('Get student progress error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress data'
        })
    }
}

/**
 * Assign assignment to students (Admin)
 */
export const assignToStudents = async (req, res) => {
    try {
        const { id } = req.params
        const { studentIds } = req.body

        if (!studentIds || studentIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Student IDs required'
            })
        }

        const studentAssignments = studentIds.map(studentId => ({
            assignment_id: id,
            student_id: studentId,
            status: 'pending'
        }))

        const { data, error } = await supabase
            .from('student_assignments')
            .upsert(studentAssignments, {
                onConflict: 'assignment_id,student_id'
            })
            .select()

        if (error) throw error

        res.json({
            success: true,
            message: `Assignment assigned to ${studentIds.length} student(s)`,
            data
        })
    } catch (error) {
        console.error('Assign to students error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to assign assignment'
        })
    }
}
