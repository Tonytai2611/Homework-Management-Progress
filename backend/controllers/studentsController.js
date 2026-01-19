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
        const { data: assignments, error: assignmentsError } = await supabase
            .from('student_assignments')
            .select(`
        *,
        assignment:assignments(*)
      `)
            .eq('student_id', id)

        if (assignmentsError) throw assignmentsError

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

        // Calculate Streak
        let streak = 0
        const today = new Date()
        let currentWeek = new Date(today)

        // Allow streak to continue if current week is not yet done, start check from this week or previous
        const currentWeekKey = getWeekKey(today)

        // Check if user has activity this week
        if (activeWeeks.has(currentWeekKey)) {
            streak++
            // Move to previous week
            currentWeek.setDate(currentWeek.getDate() - 7)
        } else {
            // If no activity this week, check previous week. 
            // If previous week has activity, streak is valid (just hasn't done this week's yet).
            // If previous week is missing, streak is broken (0).
            currentWeek.setDate(currentWeek.getDate() - 7)
            if (!activeWeeks.has(getWeekKey(currentWeek))) {
                streak = 0
            }
        }

        // Count backwards
        while (streak > 0 || (streak === 0 && activeWeeks.has(getWeekKey(new Date())))) {
            // Wait, logic above handles 0 or 1. Now loop for previous weeks.
            // Simplified loop:
            break; // refactoring below for clarity
        }

        // --- Refined Loop ---
        streak = 0
        let checkDate = new Date()
        let checkWeekKey = getWeekKey(checkDate)

        // 1. Check current week
        if (activeWeeks.has(checkWeekKey)) {
            streak++
        }

        // 2. Loop backwards
        while (true) {
            checkDate.setDate(checkDate.getDate() - 7)
            checkWeekKey = getWeekKey(checkDate)

            if (activeWeeks.has(checkWeekKey)) {
                streak++
            } else {
                // If we haven't counted ANY streak yet (current week empty), 
                // and previous week empty -> streak 0.
                // If current week empty, but previous week has data -> streak continues?
                // Rule: "Streak" implies continuity. 
                // If I did last week (streak 1), and this week is ongoing (not done yet), my streak is still 1 (active).
                // If I missed last week, streak is 0.

                if (streak === 0) {
                    // Current week empty. Check if this is the FIRST MISS or if we just haven't started.
                    // Actually, standard streak logic:
                    // If Last Week present => Streak is at least 1 (carried over).
                    // If Current Week present => Streak + 1.

                    // Let's restart logic:
                    // Check Last Week (Week - 1)
                    // If Last Week is missing, Streak = 0 (regardless of current week, unless we just started current week and it's week 1? No, simplicity).
                    // Let's try: Count consecutive weeks strictly from Today backwards?

                    // User Rule: "Tuần 3: Không làm -> X".
                    // Means if I miss a week, it breaks.

                    // Final Logic:
                    // Iterate backwards from Current Week.
                    // If Current Week has data -> Streak += 1, continue.
                    // If Current Week NO data -> Check Previous Week.
                    //    If Previous Week NO data -> Streak Ends (0).
                    //    If Previous Week HAS data -> Streak += 1 (from Prev), continue.
                    //    AND: We mark that we skipped current week (it's allowed as 'pending').

                    break;
                } else {
                    break;
                }
            }
        }

        // Re-Re-Thinking for Robustness:
        // Key concept: A streak is alive if you did last week OR this week.
        // Let's count consecutive weeks starting from [Current_Week] OR [Previous_Week].

        let s = 0;
        let d = new Date();
        let weekKey = getWeekKey(d);

        // If current week has activity, start here.
        if (activeWeeks.has(weekKey)) {
            s++;
            d.setDate(d.getDate() - 7);
            weekKey = getWeekKey(d);
        } else {
            // Current week has NO activity.
            // Check previous week.
            d.setDate(d.getDate() - 7);
            weekKey = getWeekKey(d);
            if (!activeWeeks.has(weekKey)) {
                s = 0; // No activity last week either.
            }
        }

        // Now loop backwards from wherever 'd' is
        while (s > 0) { // Only loop if we have a started streak
            if (activeWeeks.has(weekKey)) {
                // Check next previous
                // But wait, if we entered "else" block above, we essentially just checked the first previous week.
                // We need to count it if we haven't already.

                // Clean approach:
                // 1. Find the most recent active week.
                // 2. If it is Current Week or Previous Week -> It is the anchor.
                // 3. Count backwards from anchor.
                // 4. If most recent active week < Previous Week -> Streak = 0.

                break;
            }
            break;
        }

        // --- FINAL IMPLEMENTATION ---
        streak = 0
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
            while (true) {
                d.setDate(d.getDate() - 7)
                if (activeWeeks.has(getWeekKey(d))) {
                    streak++
                } else {
                    break
                }
            }
        }

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
