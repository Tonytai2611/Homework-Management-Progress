import api from './axios'

/**
 * Assignments API Service
 */
export const assignmentsAPI = {
    /**
     * Get all assignments (role-based)
     * Admin: gets all assignments
     * Student: gets their assignments
     */
    getAll: async (filters = {}) => {
        const params = new URLSearchParams()
        if (filters.status) params.append('status', filters.status)
        if (filters.subject) params.append('subject', filters.subject)

        const queryString = params.toString()
        const response = await api.get(`/assignments${queryString ? `?${queryString}` : ''}`)
        return response.data
    },

    /**
     * Get single assignment by ID
     */
    getById: async (id) => {
        const response = await api.get(`/assignments/${id}`)
        return response.data
    },

    /**
     * Get student progress statistics
     */
    getProgress: async () => {
        const response = await api.get('/assignments/progress')
        return response.data
    },

    /**
     * Update assignment status (Student)
     */
    updateStatus: async (id, status, notes = '') => {
        const response = await api.patch(`/assignments/${id}/status`, { status, notes })
        return response.data
    },

    /**
     * Create new assignment (Admin)
     */
    create: async (assignmentData) => {
        const response = await api.post('/assignments', assignmentData)
        return response.data
    },

    /**
     * Update assignment (Admin)
     */
    update: async (id, assignmentData) => {
        const response = await api.put(`/assignments/${id}`, assignmentData)
        return response.data
    },

    /**
     * Delete assignment (Admin)
     */
    delete: async (id) => {
        const response = await api.delete(`/assignments/${id}`)
        return response.data
    },

    /**
     * Assign assignment to students (Admin)
     */
    assignToStudents: async (id, studentIds) => {
        const response = await api.post(`/assignments/${id}/assign`, { studentIds })
        return response.data
    }
}

/**
 * Students API Service
 */
export const studentsAPI = {
    /**
     * Get all students (Admin)
     */
    getAll: async () => {
        const response = await api.get('/students')
        return response.data
    },

    /**
     * Get student details with progress (Admin)
     */
    getById: async (id) => {
        const response = await api.get(`/students/${id}`)
        return response.data
    },

    /**
     * Get dashboard statistics (Admin)
     */
    getDashboardStats: async () => {
        const response = await api.get('/students/dashboard-stats')
        return response.data
    }
}
