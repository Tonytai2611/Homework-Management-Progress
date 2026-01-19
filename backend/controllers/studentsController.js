import supabase from '../db.js'

/**
 * Get all students (Admin)
 */
export const getAllStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, level, created_at')
            .eq('role', 'student')
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json({
            success: true,
            data
        })
    } catch (error) {
        console.error('Get all students error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students'
        })
    }
}

/**
 * Get student details with progress (Admin)
 */
export const getStudentDetails = async (req, res) => {
    try {
        const { id } = req.params

        // Get student info
        const { data: student, error: studentError } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .eq('role', 'student')
            .single()

        if (studentError || !student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            })
        }

        // Get student assignments
        const { data: assignments, error: assignmentsError } = await supabase
            .from('student_assignments')
            .select(`
        *,
        assignment:assignments(*)
      `)
            .eq('student_id', id)

        if (assignmentsError) throw assignmentsError

        // Calculate stats
        const total = assignments.length
        const completed = assignments.filter(a => a.status === 'completed').length
        const inProgress = assignments.filter(a => a.status === 'in-progress').length
        const pending = assignments.filter(a => a.status === 'pending').length

        // Calculate by subject
        const subjectStats = {}
        assignments.forEach(sa => {
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
            name: subject,
            progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
            assignments: stats.total,
            completed: stats.completed
        }))

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    email: student.email,
                    fullName: student.full_name,
                    level: student.level,
                    createdAt: student.created_at
                },
                stats: {
                    total,
                    completed,
                    inProgress,
                    pending,
                    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
                },
                bySubject,
                recentAssignments: assignments.slice(0, 5).map(sa => ({
                    ...sa.assignment,
                    status: sa.status,
                    completedAt: sa.completed_at
                }))
            }
        })
    } catch (error) {
        console.error('Get student details error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student details'
        })
    }
}

/**
 * Get dashboard stats (Admin)
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Get total students
        const { count: totalStudents, error: studentsError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')

        if (studentsError) throw studentsError

        // Get total assignments
        const { count: totalAssignments, error: assignmentsError } = await supabase
            .from('assignments')
            .select('*', { count: 'exact', head: true })

        if (assignmentsError) throw assignmentsError

        // Get completed assignments
        const { count: completedAssignments, error: completedError } = await supabase
            .from('student_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed')

        if (completedError) throw completedError

        // Get pending assignments
        const { count: pendingAssignments, error: pendingError } = await supabase
            .from('student_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        if (pendingError) throw pendingError

        res.json({
            success: true,
            data: {
                totalStudents: totalStudents || 0,
                totalAssignments: totalAssignments || 0,
                completedAssignments: completedAssignments || 0,
                pendingAssignments: pendingAssignments || 0
            }
        })
    } catch (error) {
        console.error('Get dashboard stats error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats'
        })
    }
}
