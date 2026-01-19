import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import StudentDashboard from './pages/StudentDashboard'
import StudentAssignments from './pages/StudentAssignments'
import StudentCalendar from './pages/StudentCalendar'
import StudentProgress from './pages/StudentProgress'
import AdminDashboard from './pages/AdminDashboard'
import ManageAssignments from './pages/ManageAssignments'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute>
                <StudentAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/calendar"
            element={
              <ProtectedRoute>
                <StudentCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/progress"
            element={
              <ProtectedRoute>
                <StudentProgress />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-assignments"
            element={
              <ProtectedRoute>
                <ManageAssignments />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          {/* Default Route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
export default App