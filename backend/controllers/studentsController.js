import supabase from '../db.js'

/**
 * Get all students (Admin)
 */
export const getAllStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, level, created_at')
            .eq('role', 'student')
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json({
            success: true,
            data
        })
    } catch (error) {

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


    if (!req.user || !req.user.id) {

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
        const { data: studentAssignments, error: saError } = await supabase
            .from('student_assignments')
            .select('*')
            .eq('student_id', id)

        if (saError) throw saError

        // Get assignment details
        const assignmentIds = studentAssignments.map(sa => sa.assignment_id)
        let assignments = []

        if (assignmentIds.length > 0) {
            const { data: assignmentDetails, error: adError } = await supabase
                .from('assignments')
                .select('*')
                .in('id', assignmentIds)

            if (adError) throw adError

            assignments = studentAssignments.map(sa => {
                const detail = assignmentDetails.find(a => a.id === sa.assignment_id)
                return {
                    ...sa,
                    assignment: detail || { title: 'Unknown Assignment', subject: 'Other' }
                }
            })
        }

        // Streak Calculation
        const completedDates = assignments
            .filter(a => a.status === 'completed' && a.completed_at)
            .map(a => new Date(a.completed_at))

        const getWeekKey = (date) => {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
            const dayNum = d.getUTCDay() || 7
            d.setUTCDate(d.getUTCDate() + 4 - dayNum)
            const year = d.getUTCFullYear()
            const week = Math.ceil((((d - new Date(Date.UTC(year, 0, 1))) / 86400000) + 1) / 7)
            return `${year}-W${String(week).padStart(2, '0')}`
        }

        const activeWeeks = new Set(completedDates.map(getWeekKey))
        let streak = 0
        const now = new Date()
        const currentWK = getWeekKey(now)
        const lastWK = getWeekKey(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))

        let anchorDate = null
        if (activeWeeks.has(currentWK)) {
            streak = 1
            anchorDate = now
        } else if (activeWeeks.has(lastWK)) {
            streak = 1
            anchorDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }

        if (streak > 0) {
            let d = new Date(anchorDate)
            while (true) {
                d.setDate(d.getDate() - 7)
                if (activeWeeks.has(getWeekKey(d))) streak++
                else break
            }
        }

        const total = assignments.length
        const completed = assignments.filter(a => a.status === 'completed').length
        const pending = assignments.filter(a => a.status === 'pending').length
        const inProgress = assignments.filter(a => a.status === 'in-progress').length

        const subjectStats = {}
        assignments.forEach(sa => {
            const subject = sa.assignment?.subject || 'Other'
            if (!subjectStats[subject]) subjectStats[subject] = { total: 0, completed: 0 }
            subjectStats[subject].total++
            if (sa.status === 'completed') subjectStats[subject].completed++
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
                    fullName: student.full_name,
                    level: student.level,
                    points: student.points,
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
                recentAssignments: assignments
                    .filter(a => {

                        if (a.status === 'pending') return true;


                        if (a.status === 'completed') {
                            const today = new Date();
                            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

                            const dueDate = new Date(a.assignment.due_date);
                            const completedDate = a.completed_at ? new Date(a.completed_at) : null;

                            // Show if due date is recent OR if it was completed recently
                            return dueDate >= sevenDaysAgo || (completedDate && completedDate >= sevenDaysAgo);
                        }

                        return false;
                    })
                    .sort((a, b) => {

                        const isCompletedA = a.status === 'completed' ? 1 : 0;
                        const isCompletedB = b.status === 'completed' ? 1 : 0;
                        if (isCompletedA !== isCompletedB) return isCompletedA - isCompletedB;

                        if (isCompletedA === 0) {
                            const dateA = new Date(a.assignment.due_date);
                            const dateB = new Date(b.assignment.due_date);
                            return dateA - dateB;
                        }

                        // If both Completed: Sort by Completed Date DESC (Most recently finished first)
                        // Fallback to updated_at if completed_at is missing
                        const dateA = new Date(a.completed_at || a.updated_at);
                        const dateB = new Date(b.completed_at || b.updated_at);
                        return dateB - dateA;
                    })
                    .slice(0, 10)
                    .map(sa => ({
                        ...sa.assignment,
                        id: sa.assignment.id,
                        studentAssignmentId: sa.id,
                        status: sa.status,
                        completedAt: sa.completed_at
                    }))
            }
        })
    } catch (error) {

        res.status(500).json({ success: false, message: 'Failed to fetch student details' })
    }
}

/**
 * Get dashboard stats (Admin)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const { count: totalStudents } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student')

        const { count: totalAssignments } = await supabase
            .from('assignments')
            .select('*', { count: 'exact', head: true })

        const { count: completedAssignments } = await supabase
            .from('student_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed')

        const { count: pendingAssignments } = await supabase
            .from('student_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

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

        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' })
    }
}

/**
 * Update student points (Admin only)
 */
export const updateStudentPoints = async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;

    if (points === undefined || points === null || isNaN(points)) {
        return res.status(400).json({ success: false, message: 'Points value required and must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ points })
            .eq('id', id)
            .eq('role', 'student')
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        res.json({ success: true, message: 'Points updated successfully.', data: data[0] });
    } catch (error) {

        res.status(500).json({ success: false, message: 'Failed to update student points.' });
    }
};

/**
 * Update student streak (Admin only)
 */
export const updateStudentStreak = async (req, res) => {
    // Placeholder for streak manual update if needed
    res.status(501).json({ success: false, message: 'Not implemented' });
};
