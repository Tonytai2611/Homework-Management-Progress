const StatsCard = ({ icon, label, value, color = 'blue', trend }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        purple: 'bg-purple-100 text-purple-600',
        teal: 'bg-teal-100 text-teal-600'
    }

    const valueColorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
        purple: 'text-purple-600',
        teal: 'text-teal-600'
    }

    return (
        <div className="card hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>{value}</p>
                    </div>
                </div>
                {trend && (
                    <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatsCard
