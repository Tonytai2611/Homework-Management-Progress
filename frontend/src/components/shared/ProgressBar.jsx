const ProgressBar = ({ value, max = 100, color = 'blue', showLabel = true, label, height = 'h-2' }) => {
    const percentage = Math.min((value / max) * 100, 100)

    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500',
        teal: 'bg-teal-500',
        red: 'bg-red-500'
    }

    const bgColorClasses = {
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        orange: 'bg-orange-100',
        purple: 'bg-purple-100',
        teal: 'bg-teal-100',
        red: 'bg-red-100'
    }

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full ${height} ${bgColorClasses[color]} rounded-full overflow-hidden`}>
                <div
                    className={`${height} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export default ProgressBar
