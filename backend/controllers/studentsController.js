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
 * Get current student details
 */
export const getMyDetails = async (req, res) => {
    console.log('getMyDetails called, req.user:', req.user)
    
    if (!req.user || !req.user.id) {
        console.error('getMyDetails: No user ID in token')
        return res.status(401).json({
            success: false,
            message: 'User ID not found in token'
        })
    }
    
    req.params.id = req.user.id
    return getStudentDetails(req, res)
}

/**
 * Get student details with progress (Admin or Self)
 */
export const getStudentDetails = async (req, res) => {
    try {
        const { id } = req.params
        console.log('getStudentDetails called for ID:', id)

        // Get student info
        const { data: student, error: studentError } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .eq('role', 'student')
            .single()

        if (studentError) {
            console.error('Error fetching student:', studentError)
        }

        if (studentError || !student) {
            console.log('Student not found for ID:', id)
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            })
        }

        console.log('Student found:', student.email)

        // Get student assignments (without join first to be safe)
        console.log('Fetching student assignments...')
        const { data: studentAssignments, error: saError } = await supabase
            .from('student_assignments')
            .select('*')
            .eq('student_id', id)

        if (saError) {
            console.error('Error fetching student_assignments:', saError)
            throw saError
        }

        console.log('Student assignments fetched:', studentAssignments.length)

        // Get assignment details manually to avoid relation errors
        const assignmentIds = studentAssignments.map(sa => sa.assignment_id)
        let assignments = []

        if (assignmentIds.length > 0) {
            const { data: assignmentDetails, error: adError } = await supabase
                .from('assignments')
                .select('*')
                .in('id', assignmentIds)

            if (adError) {
                console.error('Error fetching assignment details:', adError)
                throw adError
            }

            // Merge details back
            assignments = studentAssignments.map(sa => {
                const detail = assignmentDetails.find(a => a.id === sa.assignment_id)
                return {
                    ...sa,
                    assignment: detail || { title: 'Unknown Assignment', subject: 'Other' }
                }
            })
        } else {
            assignments = []
        }

        // --- Weekly Streak Calculation (Weekly Commitment Streak) ---
        // Logic: Did the student complete AT LEAST ONE assignment in the week?
        const completedDates = assignments
            .filter(a => a.status === 'completed' && a.completed_at)
            .map(a => new Date(a.completed_at))

        // Helper to get Year-Week string (e.g., "2026-W03")
        const getWeekKey = (date) => {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
            const dayNum = d.getUTCDay() || 7
            d.setUTCDate(d.getUTCDate() + 4 - dayNum)
            const year = d.getUTCFullYear()
            const week = Math.ceil((((d - new Date(Date.UTC(year, 0, 1))) / 86400000) + 1) / 7)
            return `${year}-W${String(week).padStart(2, '0')}`
        }

        // Get set of weeks with activity
        const activeWeeks = new Set(completedDates.map(getWeekKey))

        // --- FINAL IMPLEMENTATION ---
        let streak = 0
        const now = new Date()
        const currentWK = getWeekKey(now)

        const lastWeekDate = new Date(now)
        lastWeekDate.setDate(lastWeekDate.getDate() - 7)
        const lastWK = getWeekKey(lastWeekDate)

        let anchorDate = null

        if (activeWeeks.has(currentWK)) {
            streak = 1
            anchorDate = new Date(now)
        } else if (activeWeeks.has(lastWK)) {
            streak = 1
            anchorDate = new Date(lastWeekDate)
        } else {
            streak = 0
        }

        if (streak > 0) {
            // Count backwards from anchorDate - 7 days
            let d = new Date(anchorDate)
            // Use a safety counter to prevent infinite loops (e.g. max 52 weeks)
            let safety = 0
            while (safety < 100) {
                d.setDate(d.getDate() - 7)
                if (activeWeeks.has(getWeekKey(d))) {
                    streak++
                } else {
                    break
                }
                safety++
            }
        }

        // Stats calculation
        const total = assignments.length
        const completed = assignments.filter(a => a.status === 'completed').length
        const pending = assignments.filter(a => a.status === 'pending').length
        const inProgress = assignments.filter(a => a.status === 'in-progress').length

        // Calculate by subject
        const subjectStats = {}
        assignments.forEach(sa => {
            if (!sa.assignment) return // Skip if no assignment details

            const subject = sa.assignment.subject || 'Other'
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
                    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
                    weeklyStreak: streak
                },
                bySubject,
                recentAssignments: assignments.map(sa => ({
                    ...sa.assignment,
                    id: sa.assignment.id, // Assignment ID
                    studentAssignmentId: sa.id, // Submission ID
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
