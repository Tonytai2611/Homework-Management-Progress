import ProgressBar from '../components/shared/ProgressBar'
import Badge from '../components/shared/Badge'
const StudentProgress = () => {
  const progressData = {
    overall: 74,
    subjects: [
      { name: 'Reading', progress: 75, color: 'blue', assignments: 8, completed: 6 },
      { name: 'Grammar', progress: 72, color: 'green', assignments: 10, completed: 7 },
      { name: 'Listening', progress: 80, color: 'purple', assignments: 5, completed: 4 },
      { name: 'Speaking', progress: 68, color: 'orange', assignments: 6, completed: 4 }
    ],
    weeklyProgress: [
      { week: 'Week 1', completed: 3 },
      { week: 'Week 2', completed: 5 },
      { week: 'Week 3', completed: 4 },
      { week: 'Week 4', completed: 6 }
    ],
    recentAchievements: [
      { title: 'First Assignment', description: 'Completed your first assignment!', date: '2026-01-10', icon: '🎯' },
      { title: 'Week Streak', description: '7 days in a row!', date: '2026-01-15', icon: '🔥' },
      { title: 'Grammar Master', description: 'Completed all grammar assignments', date: '2026-01-18', icon: '⭐' }
    ]
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 pb-8">
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
          <p className="text-gray-600 mt-1">Track your learning journey</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Overall Progress */}
        <div className="card bg-gradient-purple-teal text-white">
          <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <ProgressBar 
                value={progressData.overall} 
                color="teal" 
                showLabel={false}
                height="h-4"
              />
            </div>
            <span className="text-4xl font-bold ml-6">{progressData.overall}%</span>
          </div>
        </div>
        {/* Subject Progress */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Progress by Subject</h2>
          <div className="space-y-4">
            {progressData.subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{subject.name}</span>
                  <span className="text-sm text-gray-600">
                    {subject.completed}/{subject.assignments} completed
                  </span>
                </div>
                <ProgressBar
                  value={subject.progress}
                  color={subject.color}
                  showLabel={false}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Weekly Progress Chart */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
          <div className="flex items-end justify-between space-x-4 h-48">
            {progressData.weeklyProgress.map((week, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-purple-teal rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(week.completed / 6) * 100}%` }}
                />
                <span className="text-sm font-medium text-gray-700 mt-2">{week.week}</span>
                <span className="text-xs text-gray-500">{week.completed} tasks</span>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Achievements */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            {progressData.recentAchievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <span className="text-sm text-gray-500">{achievement.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudentProgress